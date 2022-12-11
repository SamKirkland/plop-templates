# <img src="https://raw.githubusercontent.com/samkirkland/plop-templates/master/resources/logo.png" width="48">Plop File Templates for Visual Studio Code

Install the extension on the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=SamKirkland.plop-templates)

## Features
This extension adds single and multi-file templates to Visual Studio Code.
Add a template by right clicking the desired location and selecting `📄 New File from Template`


## Creating new project item from template 
To invoke template selection, simply right click on a folder or file in vscode file explorer and click the `📄 New File from Template` menu item.

<img src="https://raw.githubusercontent.com/samkirkland/plop-templates/master/resources/menu.png">

## Extension Setup
1) Install the [VSCode extension](https://marketplace.visualstudio.com/items?itemName=SamKirkland.plop-templates)
2) Install [plop.js](https://github.com/plopjs/plop) globally using `npm install plop -g` *(optionally you can install plop for [just your current project](#Using-a-local-version-of-plop))*. Note: Plop 3.1.1 or higher required
3) Now for the fun part! Create a new file called `plopfile.js` at the root of your project (same folder as `package.json`, the name/location is [configurable](#Settings)).
```js
module.exports = function (plop) {
    // create your generators here
    // Read more about templates at https://plopjs.com/
    plop.setGenerator("basic template", {
        description: "this is a skeleton plopfile",
        prompts: [
            {
                // You should always include a "destinationpath" prompt when using this extension
                // this extension will automatically answer this prompt for the user.
                // Which allows your plop file to be placed in the correct location
                type: "input",
                name: "destinationpath",
                message: "Template destination path"
            },
            {
                type: "input",
                name: "fileName",
                message: "file name"
            }
        ],
        actions: [
            {
                type: "add",
                path: "{{destinationpath}}/{{fileName}}.js",
                templateFile: "plop-templates/exampleFile.hbs"
            }
        ]
    });
};
```


###### ProTip: Add plop templates as a [recommended extension](https://code.visualstudio.com/docs/editor/extension-gallery#_workspace-recommended-extensions) to your `Workspace` or `Project` settings file and commit it. Then everyone on your team will see this extension!

## Settings
To change settings open vscodes settings window and navigate to the plop extension settings

(`File` &rarr; `Preferences` &rarr; `Settings` &rarr; Search for `plopTemplates`)


| Title           | Description                                                                                                                                                                                                                                                                                                                                                                                                                       | Default Value                      |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------|
| configFileName  | File name or path to plop file                                                                                                                                                                                                                                                                                                                                                                                                    | `plopfile.js` at root of workspace |
| terminalName    | Name of the Terminal window created for plop                                                                                                                                                                                                                                                                                                                                                                                      | `terminalName`                     |
| plopCommand     | By default this extension assumes plop is installed globally (`npm install -g plop`).<br>If you'd like to use a local version of plop you can do so by adding `"add-form-template": "plop"` to your `"scripts"` record in your `package.json`.<br><br>Example:<br>```"scripts": { "add-from-template": "plop" }```<br><br>Next update the `plopCommand` setting with your command name (in the example above "add-from-template") | `plop`                             |
| destinationPath | Name of the prompt the destination path will be passed in as                                                                                                                                                                                                                                                                                                                                                                      | `destinationpath`                  |

## Using a local version of plop
This extension expects plop.js to be install globally using `npm install plop -g` if you do not want to do this you can use a local version by doing the following

1) Install plop for the current project by running `npm install --save-dev plop`
  
2) In your `package.json` file under `scripts` add a new `plop-script` script.
```
{
    // rest of your package.json file...
    "scripts": {
        "plop-script": "plop", // this tells the extension to use this projects version of plop
    },
    // rest of your package.json file...
}
```

3) Go to `File` &rarr; `Preferences` &rarr; `Settings` &rarr; Search for `plopTemplates`

4) Edit the "Plop Command" setting to your script name from step 3. In the example above we used `plop-script`


## Resolving common issues
* `Cannot find module ...\node_modules\plop\src\plop.js'`
  * You need to install plop globally, do so by running the following `npm install -g plop`
  * Alternatively you can [install plop for just the current project](#Using-a-local-version-of-plop)
* `The term 'plop' is not recognized as the name of a cmdlet, function, script file, or operable program...`
  * You need to install plop globally, do so by running the following `npm install -g plop`
  * Alternatively you can [install plop for just the current project](#Using-a-local-version-of-plop)
* `Couldn't load plop config file at the path: ".../plopfile.js" - ENOENT: no such file or directory, stat '...\plopfile.js'`
  * You need to create a plopfile with generators. Please see [Extension Setup](#Extension-Setup)


## Release Notes

#### 1.2.0
- Plop 3.1.1 or higher required
- Removed shipped plop dependency
- Removed shipped handlebars dependency
- Reduced size from 7,200KB --> 54KB
- Reduced load time

#### 1.1.0
- Fixing bug caused in 1.0.5 causing `MODULE_NOT_FOUND` error
- Updated plop to latest version (2.7.4) and node-plop (0.26.2)

#### 1.0.5
- Documentation updates

#### 1.0.4
- Skip 'destinationpathName' parameter automatically (thanks [@rbadapanda](https://github.com/rbadapanda))

#### 1.0.3
- Added destinationpath command

#### 1.0.2
- Fixed command naming
- Added link to vscode marketplace
- Added issues link
- Added plopCommand setting

#### 1.0.0
- Initial release
