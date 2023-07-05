<template>
  <v-container>
    <div ref="documentRadial">
      <v-row no-gutters justify="center" align-content="center">
        <v-col cols="8" align-self="center">
          <div id="element-to-convert" ref="elementToConvert">
            <h3 class="title">
              Коэффициенты латеральной дифференциации средневзвешенных по
              разрезам концентраций химических элементов относительно разреза в
              автономной позиции на профиле номер
              {{ this.chartData[0].ProfileGroupId }}
            </h3>
            <div>
              <v-row no-gutters justify="center" align-content="center">
                <v-col
                  class="colstyle"
                  align-self="center"
                  v-if="dataset[0] !== undefined && dataset[0].length"
                >
                  <div id="Si" class="chart"></div>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" align-content="center">
                <v-col
                  class="colstyle"
                  align-self="center"
                  v-if="dataset[1] !== undefined && dataset[1].length"
                >
                  <div id="Ca" class="chart"></div>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" align-content="center">
                <v-col
                  class="colstyle"
                  align-self="center"
                  v-if="dataset[2] !== undefined && dataset[2].length"
                >
                  <div id="Al" class="chart"></div>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" align-content="center">
                <v-col
                  class="colstyle"
                  align-self="center"
                  v-if="dataset[3] !== undefined && dataset[3].length"
                >
                  <div id="Mn" class="chart"></div>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" align-content="center">
                <v-col
                  class="colstyle"
                  align-self="center"
                  v-if="dataset[4] !== undefined && dataset[4].length"
                >
                  <div id="Fe" class="chart"></div>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" align-content="center">
                <v-col
                  class="colstyle"
                  align-self="center"
                  v-if="dataset[5] !== undefined && dataset[5].length"
                >
                  <div id="Zn" class="chart"></div>
                </v-col>
              </v-row>
              <v-row no-gutters justify="center" align-content="center">
                <v-col
                  class="colstyle"
                  align-self="center"
                  v-if="dataset[6] !== undefined && dataset[6].length"
                >
                  <div id="Pb" class="chart"></div>
                </v-col>
              </v-row>
            </div>
            <h3 class="title mt-10">
              Коэффициенты латеральной дифференциации по гумусовым горизонтам на
              профиле номер {{ this.chartData[0].ProfileGroupId }}
            </h3>
            <v-row no-gutters justify="center" align-content="center">
              <v-col
                class="colstyle"
                align-self="center"
                v-if="dataset[0] !== undefined && dataset[0].length"
              >
                <div id="Si_L2" class="chart"></div>
              </v-col>
            </v-row>
            <v-row no-gutters justify="center" align-content="center">
              <v-col
                class="colstyle"
                align-self="center"
                v-if="dataset[1] !== undefined && dataset[1].length"
              >
                <div id="Ca_L2" class="chart"></div>
              </v-col>
            </v-row>
            <v-row no-gutters justify="center" align-content="center">
              <v-col
                class="colstyle"
                align-self="center"
                v-if="dataset[2] !== undefined && dataset[2].length"
              >
                <div id="Al_L2" class="chart"></div>
              </v-col>
            </v-row>
            <v-row no-gutters justify="center" align-content="center">
              <v-col
                class="colstyle"
                align-self="center"
                v-if="dataset[3] !== undefined && dataset[3].length"
              >
                <div id="Mn_L2" class="chart"></div>
              </v-col>
            </v-row>
            <v-row no-gutters justify="center" align-content="center">
              <v-col
                class="colstyle"
                align-self="center"
                v-if="dataset[4] !== undefined && dataset[4].length"
              >
                <div id="Fe_L2" class="chart"></div>
              </v-col>
            </v-row>
            <v-row no-gutters justify="center" align-content="center">
              <v-col
                class="colstyle"
                align-self="center"
                v-if="dataset[5] !== undefined && dataset[5].length"
              >
                <div id="Zn_L2" class="chart"></div>
              </v-col>
            </v-row>
            <v-row no-gutters justify="center" align-content="center">
              <v-col
                class="colstyle"
                align-self="center"
                v-if="dataset[6] !== undefined && dataset[6].length"
              >
                <div id="Pb_L2" class="chart"></div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col>
          <div class="controller ml-5">
            <v-card style="height: 87vh" elevation="3">
              <div ref="map-root" class="pa-2" style="height: 35vh"></div>

              <div
                class="mapButtons d-flex justify-end"
                id="basemapsButton"
                fluid
              >
                <v-btn
                  :icon="basemaps[selectedBasemap].icon"
                  color="deep-purple accent-4"
                >
                </v-btn>
              </div>
              <div class="px-2" id="profilechart"></div>
              <div id="draggy">
                <v-row>
                  <v-col>
                    <v-row class="mt-2 ml-3 mb-1">
                      <p class="drag-title font-weight-medium mb-2">
                        Разрезы на профиле
                      </p>
                      <v-btn
                        class="ml-2 mt-1"
                        color="deep-purple accent-4"
                        size="small"
                        density="compact"
                        icon="mdi-refresh"
                        variant="text"
                        @click="
                          initGeoChartData();
                          handleChange();
                        "
                      ></v-btn>
                    </v-row>
                    <draggable
                      v-if="geoChartData.length"
                      class="list-group"
                      ghost-class="ghost"
                      v-model="geoChartData"
                      v-bind="dragOptions"
                      @start="drag = true"
                      @end="drag = false"
                      item-key="ProfileId"
                    >
                      <template #item="{ element }">
                        <li class="list-group-item pl-5 mx-5">
                          <i aria-hidden="true"></i>
                          {{ element.ProfileNumber }}
                          <v-btn
                            class="list-item-button"
                            color="deep-purple accent-4"
                            density="compact"
                            size="x-small"
                            icon="mdi-close-circle-outline"
                            variant="tonal"
                            @click="removeProfile(element)"
                          ></v-btn>
                          <v-radio
                            class="list-item-checkbox"
                            density="compact"
                            size="x-small"
                            variant="tonal"
                            color="deep-purple accent-4"
                            :model-value="element.is_auto"
                            @click="updateAuto(element)"
                          ></v-radio>
                          <!--@click="updateAuto(element)"-->
                        </li>
                      </template>
                    </draggable>
                    <!--</v-radio-group>-->
                  </v-col>
                  <v-col>
                    <v-row class="mt-2 ml-3 mb-1">
                      <p class="drag-title font-weight-medium mb-2">
                        Скрытые разрезы
                      </p>
                    </v-row>
                    <draggable
                      v-if="geoChartData.length"
                      class="list-group"
                      ghost-class="ghost"
                      v-model="geoChartDataRemoved"
                      v-bind="dragOptions"
                      @start="drag = true"
                      @end="drag = false"
                      item-key="ProfileId"
                    >
                      <template #item="{ element }">
                        <li class="list-group-item pl-5 mx-5">
                          <i aria-hidden="true"></i>
                          {{ element.ProfileNumber }}
                        </li>
                      </template>
                    </draggable>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </div>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script>
