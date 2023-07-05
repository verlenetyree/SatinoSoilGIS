<template>
  <div id="app-container">
    <DxDataGrid
      id="dataGrid"
      :data-source="itemsHorizons"
      key-expr="HorizonId"
      :allow-column-reordering="true"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :hover-state-enabled="true"
      @exporting="exportGrid"
    >
      <DxLoadPanel :enabled="true" />
      <DxColumn
        :fixed="true"
        data-type="number"
        sort-order="desc"
        data-field="HorizonId"
      ></DxColumn>
      <DxColumn data-type="number" data-field="HorizonDepthFrom"></DxColumn>
      <DxColumn data-type="number" data-field="HorizonDepthTo"></DxColumn>
      <DxColumn data-field="HorizonSubtypeName"></DxColumn>
      <DxColumn data-field="SubHorizonNumber"></DxColumn>
      <DxColumn data-field="PaintName"></DxColumn>
      <DxColumn data-field="TintName"></DxColumn>
      <DxColumn data-field="SpotTintName"></DxColumn>
      <DxColumn data-field="MainStructureName"></DxColumn>
      <DxColumn data-field="AdditionalStructureName"></DxColumn>
      <DxColumn data-field="MechanicalCompositionName"></DxColumn>
      <DxColumn data-field="DensityId"></DxColumn>
      <DxColumn data-field="MoistureId"></DxColumn>
      <DxColumn data-field="BorderFormName"></DxColumn>
      <DxColumn data-field="TransitionId"></DxColumn>
      <!--<DxColumn data-field="HorizonpH"></DxColumn>-->
      <DxColumn data-field="HorizonFe_Moist"></DxColumn>
      <DxColumn data-field="BankNumber"></DxColumn>
      <DxColumn data-field="Bank"></DxColumn>
      <DxColumn data-field="Bank_Moist"></DxColumn>
      <DxColumn data-field="Bank_Dry"></DxColumn>
      <DxColumn data-field="IsBaseHorizon"></DxColumn>
      <DxColumn data-field="IsA1Horizon"></DxColumn>
      <DxColumn data-field="IsGHorizon"></DxColumn>
      <DxColumn data-field="IsCaHorizon"></DxColumn>
      <DxColumn data-field="ProfileOldCode"></DxColumn>
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
  name: "TableView",
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
      itemsHorizons: [],
    };
  },
  setup() {
    const api = window.api;

    async function getHorizonsTableData() {
      let data = await api.getHorizonsTableData();

      return data;
    }
    return { getHorizonsTableData };
  },
  created() {
    this.getHorizonsTableData().then((data) => {
      this.itemsHorizons = data;
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
