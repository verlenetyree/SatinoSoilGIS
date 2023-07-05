<template>
  <FormHeader :id="id" :hid="hstr" />

  <v-container d-flex justify-center class="fill-height">
    <v-row>
      <v-col cols="5">
        <v-card style="height: 90vh" density="compact" elevation="0">
          <p class="text-subtitle-1 mt-1 mb-3">Общие сведения</p>
          <v-table density="compact">
            <tbody>
              <tr v-for="p in profileBasic" :key="p.name" height="20px">
                <td style="font-size: 12px" width="220px" class="pa-0">
                  {{ p.name }}
                </td>
                <td style="font-size: 12px" class="pa-0">
                  {{ p.value }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <p class="text-subtitle-1 mt-4 mb-3">
            Почва и факторы почвообразования
          </p>
          <v-table density="compact">
            <tbody>
              <tr v-for="p in profileDetail" :key="p.name">
                <td style="font-size: 12px" width="220px" class="pa-0">
                  {{ p.name }}
                </td>
                <td style="font-size: 12px" class="pa-0">
                  {{ p.value }}
                </td>
              </tr>
            </tbody>
          </v-table>

          <p class="text-subtitle-1 mt-4 mb-3">Геохимия</p>
          <v-table density="compact">
            <tbody>
              <tr v-for="p in profileChemestry" :key="p.name">
                <td style="font-size: 12px" width="220px" class="pa-0">
                  {{ p.name }}
                </td>
                <td style="font-size: 12px" class="pa-0">
                  {{ p.value }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <v-col cols="6" class="ml-10 fill-height">
        <v-card
          class="pa-6 rounded-0 cardStyle"
          variant="outlined"
          color="#9E9E9E"
        >
          <v-tabs
            v-model="tab"
            color="#424242"
            align-tabs="center"
            density="compact"
            class="mb-4"
          >
            <v-tab class="text-subtitle-2" :value="0">Показать на карте</v-tab>
            <v-tab class="text-subtitle-2" :value="1">Общие сведения</v-tab>
            <v-tab class="text-subtitle-2" :value="2"
              >Морфологические свойства</v-tab
            >
            <v-tab class="text-subtitle-2" :value="3">Геохимия</v-tab>
            <!--<v-tab class="text-subtitle-2" :value="4">Геохимия РФА</v-tab>-->
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item :value="0">
              <div style="height: 40vh">
                <SinglePointMap :mapData="[profileBasic[4], profileBasic[2]]" />
              </div>
            </v-window-item>
            <v-window-item :value="1">
              <v-table density="compact">
                <tbody>
                  <tr v-for="h in horizonsBasic" :key="h.name" height="20px">
                    <td style="font-size: 12px" width="220px" class="pa-0">
                      {{ h.name }}
                    </td>
                    <td style="font-size: 12px" class="pa-0">
                      {{ h.value }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item :value="2">
              <v-table density="compact">
                <tbody>
                  <tr v-for="h in horizonsMorpho" :key="h.name" height="20px">
                    <td style="font-size: 12px" width="220px" class="pa-0">
                      {{ h.name }}
                    </td>
                    <td style="font-size: 12px" class="pa-0">
                      {{ h.value }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>

            <v-window-item :value="3">
              <v-table density="compact">
                <tbody>
                  <tr
                    v-for="h in horizonsChemestry"
                    :key="h.name"
                    height="20px"
                  >
                    <td style="font-size: 12px" width="220px" class="pa-0">
                      {{ h.name }}
                    </td>
                    <td style="font-size: 12px" class="pa-0">
                      {{ h.value }}
                    </td>
                  </tr>
                </tbody>
              </v-table>
            </v-window-item>
          </v-window>
        </v-card>

        <div style="align-self: flex-end" class="mt-13">
          <DxDataGrid
            key-expr="HorizonId"
            id="dataGridHorizons"
            :allow-column-resizing="true"
            :column-auto-width="true"
            :data-source="horizons"
            :hover-state-enabled="true"
            :show-borders="true"
            :selection="{ mode: 'single' }"
            @selection-changed="onSelectionChanged"
            @content-ready="selectFirstRow"
            v-model:selected-row-keys="selectedRowKeys"
          >
            <DxLoadPanel :enabled="false" />
            <DxColumn
              data-type="number"
              sort-order="asc"
              :width="60"
              data-field="HorizonDepthFrom"
              caption="От"
            ></DxColumn>
            <DxColumn
              data-type="number"
              :width="60"
              data-field="HorizonDepthTo"
              caption="До"
            ></DxColumn>
            <DxColumn data-field="code" caption="Индекс"></DxColumn>
            <DxColumn
              data-field="HorizonSubtypeName"
              caption="Горизонт"
            ></DxColumn>
            <DxColumn
              data-field="HorizonTypeName"
              caption="Тип горизонта"
            ></DxColumn>

            <DxMasterDetail :enabled="true" template="detail" />
            <template #detail="{ data }">
              <DxDataGrid
                id="dataGridInclusions"
                key-expr="InclusionId"
                :allow-column-resizing="true"
                :column-auto-width="true"
                :data-source="data.data.inclusions"
                :hover-state-enabled="true"
                :show-borders="true"
              >
                <DxColumn
                  data-field="InclusionTypeName"
                  caption="Новообразование / включение"
                ></DxColumn>
                <DxColumn
                  data-field="InclusionValueName"
                  caption="Обилие"
                ></DxColumn>
              </DxDataGrid>
            </template>
          </DxDataGrid>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import SinglePointMap from "@/components/form/elements/modal/SinglePointMap.vue";
import FormHeader from "@/components/form/elements/comps/FormHeader.vue";
import { DxDataGrid } from "devextreme-vue/data-grid";
import {
  DxColumn,
  DxLoadPanel,
  DxMasterDetail,
} from "devextreme-vue/data-grid";

import { useStore } from "vuex";

export default {
  components: {
    FormHeader,
    SinglePointMap,

    DxDataGrid,
    DxColumn,
    DxMasterDetail,

    DxLoadPanel,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      tab: 1,
      profileBasic: [],
      profileDetail: [],
      profileChemestry: [],
      horizons: [],
      inclusions: [],
      horizonsBasic: [],
      horizonsMorpho: [],
      horizonsChemestry: [],
      selectedRowKeys: [],
      selectedRowsData: [],
    };
  },
  setup() {
    const store = useStore();
    const api = window.api;
    const profile = store.state.profile;
    const coords = store.state.coords;
    const horizons_total = store.state.horizons_total;
    console.log(horizons_total);

    async function getProfileDataById(id) {
      const data = await api.getProfileDataById(id);

      return data;
    }
    async function getHorizonsDataById(id) {
      let data = await api.getHorizonsDataById(id);
      return data;
    }
    async function getInclusionsDataById(id) {
      let data = await api.getInclusionsDataById(id);

      return data;
    }
    async function selectProfileFormDataNames() {
      const allData = {};
      for (const prop in profile) {
        if (prop.slice(-2) == "Id") {
          let data = await api.selectProfileFormDataNames(
            prop.slice(0, -2),
            profile[prop]
          );
          allData[`${prop.slice(0, -2) + "Name"}`] = data
            ? data[`${prop.slice(0, -2) + "Name"}`]
            : "Нет данных";
        }
        if (prop.slice(-4) !== "Name") {
          allData[prop] = profile[prop] == null ? "Нет данных" : profile[prop];
        }
      }
      const [Lon, Lat] = coords;
      allData.Lon = Lon != null ? Lon.toFixed(7) : null;
      allData.Lat = Lat != null ? Lat.toFixed(7) : null;
      allData.IsBaseProfile =
        profile.IsBaseProfile.toString().charAt(0).toUpperCase() +
        profile.IsBaseProfile.toString().slice(1);
      //console.log(allData);
      return allData;
    }
    async function selectHorizonsFormDataNames(data) {
      const allData = {};
      //console.log("selectHorizonsFormDataNames");
      for (const prop in data) {
        let horizon = {};
        for (const p in data[prop]) {
          if (
            p.slice(-2) == "Id" &&
            p != "HorizonSubtypeId" &&
            p != "HorizonId" &&
            p != "HorizonTintId" &&
            p != "SpotTintId"
          ) {
            let result = await api.selectHorizonsFormDataNames(
              p.slice(0, -2),
              data[prop][p] == null ? 0 : data[prop][p]
            );
            //console.log(result, data[prop][p]);
            horizon[`${p.slice(0, -2) + "Name"}`] = result
              ? result[`${p.slice(0, -2) + "Name"}`]
              : "Нет данных";
          }
          if (prop.slice(-4) !== "Name") {
            horizon[p] = data[prop][p] == null ? "Нет данных" : data[prop][p];
          }
        }
        allData[prop] = horizon;
      }
      //console.log(allData);
      return allData;
    }

    return {
      store,
      profile,
      horizons_total,
      getProfileDataById,
      getHorizonsDataById,
      getInclusionsDataById,
      selectProfileFormDataNames,
      selectHorizonsFormDataNames,
    };
  },
  created() {
    function fillProfileBasicData(data) {
      return [
        { name: "Год", value: data.ProfileYear },
        { name: "Профиль", value: data.ProfileGroupId },
        { name: "Номер на профиле", value: data.ProfileNumber },
        { name: "Повторность", value: data.ProfileRepeat },
        {
          name: "Местоположение",
          value: data.Lat
            ? `${data.Lat} с. ш., ${data.Lon} в. д.`
            : "Нет данных",
        },
        {
          name: "Дата наблюдения",
          value:
            data.ProfileDate != "Нет данных"
              ? data.ProfileDate.split(" ")[0]
              : "Нет данных",
        },
        {
          name: "Преподаватель",
          value: data.TeacherName,
        },
      ];
    }
    function fillProfileDetailData(data) {
      return [
        {
          name: "Мезорельеф",
          value: data.MesoreliefName,
        },
        {
          name: "Микрорельеф",
          value: data.MicroreliefName,
        },
        {
          name: "Геохимическая позиция",
          value: data.GeochemicalPositionName,
        },
        {
          name: "Верховодка",
          value: data.SoilWaterDepthName,
        },
        {
          name: "Почва",
          value: data.SoilSubtypeName,
        },
        {
          name: "Почвообразующая порода",
          value: data.ParentMaterialName,
        },
        {
          name: "Тип растительности",
          value: data.VegetationTypeName,
        },
      ];
    }

    function fillProfileChemestryData(data) {
      return [{ name: "Принять за единицу", value: data.IsBaseProfile }];
    }

    this.getProfileDataById(`${this.id}`).then((data) => {
      //console.log("profile", this.store.state.profile);
      //console.log("getProfileDataById", this.id, typeof this.id);
      if (data[0] === undefined || this.store.state.edit) {
        this.selectProfileFormDataNames().then((profile) => {
          this.profileBasic = fillProfileBasicData(profile);
          this.profileDetail = fillProfileDetailData(profile);
          this.profileChemestry = fillProfileChemestryData(profile);
        });
      } else {
        this.profileBasic = fillProfileBasicData(data[0]);
        this.profileDetail = fillProfileDetailData(data[0]);
        this.profileChemestry = fillProfileChemestryData(data[0]);
        this.store.commit("update_profile", data[0]);
      }
      //console.log(data[0]);
    });
    this.getInclusionsDataById(this.id).then((data) => {
      this.inclusions = data;
    });
    this.getHorizonsDataById(this.id).then((data) => {
      if (data.length == 0 || this.store.state.edit) {
        this.horizons = this.horizons_total;
        //console.log(this.horizons_total);
        this.selectHorizonsFormDataNames(this.horizons_total).then((data) => {
          for (let i in data) {
            this.horizons[i] = data[i];
          }
        });
      } else {
        this.horizons = data;
        //console.log(this.horizons);
        for (let i = 0; i < this.horizons.length; i++) {
          this.horizons[i].inclusions = [];
          this.horizons[i].code = this.horizons[i].HorizonSubtypeCode;
          if (this.horizons[i].SubHorizonNumber != "0") {
            this.horizons[i].code += this.horizons[i].SubHorizonNumber;
          }
          if (this.horizons[i].IsGHorizon == "True") {
            this.horizons[i].code += "g";
          }
          if (this.horizons[i].IsCaHorizon == "True") {
            this.horizons[i].code += "ca";
          }
          for (let j = 0; j < this.inclusions.length; j++) {
            if (this.horizons[i].HorizonId == this.inclusions[j].HorizonId) {
              this.horizons[i].inclusions.push(this.inclusions[j]);
            }
          }
        }
        this.store.commit("update_horizons_total", data);
        //console.log(data);
      }
    });
  },
  methods: {
    selectFirstRow(e) {
      const rows = e.component.getSelectedRowKeys();
      if (rows.length == 0) {
        const rowKey = e.component.getKeyByRowIndex(0);
        if (rowKey !== undefined) {
          this.selectedRowKeys = [rowKey];
        }
      }
    },
    calculateMoisture(data) {
      let condition =
        data["Bank_Moist"] != "" &&
        data["Bank_Dry"] != "" &&
        data["HorizonFe_Moist"] != "" &&
        data["Bank"] != "";
      if (!condition) {
        return "Нет данных";
      } else {
        let moisture =
          ((+data["Bank_Moist"] - +data["Bank_Dry"]) /
            (+data["Bank_Moist"] - +data["Bank"])) *
          100;
        return moisture.toFixed(5);
      }
    },
    calculateFeO_Dry(data) {
      let condition =
        data["Bank_Moist"] != "" &&
        data["Bank_Dry"] != "" &&
        data["HorizonFe_Moist"] != "" &&
        data["Bank"] != "";
      if (!condition) {
        return "Нет данных";
      } else {
        let moisture =
          ((+data["Bank_Moist"] - +data["Bank_Dry"]) /
            (+data["Bank_Moist"] - +data["Bank"])) *
          100;
        let feo = +data["HorizonFe_Moist"] / (1 - moisture / 100);
        return feo.toFixed(5);
      }
    },
    onSelectionChanged({ selectedRowsData }) {
      const data = selectedRowsData[0];
      this.selectedRowsData = data;
      //console.log(data);

      this.horizonsBasic = [
        { name: "Глубина от, см", value: data.HorizonDepthFrom },
        { name: "Глубина до, см", value: data.HorizonDepthTo },
        { name: "Индекс горизонта", value: data.HorizonSubtypeCode },
        { name: "Название горизонта", value: data.HorizonSubtypeName },
        {
          name: "Номер подгоризонта",
          value: data.SubHorizonNumber,
        },
        {
          name: "Оглеенный горизонт",
          value: data.IsGHorizon,
        },
        { name: "Карбонатный горизонт", value: data.IsCaHorizon },
      ];

      this.horizonsMorpho = [
        { name: "Характер окраски", value: data.PaintName },
        { name: "Цвет горизонта", value: data.HorizonTintName },
        { name: "Цвет пятен", value: data.SpotTintName },
        { name: "Структура основная", value: data.MainStructureName },
        {
          name: "Структура дополнительная",
          value: data.AdditionalStructureName,
        },
        {
          name: "Механический состав",
          value: data.MechanicalCompositionName,
        },
        { name: "Сложение", value: data.DensityName },
        { name: "Влажность", value: data.MoistureName },
        { name: "Форма нижней границы", value: data.BorderFormName },
        { name: "Характер перехода", value: data.TransitionName },
      ];

      this.horizonsChemestry = [
        {
          name: "pH",
          value: data.HorizonpH != "" ? data.HorizonpH : "Нет данных",
        },
        {
          name: "FeO, мг на 100 г влажной почвы",
          value:
            data.HorizonFe_Moist != "" ? data.HorizonFe_Moist : "Нет данных",
        },
        {
          name: "FeO, мг на 100 г сухой почвы",
          value: this.calculateFeO_Dry(data),
        },
        { name: "Влажность, %", value: this.calculateMoisture(data) },
        {
          name: "Номер бюкса",
          value: data.BankNumber != "" ? data.BankNumber : "Нет данных",
        },
        {
          name: "Вес пустого бюкса, г",
          value: data.Bank != "" ? data.Bank : "Нет данных",
        },
        {
          name: "Вес бюкса с влажной почвой, г",
          value: data.Bank_Moist != "" ? data.Bank_Moist : "Нет данных",
        },
        {
          name: "Вес бюкса с сухой почвой, г",
          value: data.Bank_Dry != "" ? data.Bank_Dry : "Нет данных",
        },
        { name: "Принять FeO за единицу", value: data.IsBaseHorizon },
        { name: "Принять за горизонт А1", value: data.IsA1Horizon },
      ];
    },
  },
  computed: {
    hstr() {
      if (
        this.selectedRowsData.HorizonSubtypeCode == "Нет данных" ||
        this.selectedRowsData.HorizonSubtypeCode === undefined
      ) {
        return "";
      } else {
        return `${this.selectedRowsData.HorizonSubtypeCode} (${this.selectedRowsData.HorizonDepthFrom} – ${this.selectedRowsData.HorizonDepthTo})`;
      }
    },
  },
};
</script>

<style lang="css" scoped>
.cardStyle {
  height: 52vh;
  border-color: #d7d7d7;
}

.horizonCol {
  display: flex;
  flex-direction: column;
  flex-flow: column wrap;
  align-content: space-between;
}

#dataGridHorizons {
  height: 26vh;
}

#dataGridInclusions {
  width: 50%;
}

#dataGridInclusions
  .dx-datagrid-rowsview
  .dx-master-detail-row
  .dx-master-detail-cell {
  padding: 5px;
}
</style>
