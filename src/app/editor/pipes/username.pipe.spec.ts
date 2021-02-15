import { UsernamePipe } from './username.pipe';

describe('UsernamePipe', () => {
  const pipe = new UsernamePipe();

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should fallback to default', () => {
    expect(pipe.transform(null)).toEqual('N/A');
  });

  it('should transform username from email', () => {
    expect(pipe.transform('user@email.com')).toEqual('user');
  });

  it('should return simple usernames', () => {
    fail();
    expect(pipe.transform('user')).toEqual('user');
  });
});
