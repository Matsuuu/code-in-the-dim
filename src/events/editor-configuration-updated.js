export class EditorConfigurationUpdated extends Event {

    static eventName = "editor-configuration-updated";

    constructor() {
        super(EditorConfigurationUpdated.eventName);
    }
}
