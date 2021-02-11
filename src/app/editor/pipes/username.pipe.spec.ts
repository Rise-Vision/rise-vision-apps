import { UsernamePipe } from './username.pipe';

describe('UsernamePipe', () => {
  it('create an instance', () => {
    const pipe = new UsernamePipe();
    expect(pipe).toBeTruthy();
  });
});
