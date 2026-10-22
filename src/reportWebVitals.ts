// Keep this callback type local because CRA compiles this file as CommonJS
// while web-vitals exposes ESM typings under Node16 module resolution.
type ReportHandler = (metric: unknown) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler): void => {
  if (onPerfEntry) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
