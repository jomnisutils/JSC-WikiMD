import { JSONComponent } from "./omnis"
import { WikiMD } from "./wikiMD"
import { JSCEvent } from "./omnis/JSCEvent"

enum WikiMDProperties {
    markdown = "$markdown",
    editormode = "$editormode",
}
declare type WikiMDDataProps = {
    markdown: string
    editormode: boolean
}

/*
var EVENTS = {
    evLinkClick: 1
};
 */
// enum WikiMDEvents {
//     // NO: http://sdkdocs.omnis.net/jssdk/latest/api-reference/javascript-control-reference/javascript-api/control/instance-methods/sendevent
//     // evLinkClick = 1,
//     // Neanche: http://sdkdocs.omnis.net/jssdk/latest/api-reference/javascript-control-reference/javascript-api/control/instance-methods/cansendevent

//     evLinkClick = "evLinkClick",
// }
// ^ L'API di Omnis fa schifo, da una parte serve l'id numerico (canSendEvent), dall'altro il nome stringa...

const WikiMDEvents = {
    evLinkClick: new JSCEvent(1, "evLinkClick"),
    evPickLink: new JSCEvent(2, "evPickLink"),
}

enum WikiMDMethods {
    $gethtml = "$gethtml",
    $haschanges = "$haschanges",
    $commitchanges = "$commitchanges",
    $discardchanges = "$discardchanges",
    $inserttext = "$inserttext",
}

export class WikiMDJSONCOmponent extends JSONComponent {
    private markdown: string = ""
    private editorMode: boolean = false
    private wikiMD: WikiMD | null

    constructor(base: ctrl_base) {
        super(base)
        // initialize class specific stuff
        this.markdown = ""
        this.editorMode = false
        this.wikiMD = null
    }

    protected render(): HTMLElement {
        const elem = document.createElement("div")
        elem.classList.add("wikimd")
        elem.id = "wiki-md"

        this.addClickHandlers(elem)
        return elem
    }

    protected setDataProps(dataProps: WikiMDDataProps) {
        const { markdown, editormode } = dataProps
        console.log(dataProps)
        this.wikiMD = new WikiMD({
            elementId: "wiki-md",
            editorMode: editormode,
            initialMarkdown: markdown,
            mermaidClass: ".mermaid",
        })

        this.wikiMD.addEventListener("link-click", e => this.handleLinkClick(e))
        this.wikiMD.addEventListener("select-link", () => this.handleSelectLink())
        this.setProperty(WikiMDProperties.markdown, markdown)
        this.setProperty(WikiMDProperties.editormode, editormode)
    }

    public handleLinkClick(e: Event) {
        const a = e.target as HTMLAnchorElement
        const href = a.getAttribute("href") || ""
        console.log(`Link click: ${a.href}`)

        if (href.startsWith("#p=")) {
            const regex = /p=(\d*)/
            const res = href.match(regex)
            if (res) {
                // this.sendEvent(eBaseEvent.evClick, {
                this.sendEvent(WikiMDEvents.evLinkClick, {
                    pPageId: parseInt(res[1]),
                    pHref: href,
                })
            }
            e.preventDefault()
            return false
        } else {
            return true
        }
    }

    public handleSelectLink() {
        this.sendEvent(WikiMDEvents.evPickLink)
        return true
    }

    public handleClick(pX: number, pY: number) {
        console.log("handle click")

        this.sendEvent(eBaseEvent.evClick, {
            pXPos: pX,
            pYPos: pY,
        })
        return true
    }

    /**
     * Function to get $canassign for a property of an object
     * @param prop    The Omnis property number
     * @returns   Whether the passed property can be assigned to.
     */
    public getCanAssign(prop: OmnisPropName) {
        let handled,
            status = false
        switch (prop) {
            case eBaseProperties.text:
            case WikiMDProperties.editormode:
            case WikiMDProperties.markdown:
                handled = true
                status = true
                break
            default:
                handled = false
        }
        return { handled, status }
    }

    public setProperty(prop: OmnisPropName, value: any) {
        if (!this.getCanAssign(prop) || this.wikiMD === null) {
            // check whether the value can be assigned to
            return { handled: true, status: false }
        }

        console.log(`SetProperty: ${prop} := ${value}`)

        let handled = true
        switch (prop) {
            case WikiMDProperties.editormode:
                this.editorMode = value
                this.wikiMD.setMode(this.editorMode)
                break
            case WikiMDProperties.markdown:
                this.markdown = value
                this.wikiMD.setMarkdown(this.markdown)
                break
            default:
                handled = false
        }
        return { handled, status: true }
    }
    /**
     * Called to get the value of an Omnis property
     *
     * @param prop    The Omnis property number
     * @returns {var}       The property's value
     */
    public getProperty(prop: OmnisPropName) {
        let handled = true
        let value: any = null
        switch (prop) {
            case WikiMDProperties.markdown:
                value = this.wikiMD ? this.wikiMD.getMarkdown() : ""
                break
            case WikiMDProperties.editormode:
                value = this.editorMode
                break
            default:
                handled = false
        }
        return {
            handled,
            value,
        }
    }

    public executeMethod(methodName: WikiMDMethods, args: any[]): any {
        console.log(`$method: ${methodName} `, args)
        switch (methodName) {
            case WikiMDMethods.$gethtml:
                return this.wikiMD ? this.wikiMD.getHTML() : ""
            case WikiMDMethods.$haschanges:
                return this.wikiMD ? this.wikiMD.hasChanges() : false

            case WikiMDMethods.$commitchanges:
                if (this.wikiMD) {
                    this.wikiMD.commitChanges()
                }
                return
            case WikiMDMethods.$discardchanges:
                if (this.wikiMD) {
                    this.wikiMD.discardChanges()
                }
                return
            case WikiMDMethods.$inserttext:
                let text: string = args[0]
                console.warn(`Inserisco il testo ${text}`)
                if (this.wikiMD) {
                    this.wikiMD.replaceSelectionText(text)
                }
                return
        }
    }

    public updateCtrl(what: "" | "#COL" | "#LSEL" | "#L" | "#LSEL_ALL" | "#NCELL", row: number, col: number | string): void {
        const elem = this.base.getClientElem()
    }

    public sizeChanged() {
        // center any text vertically
        const elem = this.base.getClientElem()
        elem.style.lineHeight = elem.style.height
    }
}
