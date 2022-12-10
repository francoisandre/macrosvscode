const vscode = require("vscode");

let steps = [
  "<template>",
  "</template>",
  "<script>",
  "name:",
  "computed:",
  "props:",
  "watch:",
  "data()",
  "mounted()",
  "methods:",
  "</script>",
  "<style>",
  "</style",
];

module.exports.macroCommands = {
  ScrollDown: {
    no: 1,
    func: scrollDown,
  },
  ScrollUp: {
    no: 2,
    func: scrollUp,
  },
  CreateData: {
    no: 3,
    func: createData,
  },
  CreateMethod: {
    no: 4,
    func: createMethod,
  },
};

function getLine(pattern) {
  let editor = vscode.window.activeTextEditor;
  let doc = editor.document;
  let lineCount = doc.lineCount;
  let found = false;
  for (let i = 0; i < lineCount; i++) {
    lineIndex = i;
    let line = doc.lineAt(i);
    if (!line.isEmptyOrWhitespace) {
      let text = line.text;
      if (text.indexOf(pattern) >= 0) {
        return i;
      }
    }
  }

  return -1;
}

function goTo(pattern) {
  let editor = vscode.window.activeTextEditor;
  let doc = editor.document;
  let lineCount = doc.lineCount;
  let lineIndex = 0;
  let found = false;
  for (let i = 0; i < lineCount; i++) {
    lineIndex = i;
    let line = doc.lineAt(i);
    if (!line.isEmptyOrWhitespace) {
      let text = line.text;
      if (text.indexOf(pattern) >= 0) {
        found = true;
        break;
      }
    }
  }

  if (found) {
    let line = doc.lineAt(lineIndex);
    let range = line.range;
    editor.selection = new vscode.Selection(range.start, range.end);
    editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
  }
}

function focusLine(lineIndex) {
  if (lineIndex < 0) {
    return;
  }
  let editor = vscode.window.activeTextEditor;
  let doc = editor.document;
  let line = doc.lineAt(lineIndex);
  let range = line.range;
  editor.selection = new vscode.Selection(range.start, range.end);
  editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
}

function findLine(pattern) {
  let editor = vscode.window.activeTextEditor;
  let doc = editor.document;
  let lineCount = doc.lineCount;
  let lineIndex = 0;
  let found = false;
  for (let i = 0; i < lineCount; i++) {
    lineIndex = i;
    let line = doc.lineAt(i);
    if (!line.isEmptyOrWhitespace) {
      let text = line.text;
      if (text.indexOf(pattern) >= 0) {
        return i;
      }
    }
  }
  return -1;
}

function getCurrentLine() {
  const activeEditor = vscode.window.activeTextEditor;
  if (activeEditor) {
    return activeEditor.selection.active.line;
  } else {
    return -1;
  }
}

function scrollDown() {
  let current = getCurrentLine();
  for (let i = 0; i < steps.length; i++) {
    let next = findLine(steps[i]);
    if (next > current) {
      focusLine(next);
      return;
    }
  }
  focusLine(0);
}

function scrollUp() {
  let current = getCurrentLine();
  for (let i = steps.length - 1; i >= 0; i--) {
    let previous = findLine(steps[i]);
    if (previous < current) {
      focusLine(previous);
      return;
    }
  }
  let editor = vscode.window.activeTextEditor;
  let doc = editor.document;
  let lineCount = doc.lineCount;
  focusLine(lineCount - 1);
}

function createData() {
  let editor = vscode.window.activeTextEditor;

  const selection = editor.selection;
  if (selection && !selection.isEmpty) {
    const selectionRange = new vscode.Range(
      selection.start.line,
      selection.start.character,
      selection.end.line,
      selection.end.character
    );
    const highlighted = editor.document.getText(selectionRange);
    let lineNumber = getLine("data()");
    if (lineNumber == -1) {
      return;
    } else {
      const editRange = editor.document.lineAt(lineNumber + 1).range.end;
      editor.edit((editBuilder) => {
        if (editor !== undefined) {
          editBuilder.insert(editRange, "\n" + highlighted + ": null,");
          vscode.commands.executeCommand("editor.action.formatDocument");
        }
      });
    }
  }
}

function createMethod() {
  let editor = vscode.window.activeTextEditor;

  const selection = editor.selection;
  if (selection && !selection.isEmpty) {
    const selectionRange = new vscode.Range(
      selection.start.line,
      selection.start.character,
      selection.end.line,
      selection.end.character
    );
    const highlighted = editor.document.getText(selectionRange);
    let lineNumber = getLine("methods:");
    if (lineNumber == -1) {
      return;
    } else {
      const editRange = editor.document.lineAt(lineNumber).range.end;
      editor.edit((editBuilder) => {
        if (editor !== undefined) {
          editBuilder.insert(editRange, "\n" + highlighted + "() {},");
          vscode.commands.executeCommand("editor.action.formatDocument");
        }
      });
    }
  }
}

async function format() {
  await vscode.commands.executeCommand("editor.action.formatDocument");
}

function gotoData() {
  goTo("data()");
}

function gotoComputed() {
  goTo("computed:");
}

function gotoMounted() {
  goTo("mounted()");
}
