import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { UserState } from 'src/app/ajs-upgraded-providers';

@Directive({
  selector: '[requireRole]'
})
export class RequireRoleDirective {
  private hasView = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userState: UserState
  ) { }

  @Input() set requireRole(roles: string) {
    var accessDenied = true;
    var requiredRoles = roles.split(' ');
    for (var i in requiredRoles) {
      if (this.userState.hasRole(requiredRoles[i])) {
        accessDenied = false;
      }
    }
    if (accessDenied) {
      this.viewContainer.clear();
      this.hasView = false;      
    } else if (!this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    }
  }

}
