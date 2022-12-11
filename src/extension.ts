"use strict";

import { workspace, window, commands, ExtensionContext, Terminal, Uri } from "vscode";
import { dirname } from "path";
import * as fs from "fs";

function isWorkspaceOpen() {
    if ((workspace) && (workspace.workspaceFolders) && (workspace.workspaceFolders.length > 0)) {
        return true;
    }

    return false;
}

async function runPlopInNewTerminal(dirUri: Uri) {
    if (!dirUri && isWorkspaceOpen()) {
        window.showErrorMessage("Project items cannot be created if workspace is not open.");
        return;
    }


    // user based settings
    const userSettings = workspace.getConfiguration();
    const plopTerminalName: string = userSettings.get("plopTemplates.terminalName") || "New File from Template";
    const destinationpathName: string = userSettings.get("plopTemplates.destinationPath") || "destinationpath";
    const plopCommand: string = (userSettings.get("plopTemplates.plopCommand") as string || "plop").trim();
    let plopCommandRelative: string = plopCommand;

    let destPath: string = "";
    let plopTerminal: Terminal;

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
        plopCommandRelative = `npm run ${plopCommand} --`;
    }

    plopTerminal.show();
    if (destPath.length > 0) {
        plopTerminal.sendText(`${plopCommandRelative} -- --${destinationpathName} "${destPath}"`);
    }
    else {
        plopTerminal.sendText(`${plopCommandRelative}`);
    }
}

export function activate(context: ExtensionContext) {
    let disposable = commands.registerCommand("ploptemplates.newFile", (dirUri: Uri) => {
        try {
            runPlopInNewTerminal(dirUri);
        }
        catch (e: any) {
            window.showErrorMessage(e);
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
