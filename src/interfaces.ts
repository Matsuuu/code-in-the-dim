import { EditorView } from "codemirror";

export interface EditorManagerProps {
    editor: EditorView;
    keymap: string;
    coderName: string;
}

declare global {
    interface Window {
        CODE_IN_THE_DARK_CONFIGURATION: {
            rules: string,
            assets: Array<Asset>
            referenceImage: string
        }
    }
}

interface Asset {
    name: string;
    size: string;
}
