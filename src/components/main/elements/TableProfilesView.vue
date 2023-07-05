<template>
  <div id="app-container">
    <DxDataGrid
      id="dataGrid"
      :data-source="itemsProfile"
      key-expr="ProfileId"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :hover-state-enabled="true"
      @exporting="exportGrid"
    >
      <DxLoadPanel :enabled="true" />
      <DxColumn
        :fixed="true"
        data-field="ProfileId"
        data-type="number"
        sort-order="desc"
      ></DxColumn>
      <DxColumn data-field="ProfileGroupId" data-type="number"></DxColumn>
      <DxColumn data-field="ProfileNumber" data-type="number"></DxColumn>
      <DxColumn data-field="ProfileYear" data-type="number"></DxColumn>
      <DxColumn data-field="ProfileRepeat" data-type="number"></DxColumn>
      <DxColumn data-field="ProfileX"></DxColumn>
      <DxColumn data-field="ProfileY"></DxColumn>
      <DxColumn data-field="ProfileDate" data-type="date"></DxColumn>
      <DxColumn data-field="TeacherName"></DxColumn>
      <DxColumn data-field="MesoreliefName"></DxColumn>
      <DxColumn data-field="MicroreliefName"></DxColumn>
      <DxColumn data-field="GeochemicalPositionName"></DxColumn>
      <DxColumn data-field="SoilWaterDepthName"></DxColumn>
      <DxColumn data-field="SoilSubtypeName"></DxColumn>
      <DxColumn data-field="ParentMaterialName"></DxColumn>
      <DxColumn data-field="VegetationTypeName"></DxColumn>
      <DxColumn data-field="ProfileOldCode"></DxColumn>
      <DxColumn data-field="IsBaseProfile"></DxColumn>
      <DxColumnFixing :enabled="true" />
      <DxColumnChooser :enabled="true" />
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxExport :enabled="true" :formats="['xlsx', 'pdf']" />
      <DxSelection mode="single" />
    </DxDataGrid>
  </div>
</template>

<script>
import "devextreme/dist/css/dx.light.css";
import { Workbook } from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
import { jsPDF } from "jspdf";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";

import {
  DxDataGrid,
  DxColumn,
  DxColumnFixing,
  DxColumnChooser,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxSelection,
  DxExport,
  DxLoadPanel,
} from "devextreme-vue/data-grid";

export default {
  name: "TableProfilesView",
  components: {
    DxDataGrid,
    DxColumn,
    DxColumnFixing,
    DxColumnChooser,
    DxFilterRow,
    DxSearchPanel,
    DxGroupPanel,
    DxSelection,
    DxExport,
    DxLoadPanel,
  },
  props: {},
  data() {
    return {
      itemsProfile: [],
    };
  },
  setup() {
    const api = window.api;

    async function getProfileTableData() {
      let data = await api.getProfileTableData();

      return data;
    }
    return { getProfileTableData };
  },
  created() {
    this.getProfileTableData().then((data) => {
      this.itemsProfile = data;
    });
  },
  methods: {
    exportGrid(e) {
      if (e.format === "xlsx") {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet("dat_Profiles");
        exportDataGrid({
          worksheet: worksheet,
          component: e.component,
        }).then(function () {
          workbook.xlsx.writeBuffer().then(function (buffer) {
            saveAs(
              new Blob([buffer], { type: "application/octet-stream" }),
              "dat_Profiles.xlsx"
            );
          });
        });
        e.cancel = true;
      } else if (e.format === "pdf") {
        const doc = new jsPDF();
        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: e.component,
        }).then(() => {
          doc.save("dat_Profiles.pdf");
        });
      }
    },
  },
};
</script>

<style scoped>
#dataGrid {
  height: 700px;
}
.th-150 {
  min-width: 150px;
  max-width: 150px;
}
.th-200 {
  min-width: 200px;
  max-width: 200px;
}
.th-250 {
  min-width: 250px;
  max-width: 250px;
}
.th-300 {
  min-width: 300px;
  max-width: 300px;
}
</style>
