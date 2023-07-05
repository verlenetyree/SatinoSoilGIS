<template>
  <v-dialog
    v-model="dialog"
    persistent
    height="50vh"
    width="1024"
    :scrim="false"
    transition="dialog-bottom-transition"
  >
    <v-card>
      <v-row ref="rowToDuplicate" id="rowToDuplicate" class="mx-5 mt-2">
        <v-autocomplete
          :menu-props="{ style: { fontSize: '13px' } }"
          class="filterAutocomplete"
          density="compact"
          color="deep-purple accent-4"
          label="Атрибут"
          :items="[
            'California',
            'Colorado',
            'Florida',
            'Georgia',
            'Texas',
            'Wyoming',
          ]"
          variant="outlined"
        ></v-autocomplete>
        <v-select
          :menu-props="{ style: { fontSize: '13px' } }"
          class="filterOperator mx-4"
          density="compact"
          color="deep-purple accent-4"
          label="Оператор"
          :items="['=', '!=', '>', '<', '>=', '<=']"
          variant="outlined"
        ></v-select>
        <v-autocomplete
          :menu-props="{ style: { fontSize: '13px' } }"
          class="filterAutocomplete"
          density="compact"
          color="deep-purple accent-4"
          label="Значение"
          :items="[
            'California',
            'Colorado',
            'Florida',
            'Georgia',
            'Texas',
            'Wyoming',
          ]"
          variant="outlined"
        ></v-autocomplete>
      </v-row>
      <v-btn
        class="mx-5"
        prepend-icon="mdi-plus"
        color="deep-purple accent-4"
        variant="tonal"
        @click="duplicateRow"
      >
        Добавить фильтр
      </v-btn>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="deep-purple accent-4"
          variant="text"
          @click="$emit('close')"
        >
          Закрыть
        </v-btn>
        <v-btn
          color="deep-purple accent-4"
          variant="text"
          @click="$emit('close')"
        >
          Сохранить
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { ref } from "vue";
export default {
  props: {
    showMapDialog: { type: Boolean, required: true },
  },
  data() {
    return {
      dialog: false,
      data: [],
    };
  },
  setup() {
    //const api = window.api;
    const rowToDuplicate = ref(null);

    const duplicateRow = () => {
      const originalRow = document.querySelector("#rowToDuplicate");
      const clonedRow = originalRow.cloneNode(true);
      originalRow.insertAdjacentElement("afterend", clonedRow);
    };

    return {
      rowToDuplicate,
      duplicateRow,
    };
  },
  mounted() {
    //console.log(this.data);
  },
  watch: {
    showMapDialog() {
      this.dialog = this.$props.showMapDialog;
    },
  },
  methods: {},
};
</script>

<style>
.dialog-bottom-transition-enter-active,
.dialog-bottom-transition-leave-active {
  transition: transform 0.2s ease-in-out;
}
.btn {
  margin-top: 5px;
  margin-bottom: 10px;
}
.button-group {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin-bottom: 24px;
}
.filterAutocomplete {
  width: 25%;
}
.filterOperator {
  width: 5%;
}
</style>
