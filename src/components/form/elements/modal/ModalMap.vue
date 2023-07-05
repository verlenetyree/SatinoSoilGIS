<template>
  <div class="container">
    <!--<div id="settings">
      <SettingsContainer />
    </div>-->

    <div id="map" class="mb-3">
      <MapContainer />
    </div>
  </div>
</template>

<script>
import MapContainer from "@/components/form/elements/modal/MapContainer.vue";
//import SettingsContainer from "@/components/form/elements/modal/SettingsContainer.vue";

export default {
  components: { MapContainer },
  //components: { MapContainer, SettingsContainer },
};
</script>

<style scoped>
.container {
  height: 100%;
  display: grid;
  grid-template-columns: 250px;
  grid-auto-rows: 50%;
  grid-gap: 1rem;
  box-sizing: border-box;
}
#map {
  grid-column-start: 1;
  grid-column-end: 3;
  grid-row-start: 1;
  grid-row-end: 3;
}
</style>

<!--#map {
  grid-column: 2;
  grid-row-start: 1;
  grid-row-end: 3;
}

#settings {
  grid-column: 1;
  grid-row-start: 1;
  grid-row-end: 3;
}-->
