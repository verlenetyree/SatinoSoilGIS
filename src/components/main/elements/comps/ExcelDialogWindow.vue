<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ props }">
      <div class="button-group">
        <v-btn
          size="small"
          elevation="1"
          :min-width="width"
          class="btn"
          v-bind="props"
        >
          Внести данные РФА
        </v-btn>
      </div>
    </template>
    <v-card>
      <v-toolbar color="white" elevation="3">
        <v-btn icon color="deep-purple accent-4" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Внести данные РФА</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <!--<v-btn
            color="deep-purple accent-4"
            variant="text"
            @click="dialog = false"
          >
            Сохранить
          </v-btn>-->
        </v-toolbar-items>
      </v-toolbar>
      <v-row justify="center" align-content="space-around" no-gutters>
        <v-col cols="10" style="height: 115px">
          <v-file-input
            clearable
            multiple
            accept=".xlsx, .xls"
            class="mt-3 mb-3 mx-3"
            label="Импорт данных"
            variant="solo"
            style="font-size: 12px"
            v-model="selectedFiles"
            @change="
              this.selectedFilesUploadInfo = [];
              this.is_processed = false;
              previewFiles();
            "
          >
            <template v-slot:selection="{ fileNames }">
              <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip
                  v-if="index < 2"
                  color="deep-purple-accent-4"
                  label
                  size="small"
                  class="me-2"
                >
                  {{ fileName }}
                </v-chip>

                <span
                  v-else-if="index === 2"
                  class="text-overline text-grey-darken-3 mx-2"
                >
                  +{{ selectedFiles.length - 2 }} Файл(oв)
                </span>
              </template>
            </template>
          </v-file-input>
          <!--<div v-show="!selectedFiles.length" class="mx-6">
            <v-divider class="mx-6"></v-divider>
            <p class="mt-6">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>-->
        </v-col>
      </v-row>

      <v-row no-gutters>
        <v-col cols="7" style="height: 1.25rem">
          <p v-show="selectedFiles.length" class="ml-5 mb-2 titleStyle">
            Окно просмотра данных
          </p>
        </v-col>
      </v-row>
      <v-row v-show="selectedFiles.length" no-gutters>
        <v-col cols="7">
          <div v-show="selectedFiles.length">
            <DxDataGrid
              class="ml-5"
              id="dataGrid"
              :data-source="tableData"
              :hover-state-enabled="true"
              :show-borders="true"
            >
              <!--<DxLoadPanel :enabled="true" />-->
              <!--<DxColumn data-field="Дата" data-type="date" caption="Company" />-->
            </DxDataGrid>
          </div>
        </v-col>
        <v-col cols="5">
          <v-btn
            class="ml-5 mb-5"
            elevation="1"
            :min-width="width"
            @click="uploadRFA"
            >Загрузить данные</v-btn
          >
          <v-card
            class="mx-5 overflow-auto"
            id="loadCard"
            title="Статус загрузки"
          >
            <v-list density="compact" ref="list">
              <!--:class="{ selected: currentDisplay === id }"
              :style="cssVars(file.status)"-->
              <v-list-item
                :active-color="colorIcon(file.status)"
                v-for="(file, id) in selectedFilesUploadInfo"
                :active="id === currentDisplay"
                :key="id"
                :value="file.name"
                @click="
                  currentDisplay = id;
                  previewFiles();
                "
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="colorIcon(file.status)"
                    :icon="showIcon(file.status)"
                  ></v-icon>
                </template>
                <v-list-item-title v-text="file.name"></v-list-item-title>
              </v-list-item>
              <!--<v-pagination
                v-model="page"
                :length="Math.ceil(15 / perPage)"
                :total-visible="perPage"
              ></v-pagination>-->
            </v-list>
          </v-card>
          <alertComponent
            ref="dlg"
            :visible="showAlert"
            :errorCode="errorCode"
            :errorMsg="errorMsg"
            :fileName="fileName"
            @close="showAlert = false"
          />
        </v-col>
      </v-row>
    </v-card>
  </v-dialog>
</template>

<script>
import alertComponent from "@/components/main/elements/comps/alertComponent.vue";
import uploadRFAapi from "@/scripts/uploadRFAapi.js";
import "devextreme/dist/css/dx.light.compact.css";
import * as XLSX from "xlsx";

import { DxDataGrid } from "devextreme-vue/data-grid";

