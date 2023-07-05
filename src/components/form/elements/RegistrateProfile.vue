<template>
  <a-form-item
    label="Год"
    name="ProfileYear"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-select
      :disabled="status"
      v-model:value="profile.ProfileYear"
      placeholder="Год"
      :size="size"
      :options="optionsYear"
      showSearch
    />
  </a-form-item>
  <a-form-item
    label="Профиль"
    name="ProfileGroupId"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-select
      :disabled="status"
      placeholder="Профиль"
      v-model:value="profile.ProfileGroupId"
      :size="size"
      :options="optionsProfile"
      showSearch
    />
  </a-form-item>
  <a-form-item
    label="Номер на профиле"
    name="ProfileNumber"
    :style="marginForm"
    :rules="[
      { required: true, message: 'Данное поле является обязательным' },
      { validator: checkProfileNumber },
    ]"
  >
    <a-input
      type="number"
      :disabled="status"
      placeholder="Номер на профиле"
      v-model:value="profile.ProfileNumber"
      :size="size"
    />
  </a-form-item>
  <a-form-item
    label="Повторность"
    name="ProfileRepeat"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-select
      :disabled="status"
      placeholder="Повторность"
      v-model:value="profile.ProfileRepeat"
      :size="size"
      :options="optionsRepeat"
      showSearch
    />
  </a-form-item>
</template>

<script>
import { useStore } from "vuex";

export default {
  props: {
    status: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      optionsYear: [],
      optionsProfile: [],
      optionsRepeat: [],
      selectWidth: "width: 400px; text-align: left;",
    };
  },
  setup() {
    const store = useStore();
    const profile = store.state.profile;
    const api = window.api;
    async function getValidYears() {
      const years = await api.selectProfile("getValidYears");
      return years.reverse();
    }
    async function getProfile() {
      const profiles = await api.selectProfile("getProfile");
      return profiles;
    }
    async function getRepeat() {
      const repeats = await api.selectProfile("getRepeat");
      return repeats;
    }
    async function getExistingNumbers() {
      const numbers = await api.getExistingNumbers(
        this.profile.ProfileYear,
        this.profile.ProfileGroupId,
        this.profile.ProfileRepeat
      );
      return numbers.flat();
    }
    return {
      store,
      profile,
      getValidYears,
      getProfile,
      getRepeat,
      getExistingNumbers,
    };
  },
  created() {
    this.getValidYears().then((years) => {
      for (let year of years) {
        this.optionsYear.push({
          value: year,
          name: year,
        });
      }
    });
    this.getProfile().then((profiles) => {
      for (let profile of profiles) {
        this.optionsProfile.push({
          value: profile,
          name: profile,
        });
      }
    });
    this.getRepeat().then((repeats) => {
      for (let repeat of repeats) {
        this.optionsRepeat.push({
          value: repeat,
          name: repeat,
        });
      }
    });
  },
  methods: {
    async checkProfileNumber() {
      const existingNumbers = await this.getExistingNumbers();
      if (
        existingNumbers.indexOf(this.profile.ProfileNumber) != -1 &&
        this.store.state.edit != true
      ) {
        return Promise.reject("Разрез с указанными параметрами уже существует");
      } else {
        return Promise.resolve();
      }
    },
  },
  computed: {
    size() {
      return this.status ? "small" : "large";
    },
    marginForm() {
      return this.status ? "margin: 0px 0px 10px" : "";
    },
  },
};
</script>

<style scoped>
.ant-form-item-explain,
.ant-form-item-extra {
  text-align: left;
}
</style>

<!--.ant-select-selector {
  text-align: left;
  font-size: 10px;
}-->

<!--
.ant-select-selector:focus { border-color: #57a8e9; outline: 0;
-webkit-box-shadow: 0 0 0 2px rgba(87, 168, 233, 0.2); box-shadow: 0 0 0 2px
rgba(87, 168, 233, 0.2); }-->
