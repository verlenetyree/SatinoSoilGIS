<template>
  <v-container d-flex justify-center>
    <v-row>
      <v-col cols="9">
        <div class="select-data">
          <v-select
            v-model="vYear"
            class="select-year mr-2"
            label="Год"
            density="compact"
            variant="solo"
            :items="optionsYear"
            item-title="item"
            item-value="value"
            @update:modelValue="
              updateProfileDataView(this.vYear, this.vProfile, this.vRepeat)
            "
          ></v-select>
          <v-select
            v-model="vProfile"
            class="mx-2"
            label="Профиль"
            density="compact"
            variant="solo"
            :items="optionsProfile"
            item-title="item"
            item-value="value"
            @update:modelValue="
              updateProfileDataView(this.vYear, this.vProfile, this.vRepeat)
            "
          ></v-select>
          <v-select
            v-model="vRepeat"
            class="mx-2"
            label="Повторноcть"
            density="compact"
            variant="solo"
            :items="optionsRepeat"
            item-title="item"
            item-value="value"
            @update:modelValue="
              updateProfileDataView(this.vYear, this.vProfile, this.vRepeat)
            "
          ></v-select>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="10">
        <DxDataGrid
          id="dataGridProfile"
          ref="dataGridProfileRefKey"
          :data-source="itemsProfileView"
          key-expr="ProfileId"
          :allow-column-reordering="true"
          :allow-column-resizing="true"
          :column-auto-width="true"
          :show-borders="true"
          :hover-state-enabled="true"
          :selection="{ mode: 'single' }"
          @selection-changed="onSelectionChanged"
          @content-ready="selectFirstRow"
          v-model:selected-row-keys="selectedRowKeys"
        >
          <DxLoadPanel :enabled="true" />
          <DxColumn
            :fixed="true"
            data-field="ProfileId"
            data-type="number"
            caption="Id"
            :width="60"
          ></DxColumn>
          <DxColumn
            data-field="ProfileYear"
            data-type="number"
            caption="Год"
          ></DxColumn>
          <DxColumn
            data-field="ProfileGroupId"
            data-type="number"
            caption="Профиль"
            :width="70"
          ></DxColumn>
          <DxColumn
            sort-order="asc"
            data-field="ProfileNumber"
            data-type="number"
            caption="Номер на профиле"
            :width="70"
          ></DxColumn>
          <DxColumn
            data-type="number"
            data-field="ProfileRepeat"
            caption="Повторность"
            :width="70"
          ></DxColumn>
          <DxColumn data-field="TeacherName" caption="Преподаватель"></DxColumn>
          <DxColumn data-field="SoilTypeName" caption="Тип почвы"></DxColumn>
          <DxColumn data-field="SoilSubtypeName" caption="Разность"></DxColumn>
          <DxColumn
            data-field="ProfileDate"
            data-type="date"
            caption="Дата"
            :width="100"
          ></DxColumn>
          <DxColumn
            :calculate-cell-value="boolBaseProfile"
            data-type="boolean"
            caption="Принять за единицу"
          ></DxColumn>
          <DxColumn
            data-field="Lon"
            data-type="boolean"
            caption="Координаты"
          ></DxColumn>
          <DxColumnFixing :enabled="true" />
        </DxDataGrid>

        <p class="font-weight-medium mt-5 mb-1">
          Характеристика почвенных горизонтов
        </p>
        <DxDataGrid
          key-expr="HorizonId"
          id="dataGridHorizons"
          :allow-column-resizing="true"
          :column-auto-width="true"
          :data-source="selectedHorizonsData"
          :hover-state-enabled="true"
          :show-borders="true"
        >
          <DxLoadPanel :enabled="false" />
          <DxColumn
            data-type="number"
            :width="55"
            data-field="HorizonId"
            caption="Id"
          ></DxColumn>
          <DxColumn
            data-type="number"
            sort-order="asc"
            :width="50"
            data-field="HorizonDepthFrom"
            caption="От"
          ></DxColumn>
          <DxColumn
            data-type="number"
            :width="50"
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
      </v-col>

      <v-col cols="2">
        <div class="ml-5">
          <div class="button-group">
            <v-btn
              size="small"
              elevation="1"
              :min-width="width"
              @click="
                this.$store.commit('update_data_viewer', [
                  this.vYear,
                  this.vProfile,
                  this.vRepeat,
                ]);
                $router.push({
                  name: 'DataReviewPage',
                  params: { id: id() },
                });
              "
            >
              Просмотр
            </v-btn>
            <v-dialog v-model="dialog" width="auto">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  size="small"
                  elevation="1"
                  :min-width="width"
                  class="btn"
                  :disabled="isItForbidenToDelete()"
                >
                  Удалить
                </v-btn>
              </template>

              <v-card>
                <v-card-text class="text-center">
                  <b>Вы действительно хотите удалить запись?</b><br />
                  В случае согласия данные будут потеряны.
                </v-card-text>
                <v-card-actions class="my-2 justify-space-evenly">
                  <v-btn
                    variant="tonal"
                    color="#f5222d"
                    @click="
                      deleteProfile();
                      dialog = false;
                    "
                    >Да</v-btn
                  >
                  <v-btn variant="tonal" color="#1890ff" @click="dialog = false"
                    >Нет</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-btn
              prepend-icon="mdi-map-marker-radius"
              variant="tonal"
              color="deep-purple accent-4"
              size="small"
              elevation="1"
              :min-width="width"
              class="btn"
              @click="showMapDialog = true"
            >
              Показать на карте
            </v-btn>
            <MapDialog
              :showMapDialog="showMapDialog"
              :mapData="itemsProfileView"
              :vYear="this.vYear"
              :vProfile="this.vProfile"
              :vRepeat="this.vRepeat"
              @close="showMapDialog = false"
            />
          </div>
          <div class="button-group">
            <v-btn
              size="small"
              elevation="1"
              :min-width="width"
              class="btn"
              @click="showReportDialog = true"
            >
              Отчёт (Радиальный)
            </v-btn>
            <ReportDialog
              :showReportDialog="showReportDialog"
              :chartData="itemsProfileView"
              :vYear="this.vYear"
              :vProfile="this.vProfile"
              :vRepeat="this.vRepeat"
              @close="showReportDialog = false"
            />
            <v-btn
              size="small"
              elevation="1"
              :min-width="width"
              class="btn"
              @click="showLateraReportDialog = true"
            >
              Отчёт (Латеральный)
            </v-btn>
            <ReportLateralDialog
              :showReportDialog="showLateraReportDialog"
              :chartData="itemsProfileView"
              :vYear="this.vYear"
              :vProfile="this.vProfile"
              :vRepeat="this.vRepeat"
              @close="showLateraReportDialog = false"
            />
          </div>
          <ExcelDialogWindow />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import ExcelDialogWindow from "@/components/main/elements/comps/ExcelDialogWindow.vue";
