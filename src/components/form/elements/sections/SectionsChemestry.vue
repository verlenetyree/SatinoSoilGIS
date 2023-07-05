<template>
  <a-form-item label="pH" name="HorizonpH" :style="marginForm">
    <a-input
      :size="size"
      type="number"
      :style="selectWidth"
      placeholder="pH"
      v-model:value="horizon.HorizonpH"
    />
  </a-form-item>
  <a-form-item
    label="FeO, мг на 100 г влажной почвы"
    name="HorizonFe_Moist"
    :style="marginForm"
  >
    <a-input
      :size="size"
      type="number"
      :style="selectWidth"
      placeholder="FeO, мг на 100 г влажной почвы"
      v-model:value="horizon.HorizonFe_Moist"
    />
  </a-form-item>
  <a-form-item
    label="FeO, мг на 100 г сухой почвы"
    name="HorizonFeO_Dry"
    :style="marginForm"
  >
    <a-input
      :size="size"
      :style="selectWidth"
      disabled="true"
      :placeholder="placeholderFeO"
    />
  </a-form-item>
  <a-form-item label="Влажность" name="HorizonDepthFrom" :style="marginForm">
    <a-input
      :size="size"
      :style="selectWidth"
      disabled="true"
      :placeholder="placeholderMoisture"
    />
  </a-form-item>
  <a-form-item label="Номер бюкса" name="BankNumber" :style="marginForm">
    <a-input
      :size="size"
      type="number"
      :style="selectWidth"
      placeholder="Номер бюкса"
      v-model:value="horizon.BankNumber"
    />
  </a-form-item>
  <a-form-item label="Вес пустого бюкса, г" name="Bank" :style="marginForm">
    <a-input
      :size="size"
      type="number"
      :style="selectWidth"
      placeholder="Вес пустого бюкса, г"
      v-model:value="horizon.Bank"
    />
  </a-form-item>
  <a-form-item
    label="Вес бюкса с влажной почвой, г"
    name="Bank_Moist"
    :style="marginForm"
  >
    <a-input
      :size="size"
      :style="selectWidth"
      type="number"
      placeholder="Вес бюкса с влажной почвой, г"
      v-model:value="horizon.Bank_Moist"
    />
  </a-form-item>
  <a-form-item
    label="Вес бюкса с сухой почвой, г"
    name="Bank_Dry"
    :style="marginForm"
  >
    <a-input
      type="number"
      :size="size"
      :style="selectWidth"
      placeholder="Вес бюкса с сухой почвой, г"
      v-model:value="horizon.Bank_Dry"
    />
  </a-form-item>
  <!--<a-row>
    <a-col :span="8" :offset="6">-->
  <div class="ml-15">
    <a-form-item name="IsGHorizon" :style="marginForm">
      <a-checkbox v-model:checked="horizon.IsFeOHorizon"
        >Принять FeO за единицу</a-checkbox
      >
    </a-form-item>
    <a-form-item name="IsA1Horizon" :style="marginForm">
      <a-checkbox v-model:checked="horizon.IsA1Horizon"
        >Принять за горизонт А1</a-checkbox
      >
    </a-form-item>
  </div>
  <!--</a-col>
  </a-row>-->
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
      size: "small",
      selectWidth: "width: 100%; text-align: left;",
      optionsPaint: [],
      optionsHorizonTint: [],
      optionsSpotTint: [],
      optionsMainStructure: [],
      optionsAdditionalStructure: [],
      optionsMechanicalComposition: [],
      optionsDensity: [],
      optionsMoisture: [],
      optionsBorderForm: [],
      optionsTransition: [],
    };
  },
  setup(props) {
    //const router = useRouter();
    const store = useStore();
    let horizon;

    if (store.state.horizonEdit) {
      horizon = store.state.horizons_total.filter((obj) => {
        return obj.HorizonId === props.editId;
      })[0];
    } else {
      horizon = store.state.horizon;
    }
    //const api = window.api;

    return { horizon };
  },
  methods: {
    calculateMoisture(data) {
      let condition =
        data["Bank_Moist"] != "" &&
        data["Bank_Dry"] != "" &&
        data["HorizonFe_Moist"] != "" &&
        data["Bank"] != "";
      if (!condition) {
        return "Нет данных";
      } else {
        let moisture =
          ((+data["Bank_Moist"] - +data["Bank_Dry"]) /
            (+data["Bank_Moist"] - +data["Bank"])) *
          100;
        return moisture.toFixed(5);
      }
    },
    calculateFeO_Dry(data) {
      let condition =
        data["Bank_Moist"] != "" &&
        data["Bank_Dry"] != "" &&
        data["HorizonFe_Moist"] != "" &&
        data["Bank"] != "";
      if (!condition) {
        return "Нет данных";
      } else {
        let moisture =
          ((+data["Bank_Moist"] - +data["Bank_Dry"]) /
            (+data["Bank_Moist"] - +data["Bank"])) *
          100;
        let feo = +data["HorizonFe_Moist"] / (1 - moisture / 100);
        return feo.toFixed(5);
      }
    },
  },
  computed: {
    marginForm() {
      return "margin: 0px 0px 10px";
    },
    placeholderFeO() {
      return this.calculateFeO_Dry(this.horizon);
    },
    placeholderMoisture() {
      return this.calculateMoisture(this.horizon);
    },
  },
};
</script>

<style scoped></style>
