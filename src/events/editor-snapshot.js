export class EditorSnapshot extends Event {
    static eventName = "editor-snapshot";

    /**
     * @param {string} content
     * @param mode {'final'|'draft'}
     */
    constructor(content, mode) {
        super(EditorSnapshot.eventName);
        this.content = content;
        this.mode = mode;
    }
}
