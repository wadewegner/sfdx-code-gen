const codeCreate = require('./commands/code_create.js');

(function () {
  'use strict';

  exports.topics = [{
    name: 'code',
    description: 'commands for source'
  }];

  exports.namespace = {
    name: 'waw',
    description: 'Various commands from Wade Wegner'
  };

  exports.commands = [
    codeCreate
  ];

}());