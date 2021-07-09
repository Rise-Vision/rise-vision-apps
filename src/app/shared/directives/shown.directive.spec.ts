import {expect} from 'chai';

import { ShownDirective } from './shown.directive';

describe('ShownDirective', () => {
  it('should create an instance', () => {
    const directive = new ShownDirective();
    expect(directive).to.be.ok;
  });
});
