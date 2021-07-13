import { Injectable } from '@angular/core';
import * as angular from 'angular';
import * as _ from 'lodash';
import { downgradeInjectable } from '@angular/upgrade/static';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InstrumentSearchService {
  public static readonly INSTRUMENT_SEARCH_BASE_URL = 'https://contentfinancial2.appspot.com/_ah/api/financial/v1.00/';

  constructor(private httpClient: HttpClient) { }

  popularSearchURL = InstrumentSearchService.INSTRUMENT_SEARCH_BASE_URL + 'instruments/common?category=CATEGORY';
  keywordSearchURL = InstrumentSearchService.INSTRUMENT_SEARCH_BASE_URL + 'instrument/search?category=CATEGORY&query=QUERY';
  results = {
    keyword: {},
    popular: {}
  };

  keywordSearch(category, keyword) {
    var keywordProp = category + '|' + keyword;

    if (this.results.keyword[keywordProp]) {
      return Promise.resolve(this.results.keyword[keywordProp]);
    }

    var capitalized = this._capitalizeWords(category);

    return this.httpClient.get(this.keywordSearchURL.replace('CATEGORY', capitalized).replace('QUERY', keyword))
      .toPromise()
      .then( (resp) => {
        this.results.keyword[keywordProp] = this._getValidItems(resp);
        return this.results.keyword[keywordProp];
      });
  };

  _capitalizeWords(category) {
    var fragments = category.split(' ');

    return _.map(fragments, (fragment) => {
      return fragment ? (
        fragment.charAt(0).toUpperCase() +
        fragment.slice(1).toLowerCase()
      ) : '';
    }).join('%20');
  }

  _getValidItems(resp) {
    var items = resp.items;

    return _.filter(items, (item) => {
      return !!item.symbol;
    });
  }

  popularSearch(category) {
    if (this.results.popular[category]) {
      return Promise.resolve(this.results.popular[category]);
    }

    return this.httpClient.get(this.popularSearchURL.replace('CATEGORY', category))
      .toPromise()
      .then( (resp) => {
        this.results.popular[category] = this._getValidItems(resp);
        return this.results.popular[category];
      });
  };
}

angular.module('risevision.template-editor.services')
  .factory('instrumentSearchService', downgradeInjectable(InstrumentSearchService));