<template>
  <div class="text-center">
    <v-dialog v-model="show" persistent width="50vw">
      <v-card class="pa-3">
        <v-alert
          border="start"
          variant="tonal"
          class="pa-5"
          :title="file"
          :type="code"
        >
          <span v-html="text"></span>
        </v-alert>
        <v-card-actions class="mt-3" v-if="code != 'warning'">
          <v-btn block @click="agree" :color="code" variant="flat"
            >Закрыть</v-btn
          >
        </v-card-actions>
        <v-card-actions class="mt-3" v-else>
          <v-btn
            @click="agree"
            class="flex-grow-1 mx-6"
            :color="code"
            variant="flat"
            >Да</v-btn
          >
          <v-btn
            @click="cancel"
            class="flex-grow-1 mx-6"
            :color="code"
            variant="flat"
            >Нет</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: { type: Boolean, required: true },
    errorCode: { type: String, required: true },
    errorMsg: { type: String, required: true },
    fileName: { type: String, required: true },
  },
  data() {
    return {
      show: false,
      code: "",
      text: "",
      file: "",
      resolve: null,
      reject: null,
      //alertTypes: [
      //  { code: "missingIDs", type: "warning" },
      //  { code: "fieldError", },
      //],
    };
  },
  watch: {
    visible() {
      this.show = this.$props.visible;
    },
    errorCode() {
      this.code = this.$props.errorCode;
    },
    errorMsg() {
      this.text = this.$props.errorMsg;
    },
    fileName() {
      this.file = this.$props.fileName;
    },
  },
  methods: {
    open() {
      this.show = true;
      return new Promise((resolve, reject) => {
        this.resolve = resolve;
        this.reject = reject;
      });
    },
    agree() {
      this.resolve(true);
      this.show = false;
    },
    cancel() {
      this.resolve(false);
      this.show = false;
    },
    selectAlertType() {
      for (let type of this.alertTypes) {
        if (type.code == this.code) {
          return type.type;
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
