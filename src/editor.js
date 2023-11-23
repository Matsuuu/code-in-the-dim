import { defaultKeymap, indentWithTab } from "@codemirror/commands";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { Compartment } from "@codemirror/state";
import { keymap, showPanel } from "@codemirror/view";
import { vim } from "@replit/codemirror-vim";
import { EditorView, basicSetup } from "codemirror";

const codeBoilerplate = `
<style>
    p {
        color: red;
    }
</style>

<div class="foo">
    <p>This is a paragraph</p>
</div>
`

// Toggleables
const userKeymap = new Compartment;
const tabSize = new Compartment;


const editor = new EditorView({
    doc: codeBoilerplate,
    extensions: [
        basicSetup,
        userKeymap.of(keymap.of(defaultKeymap)), // TODO: Support vim
        keymap.of([indentWithTab]),
        html(),
        css()
    ],
    parent: document.body
})



document.addEventListener("keyup", e => {
    console.log(e.key);
    if (e.key === "F2") {
        e.preventDefault();
        editor.dispatch({
            effects: userKeymap.reconfigure(vim())
        })

    }
})
