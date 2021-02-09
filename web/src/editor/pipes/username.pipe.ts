import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'username'})
export class UsernamePipe implements PipeTransform {
  transform(email: string) {
    var username = email;
    if (email && email.indexOf('@') !== -1) {
        username = email.substring(0, email.indexOf('@'));
    }
    return username;
  }
}