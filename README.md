# sfdx-code-gen [![Build Status](https://travis-ci.org/wadewegner/sfdx-code-gen.svg?branch=master)](https://travis-ci.org/wadewegner/sfdx-code-gen)

A tool for generating Salesforce DX source code from templates. This plugin is a proof-of-concept focused on making it easier to create code through templates. The idea is to make it easy to share, modify, and add new templates w/o having anything hardcoded.

## Setup

### Install from source

1. Install the Salesforce CLI.

2. Clone the repository: `git clone git@github.com:wadewegner/sfdx-code-gen.git`

3. Install npm modules: `npm install`

4. Link the plugin: `sfdx plugins:link .`

### Install as plugin

1. Install plugin: `sfdx plugins:install sfdx-code-gen`

## Usage

The basic usage of the plugin is straightforward.

```
Usage: sfdx waw:code:create

create source from a template

 -n, --name NAME           # file or bundle name
 -d, --outputdir OUTPUTDIR # folder for saving the created files
 -t, --template TEMPLATE   # code template name
 -v, --vars VARS           # variables required by the template
 ```

Creating a simple Apex class: `sfdx waw:code:create -t apex -n myclass -v className=myClass,apiVersion=40.0`

This command will create a class in the current directory.

```
The following files were created:
  myclass.cls
  myclass.cls-meta.xml
```

You can specify a different output directory with `-d|--outputdir`. If you're unsure of the `VARS` required, you can drop the `-v|--vars` and it will output the required fields.

## Creating a template

Take a look at the [example templates](https://github.com/wadewegner/sfdx-code-gen/tree/master/templates) to see how it works. Effectively, templates are folders with files. To function, be sure to create a `def.json` file that specifies the details of your template. If you're creating a Lightning component, be sure to specify `"bundle": true` so that it creates a bundle folder with all your files.

You can create your own local templates in `~/.sfdx-templates`. The tool will check here first, so you can easily overwrite default templates.