declare type WikiMDConfig = {
    elementId: string
    editorMode: boolean
    initialMarkdown: string
    mermaidClass: string
}

declare type WikiMDEvent = "link-click" | "image-click" | "select-link"
declare type WikiMDEventHandler = (e?: Event | any) => boolean
