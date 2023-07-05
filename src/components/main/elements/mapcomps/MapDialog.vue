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
          >Год: {{ this.mapData[0].ProfileYear }}, Профиль:
          {{ this.mapData[0].ProfileGroupId }}, Повторность:
          {{ this.mapData[0].ProfileRepeat }}</v-toolbar-title
        >
        <v-spacer></v-spacer>
      </v-toolbar>
      <MapDataViewer :mapData="data" />
    </v-card>
  </v-dialog>
</template>

<script>
import MapDataViewer from "@/components/main/elements/mapcomps/MapDataViewer.vue";

export default {
  components: { MapDataViewer },
  props: {
    showMapDialog: { type: Boolean, required: true },
    mapData: { type: Array, required: true },
    vYear: { type: String, required: true },
    vProfile: { type: String, required: true },
    vRepeat: { type: String, required: true },
  },
  data() {
    return {
      dialog: false,
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
    showMapDialog() {
      this.dialog = this.$props.showMapDialog;
    },
    mapData() {
      this.data = [...this.$props.mapData];
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
  methods: {},
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
