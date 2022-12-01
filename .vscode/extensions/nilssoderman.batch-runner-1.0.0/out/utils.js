"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCmdPath = exports.isRunningAsAdmin = exports.getExtensionConfig = void 0;
const vscode = require("vscode");
const child_process = require("child_process");
const fs = require("fs");
const EXTENSION_CONFIG_NAME = "batchrunner";
const CMD_PATH_CONFIG_KEY = "cmdPath";
function getExtensionConfig(filepath) {
    let workspaceFolder;
    if (filepath) {
        workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.Uri.file(filepath));
    }
    else if (vscode.window.activeTextEditor) {
        workspaceFolder = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
    }
    return vscode.workspace.getConfiguration(EXTENSION_CONFIG_NAME, workspaceFolder);
}
exports.getExtensionConfig = getExtensionConfig;
function isRunningAsAdmin() {
    try {
        child_process.execFileSync("net", ["session"], { "stdio": "ignore" });
        return true;
    }
    catch (e) {
        return false;
    }
}
exports.isRunningAsAdmin = isRunningAsAdmin;
function getCmdPath() {
    let cmdPath = getExtensionConfig().get(CMD_PATH_CONFIG_KEY);
    if (!cmdPath) {
        cmdPath = "C:\\windows\\System32\\cmd.exe";
    }
    if (!fs.existsSync(cmdPath)) {
        const browseButtonText = "Update path";
        vscode.window.showErrorMessage(`Cmd.exe could not be located at ${cmdPath}`, browseButtonText).then(clickedItem => {
            if (clickedItem === browseButtonText) {
                const searchPath = `${EXTENSION_CONFIG_NAME}.${CMD_PATH_CONFIG_KEY}`;
                vscode.commands.executeCommand('workbench.action.openSettings', searchPath);
            }
        });
        return undefined;
    }
    return cmdPath;
}
exports.getCmdPath = getCmdPath;
//# sourceMappingURL=utils.js.map