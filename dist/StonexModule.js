"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StonexModule {
    constructor(storeBinder) {
        this.__STONEXMODULE__ = true;
        if (!storeBinder) {
            throw new Error('Stonex Module created but not registered in Stonex Store. \r\n' +
                'Please attach all your modules to store');
        }
        const { getState, setState, resetState } = storeBinder;
        this.getState = getState;
        this.setState = setState;
        this.resetState = resetState;
        this.moduleName = storeBinder.moduleName;
    }
}
exports.StonexModule = StonexModule;
//# sourceMappingURL=StonexModule.js.map