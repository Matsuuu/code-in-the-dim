import { EditorElement } from "./src/editor-element.js";
import { EditorInitialized } from "./src/events/editor-initialized-event.js";


if (!customElements.get("code-in-the-dim")) {
    customElements.define("code-in-the-dim", EditorElement);
}

console.log(EditorInitialized.eventName);
