<template>
  <v-row justify="center">
    <v-col cols="5">
      <p>Новообразования / включения</p>

      <a-select
        :size="size"
        :style="selectWidth"
        placeholder="Новообразования / включения"
        v-model:value="horizon.InclusionTypeId"
        :options="optionsInclusionType"
        showSearch
      />
      <a-select
        v-for="index in selectItems"
        class="mt-4"
        :key="index"
        :size="size"
        :style="selectWidth"
        placeholder="Новообразования / включения"
        v-model:value="horizon.InclusionTypeId"
        :options="optionsInclusionType"
        showSearch
      />
    </v-col>
    <v-col cols="5">
      <p>Обилие</p>

      <a-select
        :size="size"
        :style="selectWidth"
        placeholder="Обилие"
        v-model:value="horizon.InclusionValueId"
        :options="optionsInclusionValue"
        showSearch
      />
      <a-select
        v-for="index in selectItems"
        class="mt-4"
        :key="index"
        :size="size"
        :style="selectWidth"
        placeholder="Обилие"
        v-model:value="horizon.InclusionValueId"
        :options="optionsInclusionValue"
        showSearch
      />
    </v-col>
    <v-col cols="1">
      <v-btn class="mt-9" density="comfortable" icon="mdi-minus"></v-btn>
      <v-btn
        v-for="index in selectItems"
        class="mt-3"
        :key="index"
        density="comfortable"
        icon="mdi-minus"
      ></v-btn>
    </v-col>
  </v-row>
  <v-row justify="center">
    <v-col cols="5"> </v-col>
    <v-col cols="5"> </v-col>
    <v-col cols="1">
      <v-btn
        class="mt-3"
        density="comfortable"
        icon="mdi-plus"
        @click="addSelect"
      ></v-btn>
    </v-col>
  </v-row>
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
      optionsInclusionType: [],
      optionsInclusionValue: [],
      selectItems: [],
      selectInclusionTemplate: 0,
    };
  },
  setup(props) {
    const store = useStore();
    let horizon;

    const names = ["InclusionType", "InclusionValue"];

    async function getFormData() {
      const allData = [];

      for (let name of names) {
        let data = await api.selectFormData(name);
        allData.push(data);
      }
      //  console.log(allData);
      return allData;
    }

    if (store.state.horizonEdit) {
      horizon = store.state.horizons_total[props.editId];
    } else {
      horizon = store.state.horizon;
    }
    const api = window.api;

    return {
      horizon,
      names,
      getFormData,
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
  },
  methods: {
    addSelect() {
      this.selectItems.push(this.selectInclusionTemplate++);
    },
  },
  computed: {
    marginForm() {
      return "margin: 0px 0px 15px";
    },
  },
};
</script>

<style scoped></style>
