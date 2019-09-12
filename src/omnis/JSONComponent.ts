import { JSCEvent } from "./JSCEvent"

export abstract class JSONComponent {
    base: ctrl_base
    form?: any
    elem?: HTMLElement
    rowCtrl?: any
    rowNumer?: number

    constructor(base: ctrl_base) {
        this.base = base
    }

    public delete_class_inst(): void {}

    /**
     * Initializes the control instance from element attributes.
     * Must be called after control is constructed by the constructor.
     * @param form      Reference to the parent form.
     * @param elem      The html element the control belongs to.
     * @param rowCtrl   Pointer to a complex grid control if this control belongs to a cgrid.
     * @param rowNumber The row number this control belongs to if it belongs to a cgrid.
     * @returns {boolean}   True if the control is a container.
     */
    public initControl(form: any, elem: HTMLElement, rowCtrl: any, rowNumber: number): boolean {
        this.form = form
        this.elem = elem
        this.rowCtrl = rowCtrl
        this.rowNumer = rowNumber

        const client_elem = this.base.getClientElem()
        const dataprops = client_elem.getAttribute("data-props") || ""
        const datapropsobj = JSON.parse(dataprops)

        const component = this.render()

        client_elem.appendChild(component)

        console.log("data-props", datapropsobj)
        this.setDataProps(datapropsobj)
        this.base.update()

        // return true if our control is a container and the
        // children require installing via this.form.InstallChildren
        return false
    }

    protected setDataProps(dataProps: any): void {}
    protected abstract render(): HTMLElement

    /**
     * Function to get $canassign for a property of an object
     * @param prop    The Omnis property number
     * @returns {boolean}   Whether the passed property can be assigned to.
     */
    public abstract getCanAssign(prop: OmnisPropName): { status: boolean; handled: boolean }
    /**
     * Assigns the specified property's value to the control.
     * @param prop    The Omnis property number
     * @param value     The new value for the property
     * @returns {boolean}   success
     */
    public abstract setProperty(prop: OmnisPropName, value: any): { status: boolean; handled: boolean }
    /**
     * Called to get the value of an Omnis property
     *
     * @param prop    The Omnis property number
     * @returns {var}       The property's value
     */
    public abstract getProperty(prop: OmnisPropName): { value: any; handled: boolean }

    /**
     * executeMethod
     */
    public executeMethod(methodName: string, args: Array<any>): any {}

    /**
     * Adds a click handler if the device doesn't support touch, or equivalent touch handlers if it does.
     * @param elem Element to add a click/touch handler to
     */
    public addClickHandlers(elem: HTMLElement) {
        if (!this.base.usesTouch) {
            elem.onclick = this.base.mEventFunction
        } else {
            elem.ontouchstart = this.base.mEventFunction
            elem.ontouchend = this.base.mEventFunction
        }
    }

    public handleEvent(event: any): boolean | null {
        if (!this.base.isEnabled()) {
            return true // If the control is disabled, don't process the event.
        }
        switch (event.type) {
            case "click":
                return this.handleClick(event.offsetX, event.offsetY)
            case "touchstart":
                this.base.lastTouch = new Date().getTime() // Note the time of the touch start.
                this.base.touchStartPos = {
                    x: event.changedTouches0.clientX,
                    y: event.changedTouches0.clientY,
                } // Note the starting position of the touch.
                break
            case "touchend":
                var time = new Date().getTime()
                if (time - this.base.lastTouch < 500) {
                    //Treat as a click if less than 500ms have elapsed since touchstart
                    if (touchWithinRange(this.base.touchStartPos, event.changedTouches0, 20)) {
                        //Only treat as a click if less than 20 pixels have been scrolled.
                        return this.handleClick(event.changedTouches0.offsetX, event.changedTouches0.offsetY)
                    }
                }
                break
            default:
        }
        return null
    }

    public handleClick(x: number, y: number): boolean {
        return true
    }

    public bounceToOmnis(event: JSCEvent) {
        this.sendEvent(event)
        return true
    }

    /**
     * Notifica Omnis dell'evento, passando i parametri specificati
     * http://sdkdocs.omnis.net/jssdk/latest/api-reference/javascript-control-reference/javascript-api/control/instance-methods/sendevent
     * @param event Codice dell'evento da inviare ad Omnis
     * @param eventData Dizionario con i parametri da inviare
     */
    public sendEvent(event: JSCEvent, eventData?: { [k: string]: any }): boolean {
        console.log("sendEvent", arguments)
        const canSend = this.base.canSendEvent(event.id)
        if (canSend) {
            if (eventData) {
                for (let key in eventData) {
                    let value: any = eventData[key as string]
                    this.base.eventParamsAdd(key, value)
                }
            }

            this.base.sendEvent(event.name)
        } else {
            console.warn("Non posso mandare l'evento!")
        }
        return canSend
    }

    /**
     * The control's data has changed. The contents may need to be updated.
     *
     * @param {String} what    Specifies which part of the data has changed:
     *                 ""              - The entire data has changed
     *                 "#COL"          - A single column in the $dataname list (specified by 'row' and 'col') or a row's column (specified by 'col')
     *                 "#LSEL"         - The selected line of the $dataname list has changed (specified by 'row')
     *                 "#L"            - The current line of the $dataname list has changed  (specified by 'row')
     *                 "#LSEL_ALL"     - All lines in the $dataname list have been selected.
     *                 "#NCELL"        - An individual cell in a (nested) list. In this case, 'row' is an array of row & column numbers.
     *                                  of the form "row1,col1,row2,col2,..."
     *
     * @param {Number} row             If specified, the row number in a list (range = 1..n) to which the change pertains.
     *                                 If 'what' is "#NCELL", this must be an array of row and col numbers. Optionally, a modifier may be
     *                                 added as the final array element, to change which part of the nested data is to be changed. (Currently only "#L" is supported)
     *
     * @param {Number|String} col      If specified, the column in a list row (range = 1..n or name) to which the change pertains.
     */
    public updateCtrl(what: "" | "#COL" | "#LSEL" | "#L" | "#LSEL_ALL" | "#NCELL", row: number, col: number | string): void {}

    public sizeChanged(): void {}
}
