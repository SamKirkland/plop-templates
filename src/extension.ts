'use strict';

import * as vscode from 'vscode';
import * as path from 'path';
const nodePlop = require('node-plop');

function isWorkspaceOpen() {
    if ((vscode.workspace) && (vscode.workspace.workspaceFolders) && (vscode.workspace.workspaceFolders.length > 0)) {
        return true;
    }

    return false;
}

async function selectGenerator(plop: any, plopFile: string) {
    const generators = plop.getGeneratorList();

    // no generators, output error
    if (generators.length === 0) {
        vscode.window.showErrorMessage(`No Plop.js generators found in the config file "${plopFile}". Add one using plop.setGenerator(...)`);
        throw "No Plop.js generators found...";
    }

    // single generator, no need in prompting for selection
    if (generators.length === 1) {
        return generators[0];
    }

    // prompt user for which generator they want to use
    if (generators.length > 1) {
        return await vscode.window.showQuickPick(
            generators.map((g: any) => ({ label: g.name, description: g.description })),
            {
                placeHolder: "Please choose a generator"
            }
        );
    }
}

async function runPlopInNewTerminal(dirUri: vscode.Uri) {
    if (!dirUri && isWorkspaceOpen()) {
        vscode.window.showErrorMessage("Project items cannot be created if workspace is not open.");
        return;
    }


    // user based settings
    const userSettings = vscode.workspace.getConfiguration();
    const plopFileName: string = userSettings.get('plopTemplates.configFileName') || 'plopfile.js';
    const plopTerminalName: string = userSettings.get('plopTemplates.terminalName') || 'New File from Plop Template';
    const destinationpathName: string = userSettings.get('plopTemplates.destinationPath') || 'destinationpath';
    const plopCommand: string = (userSettings.get('plopTemplates.plopCommand') as string || 'plop').toLowerCase().trim();
    let plopCommandRelative: string = plopCommand;

    const plopFile = vscode.workspace.rootPath + "/" + plopFileName;
    let plop: any;

    try {
        plop = nodePlop(plopFile);
    }
    catch (e) {
        vscode.window.showErrorMessage(`Couldn't load plop config file at the path: "${plopFile}" - ${e.message}`);
        return;
    }


    let destPath: string = "";
    let plopTerminal: vscode.Terminal;
    let selectedGenerator = await selectGenerator(plop, plopFile);

    if (selectedGenerator === undefined) {
        vscode.window.showInformationMessage("No Plop.js generator selected, cancelling...");
        return;
    }

    if (dirUri) {
        destPath = dirUri.fsPath;
    }
    else {
        vscode.window.showInformationMessage(`Couldn't find a target location "dirUri", the value of dirUri: "${dirUri}"`);
        return;
    }

    if (destPath !== "") {
        const fs = require('fs');
        let fsStat = fs.statSync(destPath);
        if (!fsStat.isDirectory()) {
            destPath = path.dirname(destPath);
        }
    }
    else {
        vscode.window.showInformationMessage(`Couldn't find a target location "destPath", the value of destPath: "${destPath}"`);
        return;
    }

    const existingTerminals = vscode.window.terminals.filter((value) => value.name === plopTerminalName);

    if (existingTerminals.length > 0) {
        // use existing terminal
        plopTerminal = existingTerminals[0];
    }
    else {
        // create new terminal
        plopTerminal = vscode.window.createTerminal({
            name: plopTerminalName
        });
    }

    if (plopCommand !== "plop") {
        plopCommandRelative = "npm run " + plopCommand;
    }

    plopTerminal.show();
    plopTerminal.sendText(`${plopCommandRelative} '${selectedGenerator.name ? selectedGenerator.name : selectedGenerator.label}' -- --${destinationpathName} '${destPath}'`);
}

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('ploptemplates.newFile', (dirUri: vscode.Uri) => {
        runPlopInNewTerminal(dirUri);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}