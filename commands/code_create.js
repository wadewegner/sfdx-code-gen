const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

(function () {
  'use strict';

  module.exports = {
    topic: 'code',
    command: 'create',
    description: 'create source from a template',
    help: 'help text for waw:code:create',
    flags: [{
      name: 'name',
      char: 'n',
      description: 'file or bundle name',
      hasValue: true,
      required: true
    }, {
      name: 'template',
      char: 't',
      description: 'code template name',
      hasValue: true,
      required: true
    }, {
      name: 'outputdir',
      char: 'd',
      description: 'folder for saving the created files',
      hasValue: true,
      required: true
    }, {
      name: 'vars',
      char: 'v',
      description: 'variables required by the template',
      hasValue: true,
      required: false
    }],
    run(context) {

      const template = context.flags.template;
      const name = context.flags.name;
      const outputdir = context.flags.outputdir;
      const vars = context.flags.vars;

      const templateFolder = path.join('templates', template);

      if (!fse.existsSync(templateFolder)) {
        console.error('ERROR:', `specified template '${template}' doesn't exist`);
        process.exit(1);
      }

      const defJsonPath = path.join(templateFolder, 'def.json');

      if (!fse.existsSync(defJsonPath)) {
        console.error('ERROR:', 'def.json not found');
        process.exit(1);
      }

      const defJson = JSON.parse(fs.readFileSync(defJsonPath).toString());
      const defJsonVars = defJson.vars;
      const defJsonBundle = defJson.bundle;
      const defJsonFiles = defJson.files;

      if (defJsonBundle) {
        console.error('ERROR:', 'Bundles not yet supported');
        process.exit(1);
      }

      if (!vars) {
        console.error('ERROR:', `The following variables are required: ${defJsonVars}`);
        console.error('ERROR:', 'Specify them like: -v className=myclass,apiName=40.0');
        process.exit(1);
      }

      defJsonFiles.forEach((row) => {
        const fileName = row[0];
        const fileExtension = row[1];

        if (fileName !== 'def.json') {

          const templateFilePath = path.join(templateFolder, fileName);
          let content = fs.readFileSync(templateFilePath).toString();

          if (vars.includes(',')) {
            const splitVars = vars.split(',');
            splitVars.forEach((value) => {
              const splitVarValues = value.split('=');

              const varName = splitVarValues[0];
              const varValue = splitVarValues[1];

              content = content.replace(new RegExp(`{{${varName}}}`, 'g'), varValue);
            });
          } else {
            const splitVarValues = vars.split('=');

            const varName = splitVarValues[0];
            const varValue = splitVarValues[1];

            content = content.replace(new RegExp(`{{${varName}}}`, 'g'), varValue);
          }

          let newFile = path.join(outputdir, `${name}.${fileExtension}`);
          const newFilePath = path.dirname(newFile);

          fse.ensureDirSync(newFilePath);

          fs.writeFile(newFile, content, (err) => {
            if (err) {
              return console.log(err);
            }

            console.log(`Your file was created: ${newFile}`);
          });
        }
      });
    }
  };
}());