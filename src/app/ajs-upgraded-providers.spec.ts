import { CanvaTypePicker, canvaTypePickerProvider } from './ajs-upgraded-providers';

describe('ajs-upgraded-providers', () => {

  describe('canvaTypePicker:', () => {    
    it('should register provider', () => {
      expect(canvaTypePickerProvider.provide).toEqual(CanvaTypePicker);
      expect(canvaTypePickerProvider.deps).toEqual(['$injector']);
      expect(canvaTypePickerProvider.useFactory).toBeInstanceOf(Function);
    });

    it('should get AngularJS service', () => {
      const $injector = {
        get: jasmine.createSpy().and.returnValue('service')
      }
      expect(canvaTypePickerProvider.useFactory($injector)).toEqual('service');
      expect($injector.get).toHaveBeenCalledWith('canvaTypePicker');
    });
  });
});
