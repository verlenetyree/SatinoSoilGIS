<template>
  <div ref="map-root" style="width: 100%; height: 100%"></div>
  <div class="mapButtons d-flex justify-end" id="basemapsButton" fluid>
    <v-btn :icon="basemaps[selectedBasemap].icon" color="blue darken-4">
    </v-btn>
  </div>
  <div ref="mouse-position"></div>
</template>

<script>
//import { useStore } from "vuex";
import View from "ol/View";
import Map from "ol/Map";
import { Tile as TileLayer, Vector as VectorLayer, Group } from "ol/layer";
import { OSM, XYZ, Vector as VectorSource } from "ol/source";
import Draw from "ol/interaction/Draw";
import { createStringXY } from "ol/coordinate";
import { Control, defaults as defaultControls } from "ol/control";
import MousePosition from "ol/control/MousePosition";

import "ol/ol.css";
import { transform } from "ol/proj.js";

import { GeoJSON } from "ol/format";

import { useStore } from "vuex";
import { computed } from "vue";

export default {
  name: "MapContainer",
  components: {},
  props: {},
  data() {
    return {
      selectedBasemap: 0,
      basemaps: [
        { title: "OpenTopoMap", icon: "mdi-space-station" },
        { title: "WorldImagery", icon: "mdi-map" },
      ],
    };
  },
  setup() {
    const store = useStore();
    const coords = computed(() => store.state.coords);
    //console.log(coords);

    return { coords };
  },
  mounted() {
    console.log(this.coords);

    function createProfileVectorLayer(coords) {
      // eslint-disable-next-line
      const geojson = {
        type: "FeatureCollection",
        features: [],
      };
      const [Lon, Lat] = coords;
      if (!(Lon == "" && Lat == "")) {
        const feature = {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [Lon, Lat],
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
        });
        return vectorLayer;
      }
      return null;
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

    const source = new VectorSource({ wrapX: false });

    const vector = new VectorLayer({
      source: source,
    });

    const mousePositionControl = new MousePosition({
      coordinateFormat: createStringXY(4),
      projection: "EPSG:4326",
      className: "custom-mouse-position",
      target: this.$refs["mouse-position"],
    });

    const basemapsControl = new Control({
      element: document.getElementById("basemapsButton"),
    });

    const map = new Map({
      controls: defaultControls({ attribution: false, zoom: false }).extend([
        mousePositionControl,
        basemapsControl,
      ]),
      target: this.$refs["map-root"],
      layers: [baseLayersGroup, vector],
      view: new View({
        center: transform([36.382177, 55.207178], "EPSG:4326", "EPSG:3857"),
        zoom: 14,
        constrainResolution: true,
      }),
    });

    let draw = null;

    if (this.coords !== undefined && this.coords.length != 0) {
      console.log(this.coords);
      const mapDatavL = createProfileVectorLayer(this.coords);

      if (mapDatavL != null) {
        map.addLayer(mapDatavL);
        //const extent = mapDatavL.getSource().getExtent();
        //map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 14 });
      }
    }

    function addInteraction() {
      draw = new Draw({
        source: source,
        type: "Point",
      });

      draw.on("drawstart", () => {
        map.getLayers().getArray()[1].getSource().clear();
      });

      map.addInteraction(draw);
    }

    source.on("addfeature", (e) => {
      const coords = transform(
        e.feature.getGeometry().getCoordinates(),
        "EPSG:3857",
        "EPSG:4326"
      );
      this.$store.state.coords = coords;
      //this.coords = coords;
    });

    addInteraction();
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
