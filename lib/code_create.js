const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');

function updateContent(content, values) {
  const splitValues = values.split('=');

  const varName = splitValues[0];
  const varValue = splitValues[1];

  content = content.replace(new RegExp(`{{${varName}}}`, 'g'), varValue);
  console.log(varName, varValue, content);
  return content;
}

function createFiles(templateFolder, name, template, vars, outputdir, done) {

  if (!outputdir) {
    outputdir = '.';
  }

  if (!fse.existsSync(templateFolder)) {
    done(`specified template '${template}' doesn't exist`, null);
  }

  const defJsonPath = path.join(templateFolder, 'def.json');

  if (!fse.existsSync(defJsonPath)) {
    done('def.json not found', null);
  }

  const defJson = JSON.parse(fs.readFileSync(defJsonPath).toString());
  const defJsonVars = defJson.vars;
  const defJsonBundle = defJson.bundle;
  const defJsonFiles = defJson.files;

  if (!vars) {
    done(`The following variables are required: ${defJsonVars}. Specify them like: -v className=myclass,apiName=40.0`, null);
  }

  const filesCreated = [];

  defJsonFiles.forEach((row) => {
    const fileName = row[0];
    const fileExtension = row[1];

    if (fileName !== 'def.json') {

      const templateFilePath = path.join(templateFolder, fileName);
      let content = fs.readFileSync(templateFilePath).toString();

      if (vars.includes(',')) {
        const splitVars = vars.split(',');
        splitVars.forEach((value) => {
          content = updateContent(content, value);
        });
      } else {
        content = updateContent(content, vars);
      }

      let newFile = path.join(outputdir, `${name}.${fileExtension}`);
      // if bundle flagged as true, add all the files in a folder with the same name
      if (defJsonBundle) {
        newFile = path.join(outputdir, name, `${name}.${fileExtension}`);
      } 

      const newFilePath = path.dirname(newFile);

      fse.ensureDirSync(newFilePath);
      fs.writeFileSync(newFile, content);
      filesCreated.push(newFile);
    }
  });

  let result = 'The following files were created:';
  for (let i = 0; i < filesCreated.length; i++) {
    result += `\n  ${filesCreated[i]}`;
  }

  done(null, result);
}

module.exports = {
  createFiles
};