export default {
  components: {
    alertComponent,
    DxDataGrid,
  },
  data() {
    return {
      page: 1,
      perPage: 8,

      //dialogStack: [],
      //dialogId: 0,
      showAlert: false,
      is_loading: false,
      is_processed: false,
      errorCode: "",
      errorMsg: "",
      fileName: "",
      dialog: false,
      selectedFiles: [],
      selectedFilesUploadInfo: [],
      statusIcon: [
        {
          status: -1,
          icon: "mdi-file-cancel-outline",
          color: "error",
          hex: "#b00020",
          hexbg: "#f5e0e4",
        },
        {
          status: 0,
          icon: "mdi-file-document-outline",
          color: undefined,
          hex: "#959595",
          hexbg: "#F5F5F5",
        },
        {
          status: 1,
          icon: "mdi-file-upload-outline",
          color: "info",
          hex: "#2196f3",
          hexbg: "#e4f2fd",
        },
        {
          status: 2,
          icon: "mdi-file-check-outline",
          color: "success",
          hex: "#4caf50",
          hexbg: "#e9f5ea",
        },
      ],
      currentDisplay: 0,
      tableData: [],
      isSelecting: false,
      width: "170px",
    };
  },
  setup() {
    const api = window.api;

    const {
      getHeaders,
      isMetalHeadersExisting,
      isHorizonIdFieldExisting,
      whichHorizonIdRecordsAreNotExisting,
    } = uploadRFAapi();

    async function getExistingHorizonIds() {
      const ids = await api.getExistingHorizonIds();
      return ids;
    }

    async function checkIfMetalFieldsExist() {
      const result = await api.checkIfMetalFieldsExist();
      return result;
    }

    async function checkHorizonIdRecordOnRFATable(ids) {
      const arr = [];
      for (let id of ids) {
        const result = await api.checkHorizonIdRecordOnRFATable(id);
        arr.push({ HorizonId: id, ifRecordExist: result });
      }
      return arr;
    }

    async function processRFARecord(record) {
      const obj = { HorizonId: record.HorizonId };
      const metalHeaders = ["Al", "Si", "Ca", "Mn", "Fe", "Zn", "Pb"];
      let result = 0;
      for (let prop in record) {
        if (metalHeaders.indexOf(prop) != -1) {
          if (!isNaN(record[prop]) || record[prop] == "ND") {
            obj[`Horizon${prop}`] = record[prop];
          } else return -1;
        }
      }
      if (Object.keys(obj).length == 8) {
        const str = JSON.stringify(obj);
        result = await api.processRFARecord(str);
      }
      return result;
    }

    async function updateRFARecord(record) {
      const obj = {};
      const metalHeaders = ["Al", "Si", "Ca", "Mn", "Fe", "Zn", "Pb"];
      let result = 0;
      for (let prop in record) {
        if (metalHeaders.indexOf(prop) != -1) {
          if (!isNaN(record[prop]) || record[prop] == "ND") {
            obj[`Horizon${prop}`] = record[prop];
          } else return -1;
        }
      }
      if (Object.keys(obj).length == 7) {
        const str = JSON.stringify(obj);
        result = await api.updateRFARecord(record.HorizonId, str);
      }
      return result;
    }

    return {
      getExistingHorizonIds,
      checkIfMetalFieldsExist,
      checkHorizonIdRecordOnRFATable,
      processRFARecord,
      updateRFARecord,
      getHeaders,
      isMetalHeadersExisting,
      isHorizonIdFieldExisting,
      whichHorizonIdRecordsAreNotExisting,
    };
  },

  methods: {
    cssVars(status) {
      let color;
      let bgColor;
      for (let icon of this.statusIcon) {
        if (status == icon.status) {
          color = icon.hex;
          bgColor = icon.hexbg;
        }
      }
      return {
        "--color": color,
        "--bg-color": bgColor,
      };
    },
    showIcon(status) {
      for (let icon of this.statusIcon) {
        if (status == icon.status) {
          return icon.icon;
        }
      }
    },
    colorIcon(status) {
      for (let icon of this.statusIcon) {
        if (status == icon.status) {
          return icon.color;
        }
      }
    },
    async updateFileInfo() {
      let id = 0;
      for (let file of this.selectedFiles) {
        let fileName = file.name;
        let arrayBuffer = await file.arrayBuffer();
        let uint8Array = new Uint8Array(arrayBuffer);
        let workbook = XLSX.read(uint8Array, {
          cellDates: true,
        });
        let data = XLSX.utils.sheet_to_json(
          workbook.Sheets[workbook.SheetNames[0]],
          {
            cellDates: true,
          }
        );
        this.selectedFilesUploadInfo.push({
          id: id++,
          name: fileName,
          ui8: uint8Array,
          data: data,
          is_processed: false,
          status: 0,
        });
      }
      //console.log(this.selectedFilesUploadInfo);
    },
    async previewFiles() {
      if (!this.selectedFilesUploadInfo.length) {
        await this.updateFileInfo();
      }

      let data = this.selectedFilesUploadInfo[this.currentDisplay].data;
      this.tableData = data;
    },
    async showDialog(code, msg, file) {
      this.fileName = file;
      this.errorCode = code;
      this.errorMsg = msg;

      const result = await this.$refs.dlg.open().then((result) => {
        return result;
      });
      return result;
    },
    makeEverythingUpload() {
      for (let i = 0; i < this.selectedFilesUploadInfo.length; i++) {
        let file = this.selectedFilesUploadInfo[i];
        file.status = 1;
      }
    },
    checkIfMetalHeadersExisting(headers, file) {
      if (!this.isHorizonIdFieldExisting(headers)) {
        file.status = -1;
        file.is_processed = true;
        return -1;
      }
      return 0;
    },
    checkIfHorizonIdFieldExisting(headers, file) {
      if (!this.isMetalHeadersExisting(headers)) {
        file.status = -1;
        file.is_processed = true;
        return -1;
      }
      return 0;
    },
    getExcelHorizonId(file) {
      const excelIDs = [];
      for (let record of file.data) {
        excelIDs.push(record.HorizonId);
      }
      return excelIDs;
    },
    getValidHorizonId(excelIDs, missingIDs) {
      const validExcelIDs = [];
      excelIDs.forEach((item) => {
        if (missingIDs.indexOf(item) == -1) {
          validExcelIDs.push(item);
        }
      });
      return validExcelIDs;
    },
    async uploadRFA() {
      if (!this.is_processed) {
        this.makeEverythingUpload();
        for (let i = 0; i < this.selectedFilesUploadInfo.length; i++) {
          let file = this.selectedFilesUploadInfo[i];
          const headers = this.getHeaders(file.ui8);
          // Проверяем наличие столбцов Al, Si, Ca, Mn, Fe, Zn, Pb и столбца с номером горизонта HorizonId
          if (this.checkIfMetalHeadersExisting(headers, file) != -1) {
            if (this.checkIfHorizonIdFieldExisting(headers, file) != -1) {
              const dbIDs = await this.getExistingHorizonIds();
              const excelIDs = this.getExcelHorizonId(file);
              const missingIDs = this.whichHorizonIdRecordsAreNotExisting(
                dbIDs,
                excelIDs
              );
              let validExcelIDs = excelIDs;
              let decision = true;
              // Проверили что записи с предоставленными айдишниками вообще существуют
              if (missingIDs.length) {
                let msg = `</br>Записей о горизонтах со следующими номерами не существует: </br></br><strong>${missingIDs.join(
                  ", "
                )}</strong></br></br>Вы хотите продолжить загрузку данных из файла, пропустив записи о данных горизонтах?`;

                decision = await this.showDialog("warning", msg, file.name);
                validExcelIDs = this.getValidHorizonId(excelIDs, missingIDs);
              }

              if (decision) {
                const recordExistance =
                  await this.checkHorizonIdRecordOnRFATable(validExcelIDs);
                const alreadyExistIds = [];
                const alreadyExist = [];
                for (let record of recordExistance) {
                  if (!record.ifRecordExist) {
                    const recordRFA = file.data.find(
                      (rec) => rec.HorizonId === record.HorizonId
                    );
                    await this.processRFARecord(recordRFA);
                  } else {
                    alreadyExistIds.push(record.HorizonId);
                    alreadyExist.push(record);
                  }
                }
                if (alreadyExistIds.length) {
                  let msg = `</br>Данные РФА уже есть для следующих горизонтов:</br></br><strong>${alreadyExistIds.join(
                    ", "
                  )}</strong></br></br>Хотите ли вы перезаписать данные для этих горизонтов?`;

                  decision = await this.showDialog("warning", msg, file.name);
                  if (decision) {
                    for (let record of alreadyExist) {
                      const recordRFA = file.data.find(
                        (rec) => rec.HorizonId === record.HorizonId
                      );
                      await this.updateRFARecord(recordRFA);
                    }
                  }
                }
                file.status = 2;
                file.is_processed = true;
              } else {
                file.status = 0;
                file.is_processed = true;
              }
            } else {
              let msg =
                "</br><strong>ОШИБКА:</strong> Отсутствует столбец с номером горизонта HorizonId";
              await this.showDialog("error", msg, file.name);
            }
          } else {
            let msg =
              "</br><strong>ОШИБКА:</strong> Проверьте наличие столбцов Al, Si, Ca, Mn, Fe, Zn, Pb";
            await this.showDialog("error", msg, file.name);
          }
        }
        this.is_processed = true;
      } else {
        let msg = "Файлы уже были обработаны";
        await this.showDialog("info", "", msg);
      }
    },
  },
};
</script>

<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
#dataGrid {
  height: 65vh;
}
#loadCard {
  height: 57vh;
}
.titleStyle {
  font-size: 1.25rem;
  font-weight: 500;
}
.btn {
  margin-top: 5px;
  margin-bottom: 10px;
}
.button-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 24px;
}
.selected {
  background-color: var(--bg-color);
  color: var(--color);
  font-weight: 700;
}
</style>
