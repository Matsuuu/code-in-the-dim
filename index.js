import { EditorElement } from "./src/editor-element.js";
import "./src/coder-name.js";
import "./src/instructions.js";
import "./src/reference-image.js";
import "./src/finish-button.js";

if (!customElements.get("code-in-the-dim")) {
    customElements.define("code-in-the-dim", EditorElement);
}

window.addEventListener("keydown", ev => {
    if (ev.key === "s" && ev.ctrlKey) {
        ev.preventDefault();
    }
});
