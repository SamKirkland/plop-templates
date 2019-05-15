# <img src="https://raw.githubusercontent.com/samkirkland/plop-templates/master/resources/logo.png" width="48">Plop File Templates for Visual Studio Code


## Features
This extension adds single and multi-file templates to Visual Studio Code.
Add a template by right clicking the desired location and selecting `New File from Plop Template`


## Creating new project item from template 
To invoke template selection, simply right click on a folder or file in vscode file explorer and click the `New File from Plop Template` menu item.

<img src="https://raw.githubusercontent.com/samkirkland/plop-templates/master/resources/menu.png">


## Using destination path in your plop generators
Name one of your prompts `destinationpath` (order does NOT matter). This prompt will automatically be answered with the absolute path to the destination folder.

Then use `{{destinationpath}}` in your actions.

```
plop.setGenerator('example generator', {
    description: 'example using destinationpath',
    prompts: [
        {
            type: 'input',
            name: 'destinationpath',
            message: 'Template destination path'
        },
        {
            type: 'input',
            name: 'name',
            message: 'Controller name please'
        }
    ],
    actions: [{
        type: 'add',
        path: '{{destinationpath}}/{{name}}.js',
        templateFile: 'template.js'
    }]
});
```


## Templates
Templates are loaded from your workspace root under the plop.js configuration file `plopfile.js`, if you use a custom file change the setting below to tell the extension the new path.

For instructions on setting up templates please see [plop.js documentation](https://plopjs.com/)

## Settings
To change settings open vscodes settings window and navigate to the plop extension settings

(`File` &rarr; `Preferences` &rarr; `Settings` &rarr; Search for `plopTemplates`)


| Title | Description | Default Value |
| ----- | ----------- | ------------- |
| configFileName | File name or path to plop file | `plopfile.js` at root of workspace |
| terminalName | Name of the Terminal window created for plop | `terminalName` |
| destinationPath | Name of the prompt the destination path will be passed in as | `destinationpath` |

## Resolving common issues
* The term 'plop' is not recognized as the name of a cmdlet, function, script file, or operable program...
  * You need to install plop globally, do so by running the following `npm install -g plop`

## Release Notes

#### 1.0.0
- Initial release
