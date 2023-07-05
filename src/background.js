"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
//import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import installExtension from "electron-devtools-installer";

// eslint-disable-next-line
import { mdiConsoleNetwork } from "@mdi/js";
// eslint-disable-next-line
const { spawn } = require("child_process");

// eslint-disable-next-line
const fs = require("fs");

const path = require("path");
const GeoJSON = require("geojson");
const dbManager = require("@/backend/queries");

const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    //width: 800,
    //height: 600,
    //fullscreen: true,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      // __static is set by webpack and will point to the public directory
      // eslint-disable-next-line
      preload: path.resolve(__static, "preload.js"),
    },
  });

  win.maximize();
  win.show();

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    //try {
    //  await installExtension(VUEJS3_DEVTOOLS);
    //} catch (e) {
    //  console.error("Vue Devtools failed to install:", e.toString());
    //}
    try {
      //await installExtension(VUEJS3_DEVTOOLS);
      await installExtension({
        id: "nhdogjmejiglipccpnnnanhbledajbpd", //Vue Devtools beta
        electron: ">=1.2.1",
      });
    } catch (e) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

/////////////////////////////

ipcMain.handle("getAllPoints", async () => {
  const result = await dbManager.getAllPointsKnex();
  return result;
});

ipcMain.handle("selectProfile", async (event, functionName) => {
  let arr = [];
  const result = await eval("dbManager." + functionName)();
  for (let elem of result) {
    arr.push(Object.values(elem));
  }
  return arr.flat();
});

ipcMain.handle("getExistingNumbers", async (event, args) => {
  let arr = [];
  const result = await dbManager.getExistingNumbersKnex(args);
  if (result) {
    for (let elem of result) {
      arr.push(Object.values(elem));
    }
    arr.flat();
    arr.sort(function (a, b) {
      return b - a;
    });
  }
  return arr;
});

ipcMain.handle("getValidYears", async () => {
  const result = await dbManager.getValidYearsKnex();
  return result;
});

ipcMain.handle("selectFormData", async (event, targetName) => {
  const result = await dbManager.getFormDataKnex(targetName);
  return result;
});

ipcMain.handle("selectSoilData", async () => {
  const soils = await dbManager.getFormDataKnex("SoilType");
  const types = await dbManager.selectSoilSubtypesKnex();
  for (let soil of soils) {
    soil.children = [];
    for (let type of types) {
      if (soil.SoilTypeId == type.SoilTypeId) {
        soil.children.push({
          label: type.SoilSubtypeName,
          value: type.SoilSubtypeId,
        });
      }
    }
  }
  return soils;
});

ipcMain.handle("selectHorizonSubtype", async () => {
  const horizons = await dbManager.getFormDataKnex("HorizonType");
  const types = await dbManager.selectHorizonSubtypeKnex();
  for (let horizon of horizons) {
    horizon.children = [];
    for (let type of types) {
      if (horizon.HorizonTypeId == type.HorizonTypeId) {
        horizon.children.push({
          code: type.HorizonSubtypeCode,
          type: type.HorizonSubtypeName,
          label: `${type.HorizonSubtypeCode} – ${type.HorizonSubtypeName}`,
          value: type.HorizonSubtypeId,
        });
      }
    }
  }
  return horizons;
});

ipcMain.handle("extractAllProfileCoords", async () => {
  const data = await dbManager.extractAllProfileCoordsKnex();
  return GeoJSON.parse(data, { Point: ["Lat", "Lon"] });
});

ipcMain.handle("getProfileTableData", async () => {
  const data = await dbManager.getProfileTableDataKnex();
  return data;
});

ipcMain.handle("getHorizonsTableData", async () => {
  const data = await dbManager.getHorizonsTableDataKnex();
  return data;
});

ipcMain.handle("getProfileDataView", async (event, args) => {
  const data = await dbManager.getProfileDataViewKnex(args);
  return data;
});

ipcMain.handle("getHorizonsDataView", async (event, args) => {
  const data = await dbManager.getHorizonsDataViewKnex(args);
  return data;
});

ipcMain.handle("getInclusionsDataView", async (event, args) => {
  const data = await dbManager.getInclusionsDataViewKnex(args);
  return data;
});

ipcMain.handle("getProfileDataById", async (event, id) => {
  const data = await dbManager.getProfileDataByIdKnex(id);
  //console.log(data, id);
  return data;
});

ipcMain.handle("getInclusionsDataById", async (event, id) => {
  const data = await dbManager.getInclusionsDataByIdKnex(id);
  return data;
});

ipcMain.handle("getHorizonsDataById", async (event, id) => {
  const data = await dbManager.getHorizonsDataByIdKnex(id);
  return data;
});

ipcMain.handle("selectProfileFormDataNames", async (event, prop, id) => {
  const result = await dbManager.getProfileFormDataNamesKnex(prop, id);
  return result[0];
});

ipcMain.handle("selectHorizonsFormDataNames", async (event, prop, id) => {
  const result = await dbManager.getProfileFormDataNamesKnex(prop, id);
  return result[0];
});

