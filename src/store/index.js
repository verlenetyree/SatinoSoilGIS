import { createStore } from "vuex";

export default createStore({
  state: {
    status: false,
    edit: false,
    horizonEdit: false,
    ifDataIsNew: true,
    vYear: "2023",
    vProfile: "1",
    vRepeat: "1",
    ProfileId: 0,
    HorizonId: [],
    uploadProfileData: [
      "ProfileGroupId",
      "ProfileNumber",
      "ProfileYear",
      "ProfileRepeat",
      "ProfileDate",
      "TeacherId",
      "MesoreliefId",
      "MicroreliefId",
      "GeochemicalPositionId",
      "SoilWaterDepthId",
      "SoilSubtypeId",
      "ParentMaterialId",
      "VegetationTypeId",
      "IsBaseProfile",
      "Lon",
      "Lat",
    ],
    uploadHorizonData: [
      "HorizonId",
      "HorizonDepthFrom",
      "HorizonDepthTo",
      "HorizonSubtypeId",
      "SubHorizonNumber",
      "IsGHorizon",
      "IsCaHorizon",
      "PaintId",
      "HorizonTintId",
      "SpotTintId",
      "MainStructureId",
      "AdditionalStructureId",
      "MechanicalCompositionId",
      "DensityId",
      "MoistureId",
      "BorderFormId",
      "TransitionId",
      "HorizonpH",
      "HorizonFe_Moist",
      "BankNumber",
      "Bank",
      "Bank_Moist",
      "Bank_Dry",
      //"IsFeOHorizon",
      "IsA1Horizon",
      //"HorizonAl",
      //"HorizonSi",
      //"HorizonCa",
      //"HorizonMn",
      //"HorizonFe",
      //"HorizonZn",
      //"HorizonPb",
    ],
    profile: {
      ProfileGroupId: null,
      ProfileNumber: null,
      ProfileYear: null,
      ProfileRepeat: null,
      ProfileDate: null,
      TeacherId: null,
      MesoreliefId: null,
      MicroreliefId: null,
      GeochemicalPositionId: null,
      SoilWaterDepthId: null,
      SoilSubtypeId: null,
      ParentMaterialId: null,
      VegetationTypeId: null,
      IsBaseProfile: false,
    },
    coords: [null, null],
    horizons_total: [],
    horizon: {
      HorizonId: null,
      HorizonDepthFrom: null,
      HorizonDepthTo: null,
      HorizonSubtypeId: null,
      HorizonSubtypeCode: null,
      HorizonSubtypeName: null,
      HorizonTypeName: null,
      SubHorizonNumber: null,
      IsGHorizon: false,
      IsCaHorizon: false,
      PaintId: null,
      HorizonTintId: null,
      SpotTintId: null,
      MainStructureId: null,
      AdditionalStructureId: null,
      MechanicalCompositionId: null,
      DensityId: null,
      MoistureId: null,
      BorderFormId: null,
      TransitionId: null,
      HorizonpH: null,
      HorizonFe_Moist: null,
      BankNumber: null,
      Bank: null,
      Bank_Moist: null,
      Bank_Dry: null,
      IsFeOHorizon: false,
      IsA1Horizon: false,
      HorizonAl: null,
      HorizonSi: null,
      HorizonCa: null,
      HorizonMn: null,
      HorizonFe: null,
      HorizonZn: null,
      HorizonPb: null,
    },
    sectionStatus: false,
  },
  getters: {},
  mutations: {
    change_status(state, status) {
      state.status = status;
    },
    if_edit(state, status) {
      state.edit = status;
    },
    if_new(state, data) {
      const [status, id] = data;
      state.ifDataIsNew = status;

      state.ProfileId = id;
    },
    set_ProfileId(state, id) {
      state.ProfileId = id;
    },
    set_HorizonId(state, ids) {
      state.HorizonId = ids;
    },
    if_horizonEdit(state, status) {
      state.horizonEdit = status;
    },
    push(state) {
      state.horizons_total.push(state.horizon);
    },
    new_horizons_total(state) {
      state.horizons_total = [];
    },
    new_coords(state) {
      state.coords = [null, null];
    },
    delete_horizon(state, key) {
      for (let i = 0; i < state.horizons_total.length; i++) {
        if (state.horizons_total[i].key == key) {
          state.horizons_total.splice(i, 1);
        }
      }
    },
    new_horizon(state) {
      state.horizon = {
        HorizonId: null,
        HorizonDepthFrom: null,
        HorizonDepthTo: null,
        HorizonSubtypeId: null,
        HorizonSubtypeCode: null,
        HorizonSubtypeName: null,
        HorizonTypeName: null,
        SubHorizonNumber: null,
        IsGHorizon: false,
        IsCaHorizon: false,
        PaintId: null,
        HorizonTintId: null,
        SpotTintId: null,
        MainStructureId: null,
        AdditionalStructureId: null,
        MechanicalCompositionId: null,
        DensityId: null,
        MoistureId: null,
        BorderFormId: null,
        TransitionId: null,
        HorizonpH: null,
        HorizonFe_Moist: null,
        BankNumber: null,
        Bank: null,
        Bank_Moist: null,
        Bank_Dry: null,
        IsFeOHorizon: false,
        IsA1Horizon: false,
        HorizonAl: null,
        HorizonSi: null,
        HorizonCa: null,
        HorizonMn: null,
        HorizonFe: null,
        HorizonZn: null,
        HorizonPb: null,
      };
    },
    new_profile(state) {
      state.profile = {
        ProfileGroupId: null,
        ProfileNumber: null,
        ProfileYear: null,
        ProfileRepeat: null,
        ProfileDate: null,
        TeacherId: null,
        MesoreliefId: null,
        MicroreliefId: null,
        GeochemicalPositionId: null,
        SoilWaterDepthId: null,
        SoilSubtypeId: null,
        ParentMaterialId: null,
        VegetationTypeId: null,
        IsBaseProfile: false,
      };
    },
    update_profile(state, data) {
      state.profile = data;
      state.profile.IsBaseProfile =
        state.profile.IsBaseProfile == "False" ? false : true;
      state.coords = [data.Lon, data.Lat];
    },
    update_horizons_total(state, data) {
      state.horizons_total = data;
      for (let horizon of state.horizons_total) {
        horizon.IsGHorizon = horizon.IsGHorizon == "False" ? false : true;
        horizon.IsCaHorizon = horizon.IsCaHorizon == "False" ? false : true;
        horizon.IsA1Horizon = horizon.IsA1Horizon == "False" ? false : true;
        horizon.IsBaseHorizon = horizon.IsBaseHorizon == "False" ? false : true;
      }
    },
    update_data_viewer(state, props) {
      const [year, profile, repeat] = props;
      state.vYear = year;
      state.vProfile = profile;
      state.vRepeat = repeat;
    },
  },
  actions: {},
  modules: {},
});
