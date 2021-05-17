export abstract class CanvaTypePicker extends Function {
}
export const canvaTypePickerProvider = {
  provide: CanvaTypePicker,
  useFactory: function ($injector: any) {
    return $injector.get('canvaTypePicker');
  },
  deps: ['$injector']
};

export abstract class AnalyticsFactory {
  [key: string]: any;
}
export const analyticsFactoryProvider = {
  provide: AnalyticsFactory,
  useFactory: function ($injector: any) {
    return $injector.get('analyticsFactory');
  },
  deps: ['$injector']
};

export abstract class TemplateEditorFactory {
  [key: string]: any;
}
export const templateEditorFactoryProvider = {
  provide: TemplateEditorFactory,
  useFactory: function ($injector: any) {
    return $injector.get('templateEditorFactory');
  },
  deps: ['$injector']
};