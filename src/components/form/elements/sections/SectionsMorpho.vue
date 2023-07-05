<template>
  <a-form-item label="Характер окраски" name="PaintId" :style="marginForm">
    <a-select
      :style="selectWidth"
      :size="size"
      placeholder="Характер окраски"
      v-model:value="horizon.PaintId"
      :options="optionsPaint"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>

  <a-form-item label="Цвет горизонта" name="HorizonTintId" :style="marginForm">
    <a-input-search
      :placeholder="placeholder"
      :size="size"
      :style="selectWidth"
      disabled
    >
      <template #enterButton>
        <a-button type="primary" @click="showModal" disabled>...</a-button>
      </template>
    </a-input-search>
  </a-form-item>
  <a-modal
    wrap-class-name="full-modal-color"
    width="100%"
    v-model:visible="visible"
    title="Цвет пятен"
    @ok="handleOk"
    ><template #footer>
      <a-button key="back" danger @click="handleCancel">Отмена</a-button>
      <a-button key="submit" type="primary" @click="handleOk"
        >Подвердить</a-button
      >
    </template>
    <ModalColor />
  </a-modal>
  <a-form-item label="Цвет пятен" name="SpotTintId" :style="marginForm">
    <a-input-search
      :placeholder="placeholder"
      :size="size"
      :style="selectWidth"
      disabled
    >
      <template #enterButton>
        <a-button type="primary" @click="showModal" disabled>...</a-button>
      </template>
    </a-input-search>
  </a-form-item>
  <a-modal
    wrap-class-name="full-modal-color"
    width="100%"
    v-model:visible="visible"
    title="Цвет горизонта"
    @ok="handleOk"
    ><template #footer>
      <a-button key="back" danger @click="handleCancel">Отмена</a-button>
      <a-button key="submit" type="primary" @click="handleOk"
        >Подвердить</a-button
      >
    </template>
    <ModalColor />
  </a-modal>
  <!--
    <a-form-item label="Цвет горизонта" name="HorizonTintId">
      <a-tree-select
        :style="selectWidth"
        v-model:value="horizon.HorizonTintId"
        :tree-data="optionsHorizonTint"
        fieldNames="{children:'children',
      label:'label', key:'key', value: 'value' }"
        placeholder="Цвет горизонта"
        allowClear
        showSearch
      />
    </a-form-item>-->
  <!--<a-form-item label="Цвет пятен" name="SpotTintId" :style="marginForm">
    <a-tree-select
      :size="size"
      :style="selectWidth"
      v-model:value="horizon.SpotTintId"
      :tree-data="optionsSpotTint"
      :fieldNames="{
        children: 'children',
        label: 'label',
        key: 'key',
        value: 'value',
      }"
      placeholder="Цвет пятен"
      allowClear
      showSearch
    />
  </a-form-item>-->
  <a-form-item
    label="Структура основная"
    name="MainStructureId"
    :style="marginForm"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Структура основная"
      v-model:value="horizon.MainStructureId"
      :options="optionsMainStructure"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <a-form-item
    label="Структура дополнительная"
    name="AdditionalStructureId"
    :style="marginForm"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Структура дополнительная"
      v-model:value="horizon.AdditionalStructureId"
      :options="optionsAdditionalStructure"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <a-form-item
    label="Механический состав"
    name="MechanicalCompositionId"
    :style="marginForm"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Механический состав"
      v-model:value="horizon.MechanicalCompositionId"
      :options="optionsMechanicalComposition"
      showSearch
    />
  </a-form-item>
  <a-form-item label="Сложение" name="DensityId" :style="marginForm">
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Сложение"
      v-model:value="horizon.DensityId"
      :options="optionsDensity"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <a-form-item label="Влажность" name="MoistureId" :style="marginForm">
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Влажность"
      v-model:value="horizon.MoistureId"
      :options="optionsMoisture"
      showSearch
    />
  </a-form-item>
  <a-form-item
    label="Форма нижней границы"
    name="BorderFormId"
    :style="marginForm"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Форма нижней границы"
      v-model:value="horizon.BorderFormId"
      :options="optionsBorderForm"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <a-form-item
    label="Характер перехода"
    name="TransitionId"
    :style="marginForm"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Характер перехода"
      v-model:value="horizon.TransitionId"
      :options="optionsTransition"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
