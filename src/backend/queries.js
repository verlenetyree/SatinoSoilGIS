//const GeoJSON = require("geojson");
const db = require("./db");

exports.getValidYearsKnex = () => {
  const result = db.select("ProfileYear").from("dir_ProfileYears").where({
    AllowCreate: "True",
  });
  return result.then((data) => {
    return data;
  });
};

exports.getAllYearsKnex = () => {
  const result = db.select("ProfileYear").from("dir_ProfileYears");
  return result.then((data) => {
    return data;
  });
};

exports.getProfileKnex = () => {
  const result = db.select("ProfileGroupName").from("dir_ProfileGroups");
  return result.then((data) => {
    return data;
  });
};

exports.getRepeatKnex = () => {
  const result = db.select("ProfileRepeat").from("dir_ProfileRepeats");
  return result.then((data) => {
    return data;
  });
};

exports.getExistingNumbersKnex = (args) => {
  const [year, groupid, repeat] = args;
  const result = db.select("ProfileNumber").from("dat_Profiles").where({
    ProfileYear: year,
    ProfileGroupId: groupid,
    ProfileRepeat: repeat,
  });
  return result.then((data) => {
    return data;
  });
};

exports.getFormDataKnex = (targetName) => {
  const tableName =
    targetName === "Mesorelief" ||
    targetName === "Microrelief" ||
    targetName === "Density"
      ? targetName
      : targetName + "s";
  const result = db
    .select(targetName + "Id", targetName + "Name")
    .from("dir_" + tableName);
  return result.then((data) => {
    return data;
  });
};

exports.selectSoilSubtypesKnex = () => {
  const result = db
    .select("SoilSubtypeId", "SoilSubtypeName", "SoilTypeId")
    .from("dir_SoilSubtypes");
  return result.then((data) => {
    return data;
  });
};

exports.selectHorizonSubtypeKnex = () => {
  const result = db
    .select(
      "HorizonSubtypeId",
      "HorizonSubtypeCode",
      "HorizonSubtypeName",
      "HorizonTypeId"
    )
    .from("dir_HorizonSubtypes");
  return result.then((data) => {
    return data;
  });
};

exports.extractAllProfileCoordsKnex = () => {
  const result = db("dat_Profiles as dp")
    .select("dp.ProfileId")
    .select("dp.Lon")
    .select("dp.Lat")
    .whereRaw("?? != ''", ["dp.Lon"]);
  return result.then((data) => {
    return data;
  });
};

exports.getProfileTableDataKnex = () => {
  const result = db("dat_Profiles as dp")
    .select("dp.ProfileId")
    .select("dp.ProfileGroupId")
    .select("dp.ProfileNumber")
    .select("dp.ProfileYear")
    .select("dp.ProfileRepeat")
    .select("dp.ProfileX")
    .select("dp.ProfileY")
    .select("dp.ProfileDate")
    .join("dir_Teachers as dt", "dt.TeacherId", "=", "dp.TeacherId")
    .select("dt.TeacherName")
    .join("dir_Mesorelief as dmes", "dmes.MesoreliefId", "=", "dp.MesoreliefId")
    .select("dmes.MesoreliefName")
    .join(
      "dir_Microrelief as dmic",
      "dmic.MicroreliefId",
      "=",
      "dp.MicroreliefId"
    )
    .select("dmic.MicroreliefName")
    .join(
      "dir_GeochemicalPositions as dgp",
      "dgp.GeochemicalPositionId",
      "=",
      "dp.GeochemicalPositionId"
    )
    .select("dgp.GeochemicalPositionName")
    .join(
      "dir_SoilWaterDepths as dswd",
      "dswd.SoilWaterDepthId",
      "=",
      "dp.SoilWaterDepthId"
    )
    .select("dswd.SoilWaterDepthName")
    .join(
      "dir_SoilSubtypes as dss",
      "dss.SoilSubTypeId",
      "=",
      "dp.SoilSubTypeId"
    )
    .select("dss.SoilSubTypeName")
    .join(
      "dir_ParentMaterials as dpm",
      "dpm.ParentMaterialId",
      "=",
      "dp.ParentMaterialId"
    )
    .select("dpm.ParentMaterialName")
    .join(
      "dir_VegetationTypes as dvt",
      "dvt.VegetationTypeId",
      "=",
      "dp.VegetationTypeId"
    )
    .select("dvt.VegetationTypeName")
    .select("dp.IsBaseProfile")
    .select("dp.ProfileOldCode");

  return result.then((data) => {
    return data;
  });
};

