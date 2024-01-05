import { LitElement, css, html } from "lit";
import { ButtonTheme } from "./editor-theme.js";

export class CodingInstructions extends LitElement {
    static get properties() {
        return {
            open: { type: Boolean, reflect: true },
        };
    }

    render() {
        const {assets, rules} = window.CODE_IN_THE_DARK_CONFIGURATION;
        return html`
            <button @click=${() => (this.open = !this.open)}>Instructions</button>

            <section>
                <p>${rules}</p>
                <label>--- Assets --- </label>
                <ul>
                    ${assets.map(
                        asset => html`<li>
                          ${asset.name} (${asset.description})<br/>
                          <input readonly value="${asset.url}" />
                        </li>`,
                    )}
                </ul>
            </section>
        `;
    }

    static get styles() {
        return [
            css`
                :host section {
                    display: none;
                }

                :host([open]) section {
                    display: block;
                    position: fixed;
                    top: 10%;
                    right: 10%;
                    width: 70%;
                    background: #fff;
                    padding: 2rem;
                }

                p {
                    white-space: break-spaces;
                }
            `,
            ButtonTheme,
        ];
    }
}

if (!customElements.get("coding-instructions")) {
    customElements.define("coding-instructions", CodingInstructions);
}
