"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppComponent = void 0;
var tslib_1 = require("tslib");
var static_1 = require("@angular/upgrade/static");
var core_1 = require("@angular/core");
var AppComponent = /** @class */ (function () {
    function AppComponent() {
        this.name = 'Angular';
    }
    AppComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-my',
            template: "<h5>My {{name}}-<app-hi></app-hi>-</h5>",
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
angular.module('risevision.apps')
    .directive('appMy', static_1.downgradeComponent({ component: AppComponent }));
//# sourceMappingURL=app.component.js.map