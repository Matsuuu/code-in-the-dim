import { LitElement, css, html } from "lit";
import { when } from "lit/directives/when.js";
import { EditorManager, keymaps } from "./editor-manager.js";
import { setUrlParam } from "./url.js";
import { EditorKeymapChanged } from "./events/editor-keymap-changed.js";
import { EditorConfigurationUpdated } from "./events/editor-configuration-updated.js";
import { TogglePowerMode } from "./events/toggle-power-mode.js";

export class EditorControls extends LitElement {
    static get properties() {
        return {
            open: { type: Boolean, reflect: true },
        };
    }

    constructor() {
        super();
        this.open = false;
    }

    firstUpdated() {
        EditorManager.addEventListener(EditorConfigurationUpdated.eventName, () => this.requestUpdate());
    }

    /**
     * @param {string} mapName
     */
    setKeymap(mapName) {
        this.keymap = mapName;
        EditorManager.dispatchEvent(new EditorKeymapChanged(this.keymap));
        setUrlParam("keymap", mapName);
    }

    togglePowerMode(ev) {
        console.log(ev);
        const checkbox = this.shadowRoot.querySelector("[name='power-mode']");
        EditorManager.dispatchEvent(new TogglePowerMode(checkbox.checked));
    }

    render() {
        return html`
            <section id="controls-toggle">
                <button @click=${() => (this.open = !this.open)}>⚙️</button>
            </section>
            ${when(this.open, () => this.renderControls())}
        `;
    }

    renderControls() {
        return html`
            <section id="controls">
                <div class="control keymap-control">
                    ${keymaps.map(
                        km => html`
                            <label for="${km.name}">${km.name}</label>
                            <input
                                @change=${() => this.setKeymap(km.name)}
                                ?checked=${EditorManager.getKeymap().name === km.name}
                                id="${km.name}"
                                type="radio"
                                name="keymap"
                                value="${km.name}"
                            />
                        `,
                    )}
                </div>
                <div class="others">
                    <label>
                        Power Mode
                        <input
                            @input=${this.togglePowerMode}
                            ?checked=${EditorManager.isPowerModeOn()}
                            type="checkbox"
                            name="power-mode"
                        />
                    </label>
                </div>
            </section>
        `;
    }

    static get styles() {
        return [
            css`
                #controls {
                    color: var(--citd-popover-fg);
                    background: var(--citd-popover-bg);
                    padding: 1rem;
                    border-radius: 4px;

                    position: fixed;
                    top: 3rem;
                    right: 3rem;
                }
                #controls .others {
                    margin-top: 1rem;
                }

                #controls-toggle button {
                    background: none;
                    outline: none;
                    border: none;
                    cursor: pointer;

                    position: absolute;
                    top: 1rem;
                    right: 1rem;
                }
            `,
        ];
    }
}

if (!customElements.get("editor-controls")) {
    customElements.define("editor-controls", EditorControls);
}
