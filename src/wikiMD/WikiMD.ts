import "easymde/dist/easymde.min.css"
import mermaid from "mermaid"

const sample_graph = "```mermaid\n graph LR \nA-->B"

import { WikiMDViewer } from "./WikiMDViewer"
import { WikiMDEditor } from "./WikiMDEditor"
import { WikiMDComponent } from "./WikiMDComponent"

import "./wikimd.css"

export class WikiMD {
    private editorMode: boolean = false
    private element: HTMLElement
    private component?: WikiMDComponent
    private config: WikiMDConfig
    private listeners: Map<WikiMDEvent, WikiMDEventHandler>

    constructor(config: WikiMDConfig) {
        this.listeners = new Map()
        this.editorMode = config.editorMode
        this.config = config
        this.element = document.getElementById(config.elementId) as HTMLElement
        this.element.style.width = "100%"
        this.element.style.height = "100%"

        this.setMode(config.editorMode)

        mermaid.initialize({
            theme: "forest",
            startOnLoad: false,
        })
    }

    public setMode(editorMode: boolean) {
        console.log(`WikiMD set mode ${editorMode}`)
        this.element.innerHTML = ""
        this.editorMode = editorMode
        if (editorMode) {
            console.log("Editor mode")
            this.component = new WikiMDEditor(this.config)
        } else {
            console.log("Viewer mode")
            this.component = new WikiMDViewer(this.config)
        }
        this.component.setHandlers(this.listeners)
        this.component.init(this.element, this.config)
    }

    public getMarkdown(): string {
        return this.component ? this.component.getMarkdown() : ""
    }

    public setMarkdown(markdown: string): void {
        if (this.component) {
            this.component.setMarkdown(markdown)
        }
    }

    public getHTML(): string {
        if (this.component) {
            return this.component.getHTML()
        } else {
            return ""
        }
    }

    public hasChanges(): boolean {
        if (this.component) {
            return this.component.hasChanges()
        } else {
            return false
        }
    }

    public commitChanges() {
        if (this.component) {
            this.component.commitChanges()
        }
    }
    public discardChanges() {
        console.log("WIKIMD: discardChanges")
        if (this.component) {
            this.component.discardChanges()
        }
    }

    public addEventListener(event: WikiMDEvent, fn: WikiMDEventHandler) {
        this.listeners.set(event, fn)
        if (this.component) {
            this.component.setHandlers(this.listeners)
        }
    }
}

const TEST_MARKDOWN = `
# Ciao mondo

* asd
* asd

**asdasd** _asd_

![asd](https://avatars1.githubusercontent.com/u/14985020?s=400&v=4)

<div class="mermaid">
graph LR
A-->B
</div>
<div class="mermaid">
gantt
title A Gantt Diagram
dateFormat YYYY-MM-DD
section Section
A task :a1, 2014-01-01, 30d
Another task :after a1 , 20d
section Another
Task in sec :2014-01-12 , 12d
another task : 24d
</div>

${sample_graph}
`