ipcMain.handle("getExistingHorizonIds", async () => {
  let arr = [];
  const result = await dbManager.getExistingHorizonIdsKnex();
  if (result) {
    for (let elem of result) {
      arr.push(+Object.values(elem));
    }
    arr.flat();
  }
  return arr.flat();
});

ipcMain.handle("checkIfMetalFieldsExist", async () => {
  const result = await dbManager.checkIfMetalFieldsExistKnex();
  return result;
});

ipcMain.handle("checkHorizonIdRecordOnRFATable", async (event, id) => {
  const result = await dbManager.checkHorizonIdRecordOnRFATableKnex(id);
  return result;
});

ipcMain.handle("processRFARecord", async (event, str) => {
  const json = JSON.parse(str);
  //console.log(json);
  const result = await dbManager.processRFARecordKnex(json);
  return result;
});

ipcMain.handle("updateRFARecord", async (event, id, str) => {
  const json = JSON.parse(str);
  const result = await dbManager.updateRFARecordKnex(id, json);
  return result;
});

ipcMain.handle("getSatinoDEM", async () => {
  let cwd = process.cwd();
  const isBuild = process.env.NODE_ENV === "production";
  let tifFilePath = "";
  if (!isBuild) {
    tifFilePath = path.join(cwd + "/src/data", "Satino_DEM_cog_3857.tif");
  } else {
    tifFilePath = path.join(__dirname, "../Satino_DEM_cog_3857.tif");
  }

  async function readFilePromise(filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, (error, data) => {
        if (error) {
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }
  const data = await readFilePromise(tifFilePath);
  return data;
});

ipcMain.handle("getConcentrationInDepth", async (event, columnName, depth) => {
  const result = await dbManager.getConcentrationInDepthKnex(columnName, depth);
  //console.log(result);
  return result;
});

ipcMain.handle(
  "getProfileConcentrationData",
  async (event, columnName, HorizonId) => {
    const result = await dbManager.getProfileConcentrationDataKnex(
      columnName,
      HorizonId
    );
    if (result[0] !== undefined) {
      return Object.values(result[0]);
    }
    return [""];
  }
);

ipcMain.handle(
  "extractAllHorizonsConcentrationData",
  async (event, columnName) => {
    const points = await dbManager.extractAllProfileCoordsKnex();
    for (let point of points) {
      let horizons = await dbManager.extractAllHorizonsConcentrationDataKnex(
        columnName,
        point.ProfileId
      );
      if (columnName == "HorizonFe_Dry" || columnName == "HorizonMoisture") {
        let dependency = [];
        for (let horizon of horizons) {
          let depth =
            +horizon.HorizonDepthTo -
            (+horizon.HorizonDepthTo - +horizon.HorizonDepthFrom) / 2;
          let condition =
            horizon["Bank_Moist"] != "" &&
            horizon["Bank_Dry"] != "" &&
            horizon["HorizonFe_Moist"] != "" &&
            horizon["Bank"] != "";
          let moisture = condition
            ? ((+horizon["Bank_Moist"] - +horizon["Bank_Dry"]) /
                (+horizon["Bank_Moist"] - +horizon["Bank"])) *
              100
            : null;
          if (columnName == "HorizonFe_Dry") {
            dependency.push({
              depth: depth,
              value:
                moisture == null
                  ? null
                  : +horizon["HorizonFe_Moist"] / (1 - moisture / 100),
            });
          } else {
            dependency.push({
              depth: depth,
              value: moisture,
            });
          }
        }
        point[columnName] = dependency;
        point.horizons = horizons;
      } else {
        let dependency = [];
        for (let horizon of horizons) {
          let depth =
            +horizon.HorizonDepthTo -
            (+horizon.HorizonDepthTo - +horizon.HorizonDepthFrom) / 2;
          dependency.push({
            depth: depth,
            value: horizon[columnName] == "" ? null : horizon[columnName],
          });
        }
        point[columnName] = dependency;
        point.horizons = horizons;
      }
    }
    return points;
  }
);

ipcMain.handle("processProfileDataRecord", async (event, str) => {
  const json = JSON.parse(str);
  console.log(json);
  const result = await dbManager.processProfileDataRecordKnex(json);
  return result;
});

ipcMain.handle("processHorizonsDataRecord", async (event, str) => {
  const json = JSON.parse(str);
  console.log(json);
  const result = await dbManager.processHorizonsDataRecordKnex(json);
  return result;
});

ipcMain.handle("updateProfileDataRecord", async (event, id, str) => {
  const json = JSON.parse(str);
  console.log(json);
  const result = await dbManager.updateProfileDataRecordKnex(id, json);
  return result;
});

ipcMain.handle("updateHorizonsDataRecord", async (event, id, str) => {
  const json = JSON.parse(str);
  console.log(json);
  const result = await dbManager.updateHorizonsDataRecordKnex(id, json);
  return result;
});

ipcMain.handle("deleteProfileDataById", async (event, id) => {
  const result = await dbManager.deleteProfileDataByIdKnex(id);
  return result;
});
