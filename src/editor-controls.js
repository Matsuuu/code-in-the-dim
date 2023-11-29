import { LitElement, css, html } from "lit";
import { EditorManager, keymaps } from "./editor-manager.js";
import { setUrlParam } from "./url.js";
import { EditorKeymapChanged } from "./events/editor-keymap-changed.js";
import { EditorConfigurationUpdated } from "./events/editor-configuration-updated.js";

export class EditorControls extends LitElement {

    firstUpdated() {
        EditorManager.addEventListener(EditorConfigurationUpdated.eventName, () => this.requestUpdate());
    }

    /**
     * @param {string} mapName
     */
    setKeymap(mapName) {
        this.keymap = mapName;
        EditorManager.dispatchEvent(new EditorKeymapChanged(this.keymap))
        setUrlParam("keymap", mapName);
    }

    render() {
        return html`

      <section id="controls">
        <div class="control keymap-control">
          ${keymaps.map(
            (km) => html`
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
      </section>

        `;
    }

    static get styles() {
        return [
            css`
        #controls {
            color: #FFF;
          background: rgba(255, 255, 255, 0.3);
          padding: 1rem;
          border-radius: 4px;

          position: absolute;
          top: 3rem;
          right: 3rem;
        }
      `,
        ];
    }
}

if (!customElements.get("editor-controls")) {
    customElements.define("editor-controls", EditorControls);
}
