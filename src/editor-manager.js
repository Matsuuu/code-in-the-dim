import { EditorInitialized } from "./events/editor-initialized-event.js";
import { Compartment } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { vim } from "@replit/codemirror-vim";
import { getUrlParam, setUrlParam } from "./url.js";
import { EditorKeymapChanged } from "./events/editor-keymap-changed.js";
import { EditorConfigurationUpdated } from "./events/editor-configuration-updated.js";
import { EditorSnapshot } from "./events/editor-snapshot.js";
import { TogglePowerMode } from "./events/toggle-power-mode.js";
import { restartPowerMode } from "./power-mode.js";

export const EDITOR_SNAPSHOT_INTERVAL = 3000;
export const LOCAL_STORAGE_SAVE_KEY = `code-in-the-dim-code-${window.CODE_IN_THE_DARK_CONFIGURATION?.roundId ?? "default"}`;

// Toggleables
export const keymapCompartment = new Compartment();

export const keymaps = [
    {
        name: "Regular",
        config: keymap.of(defaultKeymap),
    },
    {
        name: "Vim",
        config: vim(),
    },
];

class EditorManager extends EventTarget {
    /**
     * @type { import("./interfaces").EditorManagerProps }
     * */
    #state = {
        editor: undefined,
        keymap: "Regular",
        coderName: undefined,
        powerModeOn: false,
    };

    #EVENTS = [EditorInitialized, EditorKeymapChanged, EditorSnapshot, TogglePowerMode];

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
        const response = prompt("Please provide us your coder name", this.#state.coderName ?? "");
        if (!response) {
            this.requestCoderName();
            return;
        }
        setUrlParam("coderName", response);
        this.#state.coderName = response;
        this.onUpdate();
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
            effects: keymapCompartment.reconfigure(this.getKeymap().config),
        });
        this.onUpdate();
    }

    onUpdate() {
        this.broadcast(new EditorConfigurationUpdated());
    }

    getKeymap() {
        return keymaps.find(km => km.name === this.#state.keymap) ?? keymaps[0];
    }

    getCode() {
        return localStorage.getItem(LOCAL_STORAGE_SAVE_KEY);
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
            localStorage.setItem(LOCAL_STORAGE_SAVE_KEY, event.content);
            // TODO: Send to some server
        }

        if (event instanceof TogglePowerMode) {
            this.#state.powerModeOn = event.powerModeOn;
            console.log("PowerModeOn: ", this.#state.powerModeOn);
            if (this.isPowerModeOn()) {
                restartPowerMode();
            }
        }
    }

    isPowerModeOn() {
        return this.#state.powerModeOn;
    }
}

const manager = new EditorManager();

export { manager as EditorManager };
