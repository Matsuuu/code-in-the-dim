import { LitElement, css, html } from "lit";
import { keymaps, setEditorKeymap } from "./editor.js";

export class EditorControls extends LitElement {

    /**
     * @param {string} mapName
     * @param {import("@codemirror/state").Extension} mapConfig
     */
    setKeymap(mapName, mapConfig) {
        this.keymap = mapName;
        setEditorKeymap(this.editor, mapConfig);
    }

    render() {
        return html`

      <section id="controls">
        <div class="control keymap-control">
          ${keymaps.map(
            (km) => html`
              <label for="${km.name}">${km.name}</label>
              <input
              @change=${() => this.setKeymap(km.name, km.config)}
                ?checked=${this.keymap === km.name}
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
