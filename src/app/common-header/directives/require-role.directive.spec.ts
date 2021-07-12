import { expect } from 'chai';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UserState } from 'src/app/ajs-upgraded-providers';
import { RequireRoleDirective } from './require-role.directive';

@Component({
  template: `
  <h1 require-role="cp">ce protected</h1>
  <h2 require-role="ce">ce protected</h2>
  <h3 require-role="cp ce">cp or ce protected</h3>`
})
class TestComponent { }
describe('RequireRoleDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  
  beforeEach(() => {
    
    const userState = {
      hasRole: function (role) {
        const roles = ['ce'];
        if (roles) {
          return roles.indexOf(role) >= 0;
        }
        return false;
      }
    };

    fixture = TestBed.configureTestingModule({
      providers: [
        {provide: UserState, useValue: userState}
      ],
      declarations: [ RequireRoleDirective, TestComponent ]
    })
    .createComponent(TestComponent);
  
    fixture.detectChanges();    
  });

  it('should create an instance', () => {
    const debugElement = fixture.debugElement.query(By.directive(RequireRoleDirective));
    const directive = debugElement.injector.get(RequireRoleDirective);
    expect(directive).to.exist;
  });

  it("should remove element when user has no matching role ", function() {
    const element = fixture.nativeElement.querySelector('h1');
    expect(element).to.not.exist;
  });

  it("should show element when user has role", function() {
    const element = fixture.nativeElement.querySelector('h2');
    expect(element).to.exist;
    expect(element.innerHTML).to.equal("ce protected");
  });

  it("should accept multiple roles and show if any matches", function() {
    const element = fixture.nativeElement.querySelector('h3');
    expect(element).to.exist;
    expect(element.innerHTML).to.equal("cp or ce protected");
  });    
});
