<template>
  <a-form-item
    label="Местоположение"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-input-search
      :size="size"
      :placeholder="placeholder"
      :style="selectWidth"
      disabled
    >
      <template #enterButton>
        <a-button type="primary" @click="showModal">...</a-button>
      </template>
    </a-input-search>
  </a-form-item>
  <a-modal
    wrap-class-name="full-modal"
    width="100%"
    v-model:visible="visible"
    title="Выбор координат"
    @ok="handleOk"
    ><template #footer>
      <a-button key="back" danger @click="handleCancel">Отмена</a-button>
      <a-button key="submit" type="primary" @click="handleOk"
        >Подвердить</a-button
      >
    </template>
    <ModalMap />
  </a-modal>
  <a-form-item
    label="Дата наблюдения"
    name="ProfileDate"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-date-picker
      :size="size"
      :style="selectWidth"
      :format="dateFormat"
      :valueFormat="dateFormat"
      placeholder="Дата наблюдения"
      v-model:value="profile.ProfileDate"
    />
  </a-form-item>
  <a-form-item
    label="Преподаватель"
    name="TeacherId"
    :style="marginForm"
    :rules="[{ required: true, message: 'Данное поле является обязательным' }]"
  >
    <a-select
      :size="size"
      :style="selectWidth"
      placeholder="Преподаватель"
      v-model:value="profile.TeacherId"
      :options="optionsTeacher"
      showSearch
      optionFilterProp="label"
    />
  </a-form-item>
  <!--<div class="buttons-div">
    <a-button
      v-if="status"
      type="primary"
      html-type="submit"
      @click="handleNext"
      >Далее</a-button
    >
  </div>-->
</template>

<script>
import ModalMap from "@/components/form/elements/modal/ModalMap.vue";
import { useStore } from "vuex";

export default {
  components: {
    ModalMap,
  },
  data() {
    return {
      size: "small",
      status: true,
      visible: false,
      loading: false,
      optionsTeacher: [],
      dateFormat: "YYYY-MM-DD",
      selectWidth: "width: 100%; text-align: left;",
      layout: {
        labelCol: {
          span: 6,
        },
        wrapperCol: {
          span: 14,
        },
      },
    };
  },
  setup() {
    const store = useStore();
    const profile = store.state.profile;
    const api = window.api;

    async function getTeacher() {
      const data = await api.selectFormData("Teacher");
      return data;
    }
    return {
      profile,
      getTeacher,
    };
  },
  created() {
    //console.log(this.profile);
    this.getTeacher().then((teachers) => {
      for (let teacher of teachers) {
        if (teacher.TeacherName === "") {
          continue;
        }
        this.optionsTeacher.push({
          label: teacher.TeacherName,
          value: teacher.TeacherId,
        });
      }
    });
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
    handleNext() {
      this.$router.push({
        name: "AddSectionsData",
      });
    },
  },
  computed: {
    placeholder() {
      return (
        "X: " +
        (this.$store.state.coords[1]
          ? this.$store.state.coords[1]
          : "Нет данных") +
        "; Y:  " +
        (this.$store.state.coords[0]
          ? this.$store.state.coords[0]
          : "Нет данных")
      );
    },
    marginForm() {
      return "margin: 0px 0px 10px";
    },
  },
};
</script>

<style lang="less">
.buttons-div {
  padding: 40px;
  display: flex;
  justify-content: center;
}
.ant-form-item-explain,
.ant-form-item-extra {
  text-align: left;
}
.full-modal {
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
