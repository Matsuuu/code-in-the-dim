import { EditorElement } from "./src/editor-element.js";
import "./src/coder-name.js";


if (!customElements.get("code-in-the-dim")) {
    customElements.define("code-in-the-dim", EditorElement);
}

