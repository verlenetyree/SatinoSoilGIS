<template>
  <v-container class="container fill-height" fluid>
    <v-col cols="1"> </v-col>
    <v-col>
      <div ref="document">
        <div id="element-to-convert" ref="elementToConvert">
          <h3
            class="title print-only mb-5 mt-6"
            ref="title"
            style="display: none"
          >
            Расположение почвенных разрезов на профиле
            {{ this.mapData[0].ProfileGroupId }} с названиями почв в разных
            геохимических ландшафтах
          </h3>
          <v-row>
            <v-col cols="3">
              <v-row>
                <v-col>
                  <div
                    ref="map-root"
                    id="map"
                    class="d-flex justify-end"
                    style="height: 665px; max-width: 230px"
                  ></div>

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
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="9">
              <v-row class="ml-3">
                <v-col cols="12">
                  <div style="position: static" id="profilechart"></div>
                </v-col>
              </v-row>
              <v-row class="ml-3 mt-n11">
                <v-col cols="12">
                  <div style="position: reletive" id="profileinterpolate"></div>
                </v-col>
              </v-row>

              <v-row class="ma-3 mt-n6">
                <v-col cols="4">
                  <div data-html2canvas-ignore="true">
                    <v-row class="mt-3 ml-3 mb-1">
                      <p class="font-weight-medium mb-2">Разрезы на профиле</p>
                      <v-btn
                        class="ml-2 mt-1"
                        color="deep-purple accent-4"
                        size="small"
                        density="compact"
                        icon="mdi-refresh"
                        variant="text"
                        @click="
                          initGeoMapData();
                          handleChange();
                        "
                      ></v-btn>
                    </v-row>
                    <draggable
                      v-if="geoMapData.length"
                      class="list-group"
                      ghost-class="ghost"
                      v-model="geoMapData"
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
                        </li>
                      </template>
                    </draggable>
                  </div>
                </v-col>

                <v-col cols="4">
                  <div data-html2canvas-ignore="true">
                    <v-row class="mt-3 ml-3 mb-1 mt-n6">
                      <p class="font-weight-medium mt-8 mb-1">
                        Скрытые разрезы
                      </p>
                    </v-row>
                    <draggable
                      v-if="geoMapData.length"
                      class="list-group"
                      ghost-class="ghost"
                      v-model="geoMapDataRemoved"
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
                  </div>
                </v-col>

                <v-col>
                  <div class="mt-3" id="legend"></div>
                  <v-select
                    data-html2canvas-ignore="true"
                    v-model="parameter"
                    :menu-props="{ style: { fontSize: '13px' } }"
                    class="mx-1 mt-7"
                    label="Показатель"
                    density="compact"
                    color="deep-purple accent-4"
                    :items="['pH']"
                    variant="outlined"
                  ></v-select>
                  <v-btn
                    data-html2canvas-ignore="true"
                    @click="exportToPDF"
                    class="mx-1"
                    color="deep-purple accent-4"
                    append-icon="mdi-file-export-outline"
                    >Экспорт в PDF</v-btn
                  >
                </v-col>
              </v-row>
              <div ref="table" style="display: none" class="ml-3">
                <DxDataGrid
                  key-expr="ProfileNumber"
                  id="dataGrid"
                  :allow-column-resizing="true"
                  :column-auto-width="true"
                  :data-source="mapData"
                  :hover-state-enabled="true"
                  :show-borders="true"
                >
                  <DxColumn
                    sort-order="asc"
                    data-field="ProfileNumber"
                    data-type="number"
                    caption="Номер"
                    :width="55"
                  ></DxColumn>
                  <DxColumn
                    data-field="SoilSubtypeName"
                    caption="Разность"
                    :width="340"
                  ></DxColumn>
                  <DxColumn
                    data-field="GeochemicalPositionName"
                    caption="Геохимическая позиция"
                    :width="150"
                  ></DxColumn>
                </DxDataGrid>
              </div>
            </v-col>
          </v-row>
        </div>
      </div>
    </v-col>
    <v-col cols="1"> </v-col>
  </v-container>
</template>

<script>
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

import * as turf from "@turf/turf";
import html2pdf from "html2pdf.js";

import "ol/ol.css";

import "devextreme/dist/css/dx.light.compact.css";
import { DxDataGrid } from "devextreme-vue/data-grid";
import { DxColumn } from "devextreme-vue/data-grid";

