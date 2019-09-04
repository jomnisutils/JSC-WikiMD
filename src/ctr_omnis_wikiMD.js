ctrl_net_omnis_wikiMD.prototype = (function() {
    var ctrl = new ctrl_base()

    ctrl.init_class_inst = function() {
        this.superclass = ctrl_base.prototype
        this.superclass.init_class_inst.call(this)
        this.component = new ctr_omnis_wikiMD.WikiMDJSONCOmponent(this)
    }

    ctrl.delete_class_inst = function() {
        this.component.delete_class_inst()
        this.superclass.delete_class_inst.call(this) // Call superclass version to perform standard deletion procedure.
    }
    ctrl.init_ctrl_inst = function(form, elem, rowCtrl, rowNumber) {
        this.superclass.init_ctrl_inst.call(this, form, elem, rowCtrl, rowNumber)
        return this.component.initControl(form, elem, rowCtrl, rowNumber)
    }

    ctrl.updateCtrl = function(what, row, col, mustUpdate) {
        this.component.updateCtrl(what, row, col, mustUpdate)
    }

    ctrl.addClickHandlers = function(elem) {
        console.log("addClickHandlers")
        this.component.addClickHandlers(elem)
    }

    ctrl.addClickHandlers = function(elem) {
        console.log("addClickHandlers")
        this.component.addClickHandlers(elem)
    }

    ctrl.sizeChanged = function() {
        this.superclass.sizeChanged()
        this.component.sizeChanged()
    }

    ctrl.getProperty = function(propNumber) {
        console.log("getProperty", propNumber)
        var result = this.component.getProperty(propNumber)
        if (result.handled) {
            return result.value
        } else {
            return this.superclass.getProperty.call(this, propNumber) // Let the superclass handle it,if not handled here.
        }
    }

    ctrl.getCanAssign = function(propNumber) {
        console.log("getCanAssign", propNumber)
        var result = this.component.getCanAssign(propNumber)
        if (result.handled) {
            return result.status
        } else {
            return this.superclass.getCanAssign.call(this, propNumber) // Let the superclass handle it,if not handled here.
        }
    }

    ctrl.setProperty = function(propNumber, propValue) {
        console.log("Set property", propNumber, propValue)
        var result = this.component.setProperty(propNumber, propValue)
        if (result.handled) {
            return result.status
        } else {
            return this.superclass.setProperty.call(this, propNumber, propValue) // Let the superclass handle it, if not handled here.
        }
    }
    /**
     * Client Method $gethtml
     * @returns {character}
     */
    ctrl.$gethtml = function() {
        return this.component.executeMethod("$gethtml", Array.from(arguments))
    }

    /**
     * Client Method $haschanges
     * @returns {boolean}
     */
    ctrl.$haschanges = function() {
        return this.component.executeMethod("$haschanges", Array.from(arguments))
    }

    ctrl.$test = function() {
        console.info("TEST CALL", arguments)
    }

    /**
     * Client Method $commitchanges
     * @returns {character}
     */
    ctrl.$commitchanges = function(Param1, Param2) {
        return this.component.executeMethod("$commitchanges", Array.from(arguments))
    }

    /**
     * Client Method $discardchanges
     * @returns {character}
     */
    ctrl.$discardchanges = function(Param1, Param2) {
        return this.component.executeMethod("$discardchanges", Array.from(arguments))
    }

    return ctrl
})()

/**
 * Constructor for our control.
 * @constructor
 */
function ctrl_net_omnis_wikiMD() {
    this.init_class_inst() // initialize our class
}
