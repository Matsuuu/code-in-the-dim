import { EditorView } from "codemirror";

export interface EditorManagerProps {
    editor: EditorView;
    keymap: string;
    coderName: string;
}
