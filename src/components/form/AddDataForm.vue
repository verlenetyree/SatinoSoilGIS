<template>
  <v-app-bar :elevation="3" flat>
    <v-app-bar-nav-icon color="#1890ff">
      <v-icon>mdi-database-edit</v-icon>
    </v-app-bar-nav-icon>
    <v-app-bar-title>Режим формы </v-app-bar-title>
    <v-spacer></v-spacer>
    <div class="text-center">
      <v-dialog v-model="dialog" width="auto">
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" color="#1890ff" text>
            <span>Выйти </span>

            <v-icon end>mdi-exit-to-app</v-icon>
          </v-btn>
        </template>

        <v-card>
          <v-card-text class="text-center">
            <b>Вы уверены, что хотите выйти?</b><br />
            В случае выхода данные будут потеряны.
          </v-card-text>
          <v-card-actions class="my-2 justify-space-evenly">
            <v-btn variant="tonal" color="#f5222d" @click="handleBack()"
              >Да</v-btn
            >
            <v-btn variant="tonal" color="#1890ff" @click="dialog = false"
              >Нет</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-app-bar>

  <v-container d-flex justify-center class="fill-height">
    <v-row>
      <v-col cols="9">
        <nav :class="{ invisible: !this.store.state.status }">
          <router-link :to="{ name: 'formGeneral' }"
            >Общие сведения</router-link
          >
          |
          <router-link :to="{ name: 'formDetails' }"
            >Почва и факторы почвообразования</router-link
          >
          |
          <router-link :to="{ name: 'formChemestry' }">Геохимия</router-link>
        </nav>
      </v-col>
    </v-row>
    <v-row no-gutters align-content="center">
      <v-col cols="9">
        <a-form :model="profile" v-bind="layout" @finish="onFinish">
          <router-view :status="this.store.state.status" />
        </a-form>
      </v-col>
      <v-col cols="3" v-show="this.store.state.status">
        <div
          class="report-buttons-group"
          :class="{ invisible: !this.store.state.status }"
        >
          <v-btn
            color="blue darken-4"
            size="small"
            disabled
            class="form-buttons"
            variant="outlined"
            >Отчёт по разрезу</v-btn
          >
          <v-btn
            color="blue darken-4"
            size="small"
            disabled
            class="form-buttons"
            variant="outlined"
            >Сводный отчёт</v-btn
          >
        </div>
        <v-btn
          color="blue darken-4"
          size="small"
          class="create-btn"
          :class="{ invisible: !this.store.state.status }"
          @click="
            $router.push({
              name: 'DataReviewPage',
              params: { id: 0 },
            })
          "
          >{{ saveOrCreateBtn }}</v-btn
        >
      </v-col>
    </v-row>
    <v-row class="mt-3">
      <FormTable v-show="this.store.state.status" />
    </v-row>
  </v-container>
</template>

<script>
import FormTable from "@/components/form/elements/sections/FormTable.vue";
//import FormHeader from "@/components/form/elements/comps/FormHeader.vue";

import { useStore } from "vuex";

export default {
  components: {
    FormTable,
    //FormHeader,
  },
  //props: {
  //  status: {
  //    type: Boolean,
  //    default: false,
  //  },
  //},
  data() {
    return {
      dialog: false,
      layout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
      },
      //status: false,
    };
  },
  setup() {
    const store = useStore();
    const profile = store.state.profile;
    const status = store.state.status;

    return { profile, store, status };
  },
  methods: {
    onFinish() {
      //this.status = true;
      this.store.commit("change_status", true);
      //console.log(this.store.state.status);
    },
    currentTable() {
      for (let i = 0; i < this.items.length; i++) {
        if ((this.items[i].comp = this.currentComponent))
          return this.items[i].title;
      }
    },
    handleBack() {
      this.store.commit("new_profile");
      this.store.commit("new_horizon");
      this.store.commit("new_horizons_total");
      this.store.commit("new_coords");
      this.$router.push("/");
      this.store.commit("change_status", false);
      this.store.commit("if_new", [true, 0]);
      if (this.store.state.edit) {
        this.store.commit("if_edit", false);
      }
    },
  },
  computed: {
    saveOrCreateBtn() {
      //console.log(this.store.state.horizons_total);
      return this.store.state.edit ? "Сохранить" : "Создать";
    },
  },
};
</script>

<style scoped>
.invisible {
  visibility: hidden;
}

nav {
  padding: 30px;
  display: flex;
  justify-content: space-evenly;
}

nav a {
  font-weight: bold;
  color: #1890ff;
}

nav a.router-link-exact-active {
  color: #0e5699;
}
.form-buttons {
  margin-bottom: 10px;
}

.report-buttons-group {
  display: flex;
  flex-direction: column;
  width: 170px;
}
.create-btn {
  margin-top: 24px;
  width: 120px;
}
</style>
