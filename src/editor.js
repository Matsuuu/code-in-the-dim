import { defaultKeymap } from "@codemirror/commands";
import { Compartment } from "@codemirror/state";
import { keymap } from "@codemirror/view";
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

export const keymaps = [
    {
        name: "Regular",
        config: keymap.of(defaultKeymap)
    },
    {
        name: "Vim",
        config: vim()
    }
]
