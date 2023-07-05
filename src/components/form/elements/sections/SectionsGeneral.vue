<template>
  <a-form-item
    label="Глубина от, см"
    name="HorizonDepthFrom"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-input
      type="number"
      :size="size"
      :style="selectWidth"
      placeholder="Глубина от, см"
      v-model:value="horizon.HorizonDepthFrom"
    />
  </a-form-item>
  <a-form-item
    label="Глубина до, см"
    name="HorizonDepthTo"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-input
      type="number"
      :size="size"
      :style="selectWidth"
      placeholder="Глубина до, см"
      v-model:value="horizon.HorizonDepthTo"
    />
  </a-form-item>
  <a-form-item
    label="Индекс горизонта"
    name="HorizonSubtypeId"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-tree-select
      :size="size"
      :style="selectWidth"
      v-model:value="horizon.HorizonSubtypeId"
      :tree-data="optionsHorizonSubtype"
      :treeDefaultExpandAll="true"
      :fieldNames="{
        children: 'children',
        label: 'label',
        key: 'key',
        value: 'value',
      }"
      placeholder="Индекс горизонта"
      allowClear
      showSearch
    />
  </a-form-item>
  <a-form-item label="Номер подгоризонта" name="SubHorizonNumber">
    <a-input
      type="number"
      :size="size"
      :style="selectWidth"
      placeholder="Номер подгоризонта"
      v-model:value="horizon.SubHorizonNumber"
    />
  </a-form-item>
  <!--<a-row>
    <a-col :span="8" :offset="6">-->
  <div class="ml-15">
    <a-form-item name="IsGHorizon" :style="marginForm">
      <a-checkbox v-model:checked="horizon.IsGHorizon"
        >Оглеенный горизонт</a-checkbox
      >
    </a-form-item>
    <a-form-item name="IsCaHorizon" :style="marginForm">
      <a-checkbox v-model:checked="horizon.IsCaHorizon"
        >Карбонатный горизонт</a-checkbox
      >
    </a-form-item>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  props: {
    editId: {
      type: Number,
    },
  },
  data() {
    return {
      size: "default",
      selectWidth: "width: 100%; text-align: left;",
      optionsHorizonSubtype: [],
    };
  },
  setup(props) {
    const store = useStore();
    let horizon;

    if (store.state.horizonEdit) {
      horizon = store.state.horizons_total.filter((obj) => {
        return obj.HorizonId === props.editId;
      })[0];
      console.log(horizon);
    } else {
      horizon = store.state.horizon;
    }

    const api = window.api;

    async function getHorizonSubtypes() {
      let data = await api.selectHorizonSubtype();

      return data;
    }

    return {
      horizon,
      getHorizonSubtypes,
    };
  },
  created() {
    this.getHorizonSubtypes().then((options) => {
      for (let option of options) {
        this.optionsHorizonSubtype.push({
          label: option.HorizonTypeName,
          value: option.HorizonTypeName,
          children: option.children,
        });
      }
    });
  },
  computed: {
    marginForm() {
      return "margin: 0px 0px 20px";
    },
  },
};
</script>

<style scoped></style>
