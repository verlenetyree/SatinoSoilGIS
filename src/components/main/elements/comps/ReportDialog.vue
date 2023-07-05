<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-toolbar
        color="white"
        elevation="3"
        style="position: sticky; top: 0; z-index: 999"
      >
        <v-btn icon color="deep-purple accent-4" @click="$emit('close')">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title
          >Год: {{ this.chartData[0].ProfileYear }}, Профиль:
          {{ this.chartData[0].ProfileGroupId }}, Повторность:
          {{ this.chartData[0].ProfileRepeat }}</v-toolbar-title
        >
        <v-spacer></v-spacer>
        <v-btn
          @click="callExportToPDF"
          color="deep-purple accent-4"
          append-icon="mdi-file-export-outline"
          >Экспорт в PDF</v-btn
        >
      </v-toolbar>

      <ReportBuilder :chartData="data" :callExport="this.export" />
    </v-card>
  </v-dialog>
</template>

<script>
import ReportBuilder from "@/components/main/elements/comps/ReportBuilder.vue";

export default {
  components: { ReportBuilder },
  props: {
    showReportDialog: { type: Boolean, required: true },
    chartData: { type: Array, required: true },
    vYear: { type: String, required: true },
    vProfile: { type: String, required: true },
    vRepeat: { type: String, required: true },
  },
  data() {
    return {
      dialog: false,
      export: false,
      data: [],
      year: "2021",
      profile: "1",
      repeat: "1",
    };
  },
  setup() {
    const api = window.api;
    return {
      api,
    };
  },
  mounted() {
    //console.log(this.data);
  },
  watch: {
    showReportDialog() {
      this.dialog = this.$props.showReportDialog;
    },
    chartData() {
      this.data = [...this.$props.chartData];
      this.data.sort((a, b) => {
        return +a.ProfileNumber - +b.ProfileNumber;
      });
    },
    vYear() {
      this.year = this.$props.vYear;
    },
    vProfile() {
      this.profile = this.$props.vProfile;
    },
    vRepeat() {
      this.repeat = this.$props.vRepeat;
    },
  },
  methods: {
    callExportToPDF() {
      //console.log("parent");
      //this.$refs.myChild.$refs.documentRadial.exportToPDF();
      this.export = true;
      setTimeout(() => {
        this.export = false;
      }, 2000);
    },
  },
};
</script>

<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
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
</style>
