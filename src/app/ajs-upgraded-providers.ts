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

export abstract class TemplateEditorUtils {
  [key: string]: any;
}
export const templateEditorUtilsProvider = {
  provide: TemplateEditorUtils,
  useFactory: function ($injector: any) {
    return $injector.get('templateEditorUtils');
  },
  deps: ['$injector']
};

export abstract class UserState {
  [key: string]: any;
}
export const userStateProvider = {
  provide: UserState,
  useFactory: function ($injector: any) {
    return $injector.get('userState');
  },
  deps: ['$injector']
};

export abstract class StoreService {
  [key: string]: any;
}
export const storeServiceProvider = {
  provide: StoreService,
  useFactory: function ($injector: any) {
    return $injector.get('storeService');
  },
  deps: ['$injector']
};

export abstract class AddressService {
  [key: string]: any;
}
export const addressServiceProvider = {
  provide: AddressService,
  useFactory: function ($injector: any) {
    return $injector.get('addressService');
  },
  deps: ['$injector']
};

export abstract class UserAuthFactory {
  [key: string]: any;
}
export const userAuthFactoryProvider = {
  provide: UserAuthFactory,
  useFactory: function ($injector: any) {
    return $injector.get('userAuthFactory');
  },
  deps: ['$injector']
};

export abstract class PaymentSourcesFactory {
  [key: string]: any;
}
export const paymentSourcesFactoryProvider = {
  provide: PaymentSourcesFactory,
  useFactory: function ($injector: any) {
    return $injector.get('paymentSourcesFactory');
  },
  deps: ['$injector']
};