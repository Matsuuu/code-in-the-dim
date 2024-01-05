import { LitElement, html } from "lit";
import { ButtonTheme } from "./editor-theme.js";
import { EditorManager } from "./editor-manager.js";
import { EditorElement } from "./editor-element.js";

export class FinishButton extends LitElement {
    finish() {
        const confirmation = prompt(`This will show the results of your code. 
Doing this before the round is over WILL DISQUALIFY YOU. 
Are you sure you want to proceed? Type "yes" to confirm`);

        if (confirmation === "yes") {
            /** @type { EditorElement } */ (document.querySelector("code-in-the-dim"))?.sendCurrentSnapshot();
            document.querySelectorAll("link").forEach(link => link.remove());
            document.querySelectorAll("script").forEach(script => script.remove());
            document.body.innerHTML = EditorManager.getCode();
        }
    }

    render() {
        return html`<button @click=${this.finish}>Finish</button>`;
    }

    static get styles() {
        return [ButtonTheme];
    }
}

if (!customElements.get("finish-button")) {
    customElements.define("finish-button", FinishButton);
}
