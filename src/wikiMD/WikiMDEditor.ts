import EasyMDE from "easymde"
import { WikiMDComponent } from "./WikiMDComponent"
import mermaid from "mermaid"

import { renderMarkdown } from "./renderer"

export class WikiMDEditor extends WikiMDComponent {
    private textArea: HTMLTextAreaElement
    private editor?: EasyMDE
    private originalMarkdown: string

    constructor(config: WikiMDConfig) {
        super(config)
        this.textArea = document.createElement("textarea")
        this.originalMarkdown = ""
    }

    public init(element: HTMLElement, config: WikiMDConfig) {
        super.init(element, config)

        if (!config.initialMarkdown) {
            config.initialMarkdown = ""
        }

        this.setMarkdown(config.initialMarkdown)
        this.textArea = document.createElement("textarea")
        this.textArea.classList.add("wikimd-editor")
        this.element.appendChild(this.textArea)

        this.editor = new EasyMDE({
            element: this.textArea,
            autoDownloadFontAwesome: true,
            spellChecker: false,

            previewRender: function(plainText, preview) {
                // Async method
                // setTimeout(function() {
                //     preview.innerHTML = plainText
                // }, 250)
                renderMarkdown(plainText).then(html => {
                    preview.innerHTML = html
                    setTimeout(() => {
                        mermaid.init(config.mermaidClass)
                    }, 0)
                })

                return "Loading..."
            },
        })
        this.editor.value(config.initialMarkdown)
    }

    public getMarkdown(): string {
        return this.editor ? this.editor.value() : super.getMarkdown()
    }

    public setMarkdown(markdown: string) {
        if (this.editor && markdown) {
            this.editor.value(markdown)
            this.originalMarkdown = markdown
        }
    }

    public hasChanges(): boolean {
        if (!this.editor) {
            return false
        }
        let markdown = this.editor.value()
        console.log(`Editor has Changes? {markdown !== this.originalMarkdown}`)
        // console.log(this.originalMarkdown.length, markdown.length)
        // console.log(this.originalMarkdown)
        // console.log(markdown)
        return markdown !== this.originalMarkdown
    }
    public discardChanges() {
        console.log(this.originalMarkdown)
        this.setMarkdown(this.originalMarkdown)
    }

    public commitChanges() {
        this.originalMarkdown = this.getMarkdown()
        this.setMarkdown(this.originalMarkdown)
    }
}
