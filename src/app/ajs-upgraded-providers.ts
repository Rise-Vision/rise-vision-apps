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

export abstract class AjsTransitions {
  [key: string]: any;
}
export const $transitionsProvider = {
  provide: AjsTransitions,
  useFactory: function ($injector: any) {
    return $injector.get('$transitions');
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

export abstract class ContactService {
  [key: string]: any;
}
export const contactServiceProvider = {
  provide: ContactService,
  useFactory: function ($injector: any) {
    return $injector.get('contactService');
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

export abstract class PurchaseFlowTracker {
  [key: string]: any;
}
export const purchaseFlowTrackerProvider = {
  provide: PurchaseFlowTracker,
  useFactory: function ($injector: any) {
    return $injector.get('purchaseFlowTracker');
  },
  deps: ['$injector']
};

export abstract class PresentationTracker extends Function {
}
export const presentationTrackerProvider = {
  provide: PresentationTracker,
  useFactory: function ($injector: any) {
    return $injector.get('presentationTracker');
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


// editor/services
export abstract class PresentationUtils {
  [key: string]: any;
}
export const presentationUtilsProvider = {
  provide: PresentationUtils,
  useFactory: function ($injector: any) {
    return $injector.get('presentationUtils');
  },
  deps: ['$injector']
};

export abstract class PresentationService {
  [key: string]: any;
}
export const presentationServiceProvider = {
  provide: PresentationService,
  useFactory: function ($injector: any) {
    return $injector.get('presentation');
  },
  deps: ['$injector']
};


// template-editor/components/services
export abstract class BrandingFactory {
  [key: string]: any;
}
export const brandingFactoryProvider = {
  provide: BrandingFactory,
  useFactory: function ($injector: any) {
    return $injector.get('brandingFactory');
  },
  deps: ['$injector']
};


//schedules/services
export abstract class CreateFirstScheduleService extends Function {
}
export const createFirstScheduleServiceProvider = {
  provide: CreateFirstScheduleService,
  useFactory: function ($injector: any) {
    return $injector.get('createFirstSchedule');
  },
  deps: ['$injector']
};

export abstract class ScheduleFactory {
  [key: string]: any;
}
export const scheduleFactoryProvider = {
  provide: ScheduleFactory,
  useFactory: function ($injector: any) {
    return $injector.get('scheduleFactory');
  },
  deps: ['$injector']
};

export abstract class ScheduleSelectorFactory {
  [key: string]: any;
}
export const scheduleSelectorFactoryProvider = {
  provide: ScheduleSelectorFactory,
  useFactory: function ($injector: any) {
    return $injector.get('scheduleSelectorFactory');
  },
  deps: ['$injector']
};
