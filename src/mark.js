!function(root, name, make) {
    if (typeof module != 'undefined' && module['exports']) module['exports'] = make.call(root);
    else root[name] = make.call(root);
}(this, 'mark', function() {
    
    var key = 'key', instances = 0;

    /**
     * @this {Mark}
     * @param {*} needle
     * @return {number|undefined}
     */
    function search(needle) {
        // Search in reverse to speed access to recent items.
        // Stop iterations at index [1] because [0] is unused.
        var i = this.length;
        while (0 < i--) if (i in this && needle === this[i]) return i;
    }

    /**
     * @this {Mark}
     * @param {*=} item
     * @return {number}
     */
    function admit(item) {
        var i;
        if (item && 1 === item.nodeType) {
            i = +item.getAttribute(this[key]);
            i || item.setAttribute(this[key], i=this.length++); // Make index sparse.
        } else {
            i = search.call(this, item);
            i || (this[i=this.length++] = item); 
        }
        return i;
    }

    /**
     * @this {Mark}
     * @param {*=} item
     * @return {undefined}
     */
    function remit(item) {
        var i;
        if (item && 1 === item.nodeType) item.removeAttribute(this[key]);
        else if (i = search.call(this, item)) delete(this[i]);
    }
    
    /**
     * @constructor
     */
    function Mark() {
        this.length = 1; // Index 0 stays sparse.
        this[key] = 'data-marker-' + instances++;
    }

    /**
     * @param {*=} param
     * @return {Mark}
     */
    function mark(param) {
        return param instanceof Mark ? param : new Mark;
    }
    
    mark.prototype = Mark.prototype;
    Mark.prototype['mark'] = admit;
    Mark.prototype['unmark'] = remit;
    
    (function(instance) {
        function bind(fn, scope) {
            return function() {
                return fn.apply(scope, arguments);
            };
        }
        mark['mark'] = bind(admit, instance);
        mark['unmark'] = bind(remit, instance);
    }(mark()));

    return mark;
});