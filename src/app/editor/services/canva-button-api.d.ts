// From https://www.canva.com/button/documentation/js-api/
type CanvaButtonApi = {
  createDesign: (opts: {
    design: {
      type: string,
      dimensions?: {
        width: number,
        height: number,
        units?: 'px' | 'cm' | 'mm' | 'in',
      },
    },
    editor?: {
      publishLabel?: string,
      fileType?: 'jpg' | 'jpeg' | 'pdf' | 'png',
    },
    onDesignOpen?: (opts: { designId: string }) => void,
    onDesignPublish?: (opts: { exportUrl: string, designId: string }) => void,
    onDesignClose?: () => void,
  }) => void;
  editDesign: (opts: {
    design: {
      id: string,
    },
    editor?: {
      publishLabel?: string,
      fileType?: 'jpg' | 'jpeg' | 'pdf' | 'png',
    },
    onDesignOpen?: (opts: { designId: string }) => void,
    onDesignPublish?: (opts: { exportUrl: string, designId: string }) => void,
    onDesignClose?: () => void,
  }) => void;
};
declare interface Window {
  Canva: {
    DesignButton: {
      initialize: (opts: { apiKey: string }) => Promise<CanvaButtonApi>;
    }
  };
}