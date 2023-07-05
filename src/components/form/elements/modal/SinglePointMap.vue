<template>
  <div ref="map-root" style="width: 100%; height: 100%"></div>
  <div class="mapButtons d-flex justify-end" id="basemapsButton" fluid>
    <v-btn :icon="basemaps[selectedBasemap].icon" color="blue darken-4">
    </v-btn>
  </div>
</template>

<script>
//import { useStore } from "vuex";
import View from "ol/View";
import Map from "ol/Map";
// eslint-disable-next-line
import { Tile as TileLayer, Vector as VectorLayer, Group } from "ol/layer";
// eslint-disable-next-line
import { OSM, XYZ, Vector as VectorSource } from "ol/source";
import { Control, defaults as defaultControls } from "ol/control";
import { Style, Stroke, Fill, Circle, Text } from "ol/style";

import { GeoJSON } from "ol/format";

import "ol/ol.css";
import { transform } from "ol/proj.js";

export default {
  name: "MapContainer",
  components: {},
  props: {
    mapData: { type: Array, required: true },
  },
  data() {
    return {
      selectedBasemap: 0,
      basemaps: [
        { title: "OpenTopoMap", icon: "mdi-space-station" },
        { title: "WorldImagery", icon: "mdi-map" },
      ],
    };
  },
  mounted() {
    const { mapData } = this;

    function createProfileVectorLayer() {
      // eslint-disable-next-line
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      console.log(mapData[0]);
      if (mapData[0].value != "Нет данных") {
        let coord = mapData[0].value.split(" ");
        let Lat = coord[0];
        let Lon = coord[3];
        if (!(Lon == "" && Lat == "")) {
          const feature = {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [Lon, Lat],
            },
            properties: {
              ProfileNumber: +mapData[1].value,
            },
          };
          geojson.features.push(feature);

          const vectorSource = new VectorSource({
            crossOrigin: "anonymous",
            features: new GeoJSON({
              dataProjection: "EPSG:4326",
              featureProjection: "EPSG:3857",
            }).readFeatures(geojson),
          });

          const vectorLayer = new VectorLayer({
            source: vectorSource,
            style: crateVectorLayerStyle,
          });
          return vectorLayer;
        }
      }
      return null;
    }

    function getText(feature) {
      return feature.get("ProfileNumber").toString();
    }

    function crateVectorLayerStyle(feature) {
      return new Style({
        image: new Circle({
          radius: 10,
          fill: new Fill({
            color: "rgba(30, 136, 229, 0.4)",
          }),
          stroke: new Stroke({
            color: "#0D47A1",
            width: 1.4,
          }),
        }),
        text: new Text({
          text: getText(feature),
          justify: "center",
          font: "bold 12px Avenir, sans-serif",
          offsetY: +1,
          fill: new Fill({
            color: "#0D47A1",
          }),
        }),
        cursor: "pointer",
      });
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

    const basemapsControl = new Control({
      element: document.getElementById("basemapsButton"),
    });

    const map = new Map({
      controls: defaultControls({ attribution: false, zoom: false }).extend([
        basemapsControl,
      ]),
      target: this.$refs["map-root"],
      layers: [baseLayersGroup],
      view: new View({
        center: transform([36.382177, 55.207178], "EPSG:4326", "EPSG:3857"),
        zoom: 14,
        constrainResolution: true,
      }),
    });

    if (mapData[0].value != "Нет данных") {
      const mapDatavL = createProfileVectorLayer();
      if (mapDatavL != null) {
        map.addLayer(mapDatavL);
        const extent = mapDatavL.getSource().getExtent();
        map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 14 });
      }
    }

    setTimeout(() => {
      map.updateSize();
    }, 0);
  },
  methods() {},
};
</script>

<style>
.custom-mouse-position {
  margin-bottom: 5px;
  font-size: 12px;
  text-align: right;
}
.mapButtons {
  padding: 6px;
}
</style>