import Plotly from "plotly.js-dist-min";
import html2pdf from "html2pdf.js";

import * as d3 from "d3";

import View from "ol/View";
import Map from "ol/Map";

import { Style, Stroke, Fill, Circle, Text } from "ol/style";

import { Tile as TileLayer, Vector as VectorLayer, Group } from "ol/layer";
import WebGLTileLayer from "ol/layer/WebGLTile.js";
import { Control, ScaleLine, defaults as defaultControls } from "ol/control.js";

import {
  OSM,
  XYZ,
  Vector as VectorSource,
  GeoTIFF as GeoTIFFSource,
} from "ol/source";

import { GeoJSON } from "ol/format";
import { transform } from "ol/proj.js";
import haversine from "haversine-distance";
import draggable from "vuedraggable";

export default {
  components: { draggable },
  props: {
    chartData: { type: Array, required: true },
    callExport: { type: Boolean, required: true },
  },
  data() {
    return {
      L_values: [],
      sosages: [],
      sosages_L2: [],
      dataset: [],
      params: ["Si", "Ca", "Al", "Mn", "Fe", "Zn", "Pb"],
      selectedBasemap: 0,
      basemaps: [
        { title: "OpenTopoMap", icon: "mdi-space-station" },
        { title: "WorldImagery", icon: "mdi-map" },
      ],
      drawProfileCurve: true,
      geoChartData: [],
      geoChartDataRemoved: [],
      profileData: [],
      drag: false,
    };
  },
  setup() {
    const api = window.api;

    async function getSatinoDEM() {
      let data = await api.getSatinoDEM();

      return data;
    }

    async function getProfileConcentrationData(HorizonId, param) {
      let columnName = "Horizon" + param;
      let data = await api.getProfileConcentrationData(columnName, HorizonId);

      return data;
    }

    return { getSatinoDEM, getProfileConcentrationData };
  },
  mounted() {
    const {
      chartData,
      missingGeomtry,
      getSatinoDEM,
      createProfileData,
      buildProfileChart,
      initGeoChartData,
    } = this;

    let { drawProfileCurve, drawCharts } = this;

    let mapData = chartData;

    function createProfileVectorLayer() {
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      for (let i = 0; i < mapData.length; i++) {
        if (!(mapData[i].Lon == "" && mapData[i].Lat == "")) {
          const feature = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [mapData[i].Lon, mapData[i].Lat],
            },
            properties: {
              ProfileId: mapData[i].ProfileId,
              ProfileNumber: +mapData[i].ProfileNumber,
            },
          };
          geojson.features.push(feature);
        } else {
          missingGeomtry.push(mapData[i].ProfileId);
        }
      }

      const vectorSource = new VectorSource({
        crossOrigin: "anonymous",
        features: new GeoJSON({
          dataProjection: "EPSG:4326",
          featureProjection: "EPSG:3857",
        }).readFeatures(geojson),
      });

      function getText(feature) {
        return feature.get("ProfileNumber").toString();
      }

      function crateVectorLayerStyle(feature) {
        return new Style({
          image: new Circle({
            radius: 8,
            fill: new Fill({
              color: "rgba(179, 136, 255, 0.6)",
            }),
            stroke: new Stroke({
              color: "#6200EA",
              width: 1.2,
            }),
          }),
          text: new Text({
            text: getText(feature),
            justify: "center",
            font: "bold 10px Avenir, sans-serif",
            offsetY: +1,
            fill: new Fill({
              color: "#6200EA",
            }),
          }),
          cursor: "pointer",
        });
      }

      const vectorLayer = new VectorLayer({
        source: vectorSource,
        style: crateVectorLayerStyle,
      });
      return vectorLayer;
    }

    async function createDEMLayer() {
      let data = await getSatinoDEM();

      const demSource = new GeoTIFFSource({
        normalize: false,
        crossOrigin: "anonymous",
        sources: [
          {
            crossOrigin: "anonymous",
            blob: new Blob([data.buffer]),
            min: 132.583,
            max: 206.407,
          },
        ],
      });

      let demLayer = new WebGLTileLayer({
        source: demSource,
        visible: true,
        opacity: 0,
      });
      return demLayer;
    }

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

    const scaleControl = new ScaleLine({
      bar: true,
      steps: 4,
      text: true,
      minWidth: 140,
    });

    const basemapsControl = new Control({
      element: document.getElementById("basemapsButton"),
    });

    const map = new Map({
      controls: defaultControls({ attribution: false, zoom: false }).extend([
        scaleControl,
        basemapsControl,
      ]),
      target: this.$refs["map-root"],
      layers: [baseLayersGroup],
      view: new View({
        center: transform([36.382177, 55.207178], "EPSG:4326", "EPSG:3857"),
        zoom: 14,
        //minZoom: 9,
        constrainResolution: true,
      }),
    });

    const mapDatavL = createProfileVectorLayer();

    async function completeRender() {
      initGeoChartData();
      createProfileData();
      buildProfileChart();
      drawCharts();
    }

    map.addLayer(mapDatavL);
    createDEMLayer().then(
      function (demLayer) {
        map.addLayer(demLayer);

        map.on("rendercomplete", function () {
          let features = mapDatavL.getSource().getFeatures();

          for (let i = 0; i < features.length; i++) {
            if (features[i].getProperties().elevation === undefined) {
              getHeightValuesOnProfiles(demLayer, features[i]);
            }
          }
          if (drawProfileCurve) {
            mapData.sort((a, b) => {
              return +a.ProfileNumber - +b.ProfileNumber;
            });
            completeRender();

            drawProfileCurve = false;
          }
        });
      },
      function (error) {
        console.log("error", error);
      }
    );

    map.on("click", function (e) {
      const feature = map.forEachFeatureAtPixel(e.pixel, (feature) => feature);
      if (feature) {
        //console.log(feature.get("ProfileNumber"));
      }
    });

    map.on("pointermove", function (e) {
      let pixel = map.getEventPixel(e.originalEvent);
      // eslint-disable-next-line
      let hit = map.forEachFeatureAtPixel(pixel, function (feature, layer) {
        return true;
      });
      if (hit) {
        map.getTargetElement().style.cursor = "pointer";
      } else {
        map.getTargetElement().style.cursor = "";
      }
    });

    const extent = mapDatavL.getSource().getExtent();
    map.getView().fit(extent, { padding: [25, 25, 25, 25], maxZoom: 14 });

    function getHeightValuesOnProfiles(demLayer, feature) {
      const coords = feature.getGeometry().getCoordinates();
      const pixel = map.getPixelFromCoordinate(coords);
      const elevation = demLayer.getData(pixel)[0];
      feature.setProperties({ elevation: elevation });
      for (let rec of mapData) {
        if (feature.getProperties().ProfileId === rec.ProfileId) {
          rec.elevation = elevation;
        }
      }
    }
  },
  watch: {
    callExport() {
      if (this.$props.callExport) {
        this.exportToPDF();
      }
    },
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: "description",
        disabled: false,
        ghostClass: "ghost",
        onChange: this.handleChange,
      };
    },
  },
  methods: {
    exportToPDF() {
      //let element = html2pdf(document.getElementById("element-to-convert"));
      const element = this.$refs.elementToConvert;
      var opt = {
        margin: 0,
        filename: `lateral-${this.chartData[0].ProfileYear}-${this.chartData[0].ProfileGroupId}-${this.chartData[0].ProfileRepeat}.pdf`,
        //pagebreak: { mode: ["avoid-all", "css", "legacy"] },
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
      this.sosages = [];
      this.sosages_L2 = [];

      for (let param of this.params) {
        const data = [];
        for (let i = 0; i < this.geoChartData.length; i++) {
          const trace = [];
          const promises = [];
          for (let horizon of this.geoChartData[i].horizons) {
            const promise = this.getProfileConcentrationData(
              horizon.HorizonId,
              param
            ).then((data) => {
              if (data[0] != "" && data.length != 0) {
                const arr = [
                  +horizon.HorizonDepthFrom,
                  +horizon.HorizonDepthTo,
                  +data[0],
                  horizon.HorizonSubtypeCode,
                ]; // xy
                trace.push(arr);
              }
            });
            promises.push(promise);
          }
          await Promise.all(promises);
          trace.sort(function (a, b) {
            return a[0] - b[0];
          });
          const from = trace.map((point) => point[0]);
          const to = trace.map((point) => point[1]);
          const x = trace.map((point) => point[2]);
          const code = trace.map((point) => point[3]);
          if (x.length != 0 && to.length != 0 && from.length != 0)
            data.push({
              raw: x,
              from: from,
              to: to,
              code: code,
              order: this.geoChartData[i].ProfileNumber,
              name: `Разрез №${this.geoChartData[i].ProfileNumber}`,
            });
        }
        this.dataset.push(data);
      }
      //console.log(this.chartData);
      //console.log(this.geoChartData);
      //console.log(this.dataset);
    },
    calculateL1() {
      const autos = this.geoChartData.map((profile) => {
        return profile.is_auto;
      });
      const autoId = autos.indexOf(true);
      for (let i = 0; i < this.params.length; i++) {
        if (this.dataset[i].length != 0) {
          let avWeighted = [];
          let profileNumbers = [];
          for (let j = 0; j < this.dataset[i].length; j++) {
            let profile = this.dataset[i][j];
            profile.raw__ = profile.raw.map(
              (val, id) => (profile.to[id] - profile.from[id]) * val
            );
            let sum = profile.raw__.reduce((sum, current) => sum + current, 0);
            profile.avWeighted = sum / profile.to[profile.to.length - 1];
            avWeighted.push(profile.avWeighted);
            profileNumbers.push(profile.order);
            //console.log(profile);
          }
          let L1 = avWeighted.map((val, id, arr) => {
            let rounded = Math.round((val / arr[autoId]) * 10) / 10;
            return rounded.toFixed(1);
          });
          let L1_top = avWeighted.map((val, id, arr) => val / arr[autoId] / 2);
          let L1_bot = avWeighted.map(
            (val, id, arr) => -(val / arr[autoId] / 2)
          );
          this.L_values.push(...L1_top);
          //this.chartScale[0] = Math.max(...L1_top);
          let data = [
            {
              y: L1_top,
              x: profileNumbers,
              text: L1,
              textposition: "outside",
              nbinsx: profileNumbers.length,
              //categoryarray: profileNumbers,
              type: "bar",
              //histfunc: "sum",
              //name: `Разрез №${this.geoChartData[i].ProfileNumber}`,
            },
            {
              y: L1_bot,
              x: profileNumbers,
              nbinsx: profileNumbers.length,
              //categoryarray: profileNumbers,
              type: "bar",
              //histfunc: "sum",
              //name: `Разрез №${this.geoChartData[i].ProfileNumber}`,
            },
          ];
          this.sosages.push(data);
          //console.log(L1_top);
        }
        //console.log(this.sosages);
      }
    },
    calculateL2() {
      const autos = this.geoChartData.map((profile) => {
        return profile.is_auto;
      });
      const autoId = autos.indexOf(true);
      for (let i = 0; i < this.params.length; i++) {
        if (this.dataset[i].length != 0) {
          let concentrA1 = [];
          let profileNumbers = [];
          for (let j = 0; j < this.dataset[i].length; j++) {
            let profile = this.dataset[i][j];
            if (profile.code != "A0") {
              profile.concentrA1 = profile.raw[0];
            } else {
              profile.concentrA1 = profile.raw[1];
            }
            concentrA1.push(profile.concentrA1);
            profileNumbers.push(profile.order);
          }
          //concentrA1[0];
          let L2 = concentrA1.map((val, id, arr) => {
            let rounded = Math.round((val / arr[autoId]) * 10) / 10;
            return rounded.toFixed(1);
          });
          let L2_top = concentrA1.map((val, id, arr) => val / arr[autoId] / 2);
          let L2_bot = concentrA1.map(
            (val, id, arr) => -(val / arr[autoId] / 2)
          );
          this.L_values.push(...L2_top);
          //this.chartScale[1] = Math.max(...L2_top);
          let data = [
            {
              y: L2_top,
              x: profileNumbers,
              text: L2,
              textposition: "outside",
              nbinsx: profileNumbers.length,
              type: "bar",
              //histfunc: "sum",
              //name: `Разрез №${this.geoChartData[i].ProfileNumber}`,
              marker: {
                color: "rgba(70, 102, 65, 0.9)",
              },
            },
            {
              y: L2_bot,
              x: profileNumbers,
              nbinsx: profileNumbers.length,
              type: "bar",
              //histfunc: "sum",
              //name: `Разрез №${this.geoChartData[i].ProfileNumber}`,
              marker: {
                color: "rgba(252, 81, 66, 0.9)",
              },
            },
          ];
          this.sosages_L2.push(data);
        }
      }
    },
    drawCharts() {
      this.addConcentrationData().then(() => {
        this.calculateL1();
        this.calculateL2();
        const scale = Math.max(...this.L_values) + 2.5;
        //console.log(scale);
        for (let i = 0; i < this.params.length; i++) {
          if (this.sosages[i].length != 0) {
            let layout = {
              autosize: false,
              uirevision: "true",
              width: 550,
              height: 140,
              margin: {
                l: 50,
                r: 25,
                b: 20,
                t: 0,
                pad: 4,
              },
              barmode: "overlay",
              bargap: 0.07,
              showlegend: false,
              title: {
                text: `${this.params[i]}`,
                font: { size: 13 },
                xanchor: "left",
                x: "0",
                y: "0.5",
                pad: { l: 5 },
              },
              xaxis: {
                type: "category",
                categoryorder: "array", // Prevent x axis sorting
                categoryarray: this.geoChartData.map(
                  (elem) => elem.ProfileNumber
                ),
                zeroline: false,
                dtick: 1,
                showline: false,
                titlefont: { size: 13 },
                tickfont: {
                  size: 10,
                },
              },
              yaxis: {
                range: [-scale, scale],
                dtick: scale / 3,
                zeroline: true,
                showline: false,
                showticklabels: false,
                titlefont: { size: 10 },
                tickfont: {
                  size: 10,
                },
              },
              legend: {
                font: { size: 10 },
              },
            };
            Plotly.newPlot(this.params[i], this.sosages[i], layout);
          }
        }

        for (let i = 0; i < this.params.length; i++) {
          if (this.sosages_L2[i].length != 0) {
            let layout = {
              autosize: false,
              uirevision: "true",
              width: 550,
              height: 140,
              margin: {
                l: 50,
                r: 25,
                b: 20,
                t: 0,
                pad: 4,
              },
              barmode: "overlay",
              bargap: 0.07,
              showlegend: false,
              title: {
                text: `${this.params[i]}`,
                font: { size: 13 },
                xanchor: "left",
                x: "0",
                y: "0.5",
                pad: { l: 5 },
              },
              xaxis: {
                type: "category",
                categoryorder: "array", // Prevent x axis sorting
                categoryarray: this.geoChartData.map(
                  (elem) => elem.ProfileNumber
                ),
                zeroline: false,
                dtick: 1,
                showline: false,
                titlefont: { size: 13 },
                tickfont: {
                  size: 10,
                },
              },
              yaxis: {
                range: [-scale, scale],
                dtick: scale / 3,
                zeroline: true,
                showline: false,
                showticklabels: false,
                titlefont: { size: 13 },
                tickfont: {
                  size: 10,
                },
              },
              legend: {
                font: { size: 10 },
              },
            };
            Plotly.newPlot(`${this.params[i]}_L2`, this.sosages_L2[i], layout);
          }
        }
      });
    },
    handleChange() {
      this.createProfileData();
      this.buildProfileChart();
      this.drawCharts();
    },
    removeProfile(element) {
      this.geoChartDataRemoved.push(element);
      let index = this.geoChartData.indexOf(element);
      this.geoChartData.splice(index, 1);
      this.handleChange();
      const autos = this.geoChartData.map((profile) => {
        return profile.is_auto;
      });
      if (autos.indexOf(true) == -1) {
        element.is_auto = false;
        this.setAuto();
      }
    },
    updateAuto(element) {
      const auto = element.ProfileId;
      for (let profile of this.geoChartData) {
        if (profile.ProfileId != auto) {
          profile.is_auto = false;
        }
        element.is_auto = true;
      }
      this.drawCharts();
    },
    initGeoChartData() {
      this.geoChartData = [];
      this.geoChartDataRemoved = [];

      for (let data of this.chartData) {
        if (data.Lat != "") {
          let elev = data.elevation;
          for (let horizon of data.horizons) {
            let currentHorizonHeight =
              ((+horizon.HorizonDepthTo + +horizon.HorizonDepthFrom) / 2) *
              this.coef;
            horizon.elevation = elev - currentHorizonHeight;
          }
          data.is_auto = false;
          this.geoChartData.push(data);
        }
      }
      this.geoChartData.sort((a, b) => {
        return +a.ProfileNumber - +b.ProfileNumber;
      });
      for (let data of this.geoChartData) {
        data.horizons.sort((a, b) => {
          return +a.HorizonDepthFrom - +b.HorizonDepthFrom;
        });
      }
      this.setAuto();
    },
    setAuto() {
      const elevations = this.geoChartData.map((profile) => {
        return profile.elevation;
      });
      const max = Math.max(...elevations);
      const autoId = elevations.indexOf(max);
      this.geoChartData[autoId].is_auto = true;
    },
    createProfileData() {
      this.profileData = [];
      let distance0 = 0;
      for (let i = 0; i < this.geoChartData.length; i++) {
        const data = {
          geometry: [this.geoChartData[i].Lon, this.geoChartData[i].Lat],
          elevation: this.geoChartData[i].elevation,
          ProfileNumber: +this.geoChartData[i].ProfileNumber,
        };
        if (i == 0) {
          data.distance = 0;
          data.distance0 = distance0;
        } else {
          data.distance = haversine(
            this.profileData[i - 1].geometry,
            data.geometry
          );
          distance0 = data.distance + distance0;
          data.distance0 = distance0;
        }
        this.profileData.push(data);
      }
      return;
    },
    buildProfileChart() {
      const margin = { top: 45, right: 0, bottom: 5, left: 30 };
      const width = 1000 + margin.left + margin.right;
      const height = 190 + margin.top + margin.bottom;

      const xScale = d3
        .scaleLinear()
        .domain([
          d3.min(this.profileData, (d) => d.distance0),
          d3.max(this.profileData, (d) => d.distance0) + 3,
        ])
        .range([0, width]);
      // eslint-disable-next-line
      const yScale = d3
        .scaleLinear()
        .domain([
          d3.min(this.profileData, (d) => d.elevation) - 10,
          d3.max(this.profileData, (d) => d.elevation) + 5,
        ])
        .range([height * 1, 0]);

      d3.select("#profilechart svg").remove();

      const svg = d3
        .select("#profilechart")
        .append("svg")
        .attr("viewBox", [0, 0, width + 48, height + 23])
        .append("g")
        .attr("transform", `translate(${margin.left}, 2.5)`);

      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale))
        .style("stroke-width", 1.3)
        .style("font-size", "15px");

      svg
        .append("g")
        .call(d3.axisLeft(yScale))
        .style("stroke-width", 1.3)
        .style("font-size", "15px");

      const area = d3
        .area()
        .x((d) => xScale(d.distance0))
        .y0(yScale(yScale.domain()[0]))
        .y1((d) => yScale(d.elevation))
        .curve(d3.curveCardinal.tension(0.75));

      svg
        .append("path")
        .attr("d", area(this.profileData))
        .attr("class", "chartLine")
        .style("stroke", "#6200ea")
        .style("stroke-opacity", 0.2)
        .style("stroke-width", 4)
        .style("fill", "#b388ff")
        .style("fill-opacity", 0.2);

      svg
        .selectAll("profilePoints")
        .data(this.profileData)
        .enter()
        .append("circle")
        .attr("fill", "#b388ff")
        .attr("stroke", "none")
        .attr("cx", function (d) {
          return xScale(d.distance0);
        })
        .attr("cy", function (d) {
          return yScale(d.elevation);
        })
        .attr("r", 2.8);

      svg
        .selectAll("profileLabels")
        .data(this.profileData)
        .enter()
        .append("text")
        .attr("x", function (d) {
          return xScale(d.distance0) + 3;
        })
        .attr("y", function (d) {
          return yScale(d.elevation) - 6;
        })
        .style("text-anchor", "middle")
        .style("font-size", "18px")
        .attr("fill", "#b388ff")
        .text(function (d) {
          return d.ProfileNumber;
        });
    },
  },
};
</script>

<style scoped>
.title {
  display: flex;
  justify-content: center;
  text-align: center;
}
.chart {
  max-width: 800px;
  max-height: 500px;
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
.colstyle {
  flex-grow: 0;
}
.controller {
  position: sticky;
  top: 80px;
}
.list-item-button {
  position: absolute;
  right: 5px;
  top: 0.3rem;
}
.list-item-checkbox {
  position: absolute;
  right: 25px;
  top: -0.1rem;
}
.v-selection-control__input input {
  height: 5px !important;
}
.list-group-item {
  height: 3vh;
  max-height: 30px;
  position: relative;
  display: block;
  cursor: move;
  padding: 0.25em 0.9rem;
  border: 1px solid rgba(230, 230, 230, 0.9);
  font-size: 12px;
}

.list-group-item + .list-group-item {
  border-top-width: 0;
}

.list-group-item:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}

.list-group-item:last-child {
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
}

.ghost {
  opacity: 0.5;
  background: #d1c4e9;
}
.list-group {
  min-height: 15px;
  width: 100%;
  flex-direction: column;
  justify-content: space-between;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0.25rem;
}
.list-group-item i {
  cursor: pointer;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.drag-title {
  font-size: 13px;
}
</style>
