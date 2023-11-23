import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { Compartment } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { EditorView, basicSetup } from "codemirror";
import { css as codemirrorCss } from "@codemirror/lang-css";
import { html as codemirrorHtml } from "@codemirror/lang-html";
import { LitElement, html } from "lit";
import { keymapCompartment, keymaps, setEditorKeymap } from "./editor.js";
import { vim } from "@replit/codemirror-vim";

export class CodeInTheDim extends LitElement {
    static get properties() {
        return {
            editor: { type: Object },
            keymap: { type: String, reflect: true },
        };
    }

    constructor() {
        super();

        this.editor = undefined;
        this.keymap = "Regular";
        this.content = `
<style>
    p {
        color: red;
    }
</style>

<div class="foo">
    <p>This is a paragraph</p>
</div>
`;
    }

    firstUpdated() {
        this.initializeEditor();
    }

    initializeEditor() {
        this.editor = new EditorView({
            doc: this.content,
            extensions: [
                basicSetup,
                keymapCompartment.of(keymap.of(defaultKeymap)), // TODO: Support vim
                keymap.of([indentWithTab]),
                codemirrorCss(),
                codemirrorHtml(),
            ],
            parent: this.shadowRoot.querySelector("#editor"),
        });
    }

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
      <section id="editor"></section>

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
}

if (!customElements.get("code-in-the-dim")) {
    customElements.define("code-in-the-dim", CodeInTheDim);
}
