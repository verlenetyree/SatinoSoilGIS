<template>
  <v-app-bar :elevation="3" flat>
    <v-app-bar-nav-icon color="#1890ff" @click="$router.push('/')">
      <v-icon>mdi-database</v-icon>
    </v-app-bar-nav-icon>
    <v-app-bar-title>{{ title }}</v-app-bar-title>
    <v-spacer></v-spacer>

    <div class="text-center">
      <v-btn
        v-show="editData || ifDataIsNew"
        color="#1890ff"
        text
        @click="save()"
      >
        <span> Сохранить </span>

        <v-icon end>mdi-upload</v-icon>
      </v-btn>
      <v-btn color="#1890ff" text @click="edit()">
        <span>Редактировать </span>

        <v-icon end>mdi-database-edit</v-icon>
      </v-btn>

      <v-btn v-bind="props" color="#EF5350" text @click="exit()">
        <span>Выход </span>

        <v-icon end>mdi-close</v-icon>
      </v-btn>
    </div>
  </v-app-bar>
  <v-banner
    class="mt-3 pb-3"
    style="z-index: 999; position: sticky; top: 76px"
    color="info"
    elevation="5"
    icon="mdi-check-outline"
    lines="one"
    density="comfortable"
    text="Сохранение успешно завершено!"
    :stacked="false"
    v-if="showBanner"
  >
  </v-banner>
</template>

