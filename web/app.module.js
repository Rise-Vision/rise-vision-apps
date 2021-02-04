"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var static_1 = require("@angular/upgrade/static");
var app_component_js_1 = require("./src/app/app.component.js");
var hi_component_js_1 = require("./hi.component.js");
var AppModule = /** @class */ (function () {
    function AppModule(upgrade) {
        this.upgrade = upgrade;
    }
    AppModule.prototype.ngDoBootstrap = function () {
        console.log('XXXXXX');
        this.upgrade.bootstrap(document.documentElement, ['risevision.apps']);
    };
    AppModule = tslib_1.__decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                static_1.UpgradeModule,
            ],
            declarations: [
                hi_component_js_1.HiComponent,
                app_component_js_1.AppComponent
            ],
            entryComponents: [
                hi_component_js_1.HiComponent,
                app_component_js_1.AppComponent
            ],
            providers: [],
            bootstrap: []
        }),
        tslib_1.__metadata("design:paramtypes", [static_1.UpgradeModule])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map