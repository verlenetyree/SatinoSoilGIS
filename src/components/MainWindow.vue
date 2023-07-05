<template>
  <v-app-bar elevation="3" flat>
    <v-app-bar-nav-icon
      color="deep-purple accent-4"
      @click.stop="drawer = !drawer"
    ></v-app-bar-nav-icon>

    <v-toolbar-title>{{
      currentComponent == "TableProfilesView"
        ? "Таблица:   dat_Profiles"
        : currentComponent == "MapView"
        ? "Карта"
        : currentComponent == "TableHorizonsView"
        ? "Таблица:   dat_Horizons"
        : "Почвенные разрезы"
    }}</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn @click="go_to_form()" color="deep-purple accent-4" text>
      <span>Добавить данные</span>

      <v-icon end>mdi-database-edit</v-icon>
    </v-btn>
  </v-app-bar>
  <v-navigation-drawer
    disable-route-watcher
    disable-resize-watcher
    temporary
    app
    v-model="drawer"
    elevation="3"
  >
    <v-list rounded>
      <v-list-item link prepend-icon="mdi-map" class="tile">
        <v-list-item-title @click="swapTables('MapView')">
          Карта
        </v-list-item-title>
      </v-list-item>

      <v-list-item link prepend-icon="mdi-table-eye" class="tile">
        <v-list-item-title @click="swapTables('DataViewer')">
          Просмотр
        </v-list-item-title>
      </v-list-item>

      <v-list-group>
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            prepend-icon="mdi-table-large"
            title="Таблицы"
            class="tile"
          ></v-list-item>
        </template>
        <v-list-item link>
          <v-list-item-title @click="swapTables('TableProfilesView')">
            dat_Profiles
          </v-list-item-title>
        </v-list-item>
        <v-list-item link>
          <v-list-item-title @click="swapTables('TableHorizonsView')">
            dat_Horizons
          </v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>

  <component v-bind:is="currentComponent" />

  <MapView v-if="false" />
</template>

<script>
import MapView from "@/components/main/elements/MapView.vue";
import TableProfilesView from "@/components/main/elements/TableProfilesView.vue";
import TableHorizonsView from "@/components/main/elements/TableHorizonsView.vue";
import DataViewer from "@/components/main/elements/DataViewer.vue";

import { useStore } from "vuex";

export default {
  components: { MapView, TableProfilesView, TableHorizonsView, DataViewer },
  data() {
    return {
      currentComponent: "DataViewer",
      drawer: false,
      items: [
        { comp: "TableProfilesView", title: "dat_Profiles" },
        { comp: "TableHorizonsView", title: "dat_Horizons" },
      ],
    };
  },
  setup() {
    const store = useStore();

    return store;
  },
  methods: {
    currentTable() {
      //return this.currentComponent == "TableProfilesView"
      //  ? "dat_Profiles"
      //  : "dat_Horizons";
      for (let i = 0; i < this.items.length; i++) {
        if ((this.items[i].comp = this.currentComponent))
          return this.items[i].title;
      }
    },
    swapTables(component) {
      this.currentComponent = component;
    },
    go_to_form() {
      this.$store.commit("if_new", [true, 0]);
      //this.store.commit("new_coords");
      //console.log(this.$store);
      this.$router.push("/form");
      //this.store.commit("new_profile");
      //this.store.commit("new_horizon");
      //this.store.commit("new_horizons_total");
    },
  },
};
</script>

<style scoped>
.tile {
  margin: 5px;
  border-radius: 4px;
}
</style>
