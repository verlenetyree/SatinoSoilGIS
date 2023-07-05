<template>
  <div class="ml-6" style="height: 294px">
    <a-form-item name="IsBaseProfile">
      <a-checkbox v-model:checked="profile.IsBaseProfile"
        >Принять за единицу</a-checkbox
      >
    </a-form-item>
  </div>
  <!--<pre>{{ this.$store.state.profile }}</pre>-->
</template>

<script>
import { useStore } from "vuex";

export default {
  props: {
    status: {
      type: Boolean,
      default: true,
    },
  },
  setup() {
    const store = useStore();
    const profile = store.state.profile;

    return { profile };
  },
};
</script>

<style scoped></style>
