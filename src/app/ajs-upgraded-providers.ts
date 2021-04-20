export abstract class CanvaTypePicker extends Function {
}

export const canvaTypePickerProvider = {
  provide: CanvaTypePicker,
  useFactory: function ($injector: any) {
    return $injector.get('confirmModal');
  },
  deps: ['$injector']
};