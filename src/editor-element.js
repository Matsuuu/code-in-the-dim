import { indentWithTab } from "@codemirror/commands";
import { keymap } from "@codemirror/view";
import { EditorView, basicSetup } from "codemirror";
import { css as codemirrorCss } from "@codemirror/lang-css";
import { html as codemirrorHtml } from "@codemirror/lang-html";
import { LitElement, html } from "lit";
import { keymapCompartment, keymaps } from "./editor.js";
import { EditorTheme } from "./editor-theme.js";
import { oneDark } from "@codemirror/theme-one-dark";
import "./editor-controls.js";
import { EditorManager } from "./editor-manager.js";
import { EditorInitialized } from "./events/editor-initialized-event.js";
import { getUrlParam } from "./url.js";

export class EditorElement extends LitElement {
    static get properties() {
        return {
            editor: { type: Object },
        };
    }

    constructor() {
        super();

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
        const keymapKey = getUrlParam("keymap") || keymaps[0].name;
        const editorKeyMap = keymaps.find(km => km.name === keymapKey) ?? keymaps[0];

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

        EditorManager.dispatchEvent(new EditorInitialized(this.editor));
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