import MapDialog from "@/components/main/elements/mapcomps/MapDialog.vue";
import ReportDialog from "@/components/main/elements/comps/ReportDialog.vue";
import ReportLateralDialog from "@/components/main/elements/comps/ReportLateralDialog.vue";

import "devextreme/dist/css/dx.light.compact.css";
import { useStore } from "vuex";
//import { computed } from "vue";

import { DxDataGrid } from "devextreme-vue/data-grid";
import {
  DxColumn,
  DxColumnFixing,
  DxLoadPanel,
  DxMasterDetail,
} from "devextreme-vue/data-grid";

const dataGridProfileRefKey = "profile-data-grid";

export default {
  components: {
    DxDataGrid,
    DxColumn,
    DxColumnFixing,
    DxMasterDetail,
    DxLoadPanel,

    ExcelDialogWindow,
    MapDialog,
    ReportDialog,
    ReportLateralDialog,
  },
  data() {
    return {
      dataGridProfileRefKey,
      dialog: false,
      width: "170px",
      vYear: this.$store.state.vYear,
      vProfile: this.$store.state.vProfile,
      vRepeat: this.$store.state.vRepeat,
      selectedRowKeys: [],
      showMapDialog: false,
      showReportDialog: false,
      showLateraReportDialog: false,
      showHorizonsInfo: false,
      disableDelete: true,
      selectedRowNotes: "",
      selectedRowPicture: "",
      optionsYear: [],
      optionsProfile: [],
      optionsRepeat: [],
      itemsProfileView: [],
      itemsHorizonsView: [],
      itemsInclusionsView: [],
      selectedHorizonsData: [],
    };
  },
  setup() {
    const store = useStore();
    const profile = store.state.profile;
    const api = window.api;

    //const vYear = computed(() => store.state.vYear);
    //const vProfile = computed(() => store.state.vProfile);
    //const vRepeat = computed(() => store.state.vRepeat);

    async function getAllYears() {
      const years = await api.selectProfile("getAllYears");
      return years.sort((a, b) => a - b).reverse();
    }

    async function getValidYears() {
      const years = await api.getValidYears();
      return years;
    }

    async function getProfile() {
      const profiles = await api.selectProfile("getProfile");
      return profiles;
    }
    async function getRepeat() {
      const repeats = await api.selectProfile("getRepeat");
      return repeats;
    }
    async function getProfileDataView(year, profile, repeat) {
      let data = await api.getProfileDataView(year, profile, repeat);

      return data;
    }
    async function getHorizonsDataView(year, profile, repeat) {
      let data = await api.getHorizonsDataView(year, profile, repeat);

      return data;
    }
    async function getInclusionsDataView(year, profile, repeat) {
      let data = await api.getInclusionsDataView(year, profile, repeat);

      return data;
    }

    async function deleteProfileDataById(id) {
      await api.deleteProfileDataById(id);

      return;
    }

    return {
      store,
      profile,
      //vYear,
      //vProfile,
      //vRepeat,
      getAllYears,
      getValidYears,
      getProfile,
      getRepeat,
      getProfileDataView,
      getHorizonsDataView,
      getInclusionsDataView,
      deleteProfileDataById,
    };
  },
  created() {
    this.getAllYears().then((years) => {
      for (let year of years) {
        this.optionsYear.push({
          item: year,
          value: year,
        });
      }
    });
    this.getProfile().then((profiles) => {
      for (let profile of profiles) {
        this.optionsProfile.push({
          item: profile,
          value: profile,
        });
      }
    });
    this.getRepeat().then((repeats) => {
      for (let repeat of repeats) {
        this.optionsRepeat.push({
          item: repeat,
          value: repeat,
        });
      }
    });
    this.getProfileDataView(this.vYear, this.vProfile, this.vRepeat).then(
      (data) => {
        this.itemsProfileView = data;
        //console.log(data);
      }
    );
    this.getHorizonsDataView(this.vYear, this.vProfile, this.vRepeat).then(
      (data) => {
        this.itemsHorizonsView = data;
        for (let i = 0; i < this.itemsProfileView.length; i++) {
          this.itemsProfileView[i].horizons = [];
          for (let j = 0; j < this.itemsHorizonsView.length; j++) {
            if (
              this.itemsProfileView[i].ProfileId ==
              this.itemsHorizonsView[j].ProfileId
            ) {
              this.itemsProfileView[i].horizons.push(this.itemsHorizonsView[j]);
            }
          }
        }
      }
    );
    this.getInclusionsDataView(this.vYear, this.vProfile, this.vRepeat).then(
      (data) => {
        this.itemsInclusionsView = data;
      }
    );
  },
  computed: {
    dataGrid: function () {
      //console.log(this.$refs.dataGridProfileRefKey.instance);
      return this.$refs.dataGridProfileRefKey.instance;
    },
  },
  methods: {
    isItForbidenToDelete() {
      this.getValidYears().then((data) => {
        const years = Object.entries(data[0]).map((obj) => {
          return obj[1];
        });
        this.disableDelete = years.indexOf(this.vYear) == -1 ? true : false;
      });
      //console.log(this.itemsProfileView.length);
      return this.disableDelete || this.itemsProfileView.length == 0;
    },
    refreshDataGrid() {
      this.dataGrid
        .refresh()
        .then(() => {
          this.getProfileDataView(this.vYear, this.vProfile, this.vRepeat).then(
            (data) => {
              this.itemsProfileView = data;
            }
          );
          this.getHorizonsDataView(
            this.vYear,
            this.vProfile,
            this.vRepeat
          ).then((data) => {
            this.itemsHorizonsView = data;
            for (let i = 0; i < this.itemsProfileView.length; i++) {
              this.itemsProfileView[i].horizons = [];
              for (let j = 0; j < this.itemsHorizonsView.length; j++) {
                if (
                  this.itemsProfileView[i].ProfileId ==
                  this.itemsHorizonsView[j].ProfileId
                ) {
                  this.itemsProfileView[i].horizons.push(
                    this.itemsHorizonsView[j]
                  );
                }
              }
            }
          });
          this.getInclusionsDataView(
            this.vYear,
            this.vProfile,
            this.vRepeat
          ).then((data) => {
            this.itemsInclusionsView = data;
          });
        })
        .catch(function (error) {
          console.log(error);
        });
    },
    selectFirstRow(e) {
      const rows = e.component.getSelectedRowKeys();
      if (rows.length == 0) {
        const rowKey = e.component.getKeyByRowIndex(0);
        if (rowKey !== undefined) {
          this.selectedRowKeys = [rowKey];
        }
      }
    },

    onSelectionChanged({ selectedRowsData }) {
      const data = selectedRowsData[0];

      this.showHorizonsInfo = !!data;
      this.selectedHorizonsData = data && data.horizons;
      for (let i = 0; i < this.selectedHorizonsData.length; i++) {
        this.selectedHorizonsData[i].inclusions = [];
        this.selectedHorizonsData[i].code =
          this.selectedHorizonsData[i].HorizonSubtypeCode;
        if (this.selectedHorizonsData[i].SubHorizonNumber != "0") {
          this.selectedHorizonsData[i].code +=
            this.selectedHorizonsData[i].SubHorizonNumber;
        }
        if (this.selectedHorizonsData[i].IsGHorizon == "True") {
          this.selectedHorizonsData[i].code += "g";
        }
        if (this.selectedHorizonsData[i].IsCaHorizon == "True") {
          this.selectedHorizonsData[i].code += "ca";
        }
        for (let j = 0; j < this.itemsInclusionsView.length; j++) {
          if (
            this.selectedHorizonsData[i].HorizonId ==
            this.itemsInclusionsView[j].HorizonId
          ) {
            this.selectedHorizonsData[i].inclusions.push(
              this.itemsInclusionsView[j]
            );
          }
        }
      }
    },
    boolBaseProfile(rowData) {
      return rowData.IsBaseProfile == "False" ? 0 : 1;
    },

    updateProfileDataView(year, profile, repeat) {
      this.getProfileDataView(year, profile, repeat).then((data) => {
        this.itemsProfileView = data;
      });
      this.getHorizonsDataView(year, profile, repeat).then((data) => {
        this.itemsHorizonsView = data;
        for (let i = 0; i < this.itemsProfileView.length; i++) {
          this.itemsProfileView[i].horizons = [];
          for (let j = 0; j < this.itemsHorizonsView.length; j++) {
            if (
              this.itemsProfileView[i].ProfileId ==
              this.itemsHorizonsView[j].ProfileId
            ) {
              this.itemsProfileView[i].horizons.push(this.itemsHorizonsView[j]);
            }
          }
        }
      });
    },
    id() {
      this.store.commit("if_new", [false, this.selectedRowKeys[0]]);
      this.store.commit(
        "set_HorizonId",
        this.selectedHorizonsData.map((horizon) => {
          return horizon.HorizonId;
        })
      );
      return this.selectedRowKeys[0];
    },
    deleteProfile() {
      //console.log(this.selectedRowKeys[0]);
      this.deleteProfileDataById(this.selectedRowKeys[0]).then(() => {
        this.refreshDataGrid();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.select-data {
  display: flex;
  flex-direction: row;
}

.button-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 24px;
}

.card-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 24px;
}

.btn {
  margin-top: 5px;
  margin-bottom: 10px;
}

#dataGridProfile {
  height: 40vh;
}

.dx-datagrid .dx-row > td {
  padding: 3px !important;
}

#dataGridHorizons {
  height: 27vh;
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
