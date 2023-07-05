import * as XLSX from "xlsx";

export default function () {
  function getHeaders(ui8) {
    const workbookHeaders = XLSX.read(ui8, { sheetRows: 1 });
    const headers = XLSX.utils.sheet_to_json(
      workbookHeaders.Sheets[workbookHeaders.SheetNames[0]],
      { header: 1 }
    )[0];
    return headers;
  }
  function isMetalHeadersExisting(headers) {
    const metalHeaders = ["Al", "Si", "Ca", "Mn", "Fe", "Zn", "Pb"];
    for (let i = 0; i < metalHeaders.length; i++) {
      if (headers.indexOf(metalHeaders[i]) == -1) return false;
    }
    return true;
  }
  function isHorizonIdFieldExisting(headers) {
    if (headers.indexOf("HorizonId") == -1) return false;

    return true;
  }
  function whichHorizonIdRecordsAreNotExisting(dbIDs, excelIDs) {
    const missingIDs = [];
    for (let i = 0; i < excelIDs.length; i++) {
      if (dbIDs.indexOf(excelIDs[i]) == -1) {
        missingIDs.push(excelIDs[i]);
      }
    }
    return missingIDs;
  }
  return {
    getHeaders,
    isMetalHeadersExisting,
    isHorizonIdFieldExisting,
    whichHorizonIdRecordsAreNotExisting,
  };
}
