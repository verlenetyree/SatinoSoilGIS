<template>
  <div class="d-flex justify-space-around">
    <v-color-picker
      v-model="picker"
      :modes="['rgb']"
      show-swatches
      :swatches="swatches"
      hide-sliders
      elevation="5"
    ></v-color-picker>
  </div>
</template>

<script>
export default {
  data() {
    return {
      picker: null,
      swatches: [
        ["#808000", "#F2F3F4", "#808080"],
        ["#000000", "#79A0C1", "#45161C"],
        ["#964B00", "#CC7722", "#F0DC82"],
      ],
    };
  },
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
  grid-column: 2;
  grid-row-start: 1;
  grid-row-end: 3;
}

#settings {
  grid-column: 1;
  grid-row-start: 1;
  grid-row-end: 3;
}
</style>
