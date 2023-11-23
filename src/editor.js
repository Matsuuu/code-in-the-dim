import { Compartment } from "@codemirror/state";
import { vim } from "@replit/codemirror-vim";
import { EditorView } from "codemirror";


// Toggleables
export const keymapCompartment = new Compartment;

/**
 * @param {EditorView} editor
 * @param {any} keymap
 */
export function setEditorKeymap(editor, keymap) {
    editor.dispatch({
        effects: keymapCompartment.reconfigure(keymap)
    })
}
