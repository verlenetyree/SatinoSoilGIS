<template>
  <DxChart id="chart" :data-source="singleChart" height="450px">
    <DxCommonSeriesSettings argument-field="id" type="fullstackedbar" />
    <DxValueAxis position="right" :visible="false" />
    <DxArgumentAxis :visible="false" />
    <!--<DxSeries
            v-for="(code, index) in singleChart.codes"
            :value-field="index"
            :name="code"
            :key="index"
          />-->
    <DxSeries value-field="0" name="C" />
    <DxSeries value-field="1" name="C" />
    <DxSeries value-field="2" name="A1C" />
    <DxSeries value-field="3" name="A1" />
    <DxSeries value-field="4" name="A0" />
    <!--<DxSeries value-field="older" name="65 and older" />-->
  </DxChart>
</template>

<script>
import {
  DxChart,
  DxSeries,
  DxCommonSeriesSettings,
  DxValueAxis,
  DxArgumentAxis,
  //DxTitle,
  //DxLegend,
  //DxExport,
  //DxTooltip,
} from "devextreme-vue/chart";

export default {
  components: {
    DxChart,
    DxSeries,
    DxCommonSeriesSettings,
    DxValueAxis,
    DxArgumentAxis,
    //DxTitle,
    //DxLegend,
    //DxExport,
    //DxTooltip,
  },
  data() {
    return {
      horizonChartData: [],
      singleChart: [
        {
          id: 3661,
          codes: ["C", "C", "A1C", "A1", "A0"],
          0: 43,
          1: 31,
          2: 21,
          3: 26,
          4: 2,
        },
      ],
      codes: [],
    };
  },
  setup() {
    const api = window.api;

    async function getHorizonsDataById(id) {
      let data = await api.getHorizonsDataById(id);

      return data;
    }
    return {
      getHorizonsDataById,
    };
  },
  created() {
    this.getHorizonsDataById(this.id).then((data) => {
      //let arr = [];
      //let codes = [];
      for (let d of data) {
        let h = {};
        h.id = this.id;
        h.hid = d.HorizonId;
        h.name = d.HorizonSubtypeCode;
        h.depth = d.HorizonDepthTo - d.HorizonDepthFrom;
        h[d.HorizonSubtypeCode] = d.HorizonDepthTo - d.HorizonDepthFrom;
        h.HorizonDepthFrom = d.HorizonDepthFrom;
        h.HorizonDepthTo = d.HorizonDepthTo;
        this.horizonChartData.push(h);

        ////this.singleChart.id = this.id;
        ////this.singleChart[h.name] = h.depth;

        //arr.push(d.HorizonDepthFrom);

        //codes.push(d.HorizonSubtypeCode);
      }
      //arr.sort((a, b) => a - b);

      console.log(this.horizonChartData);
    });
  },
};
</script>

<style lang="css" scoped></style>