exports.getHorizonsTableDataKnex = () => {
  const result = db("dat_Horizons as dh")
    .select("dh.HorizonId")
    .select("dh.ProfileId")
    .select("dh.HorizonDepthFrom")
    .select("dh.HorizonDepthTo")
    .join(
      "dir_HorizonSubtypes as dhs",
      "dhs.HorizonSubtypeId",
      "=",
      "dh.HorizonSubtypeId"
    )
    .select("dhs.HorizonSubtypeName")
    .select("dh.SubHorizonNumber")
    .join("dir_Tints as dt", "dt.TintId", "=", "dh.HorizonTintId")
    .select("dt.TintName")
    .join("dir_Paints as dp", "dp.PaintId", "=", "dh.PaintId")
    .select("dp.PaintName")
    .join("dir_Tints as dt1", "dt1.TintId", "=", "dh.SpotTintId")
    .select("dt1.TintName")
    .as("SpotTintName")
    .join(
      "dir_MainStructures as dms",
      "dms.MainStructureId",
      "=",
      "dh.MainStructureId"
    )
    .select("dms.MainStructureName")
    .join(
      "dir_AdditionalStructures as das",
      "das.AdditionalStructureId",
      "=",
      "dh.AdditionalStructureId"
    )
    .select("das.AdditionalStructureName")
    .join(
      "dir_MechanicalCompositions as dmc",
      "dmc.MechanicalCompositionId",
      "=",
      "dh.MechanicalCompositionId"
    )
    .select("dmc.MechanicalCompositionName")
    .select("dh.DensityId")
    .select("dh.MoistureId")
    .join("dir_BorderForms as dbf", "dbf.BorderFormId", "=", "dh.BorderFormId")
    .select("dbf.BorderFormName")
    .select("dh.TransitionId")
    //.select("dh.HorizonpH")
    .select("dh.HorizonFe_Moist")
    .select("dh.BankNumber")
    .select("dh.Bank")
    .select("dh.Bank_Moist")
    .select("dh.Bank_Dry")
    .select("dh.IsBaseHorizon")
    .select("dh.IsA1Horizon")
    .select("dh.IsGHorizon")
    .select("dh.IsCaHorizon")
    .select("dh.ProfileOldCode");

  return result.then((data) => {
    return data;
  });
};

exports.getProfileDataViewKnex = (args) => {
  const [year, profile, repeat] = args;
  const result = db("dat_Profiles as dp")
    .select("dp.ProfileId")
    .select("dp.ProfileYear")
    .select("dp.ProfileGroupId")
    .select("dp.ProfileNumber")
    .select("dp.ProfileRepeat")
    .join("dir_Teachers as dt", "dt.TeacherId", "=", "dp.TeacherId")
    .select("dt.TeacherName")
    .join(
      "dir_SoilSubtypes as dss",
      "dss.SoilSubTypeId",
      "=",
      "dp.SoilSubTypeId"
    )
    .select("dss.SoilSubTypeName")
    .join("dir_SoilTypes as dst", "dss.SoilTypeId", "=", "dst.SoilTypeId")
    .select("dst.SoilTypeName")
    .join(
      "dir_GeochemicalPositions as dgp",
      "dgp.GeochemicalPositionId",
      "=",
      "dp.GeochemicalPositionId"
    )
    .select("dgp.GeochemicalPositionName")
    .select("dp.ProfileDate")
    .select("dp.IsBaseProfile")
    .select("dp.Lon")
    .select("dp.Lat")
    .where({
      ProfileYear: year,
      ProfileGroupId: profile,
      ProfileRepeat: repeat,
    })
    .andWhere(db.raw("?? != ?", ["dp.TeacherId", ""]));
  return result.then((data) => {
    return data;
  });
};

exports.getHorizonsDataViewKnex = (args) => {
  const [year, profile, repeat] = args;
  const result = db("dat_Profiles as dp")
    .select("dp.ProfileId")
    .join("dat_Horizons as dh", "dh.ProfileId", "=", "dp.ProfileId")
    .select("dh.HorizonId")
    .select("dh.HorizonDepthFrom")
    .select("dh.HorizonDepthTo")
    .join(
      "dir_HorizonSubtypes as dhs",
      "dhs.HorizonSubtypeId",
      "=",
      "dh.HorizonSubtypeId"
    )
    .select("dhs.HorizonSubtypeCode")
    .select("dhs.HorizonSubtypeName")
    .join(
      "dir_HorizonTypes as dht",
      "dhs.HorizonTypeId",
      "=",
      "dht.HorizonTypeId"
    )
    .select("dht.HorizonTypeName")
    .select("dh.SubHorizonNumber")
    .select("dh.IsCaHorizon")
    .select("dh.IsGHorizon")
    .where({
      ProfileYear: year,
      ProfileGroupId: profile,
      ProfileRepeat: repeat,
    });
  return result.then((data) => {
    //console.log(data);

    return data;
  });
};

