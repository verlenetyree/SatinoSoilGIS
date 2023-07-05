<template>
  <a-form-item label="Мезорельеф" name="MesoreliefId" :style="marginForm">
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Мезорельеф"
      v-model:value="profile.MesoreliefId"
      :options="optionsMesorelief"
      showSearch
    />
  </a-form-item>
  <a-form-item label="Микрорельеф" name="MicroreliefId" :style="marginForm">
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Микрорельеф"
      v-model:value="profile.MicroreliefId"
      :options="optionsMicrorelief"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <a-form-item
    label="Геохимическая позиция"
    name="GeochemicalPositionId"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
    :style="marginForm"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Геохимическая позиция"
      v-model:value="profile.GeochemicalPositionId"
      :options="optionsGeochemicalPosition"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <a-form-item label="Верховодка" name="SoilWaterDepthId" :style="marginForm">
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Верховодка"
      v-model:value="profile.SoilWaterDepthId"
      :options="optionsSoilWaterDepth"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <a-form-item
    label="Почва"
    name="SoilSubtypeId"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-tree-select
      :size="size"
      :style="selectWidth"
      :treeDefaultExpandAll="true"
      v-model:value="profile.SoilSubtypeId"
      :tree-data="optionsSoilSubtype"
      placeholder="Почва"
      allowClear
      showSearch
    />
  </a-form-item>
  <a-form-item
    label="Почвообразующая порода"
    name="ParentMaterialId"
    :style="marginForm"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Почвообразующая порода"
      v-model:value="profile.ParentMaterialId"
      :options="optionsParentMaterial"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <a-form-item
    label="Тип растительности"
    name="VegetationTypeId"
    :style="marginForm"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Тип растительности"
      v-model:value="profile.VegetationTypeId"
      :options="optionsVegetationType"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
</template>

<script>
import { useStore } from "vuex";
//import { v4 as uuidv4 } from "uuid";

export default {
  props: {
    status: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      size: "small",
      selectWidth: "width: 100%; text-align: left;",
      optionsMesorelief: [],
      optionsMicrorelief: [],
      optionsGeochemicalPosition: [],
      optionsSoilWaterDepth: [],
      optionsSoilSubtype: [],
      optionsParentMaterial: [],
      optionsVegetationType: [],
    };
  },
  setup() {
    const store = useStore();
    const profile = store.state.profile;
    //console.log(profile);
    const api = window.api;

    const names = [
      "Mesorelief",
      "Microrelief",
      "GeochemicalPosition",
      "SoilWaterDepth",
      "ParentMaterial",
      "VegetationType",
    ];

    async function getFormData() {
      const allData = [];

      for (let name of names) {
        let data = await api.selectFormData(name);
        allData.push(data);
      }
      return allData;
    }

    async function getSoilData() {
      let data = await api.selectSoilData(name);

      return data;
    }

    return {
      profile,
      names,
      getFormData,
      getSoilData,
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
      })
      .catch((err) => {
        console.log(err);
      });
    this.getSoilData().then((options) => {
      for (let option of options) {
        this.optionsSoilSubtype.push({
          label: option.SoilTypeName,
          value: option.SoilTypeName,
          children: option.children,
        });
      }
      console.log(this.optionsSoilSubtype);
    });
  },
  computed: {
    marginForm() {
      return "margin: 0px 0px 10px";
    },
  },
};
</script>

<style scoped></style>
