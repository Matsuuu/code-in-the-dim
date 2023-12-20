import { LitElement, css, html } from 'lit';
import { when } from 'lit/directives/when.js';

export class ReferenceImage extends LitElement {
    referenceImageNotSet() {
        return window.CODE_IN_THE_DARK_CONFIGURATION.referenceImage === undefined;
    }

    toggleImage() {
        this.toggleAttribute("show");
    }

    firstUpdated() {
        this.addEventListener("click", () => {
            this.toggleImage();
        })
    }

    render() {
        return html`
            <img src="${window.CODE_IN_THE_DARK_CONFIGURATION.referenceImage}" />
            ${when(this.referenceImageNotSet(), () => html`<p>Reference image not set in configuration</p>`)}
        `;
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                cursor: pointer;
                margin-bottom: 1rem;
            }

            :host([show]) {
                position: fixed;
                height: 95%;
                aspect-ratio: 1;
                inset: 0;
                margin: auto;
            }

            :host([show]) img {
                width: 100%;
                height: 100%;
            }

            img {
                width: 200px;
            }
        `;
    }
}

if (!customElements.get('reference-image')) {
    customElements.define('reference-image', ReferenceImage);
}
