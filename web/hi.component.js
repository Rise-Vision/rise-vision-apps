"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HiComponent = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var static_1 = require("@angular/upgrade/static");
var HiComponent = /** @class */ (function () {
    function HiComponent() {
        this.content = 'Hi Angular 2';
    }
    HiComponent = tslib_1.__decorate([
        core_1.Component({
            selector: 'app-hi',
            template: '<div class="app"> {{ content }} </div>',
            styles: [' .app { color: #000; } ']
        })
    ], HiComponent);
    return HiComponent;
}());
exports.HiComponent = HiComponent;
angular.module('risevision.apps')
    .directive('appHi', static_1.downgradeComponent({
    component: HiComponent
}));
//# sourceMappingURL=hi.component.js.map