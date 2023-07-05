<template>
  <v-row justify="center">
    <v-col>
      <a-form-item label="Al, %" name="HorizonAl" :style="marginForm">
        <a-input
          :size="size"
          :style="selectWidth"
          placeholder="Al"
          v-model:value="horizon.HorizonAl"
        />
      </a-form-item>
      <a-form-item label="Si, %" name="HorizonSi" :style="marginForm">
        <a-input
          :size="size"
          :style="selectWidth"
          placeholder="Si"
          v-model:value="horizon.HorizonSi"
        />
      </a-form-item>
      <a-form-item label="Ca, %" name="HorizonCa" :style="marginForm">
        <a-input
          :size="size"
          :style="selectWidth"
          disabled="true"
          placeholder="Ca"
          v-model:value="horizon.HorizonCa"
        />
      </a-form-item>
      <a-form-item label="Mn, %" name="HorizonMn" :style="marginForm">
        <a-input
          :size="size"
          :style="selectWidth"
          disabled="true"
          placeholder="Mn"
          v-model:value="horizon.HorizonMn"
        />
      </a-form-item>
      <a-form-item label="Fe, %" name="HorizonFe" :style="marginForm">
        <a-input
          :size="size"
          :style="selectWidth"
          placeholder="Fe"
          v-model:value="horizon.HorizonFe"
        />
      </a-form-item>
      <a-form-item label="Zn, %" name="HorizonZn" :style="marginForm">
        <a-input
          :size="size"
          :style="selectWidth"
          placeholder="Zn"
          v-model:value="horizon.HorizonZn"
        />
      </a-form-item>
      <a-form-item label="Pb, %" name="HorizonPb" :style="marginForm">
        <a-input
          :size="size"
          :style="selectWidth"
          placeholder="Pb"
          v-model:value="horizon.HorizonPb"
        />
      </a-form-item>
    </v-col>
  </v-row>
</template>

<script>
import { useStore } from "vuex";
//import { useRouter } from "vue-router";

export default {
  props: {
    editId: {
      type: Number,
    },
  },
  data() {
    return {
      size: "default",
      selectWidth: "width: 80%; text-align: left;",
    };
  },
  setup(props) {
    //const router = useRouter();
    const store = useStore();
    let horizon;

    if (store.state.horizonEdit) {
      horizon = store.state.horizons_total[props.editId];
    } else {
      horizon = store.state.horizon;
    }
    //const api = window.api;

    return { horizon };
  },
  computed: {
    marginForm() {
      return "margin: 0px 0px 15px";
    },
  },
};
</script>

<style scoped></style>
