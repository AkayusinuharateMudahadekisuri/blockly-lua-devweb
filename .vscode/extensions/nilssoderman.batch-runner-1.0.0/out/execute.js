"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runBatchFile = void 0;
const vscode = require("vscode");
const child_process = require("child_process");
const path = require("path");
const utils = require("./utils");
const TERMINAL_NAME = "Batch Runner Terminal";
function getBatchRunnerTerminal(bEnsureExists = true) {
    for (const terminal of vscode.window.terminals) {
        if (terminal.name === TERMINAL_NAME) {
            return terminal;
        }
    }
    if (bEnsureExists) {
        const cmdPath = utils.getCmdPath();
        return vscode.window.createTerminal(TERMINAL_NAME, cmdPath);
    }
}
function runBatchFileInTerminal(filepath) {
    const terminal = getBatchRunnerTerminal();
    if (!terminal) {
        return false;
    }
    const directory = path.dirname(filepath);
    const command = `cd & cls & cd "${directory}" & "${filepath}"`;
    terminal.sendText(command, true);
    terminal.show();
    return true;
}
function runBatchFileInCmd(filepath, bAdmin = false) {
    const cmdPath = utils.getCmdPath();
    if (!cmdPath) {
        return false;
    }
    const directory = path.dirname(filepath);
    let command = `start "${filepath}" /d "${directory}" "${cmdPath}" /c "${filepath}"`;
    if (bAdmin) {
        command = `powershell Start-Process "${cmdPath}" -verb runAs -ArgumentList /c, title, """${filepath}""", """&""", cd, /d, """${directory}""", """&""", """${filepath}"""`;
    }
    child_process.exec(command);
    return true;
}
function runBatchFile(filepath, bAdmin = false) {
    const config = utils.getExtensionConfig(filepath);
    const runBatchIn = config.get("runBatchIn");
    const bForceNewCmd = bAdmin && !utils.isRunningAsAdmin();
    if ((runBatchIn === null || runBatchIn === void 0 ? void 0 : runBatchIn.toLowerCase().includes("cmd")) || bForceNewCmd) {
        return runBatchFileInCmd(filepath, bAdmin);
    }
    else {
        return runBatchFileInTerminal(filepath);
    }
}
exports.runBatchFile = runBatchFile;
//# sourceMappingURL=execute.js.map