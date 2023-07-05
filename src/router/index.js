import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";

import MainWindow from "@/components/MainWindow.vue";

import AddDataForm from "@/components/form/AddDataForm.vue";
import formGeneral from "@/components/form/states/FormGeneral.vue";
import formDetails from "@/components/form/states/FormDetails.vue";
import formChemestry from "@/components/form/states/FormChemestry.vue";

//import AddSectionsData from "@/components/form/elements/sections/AddSectionsData.vue";
import sectionsGeneral from "@/components/form/elements/sections/SectionsGeneral.vue";
import sectionsMorpho from "@/components/form/elements/sections/SectionsMorpho.vue";
import sectionsChemestry from "@/components/form/elements/sections/SectionsChemestry.vue";
//import FormTable from "@/components/form/elements/sections/FormTable.vue";
import DataReviewPage from "@/components/form/elements/DataReviewPage.vue";

const routes = [
  {
    path: "/",
    name: "MainWindow",
    component: MainWindow,
  },
  {
    path: "/form",
    name: "AddDataForm",
    component: AddDataForm,
    children: [
      {
        path: "",
        name: "formGeneral",
        component: formGeneral,
      },
      {
        path: "details",
        name: "formDetails",
        component: formDetails,
      },
      {
        path: "chemestry",
        name: "formChemestry",
        component: formChemestry,
      },
      {
        path: "general",
        name: "sectionsGeneral",
        component: sectionsGeneral,
      },
      {
        path: "morpho",
        name: "sectionsMorpho",
        component: sectionsMorpho,
      },
      {
        path: "geochemestry",
        name: "sectionsChemestry",
        component: sectionsChemestry,
      },
      //{
      //  path: "datareview/:id",
      //  name: "DataReviewPage",
      //  component: DataReviewPage,
      //  props: true,
      //},
    ],
  },
  {
    path: "/datareview/:id",
    name: "DataReviewPage",
    component: DataReviewPage,
    props: true,
  },

  //{
  //  path: "/table",
  //  name: "FormTable",
  //  component: FormTable,
  //},
  //{
  //  path: "/about",
  //  name: "about",
  //  // route level code-splitting
  //  // this generates a separate chunk (about.[hash].js) for this route
  //  // which is lazy-loaded when the route is visited.
  //  component: () =>
  //    import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  //},
];

const router = createRouter({
  //history: createWebHistory(process.env.BASE_URL),
  history: process.env.IS_ELECTRON
    ? createWebHashHistory()
    : createWebHistory(),
  routes,
});

export default router;
