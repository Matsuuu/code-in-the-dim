import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { EditorView, basicSetup } from "codemirror";
import { css as codemirrorCss } from "@codemirror/lang-css";
import { html as codemirrorHtml } from "@codemirror/lang-html";
import { LitElement, html } from "lit";
import { keymapCompartment, keymaps } from "./editor.js";
import { EditorTheme } from "./editor-theme.js";
import { oneDark } from "@codemirror/theme-one-dark";
import "./editor-controls.js";

export class CodeInTheDim extends LitElement {
    static get properties() {
        return {
            editor: { type: Object },
            keymap: { type: String, reflect: true },
        };
    }

    constructor() {
        super();

        this.keymap = keymaps[0].name; // Regular
        this.editor = undefined;
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
        const editorKeyMap = keymaps.find(km => km.name === this.keymap) ?? keymaps[0];

        this.editor = new EditorView({
            doc: this.content,
            extensions: [
                basicSetup,
                keymapCompartment.of(editorKeyMap.config),
                keymap.of([indentWithTab]),
                codemirrorCss(),
                codemirrorHtml(),
                oneDark
            ],
            parent: this.shadowRoot.querySelector("#editor"),
        });
    }


    render() {
        return html`
      <section id="editor"></section>
        
      <editor-controls></editor-controls>
    `;
    }

    static get styles() {
        return [
            EditorTheme
        ]
    }
}

if (!customElements.get("code-in-the-dim")) {
    customElements.define("code-in-the-dim", CodeInTheDim);
}
