const { contextBridge, ipcRenderer } = require("electron");

const API = {
  selectProfile: (functionName) =>
    ipcRenderer.invoke("selectProfile", functionName + "Knex"),
  selectSoilData: () => ipcRenderer.invoke("selectSoilData"),
  selectHorizonSubtype: () => ipcRenderer.invoke("selectHorizonSubtype"),
  selectFormData: (targetName) =>
    ipcRenderer.invoke("selectFormData", targetName),
  getValidYears: () => ipcRenderer.invoke("getValidYears"),
  getExistingNumbers: (...args) =>
    ipcRenderer.invoke("getExistingNumbers", args),
  extractAllProfileCoords: () => ipcRenderer.invoke("extractAllProfileCoords"),
  getProfileTableData: () => ipcRenderer.invoke("getProfileTableData"),
  getHorizonsTableData: () => ipcRenderer.invoke("getHorizonsTableData"),
  getProfileDataView: (...args) =>
    ipcRenderer.invoke("getProfileDataView", args),
  getHorizonsDataView: (...args) =>
    ipcRenderer.invoke("getHorizonsDataView", args),
  getInclusionsDataView: (...args) =>
    ipcRenderer.invoke("getInclusionsDataView", args),
  getProfileDataById: (id) => ipcRenderer.invoke("getProfileDataById", id),
  getHorizonsDataById: (id) => ipcRenderer.invoke("getHorizonsDataById", id),
  getInclusionsDataById: (id) =>
    ipcRenderer.invoke("getInclusionsDataById", id),
  selectProfileFormDataNames: (prop, id) =>
    ipcRenderer.invoke("selectProfileFormDataNames", prop, id),
  selectHorizonsFormDataNames: (prop, id) =>
    ipcRenderer.invoke("selectHorizonsFormDataNames", prop, id),
  getExistingHorizonIds: () => ipcRenderer.invoke("getExistingHorizonIds"),
  checkIfMetalFieldsExist: () => ipcRenderer.invoke("checkIfMetalFieldsExist"),
  checkHorizonIdRecordOnRFATable: (id) =>
    ipcRenderer.invoke("checkHorizonIdRecordOnRFATable", id),
  processRFARecord: (str) => ipcRenderer.invoke("processRFARecord", str),
  updateRFARecord: (id, str) => ipcRenderer.invoke("updateRFARecord", id, str),
  getSatinoDEM: () => ipcRenderer.invoke("getSatinoDEM"),
  getConcentrationInDepth: (columnName, depth) =>
    ipcRenderer.invoke("getConcentrationInDepth", columnName, depth),
  extractAllHorizonsConcentrationData: (columnName) =>
    ipcRenderer.invoke("extractAllHorizonsConcentrationData", columnName),
  getProfileConcentrationData: (columnName, HorizonId) =>
    ipcRenderer.invoke("getProfileConcentrationData", columnName, HorizonId),
  gridInterpolation: (strDataset, strGrid) =>
    ipcRenderer.invoke("gridInterpolation", strDataset, strGrid),
  processProfileDataRecord: (str) =>
    ipcRenderer.invoke("processProfileDataRecord", str),
  processHorizonsDataRecord: (str) =>
    ipcRenderer.invoke("processHorizonsDataRecord", str),
  updateProfileDataRecord: (id, str) =>
    ipcRenderer.invoke("updateProfileDataRecord", id, str),
  updateHorizonsDataRecord: (id, str) =>
    ipcRenderer.invoke("updateHorizonsDataRecord", id, str),
  deleteProfileDataById: (id) =>
    ipcRenderer.invoke("deleteProfileDataById", id),
};

contextBridge.exposeInMainWorld("api", API);
