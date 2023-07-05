<template>
  <v-container d-flex justify-center>
    <v-row no-gutters align-content="center">
      <v-col cols="9">
        <v-container d-flex justify-center class="pt-0">
          <a-table
            bordered
            :data-source="dataSource"
            :columns="columns"
            size="small"
            :style="fontStyle"
            :pagination="pagination"
          >
            <template #bodyCell="{ column, text, record }">
              <template v-if="column.dataIndex === 'code'">
                <div :style="idStyle">{{ text }}</div>
              </template>
              <template v-if="column.dataIndex === 'name'">
                <div class="editable-cell">
                  <div
                    v-if="editableData[record.key]"
                    class="editable-cell-input-wrapper"
                  >
                    <a-input
                      v-model:value="editableData[record.key].name"
                      @pressEnter="save(record.key)"
                    />
                    <check-outlined
                      class="editable-cell-icon-check"
                      @click="save(record.key)"
                    />
                  </div>
                  <div v-else class="editable-cell-text-wrapper">
                    {{ text || " " }}
                    <edit-outlined
                      class="editable-cell-icon"
                      @click="edit(record.key)"
                    />
                  </div>
                </div>
              </template>
              <template v-else-if="column.dataIndex === 'operation'">
                <a-popconfirm
                  v-if="dataSource.length"
                  title="Уверены, что хотите удалить?"
                  :style="fontStyle"
                  @confirm="onDelete(record.key)"
                >
                  <a>Удалить</a>
                </a-popconfirm>
                <a class="ml-2" @click="editHorizon(record.HorizonId)"
                  >Редактировать</a
                >
              </template>
            </template>
          </a-table>
        </v-container>
      </v-col>
      <v-col cols="3">
        <v-btn
          variant="flat"
          color="blue darken-4"
          size="small"
          class="editable-add-btn"
          @click="showModal"
          >Добавить горизонт</v-btn
        >
        <a-modal
          wrap-class-name="full-section-modal"
          width="100%"
          v-model:visible="visible"
          title="Добавить горизонт"
          @ok="handleOk"
          :afterClose="afterClose"
        >
          <!--<v-col cols="3">-->
          <template #footer>
            <a-button key="back" danger @click="handleCancel">Отмена</a-button>
            <a-button
              key="submit"
              type="primary"
              @click="
                handleHorizontData(editId);
                handleOk();
              "
              >Подвердить</a-button
            >
          </template>
          <!--</v-col>-->
          <AddSectionsData :key="renderKey" :editId="editId" />
        </a-modal>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, defineComponent, reactive, ref } from "vue";
