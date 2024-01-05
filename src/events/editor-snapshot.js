export class EditorSnapshot extends Event {
    static eventName = "editor-snapshot";

    /**
     * @param {string} content
     */
    constructor(content) {
        super(EditorSnapshot.eventName);
        this.content = content;
    }
}
