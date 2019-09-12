import EasyMDE from "easymde"
import { WikiMDComponent } from "./WikiMDComponent"
import mermaid from "mermaid"

import { renderMarkdown } from "./renderer"
import { WikiMDActions } from "./WikiMD"

import "../../node_modules/easymde/dist/easymde.min.css"

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
            promptURLs: true,
            toolbar: this.makeToolbar(),
            // toolbar: [
            //     "bold",
            //     "italic",
            //     "heading",
            //     "|",
            //     "quote",
            //     {
            //         name: "custom",
            //         action: editor => {
            //             // Add your own code
            //             this.callHandler("select-link", {})
            //         },
            //         className: "fa fa-star",
            //         title: "Custom Button",
            //     },
            // ],
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

    public executeAction(action: WikiMDActions, data: any): boolean {
        switch (action) {
            case WikiMDActions.replaceText:
                this.replaceSelection(data.text, data.mode)
                return true
            default:
                return super.executeAction(action, data)
        }
    }

    /**
     * sostituisce la selezione corrente con il testo passato come parametro
     * @param text testo da inserire
     * @param mode modalità d'inserimento
     */
    private replaceSelection(text: string, mode: "around" | "start" | "end" = "end") {
        if (this.editor) {
            this.editor.codemirror.doc.replaceSelection(text, mode)
        }
    }

    private makeToolbar() {
        return [
            "bold",
            "italic",
            "strikethrough",
            "heading",
            "|",
            "code",
            "quote",
            "unordered-list",
            "ordered-list",
            "|",
            {
                name: "link",
                action: (editor: EasyMDE) => {
                    // Add your own code
                    this.callHandler("select-link", {})
                },
                className: "fa fa-link",
                title: "Link",
            },
            {
                name: "image",
                action: (editor: EasyMDE) => {
                    // Add your own code
                    this.callHandler("select-image", {})
                },
                className: "fa fa-image",
                title: "Image",
            },
            "table",
            "horizontal-rule",
            "|",
            "preview",
            "side-by-side",
            "fullscreen",
            "|",
            "guide",
        ]
    }
}
