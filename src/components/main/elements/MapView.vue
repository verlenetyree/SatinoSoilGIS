<template>
  <v-container class="fill-height" fluid>
    <v-row justify="start" class="fill-height">
      <v-col cols="3">
        <div ref="sidebar-root" class="mt-3">
          <v-card variant="outlined" class="cardStyle py-2 px-2 mx-n2">
            <div class="d-flex flex-wrap">
              <v-select
                v-model="parameter"
                :menu-props="{ style: { fontSize: '13px' } }"
                class="mx-1"
                label="Показатель"
                density="compact"
                color="deep-purple accent-4"
                :items="['pH', 'Fe_Moist', 'Fe_Dry', 'Moisture']"
                variant="outlined"
              ></v-select>
            </div>
            <div class="mt-n2">
              <div
                class="font-weight-light ml-2"
                style="font-size: 12px; color: #757575"
              >
                Глубина, см
              </div>
              <v-slider
                v-model="depth"
                color="deep-purple accent-4"
                density="compact"
                step="1"
                max="200"
                thumb-label
              ></v-slider>
            </div>
            <div class="ml-1 mt-n1">
              <v-btn
                :disabled="parameter == '' || depth == ''"
                variant="outlined"
                color="deep-purple accent-4"
                density="comfortable"
                id="colorConcentrationPointsButton"
                >Отобразить
              </v-btn>
              <v-btn
                class="ml-3 mr-12"
                variant="flat"
                icon="mdi-close"
                color="deep-purple accent-4"
                size="x-small"
              ></v-btn>
              <!--<v-tooltip v-model="show" location="top">
                <template v-slot:activator="{ props }">-->
              <v-btn
                v-bind="props"
                variant="flat"
                color="deep-purple accent-4"
                icon="mdi-eye-off"
                size="x-small"
                style="position: absolute; right: 10px"
              ></v-btn>
              <!--</template>
                <span>Скрыть знaчения "Нет данных"</span>
              </v-tooltip>-->
            </div>
          </v-card>
          <p
            class="mx-2 mt-3 text-caption font-weight-medium"
            v-if="showLegend"
          >
            {{ addLegendCaption }}
          </p>
          <div class="mt-3" id="legend"></div>
          <!--<v-btn
            class="ml-n2 mt-5"
            variant="outlined"
            color="deep-purple accent-4"
            density="comfortable"
            id="colorConcentrationPointsButton"
            @click="showMapDialog = true"
          >
            Добавить фильтр
          </v-btn>
          <FilterDialog
            :showMapDialog="showMapDialog"
            @close="showMapDialog = false"
          />-->
          <!--<v-card> </v-card>-->
        </div>
      </v-col>
      <v-col>
        <div
          ref="map-root"
          id="map-root"
          class="h-100 w-100 mt-3"
          style="height: 87vh"
        ></div>

        <div class="mapButtons d-flex justify-end" id="basemapsButton" fluid>
          <v-btn
            :icon="basemaps[selectedBasemap].icon"
            color="deep-purple accent-4"
          >
          </v-btn>
        </div>
        <div class="mapButtons d-flex justify-end" id="themeButton" fluid>
          <v-btn
            v-if="!selectedBasemap"
            :rounded="true"
            color="deep-purple accent-4"
            icon="mdi-theme-light-dark"
            :variant="selectedTheme ? 'outlined' : 'elevated'"
            :class="selectedTheme ? 'darkStyle' : ''"
          >
            <v-icon dark>mdi-theme-light-dark</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import * as d3 from "d3";
import * as ss from "simple-statistics";
import View from "ol/View";
import Map from "ol/Map";
// eslint-disable-next-line
import { Style, Stroke, Fill, Circle } from "ol/style";
import {
  Tile as TileLayer,
  // eslint-disable-next-line
  Vector as VectorLayer,
  Group,
  // eslint-disable-next-line
  WebGLPoints as WebGLPointsLayer,
} from "ol/layer";
import { Control, ScaleLine, defaults as defaultControls } from "ol/control.js";
//import { ScaleLine, defaults as defaultControls } from "ol/control.js";
import { OSM, XYZ, Vector as VectorSource } from "ol/source";
import { GeoJSON } from "ol/format";
// eslint-disable-next-line
import colormap from "colormap";
// eslint-disable-next-line
import chroma from "chroma-js";

