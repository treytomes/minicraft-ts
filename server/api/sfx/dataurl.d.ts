declare module 'dataurl';

// export = dataurl;
export as namespace dataurl;

declare namespace dataurl {
  function convert(options: {
    data: Buffer;
    mimetype: string;
    charset?: string;
    encoded?: boolean;
  }): string;
}
