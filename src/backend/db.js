const knex = require("knex");
/* eslint-disable */
const path = require("path");

const isBuild = process.env.NODE_ENV === "production";

//const pathToDbFile = path.join(
//  isBuild ? __dirname : __static,
//  isBuild ? "../../" : "",
//  "../src/backend/soil_database.sqlite"
//);
const pathToDbFile = path.join(
  isBuild ? __dirname : __static,
  "../soil_database.sqlite"
);

console.log(isBuild, pathToDbFile, __static);
const database = knex({
  client: "sqlite3",
  connection: {
    filename: pathToDbFile,
    //filename: "C:/Users/grita/Desktop/satino-soils-app/soil_database.sqlite",
  },
  useNullAsDefault: true,
});

//database("dat_Profiles")
//  .where({ ProfileId: "92231" })
//  .update({
//    //TeacherId: "1",
//    MesoreliefId: "1",
//    MicroreliefId: "1",
//    //GeochemicalPositionId: "4",
//    SoilWaterDepthId: "1",
//    //SoilSubtypeId: "20",
//    ParentMaterialId: "1",
//    VegetationTypeId: "1",
//  })
//  .then(() => {
//    console.log("New record updated successfully!");
//    return 1;
//  });

//database("dat_Horizons")
//  .where({ ProfileId: "92231" })
//  .update({
//    SubHorizonNumber: "0",
//    //HorizonSubtypeId: "1",
//    PaintId: "1",
//    HorizonTintId: "1",
//    SpotTintId: "1",
//    MainStructureId: "1",
//    AdditionalStructureId: "1",
//    MechanicalCompositionId: "1",
//    DensityId: "1",
//    MoistureId: "1",
//    BorderFormId: "1",
//    TransitionId: "1",
//  })
//  .then(() => {
//    console.log("New record updated successfully!");
//    return 1;
//  });

//database("dat_Horizons")
//  .where({ HorizonId: "1022312" })
//  .update({
//    HorizonpH: "4.83",
//  })
//  .then(() => {
//    console.log("New record updated successfully!");
//    return 1;
//  });

//database("dat_Horizons")
//  .where({ HorizonId: "1022313" })
//  .update({
//    HorizonpH: "5.02",
//  })
//  .then(() => {
//    console.log("New record updated successfully!");
//    return 1;
//  });

//database("dat_Horizons")
//  .where({ HorizonId: "1022314" })
//  .update({
//    HorizonpH: "4.83",
//  })
//  .then(() => {
//    console.log("New record updated successfully!");
//    return 1;
//  });

//database("dir_ProfileYears")
//  .where({ ProfileYear: "2019" })
//  .update({ AllowCreate: "False", AllowEdit: "False" })
//  .then(() => {
//    console.log("New record 2019 updated successfully!");
//    return 1;
//  });

//database("dat_Profiles")
//  .where("ProfileId", "21231")
//  .del()
//  .then(() => {
//    console.log("Record(s) deleted successfully!");
//    return 1;
//  });
//database("dat_HorizonsRFA")
//  .where("HorizonId", "21231")
//  .del()
//  .then(() => {
//    console.log("Horizon(s) deleted successfully!");
//    return 1;
//  });

//database.schema
//  .dropTableIfExists("dat_HorizonsRFA")
//  .then(function () {
//    return database.schema.createTable("dat_HorizonsRFA", function (t) {
//      t.increments("id").primary();
//      t.string("HorizonId");
//      t.string("HorizonSi");
//      t.string("HorizonCa");
//      t.string("HorizonAl");
//      t.string("HorizonMn");
//      t.string("HorizonFe");
//      t.string("HorizonZn");
//      t.string("HorizonPb");
//    });
//  })
//  .catch(function (error) {
//    console.error(error);
//    throw error;
//  });

//database.schema
//  .hasTable("dat_HorizonsRFA")
//  .then(function (exists) {
//    if (!exists) {
//      return database.schema.createTable("dat_HorizonsRFA", function (t) {
//        t.increments("id").primary();
//        t.string("HorizonId");
//        t.string("HorizonSi");
//        t.string("HorizonCa");
//        t.string("HorizonAl");
//        t.string("HorizonMn");
//        t.string("HorizonFe");
//        t.string("HorizonZn");
//        t.string("HorizonPb");
//      });
//    }
//  })
//  .catch(function (error) {
//    console.error(error);
//    throw error;
//  });

module.exports = database;
