import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { Compartment } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { EditorView, basicSetup } from "codemirror";
import { css as codemirrorCss } from "@codemirror/lang-css";
import { html as codemirrorHtml } from "@codemirror/lang-html";
import { LitElement, html } from "lit"
import { keymapCompartment, setEditorKeymap } from "./editor.js";
import { vim } from "@replit/codemirror-vim";

export class CodeInTheDim extends LitElement {

    static get properties() {
        return {
            editor: { type: Object },
            keymap: { type: String, reflect: true },
        }
    }

    constructor() {
        super();

        this.editor = undefined;
        this.keymap = "regular";
        this.content = `
<style>
    p {
        color: red;
    }
</style>

<div class="foo">
    <p>This is a paragraph</p>
</div>
`
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
                codemirrorHtml()
            ],
            parent: this.shadowRoot.querySelector("#editor")
        });
    }

    setKeymap(map) {
        this.keymap = map;
        let keymapObject = keymap.of(defaultKeymap);
        switch (map) {
            case "regular":
                keymapObject = keymap.of(defaultKeymap);
                break;
            case "vim":
                keymapObject = vim();
                break;
        }

        setEditorKeymap(this.editor, keymapObject);
    }

    render() {
        return html`
            <section id="editor"></section>

            <section id="controls">
                <div class="control keymap-control">
                    <button @click=${() => this.setKeymap("regular")}>Regular</button>
                    <button @click=${() => this.setKeymap("vim")}>Vim</button>
                </div>
            </section>
        `;
    }
}

if (!customElements.get("code-in-the-dim")) {
    customElements.define("code-in-the-dim", CodeInTheDim);
}