export default {
  name: "MapDataView",
  components: {
    draggable,
    DxDataGrid,
    DxColumn,
    //DxLoadPanel,
  },
  props: {
    mapData: { type: Array, required: true },
  },
  data() {
    return {
      parameter: "pH",
      drag: false,
      coef: 0.01,
      avgDepth: 0,
      avgDist: 0,
      gridStep: 0,
      missingGeomtry: [],
      horizonLimits: [],
      horizonDepths: [],
      geoMapData: [],
      geoMapDataRemoved: [],
      profileData: [],
      drawProfileCurve: true,
      selectedBasemap: 0,
      basemaps: [
        { title: "OpenTopoMap", icon: "mdi-space-station" },
        { title: "WorldImagery", icon: "mdi-map" },
      ],
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
    // eslint-disable-next-line
    const {
      mapData,
      missingGeomtry,
      getSatinoDEM,
      createProfileData,
      buildProfileChart,
      initGeoMapData,
      buildProfileInterpolation,
    } = this;

    let { drawProfileCurve } = this;

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
            radius: 10,
            fill: new Fill({
              color: "rgba(179, 136, 255, 0.6)",
            }),
            stroke: new Stroke({
              color: "#6200EA",
              width: 1.4,
            }),
          }),
          text: new Text({
            text: getText(feature),
            justify: "center",
            font: "bold 12px Avenir, sans-serif",
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
      initGeoMapData();
      createProfileData();
      buildProfileChart();
      buildProfileInterpolation();
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
    map.getView().fit(extent, { padding: [5, 5, 5, 5], maxZoom: 14 });

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
    async exportToPDF() {
      //let element = html2pdf(document.getElementById("element-to-convert"));
      const element = this.$refs.elementToConvert;
      const title = this.$refs.title;
      const table = this.$refs.table;

      let opt = {
        margin: 5,
        filename: `${this.parameter}-profile-${this.mapData[0].ProfileYear}-${this.mapData[0].ProfileGroupId}-${this.mapData[0].ProfileRepeat}.pdf`,
        image: {
          type: "jpeg",
          quality: 0.98,
        },
        html2canvas: {
          scale: 5,
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          // Here is where you set your pdf orientation (portrait, landscape)
          orientation: "landscape",
        },
      };
      title.style.display = "block"; // <== here
      table.style.display = "block"; // <== here

      await html2pdf().set(opt).from(element).save();
      title.style.display = "none"; // <== and here
      table.style.display = "none"; // <== and here
    },
    handleChange() {
      this.createProfileData();
      this.buildProfileChart();
      this.buildProfileInterpolation();
    },
    removeProfile(element) {
      this.geoMapDataRemoved.push(element);
      let index = this.geoMapData.indexOf(element);
      this.geoMapData.splice(index, 1);
      this.handleChange();
    },
    initGeoMapData() {
      this.geoMapData = [];
      this.geoMapDataRemoved = [];
      for (let data of this.mapData) {
        if (data.Lat != "") {
          let elev = data.elevation;
          for (let horizon of data.horizons) {
            let currentHorizonHeight =
              ((+horizon.HorizonDepthTo + +horizon.HorizonDepthFrom) / 2) *
              this.coef;
            horizon.elevation = elev - currentHorizonHeight;
          }
          this.geoMapData.push(data);
        }
      }
      this.geoMapData.sort((a, b) => {
        return +a.ProfileNumber - +b.ProfileNumber;
      });
      for (let data of this.geoMapData) {
        data.horizons.sort((a, b) => {
          return +a.HorizonDepthFrom - +b.HorizonDepthFrom;
        });
      }
    },
    createProfileData() {
      this.profileData = [];
      let distance0 = 0;
      for (let i = 0; i < this.geoMapData.length; i++) {
        const data = {
          geometry: [this.geoMapData[i].Lon, this.geoMapData[i].Lat],
          elevation: this.geoMapData[i].elevation,
          ProfileNumber: +this.geoMapData[i].ProfileNumber,
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
      const height = 140 + margin.top + margin.bottom;
      //const xAxisTicks = 8;
      //const yAxisTicks = 6;

      // eslint-disable-next-line
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
        .range([height * 0.6, 0]);

      d3.select("#profilechart svg").remove();

      const svg = d3
        .select("#profilechart")
        .append("svg")
        .attr("viewBox", [0, 0, width + 48, 140])
        .append("g")
        .attr("transform", `translate(${margin.left}, 2.5)`);

      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

      svg.append("g").call(d3.axisLeft(yScale));

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
        .style("stroke-width", 2)
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
        .attr("r", 2);

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
        .style("font-size", "10px")
        .attr("fill", "#b388ff")
        .text(function (d) {
          return d.ProfileNumber;
        });
    },
    sequence(min, max, step) {
      const arr = [];

      for (let i = min - step; i < max + step; i += step) {
        arr.push(i.toFixed(3));
      }

      return arr;
    },
    async addConcentrationData() {
      let param = "pH";
      const contourData = [];
      const promises = [];

      for (let i = 0; i < this.geoMapData.length; i++) {
        let distance0 = this.profileData[i].distance0; // x
        //let elevation = this.profileData[i].elevation; // y
        for (let horizon of this.geoMapData[i].horizons) {
          const promise = this.getProfileConcentrationData(
            horizon.HorizonId,
            param
          ).then((data) => {
            if (data[0] != "") {
              const arr = [distance0, horizon.elevation, +data[0]]; // xyz
              horizon[param] = data;
              contourData.push(arr);
            }
          });
          promises.push(promise);
        }
      }

      //console.log(contourData);
      await Promise.all(promises);
      //console.log(contourData);
      return contourData;
    },
    // profiles
    findAverageParametrs(contourData) {
      const originalElevations = [];
      this.horizonLimits = [];

      let i = 0;
      //console.log(this.geoMapData);
      for (let data of this.geoMapData) {
        let elevation = data.elevation; // x
        originalElevations.push(elevation);
        let distance0 = this.profileData[i].distance0;
        //let line = [];

        for (let horizon of data.horizons) {
          this.horizonLimits.push({
            elevation: -(horizon.HorizonDepthTo * this.coef),
            distance0: distance0,
          });
        }
        i++;
        //this.horizonLimits.push(line);
      }
      console.log(this.horizonLimits);

      const lowestHorizons = this.findLowestHorizons(contourData);
      const horizonDepthAbsolute = lowestHorizons.map(
        (point) => point.elevation
      );
      const profileDistances = lowestHorizons.map((point) => point.distance0);
      const horizonDepthRelative = [];
      for (let i = 0; i < originalElevations.length; i++) {
        horizonDepthRelative.push(
          originalElevations[i] - horizonDepthAbsolute[i]
        );
      }
      const sumRelativeDepth = horizonDepthRelative.reduce(
        (accumulator, currentValue) => accumulator + currentValue
      );

      this.avgDepth = sumRelativeDepth / lowestHorizons.length;
      this.avgDist =
        profileDistances[profileDistances.length - 1] /
          profileDistances.length -
        1;
      return originalElevations;
    },
    findLowestHorizons(contourData) {
      let currentProfile = 0;
      let lowestHorizons = [];

      for (let i = 0; i < contourData.length - 1; i++) {
        if (
          (i != contourData.length - 1) &
          (contourData[i + 1][0] != currentProfile)
        ) {
          let point = {
            elevation: contourData[i][1],
            distance0: contourData[i][0],
          };
          lowestHorizons.push(point);
          currentProfile = contourData[i + 1][0];
        }
      }
      lowestHorizons.push({
        elevation: contourData[contourData.length - 1][1],
        distance0: contourData[contourData.length - 1][0],
      });
      return lowestHorizons;
    },
    getPreinterpolationData(contourData) {
      const originalElevations = this.findAverageParametrs(contourData);
      //console.log(originalElevations);
      console.log("avgDepth: ", this.avgDepth, "avgDist: ", this.avgDist);

      let distScaleCoef = this.avgDepth / this.avgDist;
      //console.log(distScaleCoef);

      let i = 0;
      let j = -1;
      const preInterpolationData = [];
      while (i < contourData.length - 1) {
        j += 1;
        let currProfile = contourData[i][0];
        while (
          (i < contourData.length - 1) &
          (contourData[i][0] == currProfile)
        ) {
          preInterpolationData.push([
            contourData[i][0] * distScaleCoef,
            contourData[i][1] - originalElevations[j],
            contourData[i][2],
          ]);
          i++;
        }
      }
      //console.log(preInterpolationData);
      return preInterpolationData;
    },
    preInterpolationGrid(contourData) {
      const preInterpolationData = this.getPreinterpolationData(contourData);
      //console.log(preInterpolationData);

      const xVals = preInterpolationData.map((point) => point[0]); // horizontal
      const yVals = preInterpolationData.map((point) => point[1]); // vertical
      const zVals = preInterpolationData.map((point) => point[2]);

      const coords = xVals.map((val, id) => [val, yVals[id]]);

      const points = this.fillGeoJson(coords, zVals);
      console.log(points, turf.bbox(points));

      let options = {
        gridType: "point",
        property: "value",
        units: "kilometers",
        weight: 5,
      };

      this.gridStep = (this.avgDepth / 2) * 12;
      console.log(this.gridStep);
      const grid = turf.interpolate(points, this.gridStep, options);

      //console.log(grid);
      //console.log(turf.bbox(grid));
      return grid;
    },
    fillGeoJson(coords, zVals) {
      const points = {
        type: "FeatureCollection",
        features: [],
      };
      for (let i = 0; i < coords.length; i++) {
        const feature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [coords[i][0], coords[i][1]],
          },
          properties: {
            value: zVals[i],
          },
        };
        points.features.push(feature);
      }
      return points;
    },
    rescaleInterpolationData(data) {
      let distScaleCoef = this.avgDepth / this.avgDist;
      const dataRE = data.map((point) => [
        point[0] / distScaleCoef,
        point[1],
        point[2],
      ]);
      return dataRE;
    },
    async buildProfileInterpolation() {
      //console.log(this.geoMapData, this.profileData);
      const contourData = await this.addConcentrationData();
      const preInterpolationData = this.getPreinterpolationData(contourData);
      const preInterpolationData_RE =
        this.rescaleInterpolationData(preInterpolationData);

      const lowestHorizonsFlat = this.findLowestHorizons(
        preInterpolationData_RE
      );

      const xVals = preInterpolationData_RE.map((point) => point[0]); // horizontal
      const yVals = preInterpolationData_RE.map((point) => point[1]); // vertical

      const margin = { top: 30, right: 0, bottom: 5, left: 30 };
      const width = 1000 + margin.left + margin.right;
      const height = 140 + margin.top;

      // eslint-disable-next-line
      const color = d3
        .scaleSequential((t) => d3.interpolateSpectral(t))
        .domain(d3.extent(contourData, (d) => d[2]))
        .nice();

      // Define the scales
      const xScale = d3
        .scaleLinear()
        .domain([d3.min(xVals), d3.max(xVals)])
        .range([0, width]);

      const yScale = d3
        .scaleLinear()
        //.domain([d3.min(yVals), d3.max(yVals)])
        .domain([-2.26, d3.max(yVals)])
        .range([height, 0]);

      const grid = this.preInterpolationGrid(contourData);
      const zGrid = [];
      turf.featureEach(grid, function (point) {
        zGrid.push(point.properties.value);
      });
      const zMin = d3.min(zGrid);
      const zMax = d3.max(zGrid);
      const breaks = this.sequence(zMin, zMax, (zMax - zMin) / 9);

      let iso_options = {
        zProperty: "value",
      };
      const isobands = turf.isobands(grid, breaks, iso_options);

      const isobandsMP = [];

      for (let i = 0; i < isobands.features.length; i++) {
        const feature = isobands.features[i];
        const obj = {
          type: "MultiPolygon",
          value: breaks[i],
          valueRange: feature.properties.value,
          coordinates: feature.geometry.coordinates,
        };
        isobandsMP.push(obj);
      }

      const projection = d3
        .geoIdentity()
        .reflectY(true)
        //.fitHeight(190, isobands)
        .fitWidth(width, isobands);
      //.fitHeight(height, isobands);
      //.fitSize([width, height], isobands);

      const path = d3.geoPath().projection(projection);

      d3.select("#profileinterpolate svg").remove();

      const svg = d3
        .select("#profileinterpolate")
        .append("svg")
        //.attr("width", "100%")
        //.attr("height", 250)
        .attr("viewBox", [0, 0, width + 50, height + 20])
        .append("g")
        .attr("transform", `translate(${margin.left}, 2.5)`);

      svg
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height);

      svg
        .append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(xScale));

      svg.append("g").call(d3.axisLeft(yScale));

      const area = d3
        .area()
        .x((d) => xScale(d.distance0))
        .y0(yScale(yScale.domain()[0]))
        .y1((d) => yScale(d.elevation))
        .curve(d3.curveCardinal.tension(0.75));

      // Plot the contours
      svg
        .append("g")
        .attr("stroke", "#000")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 2)
        .selectAll("path")
        .data(isobandsMP)
        .join("path")
        .attr("clip-path", "url(#clip)")
        .attr("fill", function (d) {
          return color(d.value);
        })
        .attr("d", path)
        .attr("mask", "url(#myMask)");

      svg
        .append("path")
        .attr("d", area(lowestHorizonsFlat))
        .style("fill", "#fff")
        .style("stroke", "#000")
        .attr("stroke-opacity", 0.5)
        .attr("stroke-width", 2);

      svg
        .selectAll("profilePoints")
        .data(lowestHorizonsFlat)
        .enter()
        .append("circle")
        .attr("fill", "#000")
        .attr("stroke", "none")
        .attr("cx", function (d) {
          return xScale(d.distance0);
        })
        .attr("cy", function () {
          return yScale(-0.025);
        })
        .attr("r", 2);

      const line = d3
        .line()
        .x(function (d) {
          return xScale(d.distance0);
        })
        .y(function (d) {
          return yScale(d.elevation);
        });

      const group = d3.group(this.horizonLimits, (d) => d.distance0);
      const groupArr = Array.from(group.values());
      const horizonLines = [];
      groupArr.forEach((item) => {
        item.sort((a, b) => b.elevation - a.elevation);
      });
      groupArr.forEach((item, i) => {
        if (i != 0) {
          horizonLines.push([
            { elevation: -0.025, distance0: item[0].distance0 },
            item[item.length - 1],
          ]);
        }
      });

      svg
        .selectAll(".line")
        .data(horizonLines)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "#000")
        .attr("stroke-width", 1.5)
        .attr("class", "line")
        .attr("d", line);

      svg
        .selectAll("horizonPoints")
        .data(groupArr.flat())
        .enter()
        .append("line")
        .attr("stroke", "#000")
        .attr("x1", function (d) {
          return xScale(d.distance0 - d3.max(xVals) * 0.004);
        })
        .attr("y1", function (d) {
          return yScale(d.elevation);
        })
        .attr("x2", function (d) {
          return xScale(d.distance0 + d3.max(xVals) * 0.004);
        })
        .attr("y2", function (d) {
          return yScale(d.elevation);
        })
        .attr("width", 2)
        .attr("heigth", 1);

      this.addLegend(isobandsMP, contourData);
    },
    addLegend(isobandsMP, contourData) {
      const color = d3
        .scaleSequential((t) => d3.interpolateSpectral(t))
        .domain(d3.extent(contourData, (d) => d[2]))
        .nice();

      let data = [];
      for (let band of isobandsMP) {
        data.push({
          color: color(band.value),
          value: band.value,
        });
      }

      let maxValue =
        isobandsMP[isobandsMP.length - 1]["valueRange"].split("-")[1];

      data.push({
        color: color(maxValue),
        value: maxValue,
      });

      let extent = d3.extent(data, (d) => d.value);

      let padding = 9;
      let width = 300;
      let innerWidth = width - padding * 2;
      let barHeight = 8;
      let height = 28;

      let xScale = d3.scaleLinear().range([0, innerWidth]).domain(extent);

      let xTicks = data.filter((f) => f.value).map((d) => d.value);

      let xAxis = d3
        .axisBottom(xScale)
        .tickSize(barHeight * 2)
        .tickValues(xTicks);

      d3.select("#legend svg").remove();

      let svg = d3
        .select("#legend")
        .append("svg")
        //.attr("width", width)
        //.attr("height", height);
        .attr("viewBox", [0, 0, width, height]);
      let g = svg
        .append("g")
        .attr("transform", "translate(" + padding + ", 0)");

      let defs = svg.append("defs");
      let linearGradient = defs
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
    },
  },
};
</script>

<style scoped>
.mapButtons {
  padding: 6px;
}

#basemapsButton {
  justify-content: flex-end;
}

.basemapsMenuList {
  width: 165px;
}
.ol-pointer {
  cursor: pointer !important;
}
.list-item-button {
  position: absolute;
  right: 5px;
  top: 0.3rem;
}
.list-group-item {
  height: 26px;
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
  min-height: 20px;
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
.title {
  display: flex;
  justify-content: center;
  text-align: center;
}
#dataGrid {
  height: 380px;
}
.container {
  display: flex;
  align-items: center;
}
</style>
