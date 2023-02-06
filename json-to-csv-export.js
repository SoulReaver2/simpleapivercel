/**
 * Minified by jsDelivr using Terser v5.15.1.
 * Original file: /npm/json-to-csv-export@2.1.1/lib/cjs/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"use strict";Object.defineProperty(exports,"__esModule",{value:!0});var generate_1=require("./generate"),CSV_FILE_TYPE="text/csv;charset=utf-8;",csvDownload=function(e){var t=e.data,n=e.filename,o=void 0===n?"export.csv":n,r=e.delimiter,a=void 0===r?";":r,d=e.headers,c=getFilename(o);if(0!==t.length){var i=(0,generate_1.csvGenerate)(t,d,a);triggerCsvDownload(i,c)}else triggerCsvDownload(d?d.join(a):"",c)},triggerCsvDownload=function(e,t){var n=new Blob(["\ufeff",e],{type:CSV_FILE_TYPE}),o=document.createElement("a");o.href=URL.createObjectURL(n),o.download=t,o.style.display="none",document.body.appendChild(o),o.click(),document.body.removeChild(o)},getFilename=function(e){return/csv$/i.test(e)?e:"".concat(e,".csv")};exports.default=csvDownload;
//# sourceMappingURL=/sm/4b9615c51dbe91b80f8853a90d1c6cd091d8c30fe121cf8a67f18090486096d3.map