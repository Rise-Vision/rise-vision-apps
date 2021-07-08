import { expect } from 'chai';
import { EncodeLinkPipe } from './encode-link.pipe';

describe('EncodeLinkPipe', () => {
  it('create an instance', () => {
    const pipe = new EncodeLinkPipe();
    expect(pipe).to.exist;
  });

  it('should return the correct encoded link for a given url', () => {
    const pipe = new EncodeLinkPipe();
    expect(pipe.transform('http://api.foxsports.com/v1/rss?partnerKey=zBaFxRyGKCfxBagJG9b8pqLyndmvo7UU')).to.equal('http%3A%2F%2Fapi.foxsports.com%2Fv1%2Frss%3FpartnerKey%3DzBaFxRyGKCfxBagJG9b8pqLyndmvo7UU');
  });
});
