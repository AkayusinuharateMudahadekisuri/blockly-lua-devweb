'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = exports.commands = void 0;
const vscode = require("vscode");
const Color = require("color");
function replaceColorText(conversion) {
    return __awaiter(this, void 0, void 0, function* () {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return false;
        }
        const { document, selections } = editor;
        return editor.edit((editBuilder) => {
            selections.forEach((selection) => {
                const text = document.getText(selection);
                let color;
                try {
                    color = Color(text);
                }
                catch (_a) {
                    // Trim the selected text in case it's really long so the error message doesn't blow up
                    const badSelection = text.substring(0, 30);
                    void vscode.window.showErrorMessage(`Could not convert color '${badSelection}', unknown format.`);
                    return;
                }
                const colorString = conversion(color).toLowerCase();
                editBuilder.replace(selection, colorString);
            });
        });
    });
}
// HACK: Color has a bug in alpha that doesn't actually round:
// https://github.com/Qix-/color/issues/127
const formatter = Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
});
function fixColorPkgHslAlphaBug(color) {
    const array = color.array();
    const hue = formatter.format(color.hue());
    const saturation = formatter.format(color.saturationl());
    const lightness = formatter.format(color.lightness());
    const alpha = formatter.format(color.alpha());
    if (array.length === 3) {
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    }
    else {
        return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
    }
}
function fixColorPkgRgbAlphaBug(color) {
    const array = color.array();
    if (array.length === 3) {
        return color.string();
    }
    const red = Math.round(color.red());
    const green = Math.round(color.green());
    const blue = Math.round(color.blue());
    const alpha = formatter.format(color.alpha());
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
// END HACK
exports.commands = {
    hex: {
        description: 'Convert color to hex (#RRGGBB/AA)',
        // color library drops the alpha for hex :(
        transform: () => replaceColorText((color) => {
            const { alpha } = color.object();
            const alphaString = alpha !== undefined
                ? Math.round(255 * alpha)
                    .toString(16)
                    .padStart(2, '0')
                : '';
            return color.hex() + alphaString;
        }),
    },
    hsl: {
        description: 'Convert color to hsl/hsla()',
        transform: () => replaceColorText((color) => fixColorPkgHslAlphaBug(color.hsl())),
    },
    rgb: {
        description: 'Convert color to rgb/rgba()',
        transform: () => replaceColorText((color) => fixColorPkgRgbAlphaBug(color.rgb())),
    },
};
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Register quick pick commands
    let disposable = vscode.commands.registerCommand('extension.changeColorFormat.commands', () => {
        const opts = {
            matchOnDescription: true,
            placeHolder: 'Which color space would you like to shift to?',
        };
        const items = Object.keys(exports.commands).map((label) => ({
            label,
            description: exports.commands[label].description,
        }));
        void vscode.window
            .showQuickPick(items, opts)
            .then((option) => { var _a; return option && ((_a = exports.commands[option.label]) === null || _a === void 0 ? void 0 : _a.transform()); });
    });
    context.subscriptions.push(disposable);
    // Create individual commands
    Object.entries(exports.commands).forEach(([key, options]) => {
        disposable = vscode.commands.registerCommand(`extension.changeColorFormat.${key}SmartConvert`, options.transform);
        context.subscriptions.push(disposable);
    });
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map