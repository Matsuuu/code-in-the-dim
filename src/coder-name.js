import { LitElement, html, css } from "lit";
import { EditorManager } from "./editor-manager.js";
import { EditorConfigurationUpdated } from "./events/editor-configuration-updated.js";

export class CoderName extends LitElement {
    static get properties() {
        return {
            coderName: { type: String, attribute: "coder-name" },
        };
    }

    constructor() {
        super();
        this.coderName = EditorManager.getCoderName();
    }

    firstUpdated() {
        EditorManager.addEventListener(EditorConfigurationUpdated.eventName, () => {
            this.coderName = EditorManager.getCoderName();
        });
        this.addEventListener("click", () => {
            EditorManager.requestCoderName();
        });
    }

    render() {
        return html`<p>${this.coderName}</p>`;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding-right: 1rem;
                padding-left: 1rem;
                padding-bottom: 0.5rem;
                font-size: 3rem;
                background: var(--citd-name-bg);
                color: var(--citd-name-fg);
                cursor: text;
            }

            p {
                margin: 0;
            }
        `;
    }
}

if (!customElements.get("coder-name")) {
    customElements.define("coder-name", CoderName);
}
