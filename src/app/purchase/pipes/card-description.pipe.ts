import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cardDescription'
})
export class CardDescriptionPipe implements PipeTransform {

  _convertSnakeCase(string) {
    return string.replace(/[\W_]+/g, ' ');
  };

  _toTitleCase (string) {
    return string.replace(/(^|\s)\S/g, function (t) {
      return t.toUpperCase();
    });
  };

  transform(card?): unknown {
    if (!card) {
      return '';
    }

    var brand = card.brand || '';
    brand = this._convertSnakeCase(brand);
    brand = this._toTitleCase(brand) || 'Credit Card';
    var last4 = card.last4 || '****';

    return brand + ' ending in ' + last4;
  }

}
