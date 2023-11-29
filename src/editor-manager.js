import { EditorInitialized } from "./events/editor-initialized-event";
import { Compartment } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { vim } from "@replit/codemirror-vim";
import { getUrlParam } from "./url";
import { EditorKeymapChanged } from "./events/editor-keymap-changed";
import { EditorConfigurationUpdated } from "./events/editor-configuration-updated";
import { EditorSnapshot } from "./events/editor-snapshot";

export const EDITOR_SNAPSHOT_INTERVAL = 3000;

// Toggleables
export const keymapCompartment = new Compartment;

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

class EditorManager extends EventTarget {
    /**
     * @type { import("./interfaces").EditorManagerProps }
     * */
    #state = {
        editor: undefined,
        keymap: "Regular"
    };

    constructor() {
        super();
        this.#state.keymap = getUrlParam("keymap") || keymaps[0].name;

        this.addEventListener(EditorInitialized.eventName, this.onEditorInitialized.bind(this));
        this.addEventListener(EditorKeymapChanged.eventName, this.onEditorKeymapChanged.bind(this));
        this.addEventListener(EditorSnapshot.eventName, this.onEditorSnapshot.bind(this));
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
     * @param {import("@codemirror/state").Extension} keymap
     */
    setKeymap(keymap) {
        this.#state.editor.dispatch({
            effects: keymapCompartment.reconfigure(keymap)
        })
        this.broadcast(new EditorConfigurationUpdated());
    }

    getKeymap() {
        return keymaps.find(km => km.name === this.#state.keymap) ?? keymaps[0];
    }

    /**
     * @param {EditorInitialized} event
     */
    onEditorInitialized(event) {
        this.#state.editor = event.editorElement;
    }

    /**
     * @param {EditorKeymapChanged} event
     */
    onEditorKeymapChanged(event) {
        this.#state.keymap = event.keymap;
        // As we set it above to state, we can utilize the setter below.
        this.setKeymap(this.getKeymap().config);
    }

    /**
     * @param {EditorSnapshot} event
     */
    onEditorSnapshot(event) {
        // TODO: Send to some server
    }
}

const manager = new EditorManager();

export { manager as EditorManager };