exports.getInclusionsDataViewKnex = (args) => {
  const [year, profile, repeat] = args;
  const result = db("dat_Profiles as dp")
    .select("dp.ProfileId")
    .join("dat_Horizons as dh", "dh.ProfileId", "=", "dp.ProfileId")
    .select("dh.HorizonId")
    .join("dat_Inclusions as di", "di.HorizonId", "=", "dh.HorizonId")
    .select("di.InclusionId")
    .join(
      "dir_InclusionTypes as dit",
      "dit.InclusionTypeId",
      "=",
      "di.InclusionTypeId"
    )
    .select("dit.InclusionTypeName")
    .join(
      "dir_InclusionValues as div",
      "div.InclusionValueId",
      "=",
      "di.InclusionValueId"
    )
    .select("div.InclusionValueName")

    .where({
      ProfileYear: year,
      ProfileGroupId: profile,
      ProfileRepeat: repeat,
    });
  return result.then((data) => {
    return data;
  });
};

exports.getProfileDataByIdKnex = (id) => {
  const result = db("dat_Profiles as dp")
    .select("dp.ProfileYear")
    .select("dp.ProfileGroupId")
    .select("dp.ProfileNumber")
    .select("dp.ProfileRepeat")
    .join("dir_Teachers as dt", "dt.TeacherId", "=", "dp.TeacherId")
    .select("dp.TeacherId")
    .select("dt.TeacherName")
    .join(
      "dir_SoilSubtypes as dss",
      "dss.SoilSubTypeId",
      "=",
      "dp.SoilSubTypeId"
    )
    .select("dp.SoilSubTypeId")
    .select("dss.SoilSubTypeName")
    .join("dir_SoilTypes as dst", "dss.SoilTypeId", "=", "dst.SoilTypeId")
    .select("dst.SoilTypeName")
    .select("dp.ProfileDate")
    //.select("dss.SoilSubTypeName")
    .select("dp.IsBaseProfile")
    .select("dp.Lon")
    .select("dp.Lat")
    .join("dir_Mesorelief as dmes", "dmes.MesoreliefId", "=", "dp.MesoreliefId")
    .select("dp.MesoreliefId")
    .select("dmes.MesoreliefName")
    .join(
      "dir_Microrelief as dmic",
      "dmic.MicroreliefId",
      "=",
      "dp.MicroreliefId"
    )
    .select("dp.MicroreliefId")
    .select("dmic.MicroreliefName")
    .join(
      "dir_GeochemicalPositions as dgp",
      "dgp.GeochemicalPositionId",
      "=",
      "dp.GeochemicalPositionId"
    )
    .select("dp.GeochemicalPositionId")
    .select("dgp.GeochemicalPositionName")
    .join(
      "dir_SoilWaterDepths as dswd",
      "dswd.SoilWaterDepthId",
      "=",
      "dp.SoilWaterDepthId"
    )
    .select("dp.SoilWaterDepthId")
    .select("dswd.SoilWaterDepthName")
    .join(
      "dir_ParentMaterials as dpm",
      "dpm.ParentMaterialId",
      "=",
      "dp.ParentMaterialId"
    )
    .select("dpm.ParentMaterialName")
    .select("dp.ParentMaterialId")
    .join(
      "dir_VegetationTypes as dvt",
      "dvt.VegetationTypeId",
      "=",
      "dp.VegetationTypeId"
    )
    .select("dvt.VegetationTypeName")
    .select("dp.VegetationTypeId")

    .where({
      ProfileId: id,
    });
  return result
    .then((data) => {
      return data;
    })
    .catch(function (error) {
      console.error(error);
      throw error;
    });
};

