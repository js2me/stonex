"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StonexModule = /** @class */ (function () {
    /* tslint:enable:variable-name */
    function StonexModule(storeBinder) {
        this.__STONEXMODULE__ = true;
        if (!storeBinder) {
            throw new Error('Stonex Module created but not registered in Stonex Store. \r\n' +
                'Please attach all your modules to store');
        }
        Object.assign(this, storeBinder);
    }
    return StonexModule;
}());
exports.StonexModule = StonexModule;
//# sourceMappingURL=StonexModule.js.map