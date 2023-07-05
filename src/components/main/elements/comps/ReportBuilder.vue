<template>
  <v-container>
    <v-col cols="1"> </v-col>
    <v-col>
      <div ref="documentRadial">
        <div id="element-to-convert" ref="elementToConvert">
          <h3 class="title">
            Распределение химических элементов в почвенных разрезах на профиле
            номер {{ this.chartData[0].ProfileGroupId }}
          </h3>
          <v-row no-gutters justify="center" align-content="center">
            <v-col
              align-self="center"
              v-if="dataset[0] !== undefined && dataset[0].length"
            >
              <div id="Si" class="chart"></div>
            </v-col>
            <v-col
              align-self="center"
              v-if="dataset[1] !== undefined && dataset[1].length"
            >
              <div id="Ca" class="chart"></div>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center" align-content="center">
            <v-col
              align-self="center"
              v-if="dataset[2] !== undefined && dataset[2].length"
            >
              <div id="Al" class="chart"></div>
            </v-col>
            <v-col
              align-self="center"
              v-if="dataset[3] !== undefined && dataset[3].length"
            >
              <div id="Mn" class="chart"></div>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center" align-content="center">
            <v-col
              align-self="center"
              v-if="dataset[4] !== undefined && dataset[4].length"
            >
              <div id="Fe" class="chart"></div>
            </v-col>
            <v-col
              align-self="center"
              v-if="dataset[5] !== undefined && dataset[5].length"
            >
              <div id="Zn" class="chart"></div>
            </v-col>
          </v-row>
          <v-row no-gutters justify="center" align-content="center">
            <v-col
              align-self="center"
              v-if="dataset[6] !== undefined && dataset[6].length"
            >
              <div id="Pb" class="chart"></div>
            </v-col>
            <v-col
              align-self="center"
              v-if="dataset[7] !== undefined && dataset[7].length"
            >
              <div id="pH" class="chart"></div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-col>
    <v-col cols="1"> </v-col>
  </v-container>
</template>

<script>
import Plotly from "plotly.js-dist-min";
import html2pdf from "html2pdf.js";

export default {
  props: {
    chartData: { type: Array, required: true },
    callExport: { type: Boolean, required: true },
  },
  data() {
    return {
      dataset: [],
      params: ["Si", "Ca", "Al", "Mn", "Fe", "Zn", "Pb", "pH"],
    };
  },
  setup() {
    const api = window.api;

    async function getProfileConcentrationData(HorizonId, param) {
      let columnName = "Horizon" + param;
      let data = await api.getProfileConcentrationData(columnName, HorizonId);

      return data;
    }

    return { getProfileConcentrationData };
  },
  mounted() {
    this.addConcentrationData().then(() => {
      for (let i = 0; i < this.params.length; i++) {
        if (this.dataset[i].length != 0) {
          let layout = {
            autosize: false,
            width: 350,
            height: 270,
            margin: {
              l: 50,
              r: 25,
              b: 10,
              t: 50,
              pad: 4,
            },
            showlegend: true,
            xaxis: {
              title: `${this.params[i]}`,
              zeroline: false,
              showline: true,
              side: "top",
              titlefont: { size: 13 },
              tickfont: {
                size: 10,
              },
            },
            yaxis: {
              title: "Глубина, см",
              zeroline: true,
              showline: true,
              autorange: "reversed",
              titlefont: { size: 13 },
              tickfont: {
                size: 10,
              },
            },
            legend: {
              font: { size: 9 },
            },
          };
          Plotly.newPlot(this.params[i], this.dataset[i], layout);
        }
      }
    });
  },
  watch: {
    callExport() {
      if (this.$props.callExport) {
        this.exportToPDF();
      }
    },
  },
  methods: {
    exportToPDF() {
      //console.log("child");
      //let element = html2pdf(document.getElementById("element-to-convert"));
      const element = this.$refs.elementToConvert;
      var opt = {
        margin: 0,
        filename: `radial-${this.chartData[0].ProfileYear}-${this.chartData[0].ProfileGroupId}-${this.chartData[0].ProfileRepeat}.pdf`,
        pagebreak: { mode: ["avoid-all", "css", "legacy"] },
        html2canvas: {
          dpi: 192,
          letterRendering: true,
        },
        image: { type: "png", quality: 1 },
      };
      html2pdf().set(opt).from(element).save();
    },
    async addConcentrationData() {
      this.dataset = [];

      for (let param of this.params) {
        const data = [];
        for (let i = 0; i < this.chartData.length; i++) {
          const trace = [];
          const promises = [];
          for (let horizon of this.chartData[i].horizons) {
            horizon.elevation =
              (+horizon.HorizonDepthTo + +horizon.HorizonDepthFrom) / 2;
            const promise = this.getProfileConcentrationData(
              horizon.HorizonId,
              param
            ).then((data) => {
              if (data[0] != "" && data.length != 0) {
                const arr = [
                  horizon.elevation,
                  +data[0],
                  +horizon.HorizonDepthFrom,
                  +horizon.HorizonDepthTo,
                ]; // xy
                trace.push(arr);
              }
            });
            promises.push(promise);
          }
          await Promise.all(promises);
          trace.sort(function (a, b) {
            return a[2] - b[2];
          });
          const x = trace.map((point) => point[0]); // horizontal
          const y = trace.map((point) => point[1]); // vertical
          if (x.length != 0 && y.length != 0)
            data.push({
              x: y,
              y: x,
              type: "scatter",
              mode: "lines+markers",
              line: {
                width: 1.2,
              },
              marker: {
                size: 5,
              },
              name: `Разрез №${this.chartData[i].ProfileNumber}`,
            });
        }
        //console.log(data);
        this.dataset.push(data);
      }
    },
  },
};
</script>

<style scoped>
.title {
  display: flex;
  justify-content: center;
}
.chart {
  max-width: 600px;
  max-height: 510px;
  display: flex;
  justify-content: center;
}
</style>