import { CheckOutlined, EditOutlined } from "@ant-design/icons-vue";
import AddSectionsData from "@/components/form/elements/sections/AddSectionsData.vue";
import { cloneDeep } from "lodash-es";
export default defineComponent({
  components: {
    CheckOutlined,
    EditOutlined,
    AddSectionsData,
  },
  props: {
    status: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      dialog: false,
      visible: false,
      renderKey: 0,
      editId: 0,
      fontStyle: "font-size: 11px; user-select: none;",
      idStyle: "font-weight: bold; user-select: none;",
      pagination: {
        pageSize: 5,
      },
    };
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const api = window.api;

    const columns = [
      {
        title: "от",
        dataIndex: "HorizonDepthFrom",
        width: "7%",
      },
      {
        title: "до",
        dataIndex: "HorizonDepthTo",
        width: "7%",
      },
      {
        title: "Индекс",
        dataIndex: "code",
        width: "15%",
      },
      {
        title: "Горизонт",
        dataIndex: "HorizonSubtypeName",
      },
      {
        title: "Тип горизонта",
        dataIndex: "HorizonTypeName",
      },
      //{
      //  title: "FeO за ед.",
      //  dataIndex: "IsGHorizon",
      //},
      //{
      //  title: "A1 горизонт",
      //  dataIndex: "IsA1Horizon",
      //},
      {
        title: "",
        dataIndex: "operation",
        width: "10%",
      },
    ];
    const dataSource = ref(store.state.horizons_total);
    const count = computed(() => dataSource.value.length + 1);
    const editableData = reactive({});

    const edit = (key) => {
      console.log(key);
      editableData[key] = cloneDeep(
        dataSource.value.filter((item) => key === item.key)[0]
      );
    };

    const save = (key) => {
      Object.assign(
        dataSource.value.filter((item) => key === item.key)[0],
        editableData[key]
      );
      delete editableData[key];
    };

    const onDelete = (key) => {
      dataSource.value = dataSource.value.filter((item) => item.key !== key);
      store.commit("delete_horizon", key);
    };

    async function getHorizonSubtypes() {
      let data = await api.selectHorizonSubtype();

      return data;
    }

    function getHorizonCode(editId) {
      if (!store.state.horizonEdit) {
        if (
          store.state.horizon.SubHorizonNumber != null &&
          store.state.horizon.SubHorizonNumber != "0"
        ) {
          store.state.horizon.code += store.state.horizon.SubHorizonNumber;
        }
        if (store.state.horizon.IsGHorizon) {
          store.state.horizon.code += "g";
        }
        if (store.state.horizon.IsCaHorizon) {
          store.state.horizon.code += "ca";
        }
      } else {
        if (
          store.state.horizons_total[editId].SubHorizonNumber != null &&
          store.state.horizons_total[editId].SubHorizonNumber != "0"
        ) {
          store.state.horizons_total[editId].code +=
            store.state.horizons_total[editId].SubHorizonNumber;
        }
        if (store.state.horizons_total[editId].IsGHorizon) {
          store.state.horizons_total[editId].code += "g";
        }
        if (store.state.horizons_total[editId].IsCaHorizon) {
          store.state.horizons_total[editId].code += "ca";
        }
      }
    }

    const handleHorizontData = async (editId) => {
      if (!store.state.horizonEdit) {
        store.state.horizon.HorizonId = store.state.horizons_total.length;
        store.state.horizon.key = store.state.horizons_total.length;
        await getHorizonSubtypes().then((options) => {
          for (let option of options) {
            for (let child of option.children) {
              if (child.value == store.state.horizon.HorizonSubtypeId) {
                store.state.horizon.HorizonSubtypeCode = child.code;
                store.state.horizon.HorizonSubtypeName = child.type;
                store.state.horizon.HorizonTypeName = option.HorizonTypeName;
              }
            }
          }
        });
        if (store.state.horizon.SubHorizonNumber == null) {
          store.state.horizon.SubHorizonNumber == "0";
        }
        store.state.horizon.code = store.state.horizon.HorizonSubtypeCode;
        getHorizonCode(editId);

        store.commit("push");
        store.commit("new_horizon");
        //console.log(store.state.horizons_total);
      } else {
        await getHorizonSubtypes().then((options) => {
          for (let option of options) {
            for (let child of option.children) {
              if (
                child.value ==
                store.state.horizons_total[editId].HorizonSubtypeId
              ) {
                store.state.horizons_total[editId].HorizonSubtypeCode =
                  child.code;
                store.state.horizons_total[editId].HorizonSubtypeName =
                  child.type;
                store.state.horizons_total[editId].HorizonTypeName =
                  option.HorizonTypeName;
              }
            }
          }
        });
        if (store.state.horizons_total[editId].SubHorizonNumber == null) {
          store.state.horizons_total[editId].SubHorizonNumber == "0";
        }
        store.state.horizons_total[editId].code =
          store.state.horizons_total[editId].HorizonSubtypeCode;
        getHorizonCode(editId);
        store.commit("if_horizonEdit", false);
      }
    };

    const handleAdd = () => {
      //this.visible = true;
      store.state.sectionStatus = true;
      router.push({
        name: "sectionsGeneral",
      });
    };

    const handleBack = () => {
      router.push({
        name: "formGeneral",
        props: { status: false },
      });
    };

    return {
      //visible,
      store,
      columns,
      onDelete,
      handleAdd,
      handleBack,
      dataSource,
      editableData,
      count,
      edit,
      save,
      getHorizonSubtypes,
      handleHorizontData,
    };
  },
  methods: {
    handleCancel() {
      if (this.store.state.horizonEdit) {
        this.store.commit("if_horizonEdit", false);
      }
      this.visible = false;
    },
    handleOk() {
      //store.state.sectionStatus = false;
      //this.handleHorizontData();
      this.visible = false;
    },
    showModal() {
      this.renderKey += 1;
      this.visible = true;
    },
    editHorizon(key) {
      this.store.commit("if_horizonEdit", true);
      this.visible = true;
      //console.log(key);
      this.editId = key;
    },
    afterClose() {
      if (this.store.state.horizonEdit) {
        this.store.commit("if_horizonEdit", false);
      }
    },
  },
});
</script>

<style lang="less">
.nav {
  padding: 30px;
}
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    margin-top: 4px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
    font-size: 13px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
.full-section-modal {
  .ant-modal {
    max-width: 80%;
  }
  .ant-modal-content {
    display: flex;
    flex-direction: column;
    height: calc(80vh);
  }
  .ant-modal-body {
    flex: 1;
    padding: 0px 24px;
  }
}
</style>
