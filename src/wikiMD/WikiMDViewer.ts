import mermaid from "mermaid"

import { renderMarkdown } from "./renderer"
import { WikiMDComponent } from "./WikiMDComponent"
import { toggleSideBySide } from "easymde"

export class WikiMDViewer extends WikiMDComponent {
    private renderArea: HTMLElement // elemento nel quale settare il codice HTML

    constructor(config: WikiMDConfig) {
        super(config)
        this.renderArea = document.createElement("div")
    }

    public init(element: HTMLElement, config: WikiMDConfig) {
        super.init(element, config)
        this.setMarkdown(config.initialMarkdown)

        this.renderArea = document.createElement("div")
        this.renderArea.classList.add("wikimd-viewer")

        this.renderArea.innerHTML = ""

        this.element.appendChild(this.renderArea)
    }

    public setMarkdown(markdown: string) {
        super.setMarkdown(markdown)
        renderMarkdown(markdown).then(html => {
            console.log(html)
            this.renderArea.innerHTML = html
            mermaid.init(this.mermaidClass)

            this.renderArea.querySelectorAll("a").forEach(a => {
                a.target = "_blank"
                a.classList.add("interal-link")
                a.addEventListener("click", e => this.callHandler("link-click", e))
            })
        })
    }

    public getHTML(): string {
        return this.renderArea.innerHTML
    }

    public hasChanges(): boolean {
        return false
    }
}
