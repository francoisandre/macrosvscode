const vscode = require('vscode');


module.exports.macroCommands = {
   GoToData: {
      no: 1,
      func: gotoData
   },
   GoToComputed: {
      no: 2,
      func: gotoComputed
   },
   GoToMounted: {
      no: 3,
      func: gotoMounted
   },
   CreateData: {
      no: 4,
      func: createData
   }
}

function getLine(pattern) {
   let editor = vscode.window.activeTextEditor;
   let doc = editor.document; 
   let lineCount = doc.lineCount;
   let found = false;
   for (let i = 0; i< lineCount; i++) {
      lineIndex = i;
      let line = doc.lineAt(i);
      if (! line.isEmptyOrWhitespace) {
         let text = line.text;
         if (text.indexOf(pattern)>=0) {
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
   for (let i = 0; i< lineCount; i++) {
      lineIndex = i;
      let line = doc.lineAt(i);
      if (! line.isEmptyOrWhitespace) {
         let text = line.text;
         if (text.indexOf(pattern)>=0) {
            found = true;
            break
         }
      }
   }

   if (found) {
   let line = doc.lineAt(lineIndex);
   let range = line.range;
   editor.selection =  new vscode.Selection(range.start, range.end);
   editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
   }
}

function createData() {
   let editor = vscode.window.activeTextEditor;
   const selection = editor.selection;
   if (selection && !selection.isEmpty) {
      const selectionRange = new vscode.Range(selection.start.line, selection.start.character, selection.end.line, selection.end.character);
      const highlighted = editor.document.getText(selectionRange);
      let lineNumber = getLine("data()")
      if (lineNumber == -1) {
         return;
      } else {
         const editRange = editor.document.lineAt(lineNumber+1).range.end;
         editor.edit(editBuilder =>{
            if (editor !== undefined){
              editBuilder.insert(editRange,"\n"+highlighted+": null,");
            }
        });
      }

   }
}

function gotoData() {
   goTo("data()")
}

function gotoComputed() {
   goTo("computed:")
}

function gotoMounted() {
   goTo("mounted()")
}
