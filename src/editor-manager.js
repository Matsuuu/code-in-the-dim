import { EditorInitialized } from "./events/editor-initialized-event";
import { Compartment } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { vim } from "@replit/codemirror-vim";
import { getUrlParam, setUrlParam } from "./url";
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
        keymap: "Regular",
        coderName: undefined
    };

    #EVENTS = [
        EditorInitialized,
        EditorKeymapChanged,
        EditorSnapshot
    ];

    constructor() {
        super();
        this.#state.keymap = getUrlParam("keymap") || keymaps[0].name;
        this.#state.coderName = getUrlParam("coderName");

        for (const ev of this.#EVENTS) {
            this.addEventListener(ev.eventName, this);
        }

        if (!this.#state.coderName) {
            this.requestCoderName();
        }
    }

    requestCoderName() {
        const response = prompt("Please provide us your coder name");
        if (!response) {
            this.requestCoderName();
            return;
        }
        setUrlParam("coderName", response);
        this.#state.coderName = response;
    }

    getCoderName() {
        return this.#state.coderName;
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

    updateKeymap() {
        this.#state.editor.dispatch({
            effects: keymapCompartment.reconfigure(this.getKeymap().config)
        })
        this.broadcast(new EditorConfigurationUpdated());
    }

    getKeymap() {
        return keymaps.find(km => km.name === this.#state.keymap) ?? keymaps[0];
    }

    /**
     * @param {Event} event
     */
    handleEvent(event) {
        if (event instanceof EditorInitialized) {
            this.#state.editor = event.editorElement;
            return;
        }

        if (event instanceof EditorKeymapChanged) {
            this.#state.keymap = event.keymap;
            // As we set it above to state, we can utilize the setter below.
            this.updateKeymap();
            return;
        }

        if (event instanceof EditorSnapshot) {
            // TODO: Send to some server
        }
    }
}

const manager = new EditorManager();

export { manager as EditorManager };
