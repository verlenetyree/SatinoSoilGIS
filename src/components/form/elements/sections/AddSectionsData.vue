<template>
  <v-container d-flex justify-center class="my-0 py-0">
    <!--<v-row>-->
    <!--<v-col cols="9">-->
    <nav>
      <a
        @click="swapSectionsNav('SectionsGeneral')"
        :style="actveNavStyling('SectionsGeneral')"
        >Общие сведения</a
      >
      |
      <a
        @click="swapSectionsNav('SectionsMorpho')"
        :style="actveNavStyling('SectionsMorpho')"
      >
        Морфологические свойства</a
      >
      |
      <a
        @click="swapSectionsNav('SectionsChemestry')"
        :style="actveNavStyling('SectionsChemestry')"
        >Геохимия</a
      >
      <!--|
      <a
        @click="swapSectionsNav('SectionsChemestryRFA')"
        :style="actveNavStyling('SectionsChemestryRFA')"
        >Геохимия РФА</a
      >
      |
      <a
        @click="swapSectionsNav('SectionsInclusions')"
        :style="actveNavStyling('SectionsInclusions')"
        >Новообразования / включения</a
      >-->
    </nav>
    <a-form
      :model="horizon"
      v-bind="layout"
      @finish="onFinish"
      style="grid-column-start: 2"
    >
      <component v-bind:is="currentComponent" :editId="editId" />
    </a-form>
  </v-container>
</template>

<script>
import { useStore } from "vuex";
import SectionsGeneral from "@/components/form/elements/sections/SectionsGeneral.vue";
import SectionsMorpho from "@/components/form/elements/sections/SectionsMorpho.vue";
import SectionsChemestry from "@/components/form/elements/sections/SectionsChemestry.vue";
import SectionsChemestryRFA from "@/components/form/elements/sections/SectionsChemestryRFA.vue";
import SectionsInclusions from "@/components/form/elements/sections/SectionsInclusions.vue";

export default {
  components: {
    SectionsGeneral,
    SectionsMorpho,
    SectionsChemestry,
    SectionsChemestryRFA,
    SectionsInclusions,
  },
  props: {
    editId: {
      type: Number,
    },
  },
  data() {
    return {
      dialog: false,

      currentComponent: "SectionsGeneral",
      items: [
        { comp: "SectionsGeneral" },
        { comp: "SectionsMorpho" },
        { comp: "SectionsChemestry" },
        { comp: "SectionsChemestryRFA" },
        { comp: "SectionsInclusions" },
      ],
      layout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
      },
      //  status: false,
    };
  },
  setup(props) {
    const store = useStore();
    let horizon;

    if (store.state.horizonEdit) {
      horizon = store.state.horizons_total.filter((obj) => {
        return obj.HorizonId === props.editId;
      });
    } else {
      horizon = store.state.horizon;
    }

    return { horizon };
  },
  methods: {
    swapSectionsNav(component) {
      this.currentComponent = component;
    },
    actveNavStyling(component) {
      if (this.currentComponent == component) {
        return "color: #0e5699;";
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
}
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

nav a:active {
  color: #0e5699;
}
</style>
