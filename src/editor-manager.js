import { EditorInitialized } from "./events/editor-initialized-event";

class EditorManager extends EventTarget {
    /**
     * @type { import("./interfaces").EditorManagerProps }
     * */
    #state = {
        editor: undefined,
    };

    constructor() {
        super();

        this.addEventListener(EditorInitialized.eventName, this.onEditorInitialized.bind(this));
    }

    /**
     * @param {Event} event
     */
    broadcast(event) {
        this.dispatchEvent(event);
    }

    getEditor() {
        return this.#state.editor;
    }

    /**
     * @param {EditorInitialized} event
     */
    onEditorInitialized(event) {
        this.#state.editor = event.editorElement;
    }
}

const manager = new EditorManager();

export { manager as EditorManager };
