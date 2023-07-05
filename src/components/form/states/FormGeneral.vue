<template>
  <RegistrateProfile :status="status" />
  <RegistrateProfileAdd v-if="status" />
  <div v-show="!status" class="buttons-div">
    <v-btn
      class="buttons"
      v-show="!status"
      type="primary"
      html-type="submit"
      @click="handleNext"
      color="blue darken-4"
      variant="flat"
      >Далее</v-btn
    >
    <!--<a-button
      class="buttons"
      v-show="!status"
      type="primary"
      html-type="submit"
      @click="handleNext"
      >Далее</a-button
    >-->
  </div>
</template>

<script>
import RegistrateProfile from "@/components/form/elements/RegistrateProfile.vue";
import RegistrateProfileAdd from "@/components/form/elements/RegistrateProfileAdd.vue";
import { useStore } from "vuex";

export default {
  components: {
    RegistrateProfile,
    RegistrateProfileAdd,
  },
  props: {
    status: {
      type: Boolean,
      required: true,
    },
  },
  setup() {
    const store = useStore();

    return { store };
  },
  methods: {
    handleNext() {
      //this.store.commit("change_status", true);
    },
  },
};
</script>

<style scoped>
.buttons-div {
  padding: 40px;
  display: flex;
  justify-content: center;
}
</style>
