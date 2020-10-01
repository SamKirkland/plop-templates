"use strict";

import { workspace, window, commands, ExtensionContext, Terminal, Uri, QuickPickItem } from "vscode";
import { dirname } from "path";
import * as fs from "fs";
import nodePlop, { NodePlopAPI } from "node-plop";

function isWorkspaceOpen() {
    if ((workspace) && (workspace.workspaceFolders) && (workspace.workspaceFolders.length > 0)) {
        return true;
    }

    return false;
}

type Generator = {
    name: string;
    description: string;
};

async function selectGenerator(plop: NodePlopAPI, plopFile: string): Promise<Generator | undefined> {
    const generators = plop.getGeneratorList();

    // no generators, output error
    if (generators.length === 0) {
        window.showErrorMessage(`No Plop.js generators found in the config file "${plopFile}". Add one using plop.setGenerator(...)`);
        throw "No Plop.js generators found...";
    }

    // single generator, no need in prompting for selection
    if (generators.length === 1) {
        return generators[0];
    }

    // prompt user for which generator they want to use
    if (generators.length > 1) {
        const result = await window.showQuickPick<QuickPickItem>(
            generators.map((generator: Generator) => ({ label: generator.name, description: generator.description })),
            {
                placeHolder: "Please choose a generator"
            }
        );

        if (result === undefined) {
            return undefined;
        }

        return {
            name: result.label,
            description: result.description!
        };
    }
}

async function runPlopInNewTerminal(dirUri: Uri) {
    if (!dirUri && isWorkspaceOpen()) {
        window.showErrorMessage("Project items cannot be created if workspace is not open.");
        return;
    }


    // user based settings
    const userSettings = workspace.getConfiguration();
    const plopFileName: string = userSettings.get("plopTemplates.configFileName") || "plopfile.js";
    const plopTerminalName: string = userSettings.get("plopTemplates.terminalName") || "New File from Template";
    const destinationpathName: string = userSettings.get("plopTemplates.destinationPath") || "destinationpath";
    const plopCommand: string = (userSettings.get("plopTemplates.plopCommand") as string || "plop").trim();
    let plopCommandRelative: string = plopCommand;

    const plopFile = workspace.rootPath + "/" + plopFileName;
    let plop: NodePlopAPI;

    try {
        plop = nodePlop(plopFile);
    }
    catch (e) {
        window.showErrorMessage(`Couldn't load plop config file at the path: "${plopFile}" - ${e}`);
        return;
    }


    let destPath: string = "";
    let plopTerminal: Terminal;
    let selectedGenerator = await selectGenerator(plop, plopFile);

    if (selectedGenerator === undefined) {
        window.showInformationMessage("No Plop.js generator selected, cancelling...");
        return;
    }

    if (dirUri) {
        destPath = dirUri.fsPath;
    }
    else {
        window.showInformationMessage(`Couldn't find a target location "dirUri", the value of dirUri: "${dirUri}"`);
        return;
    }

    if (destPath !== "") {
        let fsStat = fs.statSync(destPath);
        if (!fsStat.isDirectory()) {
            destPath = dirname(destPath);
        }
    }
    else {
        window.showInformationMessage(`Couldn't find a target location "destPath", the value of destPath: "${destPath}"`);
        return;
    }

    const existingTerminals = window.terminals.filter((value) => value.name === plopTerminalName);

    if (existingTerminals.length > 0) {
        // use existing terminal
        plopTerminal = existingTerminals[0];
    }
    else {
        // create new terminal
        plopTerminal = window.createTerminal({
            name: plopTerminalName
        });
    }

    if (plopCommand !== "plop") {
        plopCommandRelative = "npm run " + plopCommand;
    }

    plopTerminal.show();
    plopTerminal.sendText(`${plopCommandRelative} "${selectedGenerator.name}" --${destinationpathName} "${destPath}"`);
}

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand("ploptemplates.newFile", (dirUri: Uri) => {
        try {
            runPlopInNewTerminal(dirUri);
        }
        catch (e) {
            window.showErrorMessage(e);
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
