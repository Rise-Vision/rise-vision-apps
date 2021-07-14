import { Injectable } from '@angular/core';

import { ModalService } from 'src/app/components/modals/modal.service';

import * as _ from 'lodash';
import * as angular from 'angular';
import { downgradeInjectable } from '@angular/upgrade/static';

@Injectable({
  providedIn: 'root'
})
export class TemplateEditorUtilsService {

  constructor(private modalService: ModalService) { }

  intValueFor(providedValue, defaultValue?) {
    var intValue = parseInt(providedValue, 10);

    return isNaN(intValue) ? defaultValue : intValue;
  }

  addOrRemove(list, oldItem, newItem) {
    var idx = _.findIndex(list, oldItem);

    if (idx >= 0) {
      list.splice(idx, 1);
    } else {
      list.push(newItem);
    }

    return list;
  }

  addOrReplaceAll(list, oldItem, newItem) {
    var matchCount = 0;

    for (var i = 0; i < list.length; i++) {
      var item = list[i];

      if (_.isMatch(item, oldItem)) {
        matchCount++;
        list.splice(i, 1, newItem);
      }
    }

    if (matchCount === 0) {
      list.push(newItem);
    }
  }

  isFolder(path) {
    return path[path.length - 1] === '/';
  }

  isStaging() {
    try {
      var hostname = window.location.hostname;

      return hostname.includes('apps-stage-');
    } catch (err) {
      console.log('can\'t access hostname of window.location');
    }

    return false;
  }

  fileNameOf(path) {
    var parts = path.split('/');

    if (this.isFolder(path)) {
      return parts[parts.length - 2];
    } else {
      return parts.pop();
    }
  }

  fileHasValidExtension(file, extensions?) {
    return !extensions || extensions.length === 0 || _.some(extensions, function (extension) {
      return _.endsWith(file.toLowerCase(), extension.trim().toLowerCase());
    });
  }

  hasRegularFileItems(folderItems) {
    var regularFiles = _.filter(folderItems, item => {
      return !this.isFolder(item.name);
    });

    return regularFiles.length > 0;
  }

  findElement(selector, parent?) {
    if (parent) {
      return parent.find(selector);
    } else {
      return document.querySelector(selector) && angular.element(document.querySelector(selector));          
    }
  }

  showMessageWindow(title, message) {
    this.modalService.showMessage(title, message);
  }

  showInvalidExtensionsMessage(validExtensions) {
    var title = 'This file type is not supported';
    var message = this.getValidExtensionsMessage(validExtensions);

    this.showMessageWindow(title, message);
  }

  getValidExtensionsMessage(validExtensions) {
    var prefix = validExtensions;
    var suffix = '';

    if (validExtensions.length > 1) {
      prefix = validExtensions.slice(0, validExtensions.length - 1);
      suffix = ' and ' + validExtensions[validExtensions.length - 1].toUpperCase();
    }

    return 'Rise Vision supports ' + prefix.join(', ').toUpperCase() + suffix + '.';
  }

  repeat(value, times) {
    var items = [];

    for (var i = 0; i < times; i++) {
      items.push(value);
    }

    return items;
  }

  padNumber(number, minLength) {
    var numberStr = String(number);
    var numberLen = numberStr.length || 0;

    if (numberLen < minLength) {
      return this.repeat('0', minLength - numberLen).join('') + numberStr;
    } else {
      return numberStr;
    }
  }

  formatISODate(dateString) {
    var date = new Date(dateString);

    if (isNaN(date.getTime())) {
      return null;
    } else {
      return this.padNumber(date.getUTCFullYear(), 4) + '-' + this.padNumber(date.getUTCMonth() + 1, 2) + '-' +
        this.padNumber(date.getUTCDate(), 2);
    }
  }

  absoluteTimeToMeridian(timeString) {
    var regex = /^(\d{1,2}):(\d{1,2})$/;
    var parts = regex.exec(timeString);

    if (parts) {
      var hours = Number(parts[1]);
      var minutes = Number(parts[2]);
      var meridian = hours >= 12 ? 'PM' : 'AM';

      if (hours >= 24) {
        return null;
      } else if (hours === 0) {
        hours = 12;
      } else if (hours > 12) {
        hours = hours % 12;
      }

      if (minutes >= 60) {
        return null;
      }

      return this.padNumber(hours, 2) + ':' + this.padNumber(minutes, 2) + ' ' + meridian;
    } else {
      return null;
    }
  }

  meridianTimeToAbsolute(timeString) {
    var regex = /^(\d{1,2}):(\d{1,2}) (\D{2})$/;
    var parts = regex.exec(timeString);

    if (parts) {
      var meridian = parts[3];
      var hours = Number(parts[1]) + (meridian === 'PM' ? 12 : 0);
      var minutes = Number(parts[2]);

      if (hours > 24) {
        return null;
      } else if (hours === 12) {
        hours = 0;
      } else if (hours === 24) {
        hours = 12;
      }

      if (minutes >= 60) {
        return null;
      }

      if (meridian !== 'AM' && meridian !== 'PM') {
        return null;
      }

      return this.padNumber(hours, 2) + ':' + this.padNumber(minutes, 2);
    } else {
      return null;
    }
  }

}

angular.module('risevision.template-editor.services')
  .factory('templateEditorUtils', downgradeInjectable(TemplateEditorUtilsService));