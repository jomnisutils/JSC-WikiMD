/*
var EVENTS = {
    evLinkClick: 1
};
 */
//enum WikiMDEvents {
// NO: http://sdkdocs.omnis.net/jssdk/latest/api-reference/javascript-control-reference/javascript-api/control/instance-methods/sendevent
// evLinkClick = 1,
// Neanche: http://sdkdocs.omnis.net/jssdk/latest/api-reference/javascript-control-reference/javascript-api/control/instance-methods/cansendevent

// evLinkClick = "evLinkClick",
// }
// ^ L'API di Omnis fa schifo, da una parte serve l'id numerico (canSendEvent), dall'altro il nome stringa...

/**
 * Classe che modella un evento di Omnis (sia custom che no), gestendo i problemi dell'API
 * (identificazione a volte per nome e altre volte per id)
 *
 * Vedi:
 * - http://sdkdocs.omnis.net/jssdk/latest/api-reference/javascript-control-reference/javascript-api/control/instance-methods/sendevent
 * - http://sdkdocs.omnis.net/jssdk/latest/api-reference/javascript-control-reference/javascript-api/control/instance-methods/cansendevent
 */
export class JSCEvent {
    public name: string | number
    public id: number

    /**
     * L'API di Omnis gestice gli eventi a sentimento:
     * - Gli eventi standard hanno un codice numerico e un nome numerico uguale al codice
     * - Gli eventi custom hanno un id numerico e una stringa che li identifica
     *      - il canSendEvent funziona con l'ID dell'evento
     *      - il sendEvent funziona con il nome stirngao
     * @param evCode Id dell'evento
     * @param evName Nome dell'evento
     */
    constructor(evCode: number, evName?: string | number) {
        this.id = evCode
        if (evName) {
            this.name = evName
        } else {
            this.name = evCode
        }
    }
}
