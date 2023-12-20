import { EditorElement } from "./src/editor-element.js";
import "./src/coder-name.js";
import "./src/instructions.js";
import "./src/reference-image.js";


if (!customElements.get("code-in-the-dim")) {
    customElements.define("code-in-the-dim", EditorElement);
}