exports.getHorizonsDataByIdKnex = (id) => {
  const result = db("dat_Horizons as dh")
    .select("dh.HorizonId")
    .select("dh.HorizonDepthFrom")
    .select("dh.HorizonDepthTo")
    .join(
      "dir_HorizonSubtypes as dhs",
      "dhs.HorizonSubtypeId",
      "=",
      "dh.HorizonSubtypeId"
    )
    .select("dhs.HorizonSubtypeCode")
    .select("dhs.HorizonSubtypeName")
    .select("dh.SubHorizonNumber")
    .join(
      "dir_HorizonTypes as dht",
      "dhs.HorizonTypeId",
      "=",
      "dht.HorizonTypeId"
    )
    .select("dht.HorizonTypeName")

    .join("dir_Tints as dt", "dt.TintId", "=", "dh.HorizonTintId")
    .select("dt.TintName as HorizonTintName")
    .join("dir_Tints as dt1", "dt1.TintId", "=", "dh.SpotTintId")
    .select("dt1.TintName as SpotTintName")
    .join("dir_Paints as dp", "dp.PaintId", "=", "dh.PaintId")
    .select("dp.PaintName")
    .join(
      "dir_MainStructures as dms",
      "dms.MainStructureId",
      "=",
      "dh.MainStructureId"
    )
    .select("dms.MainStructureName")
    .join(
      "dir_AdditionalStructures as das",
      "das.AdditionalStructureId",
      "=",
      "dh.AdditionalStructureId"
    )
    .select("das.AdditionalStructureName")
    .join(
      "dir_MechanicalCompositions as dmc",
      "dmc.MechanicalCompositionId",
      "=",
      "dh.MechanicalCompositionId"
    )
    .select("dmc.MechanicalCompositionName")
    .join("dir_Density as dd", "dd.DensityId", "=", "dh.DensityId")
    .select("dd.DensityName")
    .join("dir_Moistures as dm", "dm.MoistureId", "=", "dh.MoistureId")
    .select("dm.MoistureName")
    .join("dir_BorderForms as dbf", "dbf.BorderFormId", "=", "dh.BorderFormId")
    .select("dbf.BorderFormName")
    .join("dir_Transitions as dt", "dt.TransitionId", "=", "dh.TransitionId")
    .select("dt.TransitionName")

    .select("dh.HorizonpH")
    .select("dh.HorizonFe_Moist")
    .select("dh.BankNumber")
    .select("dh.Bank")
    .select("dh.Bank_Moist")
    .select("dh.Bank_Dry")

    .select("dh.IsGHorizon")
    .select("dh.IsCaHorizon")
    .select("dh.IsA1Horizon")
    .select("dh.IsBaseHorizon")

    .where({
      ProfileId: id,
    });
  return result.then((data) => {
    return data;
  });
};

exports.getInclusionsDataByIdKnex = (id) => {
  const result = db("dat_Horizons as dh")
    //.select("dp.ProfileId")
    //.join("dat_Horizons as dh", "dh.ProfileId", "=", "dp.ProfileId")
    .select("dh.HorizonId")
    .join("dat_Inclusions as di", "di.HorizonId", "=", "dh.HorizonId")
    .select("di.InclusionId")
    .join(
      "dir_InclusionTypes as dit",
      "dit.InclusionTypeId",
      "=",
      "di.InclusionTypeId"
    )
    .select("dit.InclusionTypeName")
    .join(
      "dir_InclusionValues as div",
      "div.InclusionValueId",
      "=",
      "di.InclusionValueId"
    )
    .select("div.InclusionValueName")

    .where({
      ProfileId: id,
    });
  return result.then((data) => {
    return data;
  });
};

exports.getProfileFormDataNamesKnex = (prop, id) => {
  const tableName =
    prop === "Mesorelief" || prop === "Microrelief" || prop === "Density"
      ? prop
      : prop + "s";
  const result = db
    .select(prop + "Name")
    .from("dir_" + tableName)
    .where({
      [`${prop + "Id"}`]: id,
    });
  return result.then((data) => {
    return data;
  });
};

exports.getExistingHorizonIdsKnex = () => {
  const result = db.select("HorizonId").from("dat_Horizons");
  return result.then((data) => {
    return data;
  });
};

exports.checkIfMetalFieldsExistKnex = () => {
  const result = db.schema.hasColumn("dat_Horizons", "HorizonAl");

  return result.then((data) => {
    return data;
  });
};

exports.checkHorizonIdRecordOnRFATableKnex = (id) => {
  const result = db("dat_HorizonsRFA")
    .where({ HorizonId: id })
    .select("HorizonId");

  return result.then((data) => {
    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  });
};

exports.processRFARecordKnex = (record) => {
  db("dat_HorizonsRFA")
    .insert(record)
    .then(() => {
      console.log("New record added successfully!");
      return 1;
    })
    .catch((error) => {
      console.error(error);
      return 0;
    });
};

exports.updateRFARecordKnex = (id, record) => {
  db("dat_HorizonsRFA")
    .where({ HorizonId: id })
    .update(record)
    .then(() => {
      console.log("Record updated successfully!");
      return 1;
    })
    .catch((error) => {
      console.error(error);
      return 0;
    });
};

