"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const execute = require("./execute");
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('batch-utils.execBatchFile', (args) => {
        let filepath = getFilepath(args);
        if (filepath) {
            execute.runBatchFile(filepath, false);
        }
    }));
    context.subscriptions.push(vscode.commands.registerCommand('batch-utils.execBatchFileAsAdmin', (args) => {
        let filepath = getFilepath(args);
        if (filepath) {
            execute.runBatchFile(filepath, true);
        }
    }));
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
function getFilepath(args) {
    var _a;
    if (args) {
        let filepath = args["path"];
        if (filepath && filepath.startsWith("/")) {
            filepath = filepath.replace("/", "");
        }
        return filepath;
    }
    return (_a = vscode.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri.fsPath;
}
//# sourceMappingURL=extension.js.map