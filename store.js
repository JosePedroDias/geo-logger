var getStore = function(PREFIX) {
    'use strict';

    var fakeLS = {};

    return {
        get: function(key, defaultVal) {
            if ('localStorage' in window) {
                try { // if no prior data or problem parsing JSON falls back to default
                    var val = localStorage.getItem(PREFIX + key);
                    if (val === null) { return defaultVal; } // no setting in LS, use default instead...
                    return JSON.parse(val);
                } catch (ex) {}
            }
            return (fakeLS[key] !== undefined) ? fakeLS[key] : defaultVal; // fallback to fakeLS
        },
        put: function(key, val) {
            try { // safari's porn mode throws exception if setItem is called
                if (!('localStorage' in window)) { throw 'argh'; }
                localStorage.setItem(PREFIX + key, JSON.stringify(val) );
            } catch (ex) {
                fakeLS[key] = val; // fallback to fakeLS
            }
        }
    };
};
