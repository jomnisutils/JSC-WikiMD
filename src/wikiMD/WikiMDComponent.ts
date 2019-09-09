import mermaid from "mermaid"
import { WikiMDActions } from "./WikiMD"

export abstract class WikiMDComponent {
    protected element: HTMLElement // elemento in cui è instanziato il visualizzatore
    protected mermaidClass: string
    protected markdown: string
    protected config: WikiMDConfig
    protected handlers: Map<WikiMDEvent, WikiMDEventHandler>

    constructor(config: WikiMDConfig) {
        this.element = document.createElement("div")
        this.markdown = ""
        this.config = config
        this.mermaidClass = ".mermaid"
        this.handlers = new Map()
        mermaid.initialize({
            theme: "forest",
            startOnLoad: false,
        })
    }

    public init(element: HTMLElement, config: WikiMDConfig) {
        this.element = element
        this.mermaidClass = config.mermaidClass
    }

    public getMarkdown(): string {
        return this.markdown
    }

    public setMarkdown(markdown: string) {
        this.markdown = markdown
    }

    public getHTML(): string {
        console.warn("super.getHTML()")
        return ""
    }

    public hasChanges(): boolean {
        console.warn("super.hasChanges()")
        return false
    }

    public discardChanges(): void {
        console.warn("super.discardChanges()")
    }

    public commitChanges(): void {
        console.warn("super.commitChanges()")
    }

    public setHandlers(handlers: Map<WikiMDEvent, WikiMDEventHandler>) {
        this.handlers = handlers
    }

    public executeAction(action: WikiMDActions, data: any): boolean {
        console.warn(`Azione non gestita: ${action}`)
        return true
    }

    protected callHandler(eventName: WikiMDEvent, eventData: Event | any): boolean {
        const handler = this.handlers.get(eventName)
        if (handler) {
            return handler(eventData)
        } else {
            return true
        }
    }
}