</template>

<script>
import { useStore } from "vuex";
import ModalColor from "@/components/form/elements/modal/ModalColor.vue";
//import VSwatches from "vue-swatches";
//import "vue-swatches/dist/vue-swatches.css";
//import { v4 as uuidv4 } from "uuid";

export default {
  components: {
    ModalColor,
  },
  props: {
    editId: {
      type: Number,
    },
  },
  //components: { VSwatches },
  //props: {
  //  status: {
  //    type: Boolean,
  //    default: true,
  //  },
  //},
  data() {
    return {
      size: "small",
      visible: false,
      selectWidth: "width: 100%; text-align: left;",
      color: "#1CA085",
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
    const store = useStore();
    let horizon;

    if (store.state.horizonEdit) {
      horizon = store.state.horizons_total.filter((obj) => {
        return obj.HorizonId === props.editId;
      })[0];
    } else {
      horizon = store.state.horizon;
    }

    const api = window.api;

    const names = [
      "Paint",
      //"HorizonTint",
      //"SpotTint",
      "MainStructure",
      "AdditionalStructure",
      "MechanicalComposition",
      "Density",
      "Moisture",
      "BorderForm",
      "Transition",
    ];

    async function getFormData() {
      const allData = [];

      for (let name of names) {
        let data = await api.selectFormData(name);
        allData.push(data);
      }
      //console.log(allData);
      return allData;
    }

    //async function getSoilData() {
    //  let data = await api.selectSoilData(name);

    //  return data;
    //}

    return {
      store,
      horizon,
      names,
      getFormData,
      //getSoilData,
    };
  },
  created() {
    this.getFormData()
      .then((items) => {
        for (let i = 0; i < items.length; i++) {
          for (let j = 0; j < items[i].length; j++) {
            eval("this.options" + this.names[i]).push({
              label: eval(`items[${i}][${j}].` + this.names[i] + "Name"),
              value: eval(`items[${i}][${j}].` + this.names[i] + "Id"),
            });
          }
        }
        if (this.store.state.horizonEdit) {
          for (let i = 0; i < this.names.length; i++) {
            const hName = Object.entries(this.horizon).filter((obj) => {
              return obj[0] == this.names[i] + "Name";
            })[0];
            const hId = Object.entries(this.horizon).filter((obj) => {
              return obj[0] == this.names[i] + "Id";
            });
            if (hId.length == 0) {
              const options = new Array(eval("this.options" + this.names[i]));

              let id = null;
              options.filter((obj) => {
                id = obj.filter((opt) => {
                  return opt.label == hName[1];
                });
              });
              //console.log(id[0].value);
              this.horizon[`${this.names[i] + "Id"}`] = id[0].value;
            }
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //console.log(Object.entries(this.horizon).map((horizon) => horizon[0]));

    //this.getSoilData().then((options) => {
    //  for (let option of options) {
    //    this.optionsSoilSubtype.push({
    //      label: option.SoilTypeName,
    //      value: option.SoilTypeName,
    //      children: option.children,
    //    });
    //  }
    //});
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    handleOk() {
      this.visible = false;
    },
  },
  computed: {
    placeholder() {
      return this.$store.state.PaintId
        ? this.$store.state.PaintId
        : "Цвет горизонта";
    },
    marginForm() {
      return "margin: 0px 0px 10px";
    },
  },
};
</script>

<style lang="less">
.full-modal-color {
  .ant-modal {
    max-width: 70%;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(70vh);
  }
  .ant-modal-body {
    flex: 1;
  }
}
</style>
