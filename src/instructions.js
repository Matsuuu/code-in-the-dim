import { LitElement, css, html } from "lit";
import { ButtonTheme } from "./editor-theme.js";
import { debugBubble } from "debug-bubble";

export class CodingInstructions extends LitElement {
    static get properties() {
        return {
            open: { type: Boolean, reflect: true },
        };
    }

    copyUrl(url) {
        navigator.clipboard.writeText(url);
        debugBubble("Url copied", "", 1);
    }

    render() {
        const { assets, rules } = window.CODE_IN_THE_DARK_CONFIGURATION;
        return html`
            <button @click=${() => (this.open = !this.open)}>Instructions</button>

            <section>
                <p>${rules}</p>
                <label>--- Assets --- </label>
                <ul>
                    ${assets.map(
            asset =>
                html`<li>
                                <span>${asset.name} (${asset.description})</span>
                                <input @click=${() => this.copyUrl(asset.url)} readonly value="${asset.url}" />
                                <img src="${asset.url}" />
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
                    background: var(--citd-instructions-bg);
                    color: var(--citd-instructions-fg);
                    backdrop-filter: blur(5px);
                    padding: 2rem;
                    overflow: auto;
                    max-height: 70%;
                }

                img {
                    max-width: 200px;
                }

                p {
                    white-space: break-spaces;
                }

                input {
                    width: fit-content;
                }

                li {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    margin-bottom: 2rem;
                }
            `,
            ButtonTheme,
        ];
    }
}

if (!customElements.get("coding-instructions")) {
    customElements.define("coding-instructions", CodingInstructions);
}
