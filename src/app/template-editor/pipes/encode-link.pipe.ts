import { Pipe, PipeTransform } from '@angular/core';
import * as angular from 'angular';

@Pipe({
  name: 'encodeLink'
})
export class EncodeLinkPipe implements PipeTransform {

  transform(link: string): string {
    return window.encodeURIComponent(link);
  }

}

angular.module('risevision.template-editor.filters')
  .filter('encodeLink', () =>  { 
    return (link) => new EncodeLinkPipe().transform(link);
  })