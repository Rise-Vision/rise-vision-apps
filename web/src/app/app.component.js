"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.name = 'Angular';
    }
    AppComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'my-app',
            template: "<h1>Hello {{name}}</h1>",
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map