import { LitElement, html, css } from "lit";
import { EditorManager } from "./editor-manager";
import { EditorConfigurationUpdated } from "./events/editor-configuration-updated";

export class CoderName extends LitElement {

    static get properties() {
        return {
            coderName: { type: String, attribute: "coder-name" }
        }
    }

    constructor() {
        super();
        this.coderName = EditorManager.getCoderName();
    }

    firstUpdated() {
        EditorManager.addEventListener(EditorConfigurationUpdated.eventName, () => {
            this.coderName = EditorManager.getCoderName();
        });
    }

    render() {
        return html`
            <p>${this.coderName}</p>
        `;
    }

    static get styles() {
        return css`
            :host {
                display: block;
                padding: 0.5rem 1rem;
                font-size: 3rem;
                background: rgb(224, 108, 117);
                position: absolute;
                bottom: 0;
                left: 0;
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
