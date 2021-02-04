"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroDetailDirective = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var static_1 = require("@angular/upgrade/static");
var HeroDetailDirective = /** @class */ (function (_super) {
    tslib_1.__extends(HeroDetailDirective, _super);
    function HeroDetailDirective(elementRef, injector) {
        return _super.call(this, 'heroDetail', elementRef, injector) || this;
    }
    HeroDetailDirective = tslib_1.__decorate([
        core_1.Directive({
            selector: 'hero-detail'
        }),
        tslib_1.__metadata("design:paramtypes", [core_1.ElementRef, core_1.Injector])
    ], HeroDetailDirective);
    return HeroDetailDirective;
}(static_1.UpgradeComponent));
exports.HeroDetailDirective = HeroDetailDirective;
//# sourceMappingURL=hero-detail.component.js.map