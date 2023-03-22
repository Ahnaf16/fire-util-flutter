const vscode = require("vscode");

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  console.log(
    'Congratulations, your extension "fire-util-flutter" is now active!',
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "fire-util-flutter.generateStaticFieldNames",
      generateStaticFieldNames,
    ),
  );
}

function generateStaticFieldNames() {
  var editor = vscode.window.activeTextEditor;
  if (!editor) return;

  const selection = editor.selection;
  var text = editor.document.getText(selection);
  if (text.length < 1) {
    vscode.window.showErrorMessage("No selected properties.");
    return;
  }

  let properties = text
    .split(/\r?\n/)
    .filter((x) => x.length > 2)
    .map((x) => x.replace(";", ""));

  let varNames = ["\n"];

  for (const prop of properties) {
    const varName = prop.split(" ").slice(-1).toString();

    const varNameUC = varName.charAt(0).toUpperCase() + varName.slice(1);

    const varNameFinal = `field${varNameUC}`;

    varNames.push(`\n  static const String ${varNameFinal} = '${varName}';`);

    console.log(varNameFinal);
  }

  editor.edit((edit) =>
    editor.selections.forEach((selection) => {
      edit.insert(selection.end, varNames.join(" "));
    }),
  );

  const position = editor.selection.end;
  editor.selection = new vscode.Selection(position, position);
}

function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
