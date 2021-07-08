import {expect} from 'chai';

import { UsernamePipe } from './username.pipe';

describe('UsernamePipe', () => {
  const pipe = new UsernamePipe();

  it('create an instance', () => {
    expect(pipe).to.be.ok;
  });

  it('should fallback to default', () => {
    expect(pipe.transform(null)).to.equal('N/A');
  });

  it('should transform username from email', () => {
    expect(pipe.transform('user@email.com')).to.equal('user');
  });

  it('should return simple usernames', () => {
    expect(pipe.transform('user')).to.equal('user');
  });
});