exports.getConcentrationInDepthKnex = (columnName, depth) => {
  if (columnName == "HorizonpH") {
    const result = db("dat_Horizons as dh")
      .select("dh.HorizonId")
      .select("dh.ProfileId")
      .select("dh.HorizonDepthFrom")
      .select("dh.HorizonDepthTo")
      .select(columnName)
      .join("dat_Profiles as dp", "dp.ProfileId", "=", "dh.ProfileId")
      .select("dp.Lon")
      .select("dp.Lat")
      //.whereRaw("?? != ''", ["dp.Lon"])
      .where(db.raw("CAST(dh.HorizonDepthFrom AS INTEGER) <= ?", [+depth]))
      .andWhere(db.raw("CAST(dh.HorizonDepthTo AS INTEGER) >= ?", [+depth]))
      .andWhere(db.raw("?? != ''", ["dp.Lon"]));
    return result.then((data) => {
      return data;
    });
  }
};

exports.getProfileConcentrationDataKnex = (columnName, HorizonId) => {
  if (columnName == "HorizonpH") {
    const result = db("dat_Horizons as dh").select(columnName).where({
      HorizonId: HorizonId,
    });
    return result.then((data) => {
      return data;
    });
  } else {
    const result = db("dat_HorizonsRFA as rfa").select(columnName).where({
      HorizonId: HorizonId,
    });
    return result.then((data) => {
      return data;
    });
  }
};

exports.extractAllHorizonsConcentrationDataKnex = (columnName, ProfileId) => {
  if (columnName == "HorizonpH" || columnName == "HorizonFe_Moist") {
    const result = db("dat_Horizons as dh")
      .select("dh.HorizonId")
      .select("dh.ProfileId")
      .select("dh.HorizonDepthFrom")
      .select("dh.HorizonDepthTo")
      .select(columnName)
      .where({
        ProfileId: ProfileId,
      });
    return result.then((data) => {
      return data;
    });
  }
  if (columnName == "HorizonFe_Dry" || columnName == "HorizonMoisture") {
    const result = db("dat_Horizons as dh")
      .select("dh.HorizonId")
      .select("dh.ProfileId")
      .select("dh.HorizonDepthFrom")
      .select("dh.HorizonDepthTo")
      .select("dh.HorizonFe_Moist")
      .select("dh.Bank")
      .select("dh.Bank_Moist")
      .select("dh.Bank_Dry")
      .where({
        ProfileId: ProfileId,
      });
    return result.then((data) => {
      return data;
    });
  }
};

exports.processProfileDataRecordKnex = (record) => {
  db("dat_Profiles")
    .insert(record)
    .then(() => {
      console.log("New PROFILE record added successfully!");
      return 1;
    })
    .catch((error) => {
      console.error(error);
      return 0;
    });
};

exports.processHorizonsDataRecordKnex = (record) => {
  db("dat_Horizons")
    .insert(record)
    .then(() => {
      console.log("New HORIZON record added successfully!");
      return 1;
    })
    .catch((error) => {
      console.error(error);
      return 0;
    });
};

exports.updateProfileDataRecordKnex = (id, record) => {
  db("dat_Profiles")
    .where({ ProfileId: id })
    .update(record)
    .then(() => {
      console.log("New PROFILE record updated successfully!");
      return 1;
    })
    .catch((error) => {
      console.error(error);
      return 0;
    });
};

exports.updateHorizonsDataRecordKnex = (id, record) => {
  db("dat_Horizons")
    .where({ HorizonId: id })
    .update(record)
    .then(() => {
      console.log("New HORIZON record updated successfully!");
      return 1;
    })
    .catch((error) => {
      console.error(error);
      return 0;
    });
};

exports.deleteProfileDataByIdKnex = (id) => {
  db("dat_Profiles")
    .where("ProfileId", `${id}`)
    .del()
    .then(() => {
      console.log("Record(s) deleted successfully!");
      return 1;
    });
  db("dat_Horizons")
    .where("ProfileId", `${id}`)
    .del()
    .then(() => {
      console.log("Horizon(s) deleted successfully!");
      return 1;
    });
  db("dat_Horizons as dh")
    .where("dh.ProfileId", `${id}`)
    .del()
    .then(() => {
      console.log("Horizon(s) deleted successfully!");
      return 1;
    });
  //db("dat_HorizonsRFA")
  //  .where("HorizonId", `${id}`)
  //  .del()
  //  .then(() => {
  //    console.log("Horizon(s) deleted successfully!");
  //    return 1;
  //  });
};
