declare type WikiMDConfig = {
    elementId: string
    editorMode: boolean
    initialMarkdown: string
    mermaidClass: string
}

declare type WikiMDEvent = "link-click" | "image-click"
declare type WikiMDEventHandler = (e: Event) => boolean
