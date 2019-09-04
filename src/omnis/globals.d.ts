declare type ctrl_base = {
    getClientElem: () => HTMLElement
    update: () => void
    mEventFunction: () => void
    usesTouch: boolean
    isEnabled: () => boolean
    lastTouch: number
    touchStartPos: {
        x: number
        y: number
    }
    canSendEvent: (evName: OmnisEventName) => boolean
    eventParamsAdd: (name: string, value: any) => void
    sendEvent: (event: number | string) => void
    getData(): any
}

declare type OmnisEventName = string | number // numero per le proprietà interne di Omnis, stringa per quelle user-defined

declare type OmnisPropName = string | number // numero per le proprietà interne di Omnis, stringa per quelle user-defined
declare var touchWithinRange: any
declare var eBaseProperties: any
declare var eBaseEvent: any