//import LegendControl from "ol-ext/control/Legend";
//import Legend from "ol-ext/legend/Legend";

import "ol/ol.css";

import { transform } from "ol/proj.js";

//import FilterDialog from "@/components/main/elements/comps/FilterDialog.vue";

export default {
  name: "MapView",
  //components: { FilterDialog },
  props: {},
  //el: "#layers",
  data() {
    return {
      parameter: "",
      depth: 15,
      sliderDepth: 100,
      selectedBasemap: 0,
      selectedTheme: 0,
      showMapDialog: false,
      showLegend: false,
      basemaps: [
        { title: "OpenTopoMap", icon: "mdi-space-station" },
        { title: "WorldImagery", icon: "mdi-map" },
      ],
      themes: [{ title: "Light" }, { title: "Dark" }],
      general: [
        "ContoursAdd",
        "ContoursBasic",
        "ForestBorders",
        "GeoPoints",
        "LandParcels",
        "ReliefBreaks",
        "ReliefTalwegs",
        "ReliefTalwegs3D",
        "Roads",
        "WaterLine",
        "WaterPolygon",
      ],
      thematic: [
        "LandscapeTypes",
        "LandUse",
        "MicroClimateTypes",
        "Processes",
        "QDeposit",
        "RelTypes",
        "SoilsDamaged",
        "SoilsPaleo",
        "SoilTypes",
        "VegTypes",
      ],
      others: ["DEM"],
    };
  },
  setup() {
    const api = window.api;

    async function extractAllProfileCoords() {
      let data = await api.extractAllProfileCoords();
      //let data = await api.extractAllHorizonsConcentrationData(columnName);

      return data;
    }
    async function extractAllHorizonsConcentrationData(param) {
      let columnName = "Horizon" + param;
      let data = await api.extractAllHorizonsConcentrationData(columnName);

      return data;
    }

    return {
      extractAllHorizonsConcentrationData,
      extractAllProfileCoords,
    };
  },
  mounted() {
    this.extractAllProfileCoords().then((points) => {
      // BASEMAPS
      const rasterOSM = new TileLayer({
        title: "OpenTopoMap",
        type: "base",
        visible: true,
        source: new OSM({
          url: "https://{a-c}.tile.opentopomap.org/{z}/{x}/{y}.png",
        }),
      });

      const rasterImagery = new TileLayer({
        title: "WorldImagery",
        type: "base",
        visible: false,
        source: new XYZ({
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        }),
      });

      const baseLayersGroup = new Group({
        layers: [rasterOSM, rasterImagery],
      });

      const vectorLayersGroup = new Group({
        layers: [],
      });

      const baseLayersElements = document.getElementById("basemapsButton");
      baseLayersElements.addEventListener("click", () => {
        this.selectedBasemap = this.selectedBasemap == 0 ? 1 : 0;
        let id = this.selectedBasemap;
        let basemapElementValue = this.basemaps[id].title;
        baseLayersGroup.getLayers().forEach((element) => {
          let basemapTitle = element.get("title");
          element.setVisible(basemapTitle === basemapElementValue);
        });
      });

      const themeElements = document.getElementById("themeButton");
      themeElements.addEventListener("click", () => {
        this.selectedTheme = this.selectedTheme == 0 ? 1 : 0;
        let id = this.selectedTheme;
        if (id) {
          document.querySelector("canvas").style.filter =
            "grayscale(30%) brightness(65%)";
        } else {
          document.querySelector("canvas").style.filter = "";
        }
      });

      //function sequence(min, max, step) {
      //  const arr = [];

      //  for (let i = min; i < max; i += step) {
      //    arr.push(+i.toFixed(3));
      //  }

      //  return arr;
      //}

      function refreshLayer(newStyle) {
        map.removeLayer(pointsLayer); // remove the old layer
        const newLayer = new WebGLPointsLayer({
          // create a new layer with the updated style
          source: pointsSource,
          style: newStyle,
        });
        map.addLayer(newLayer); // add the new layer to the map
        pointsLayer = newLayer; // update the variable pointsLayer with the new layer
      }

      function interpolateValueAtDepth(data, depth) {
        const nullLessData = [];
        for (let d of data) {
          if (d.value !== null) {
            nullLessData.push({ depth: d.depth, value: +d.value });
          }
        }
        if (nullLessData.length) {
          // Case when depth is shallowest
          if (depth == nullLessData[0].depth) {
            return nullLessData[0].value;
          }
          if (depth < nullLessData[0].depth) {
            return -1;
          }

          // Case when depth is deepest
          if (depth == nullLessData[nullLessData.length - 1].depth) {
            return nullLessData[nullLessData.length - 1].value;
          }
          if (depth > nullLessData[nullLessData.length - 1].depth) {
            return -1;
          }

          // Find the index of the first depth greater than the given depth
          const upperIndex = nullLessData.findIndex((d) => d.depth > depth);

          // Points for interpolation are the one greater and one smaller than depth
          const lowerPoint = nullLessData[upperIndex - 1];
          const upperPoint = nullLessData[upperIndex];

          // Interpolate the value based on the two points
          return (
            lowerPoint.value +
            ((depth - lowerPoint.depth) /
              (upperPoint.depth - lowerPoint.depth)) *
              (upperPoint.value - lowerPoint.value)
          );
        } else {
          return -1;
        }
      }

      const colorConcentrationPoint = document.getElementById(
        "colorConcentrationPointsButton"
      );

      colorConcentrationPoint.addEventListener("click", () => {
        let columnName = "Horizon" + this.parameter;
        const keys = pointsLayer.getSource().getFeatures()[0].getKeys();
        console.log(keys.indexOf(columnName));

        this.extractAllHorizonsConcentrationData(this.parameter).then(
          (data) => {
            const allvalues = data
              .map((obj) => obj[columnName].map((item) => +item.value))
              .flat()
              .filter((item) => item != null);

            console.log(allvalues);

            let features = pointsLayer.getSource().getFeatures();

            for (let i = 0; i < features.length; i++) {
              let jsonFeature = data.find(function (rec) {
                return rec.ProfileId === features[i].get("ProfileId");
              });
              let displayValue = interpolateValueAtDepth(
                jsonFeature[columnName],
                this.depth
              );
              //console.log(jsonFeature[columnName]);

              features[i].setProperties({ displayFeature: displayValue });
              features[i].setProperties({
                [columnName]: jsonFeature[columnName],
              });
            }

            if (this.parameter == "pH") {
              let pHConcentrationPointsStyle = {
                symbol: {
                  symbolType: "circle",
                  size: 10,
                  color: [
                    "interpolate",
                    ["linear"],
                    ["get", "displayFeature"],
                    -1,
                    "#959595",
                    0,
                    "#db0b31",
                    1,
                    "#ec6d1c",
                    2,
                    "#fcc306",
                    3,
                    "#fcdd00",
                    4,
                    "#eff0bc",
                    5,
                    "#dde389",
                    6,
                    "#bacf32",
                    7,
                    "#98c11d",
                    8,
                    "#6bb97b",
                    9,
                    "#83ceeb",
                    10,
                    "#37bced",
                    11,
                    "#1d9ad6",
                    12,
                    "#0070ab",
                    13,
                    "#004980",
                    14,
                    "#191629",
                  ],
                  rotateWithView: false,
                  offset: [0, 0],
                  opacity: [
                    "interpolate",
                    ["linear"],
                    ["get", "displayFeature"],
                    -1,
                    0,
                    0,
                    0.92,
                  ],
                },
              };
              refreshLayer(pHConcentrationPointsStyle);
              const dataLegeng = [
                {
                  value: "0",
                  color: "#db0b31",
                },
                {
                  value: 1,
                  color: "#ec6d1c",
                },
                {
                  value: 2,
                  color: "#fcc306",
                },
                {
                  value: 3,
                  color: "#fcdd00",
                },
                {
                  value: 4,
                  color: "#eff0bc",
                },
                {
                  value: 5,
                  color: "#dde389",
                },
                {
                  value: 6,
                  color: "#bacf32",
                },
                {
                  value: 7,
                  color: "#98c11d",
                },
                {
                  value: 8,
                  color: "#6bb97b",
                },
                {
                  value: 9,
                  color: "#83ceeb",
                },
                {
                  value: 10,
                  color: "#37bced",
                },
                {
                  value: 11,
                  color: "#1d9ad6",
                },
                {
                  value: 12,
                  color: "#0070ab",
                },
                {
                  value: 13,
                  color: "#004980",
                },
                {
                  value: 14,
                  color: "#191629",
                },
              ];
              this.addLegend(dataLegeng);
            } else {
              const breaks = ss.ckmeans(allvalues, 6).map((arr) => arr[0]);

              console.log(breaks);
              if (this.parameter == "Moisture") {
                let ConcentrationPointsStyle = {
                  symbol: {
                    symbolType: "circle",
                    size: 10,
                    color: [
                      "interpolate",
                      ["linear"],
                      ["get", "displayFeature"],
                      -1,
                      "#959595",
                      0,
                      "#eef9f6",
                      breaks[1],
                      "#b7d4d8",
                      breaks[2],
                      "#85b6cd",
                      breaks[3],
                      "#0070ab",
                      breaks[4],
                      "#004980",
                      breaks[5],
                      "#7621b9",
                    ],
                    rotateWithView: false,
                    offset: [0, 0],
                    opacity: [
                      "interpolate",
                      ["linear"],
                      ["get", "displayFeature"],
                      -1,
                      0,
                      0,
                      0.92,
                    ],
                  },
                };
                refreshLayer(ConcentrationPointsStyle);
                const dataLegeng = [
                  {
                    value: "0",
                    color: "#eef9f6",
                  },
                  {
                    value: breaks[1],
                    color: "#b7d4d8",
                  },
                  {
                    value: breaks[2],
                    color: "#85b6cd",
                  },
                  {
                    value: breaks[3],
                    color: "#0070ab",
                  },
                  {
                    value: breaks[4],
                    color: "#004980",
                  },
                  {
                    value: breaks[5],
                    color: "#7621b9",
                  },
                ];
                this.addLegend(dataLegeng);
              } else {
                let ConcentrationPointsStyle = {
                  symbol: {
                    symbolType: "circle",
                    size: 10,
                    color: [
                      "interpolate",
                      ["linear"],
                      ["get", "displayFeature"],
                      -1,
                      "#959595",
                      0,
                      "#fffdbc",
                      breaks[1],
                      "#ffe674",
                      breaks[2],
                      "#f1c421",
                      breaks[3],
                      "#ed8d49",
                      breaks[4],
                      "#ed6449",
                      breaks[5],
                      "#b8125c",
                    ],
                    rotateWithView: false,
                    offset: [0, 0],
                    opacity: [
                      "interpolate",
                      ["linear"],
                      ["get", "displayFeature"],
                      -1,
                      0,
                      0,
                      0.92,
                    ],
                  },
                };
                refreshLayer(ConcentrationPointsStyle);
                const dataLegeng = [
                  {
                    value: "0",
                    color: "#fffdbc",
                  },
                  {
                    value: breaks[1],
                    color: "#ffe674",
                  },
                  {
                    value: breaks[2],
                    color: "#f1c421",
                  },
                  {
                    value: breaks[3],
                    color: "#ed8d49",
                  },
                  {
                    value: breaks[4],
                    color: "#ed6449",
                  },
                  {
                    value: breaks[5],
                    color: "#b8125c",
                  },
                ];
                this.addLegend(dataLegeng);
              }
            }
          }
        );
      });

      const scaleControl = new ScaleLine({
        bar: true,
        steps: 4,
        text: true,
        minWidth: 140,
      });

      const basemapsControl = new Control({
        element: document.getElementById("basemapsButton"),
      });

      const themeControl = new Control({
        element: document.getElementById("themeButton"),
      });

      const map = new Map({
        controls: defaultControls({ attribution: false, zoom: false }).extend([
          scaleControl,
          basemapsControl,
          themeControl,
        ]),
        target: this.$refs["map-root"],
        layers: [baseLayersGroup, vectorLayersGroup],
        view: new View({
          center: transform([36.382177, 55.207178], "EPSG:4326", "EPSG:3857"),
          zoom: 14,
          //minZoom: 9,
          constrainResolution: true,
        }),
      });

      //const defaultPointsStyle = new Style({
      //  image: new Circle({
      //    radius: 4,
      //    fill: new Fill({
      //      color: "rgba(179, 136, 255, 0.6)",
      //    }),
      //    stroke: new Stroke({
      //      color: "#6200EA",
      //      width: 1,
      //    }),
      //  }),
      //  cursor: "pointer",
      //});

      //const initialStyle = {
      //  symbol: {
      //    symbolType: "circle",
      //    size: 10,
      //    color: "rgb(179, 136, 255)",
      //    opacity: 0.6,
      //  },
      //};

      const pointsSource = new VectorSource({
        features: new GeoJSON({
          defaultDataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }).readFeatures(points),
      });

      let pointsLayer = new WebGLPointsLayer({
        source: pointsSource,
        style: {
          symbol: {
            symbolType: "circle",
            size: 10,
            color: "#959595",
            opacity: 0.6,
          },
        },
        title: "Points",
        visible: true,
      });

      const layers = [pointsLayer];
      const vectorLayersCollection = vectorLayersGroup.getLayers();
      for (let lyr of layers) {
        vectorLayersCollection.push(lyr);
      }

      const extent = pointsLayer.getSource().getExtent();
      map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 14 });

      //map.on("postcompose", function () {
      //  document.querySelector("canvas").style.filter =
      //    "grayscale(30%) brightness(65%)";
      //});
    });
  },
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
    async colorMapData() {
      const data = await this.getConcentrationInDepth(
        this.parameter,
        this.depth
      );
      console.log(data);
    },
    addLegend(data) {
      var extent = d3.extent(data, (d) => d.value);

      var padding = 9;
      var width = 300;
      var innerWidth = width - padding * 2;
      var barHeight = 8;
      var height = 28;

      var xScale = d3.scaleLinear().range([0, innerWidth]).domain(extent);

      var xTicks = data.filter((f) => f.value).map((d) => d.value);

      var xAxis = d3
        .axisBottom(xScale)
        .tickSize(barHeight * 2)
        .tickValues(xTicks);

      d3.select("#legend svg").remove();

      var svg = d3
        .select("#legend")
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);
      var g = svg
        .append("g")
        .attr("transform", "translate(" + padding + ", 0)");

      var defs = svg.append("defs");
      var linearGradient = defs
        .append("linearGradient")
        .attr("id", "myGradient");
      linearGradient
        .selectAll("stop")
        .data(data)
        .enter()
        .append("stop")
        .attr(
          "offset",
          (d) => ((d.value - extent[0]) / (extent[1] - extent[0])) * 100 + "%"
        )
        .attr("stop-color", (d) => d.color);

      g.append("rect")
        .attr("width", innerWidth)
        .attr("height", barHeight)
        .style("fill", "url(#myGradient)");

      g.append("g").call(xAxis).select(".domain").remove();
      this.showLegend = true;
    },
  },
  computed: {
    addLegendCaption() {
      let depthstr = this.depth + " см";
      switch (this.parameter) {
        case "pH":
          return `pH (${depthstr})`;
        case "Fe_Moist":
          return `FeO, мг на 100г влажной почвы (${depthstr})`;
        case "Fe_Dry":
          return `FeO, мг на 100г сухой почвы (${depthstr})`;
        case "Moisture":
          return `Влажность, % (${depthstr})`;
      }
      return "";
    },
  },
};
</script>

<style scoped>
.mapButtons {
  padding: 6px;
}
.sidebar-open {
  transform: translateX(0);
}

.sidebar-closed {
  transform: translateX(-100%);
}

.sidebar-root {
  transition: transform 0.5s;
}

#basemapsButton {
  justify-content: flex-end;
}

.basemapsMenuList {
  width: 165px;
}
.cardStyle {
  border-color: #d1c4e9;
}
.darkStyle {
  background-color: rgba(256, 256, 256, 0.7);
}
.darkStyle .v-icon {
  color: #6200ea;
}
</style>
