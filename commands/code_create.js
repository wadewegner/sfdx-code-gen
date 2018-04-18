const path = require('path');
const fse = require('fs-extra');
const fs = require('fs');
const os = require('os');

const codeCreate = require('../lib/code_create.js');

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
      required: false
    }, {
      name: 'vars',
      char: 'v',
      description: 'variables required by the template',
      hasValue: true,
      required: false
    }, {
      name: 'usecurrentfolder',
      char: 'c',
      description: 'use current working directory to look for .sfdx-templates',
      hasValue: false,
      required: false
    }],
    run(context) {

      const template = context.flags.template;
      const name = context.flags.name;
      const outputdir = context.flags.outputdir;
      const vars = context.flags.vars;
      const usecurrentfolder = context.flags.usecurrentfolder;

      let templateFolder = usecurrentfolder ? path.join('./', '.sfdx-templates', template) :  path.join(os.homedir(), '.sfdx-templates', template);
      if (!fse.existsSync(templateFolder)) {
        templateFolder = path.join(__dirname, '../templates', template);
      }

      codeCreate.createFiles(templateFolder, name, template, vars, outputdir, (err, success) => {

        if (err) {
          console.error('ERROR:', err);
          process.exit(1);
        }

        console.log(success);
      });
    }
  };
}());