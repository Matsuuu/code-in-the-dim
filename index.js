import { EditorElement } from "./src/editor-element.js";


if (!customElements.get("code-in-the-dim")) {
    customElements.define("code-in-the-dim", EditorElement);
}

