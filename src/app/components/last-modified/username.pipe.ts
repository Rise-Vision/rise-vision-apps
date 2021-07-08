import { Pipe, PipeTransform } from '@angular/core';
import * as angular from 'angular';

@Pipe({name: 'username'})
export class UsernamePipe implements PipeTransform {
  transform(email: string) {
    var username = email || 'N/A';
    if (email && email.indexOf('@') !== -1) {
        username = email.substring(0, email.indexOf('@'));
    }
    return username;
  }
}

angular.module('risevision.common.components')
  .filter('username', () =>  { 
    return (email: string) => new UsernamePipe().transform(email);
  })
