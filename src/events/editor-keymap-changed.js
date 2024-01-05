export class EditorKeymapChanged extends Event {
    static eventName = "editor-keymap-changed";

    /**
     * @param {string} keymap
     */
    constructor(keymap) {
        super(EditorKeymapChanged.eventName);

        this.keymap = keymap;
    }
}
