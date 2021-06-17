// AngularJS
export abstract class AjsState {
  [key: string]: any;
}
export const $stateProvider = {
  provide: AjsState,
  useFactory: function ($injector: any) {
    return $injector.get('$state');
  },
  deps: ['$injector']
};


// billing/services
export abstract class Billing {
  [key: string]: any;
}
export const billingProvider = {
  provide: Billing,
  useFactory: function ($injector: any) {
    return $injector.get('billing');
  },
  deps: ['$injector']
};

export abstract class SubscriptionFactory {
  [key: string]: any;
}
export const subscriptionFactoryProvider = {
  provide: SubscriptionFactory,
  useFactory: function ($injector: any) {
    return $injector.get('subscriptionFactory');
  },
  deps: ['$injector']
};


// common-header/services
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


// components/canva-type-picker
export abstract class CanvaTypePicker extends Function {
}
export const canvaTypePickerProvider = {
  provide: CanvaTypePicker,
  useFactory: function ($injector: any) {
    return $injector.get('canvaTypePicker');
  },
  deps: ['$injector']
};


// components/confirm-modal
export abstract class ConfirmModal extends Function {
}
export const confirmModalProvider = {
  provide: ConfirmModal,
  useFactory: function ($injector: any) {
    return $injector.get('confirmModal');
  },
  deps: ['$injector']
};


// components/logging
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


// components/plans
export abstract class PlansService {
  [key: string]: any;
}
export const plansServiceProvider = {
  provide: PlansService,
  useFactory: function ($injector: any) {
    return $injector.get('plansService');
  },
  deps: ['$injector']
};


// components/scrolling-list
export abstract class ProcessErrorCode extends Function {
}
export const processErrorCodeProvider = {
  provide: ProcessErrorCode,
  useFactory: function ($injector: any) {
    return $injector.get('processErrorCode');
  },
  deps: ['$injector']
};


// components/userstate
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


// template-editor/services
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
