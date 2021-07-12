import { Component, Directive, ElementRef, Input } from '@angular/core';
import { UserState } from 'src/app/ajs-upgraded-providers';
import { downgradeComponent } from '@angular/upgrade/static';
import * as angular from 'angular';
import * as _ from 'lodash'

@Directive({
  selector: '[require-role]'
})
export class RequireRoleDirective {

  constructor(
    private elementRef: ElementRef,
    private userState: UserState
  ) { }

  @Input('require-role') set requireRole(roles: string) {
    var accessDenied = true;
    var requiredRoles = roles.split(' ');
    for (var i in requiredRoles) {
      if (this.userState.hasRole(requiredRoles[i])) {
        accessDenied = false;
      }
    }
    if (accessDenied) {
      this.elementRef.nativeElement.remove();
    }
  }

}


@Component({
  selector: 'requireRole',
  template: `<ng-content></ng-content>`,
  providers: [RequireRoleDirective]
})
export class RequireRoleDirectiveWrapper {
  constructor(directive: RequireRoleDirective, private hostElement: ElementRef){
    directive.requireRole = this.hostElement.nativeElement.getAttribute('require-role');
  }
}
const allowAttribute = directiveFactory => [ '$injector', $injector =>
    Object.assign($injector.invoke(directiveFactory), {restrict: 'EA'})
];
angular.module('risevision.common.header.directives')
  .directive('requireRole', allowAttribute(downgradeComponent({
    component: RequireRoleDirectiveWrapper,
  })));