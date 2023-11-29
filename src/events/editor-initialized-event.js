import { EditorView } from "codemirror";

export class EditorInitialized extends Event {

    static eventName = "editor-initialized";

    /**
     * @param {EditorView} editorElement
     */
    constructor(editorElement) {
        super(EditorInitialized.eventName);

        this.editorElement = editorElement;
    }
}