<script>
import { useStore } from "vuex";
import { computed } from "vue";

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    hid: {
      type: String,
      required: true,
    },
  },
  components: {},
  data() {
    return {
      profileDataChunk: {},
      horizonsDataChunk: [],
      showBanner: false,
    };
  },
  setup() {
    const api = window.api;
    const store = useStore();
    //const editData = store.state.edit;
    //const ifDataIsNew = store.state.ifDataIsNew;
    const editData = computed(() => store.state.edit);
    const ifDataIsNew = computed(() => store.state.ifDataIsNew);
    const profile = store.state.profile;

    async function processDataRecord(profileDataChunk, horizonsDataChunk) {
      //console.log(profileDataChunk, horizonsDataChunk);
      const strProfile = JSON.stringify(profileDataChunk);
      //console.log(strProfile, strHorizons);
      await api.processProfileDataRecord(strProfile);
      for (let horizon of horizonsDataChunk) {
        const strHorizons = JSON.stringify(horizon);
        await api.processHorizonsDataRecord(strHorizons);
      }
      return;
    }

    async function updateDataRecord(profileDataChunk, horizonsDataChunk) {
      //console.log(profileDataChunk, horizonsDataChunk);
      const strProfile = JSON.stringify(profileDataChunk);
      //console.log(strProfile, strHorizons);
      await api.updateProfileDataRecord(profileDataChunk.ProfileId, strProfile);
      for (let horizon of horizonsDataChunk) {
        const { HorizonId, ...data } = horizon;
        const strHorizons = JSON.stringify(data);
        await api.updateHorizonsDataRecord(HorizonId, strHorizons);
      }
      return;
    }

    return {
      store,
      profile,
      ifDataIsNew,
      editData,
      //getExistingHorizonIds,
      processDataRecord,
      updateDataRecord,
    };
  },
  methods: {
    pushBack() {
      if (this.id == 0) {
        this.$router.push({
          name: "formGeneral",
          //props: { status: false },
        });
      } else {
        this.$router.go(-1);
      }
    },
    exit() {
      this.store.commit("new_profile");
      this.store.commit("new_horizon");
      this.store.commit("new_horizons_total");
      this.store.commit("new_coords");
      this.$router.push("/");
      this.store.commit("change_status", false);
      this.store.commit("if_new", [true, 0]);
      if (this.store.state.edit) {
        this.store.commit("if_edit", false);
        //this.store.commit("what_edit", this.hid);
      }
    },
    edit() {
      console.log(this.store.state.profile);
      this.store.commit("if_edit", true);
      this.$router.push("/form");
    },
    async save() {
      if (this.ifDataIsNew) {
        const profileId =
          this.profile.ProfileNumber +
          this.profile.ProfileGroupId +
          this.profile.ProfileYear.slice(-2) +
          this.profile.ProfileRepeat;
        this.store.commit("set_ProfileId", profileId);

        this.store.state.horizons_total.sort(function (a, b) {
          return a.HorizonDepthFrom - b.HorizonDepthFrom;
        });
        const horizonId = this.store.state.horizons_total.map((horizon, id) => {
          return profileId + (id + 1);
        });
        this.store.commit("set_HorizonId", horizonId);
      } else {
        if (this.store.state.HorizonId.length == 0) {
          this.store.state.horizons_total.sort(function (a, b) {
            return a.HorizonDepthFrom - b.HorizonDepthFrom;
          });
          const horizonId = this.store.state.horizons_total.map(
            (horizon, id) => {
              return this.store.state.ProfileId + (id + 1);
            }
          );
          this.store.commit("set_HorizonId", horizonId);
        }
        //else if (
        //  this.store.state.HorizonId.length <
        //  this.store.state.horizons_total.length
        //) {
        //  for (
        //    let i = 1;
        //    i <=
        //    this.store.state.horizons_total.length -
        //      this.store.state.HorizonId.length;
        //    i++
        //  ) {
        //    this.store.state.HorizonId.push(
        //      this.store.state.ProfileId +
        //        (this.store.state.horizons_total.length + i)
        //    );
        //  }
        //}
      }
      //console.log(this.store.state.ProfileId, this.store.state.HorizonId);

      this.createProfileDataChunk();
      this.createHorizonsDataChunk();

      if (this.ifDataIsNew) {
        await this.processDataRecord(
          this.profileDataChunk,
          this.horizonsDataChunk
        );
      } else {
        await this.updateDataRecord(
          this.profileDataChunk,
          this.horizonsDataChunk
        );
      }
      this.showBanner = true;
      this.store.commit("if_new", [false, this.store.state.ProfileId]);
      this.store.commit("if_edit", false);
      //console.log(this.store.state.ifDataIsNew);
      this.ifDataIsNew = false;

      setTimeout(() => (this.showBanner = false), 3000);

      //console.log(this.store.state.profile);
      //console.log(this.store.state.horizons_total);
    },
    createProfileDataChunk() {
      this.profileDataChunk = {};
      const [Lon, Lat] = this.store.state.coords;

      for (const [key, value] of Object.entries(this.store.state.profile)) {
        for (let prop of this.store.state.uploadProfileData) {
          if (key == prop) {
            if (key.slice(-2) === "Id") {
              this.profileDataChunk[key] =
                value === "Нет данных" || value === null ? "1" : value;
            } else {
              this.profileDataChunk[key] = value === null ? "" : value;
            }
          }
        }
      }
      this.profileDataChunk.IsBaseProfile = this.profileDataChunk.IsBaseProfile
        ? "True"
        : "False";

      this.profileDataChunk.Lon = Lon != null ? +Lon.toFixed(7) : "";
      this.profileDataChunk.Lat = Lat != null ? +Lat.toFixed(7) : "";

      this.profileDataChunk.ProfileX = "";
      this.profileDataChunk.ProfileY = "";
      this.profileDataChunk.ProfileOldCode = "";

      this.profileDataChunk.ProfileId = this.store.state.ProfileId;
      //console.log(this.profileDataChunk);
    },
    createHorizonsDataChunk() {
      this.horizonsDataChunk = [];

      let i = 0;
      if (this.store.state.horizons_total.length != 0) {
        for (let horizon of this.store.state.horizons_total) {
          const chunk = {};
          for (const [key, value] of Object.entries(horizon)) {
            for (let prop of this.store.state.uploadHorizonData) {
              if (key == prop) {
                if (key.slice(-2) === "Id") {
                  chunk[key] = value === "Нет данных" ? "1" : value;
                } else {
                  chunk[key] = value === "Нет данных" ? "" : value;
                }
              }
            }
          }
          chunk.SubHorizonNumber =
            chunk.SubHorizonNumber === "" ? "0" : chunk.SubHorizonNumber;
          chunk.IsGHorizon = chunk.IsGHorizon ? "True" : "False";
          chunk.IsCaHorizon = chunk.IsCaHorizon ? "True" : "False";
          chunk.IsA1Horizon = chunk.IsA1Horizon ? "True" : "False";

          chunk.ProfileOldCode = "";
          chunk.IsBaseHorizon = "False";
          chunk.ProfileId = this.store.state.ProfileId;
          chunk.HorizonId = this.store.state.HorizonId[i++];
          this.horizonsDataChunk.push(chunk);
        }
      }
      //console.log(this.horisonsDataChunk);
    },
  },
  computed: {
    title() {
      let a = "";
      let b = "";
      if (this.store.state.ProfileId == 0) {
        a = `Новый разрез`;
      } else {
        a = `Разрез ${this.store.state.ProfileId}`;
      }
      if (this.hid == "") {
        b = "";
      } else {
        b = ` — горизонт ${this.hid}`;
      }
      return a + b;
    },
  },
};
</script>

<style scoped></style>
