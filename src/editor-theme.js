import { css } from "lit";

export const EditorTheme = css`
    .cm-editor {
        font-size: 18px;
    }

    label {
        color: #fff;
    }
`;

export const ButtonTheme = css`
    button {
        background: var(--citd-button-bg);
        color: var(--citd-button-fg);
        border: none;
        font-size: 1.4rem;
        margin-bottom: 0.2rem;
        padding: 0.5rem 1rem;
        cursor: pointer;
        font-family: inherit;
    }
`;
