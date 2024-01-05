import { EditorView } from "codemirror";

export interface EditorManagerProps {
    editor: EditorView;
    keymap: string;
    coderName: string;
    powerModeOn: boolean;
}

export interface CITDConfiguration {
    roundId: string;
    assets: Array<Asset>;
    referenceImage?: string;
    rules: string;
    saveToken?: string;
    saveUrl?: string;
}

interface Asset {
    name: string;
    description: string;
    url: string;
}

declare global {
    interface Window {
        CODE_IN_THE_DARK_CONFIGURATION: CITDConfiguration;
    }
}
