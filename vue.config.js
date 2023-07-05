const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [new NodePolyfillPlugin()],
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        //extraResources: ["./soil_database.sqlite"],
        extraResources: ["./soil_database.sqlite", "./Satino_DEM_cog_3857.tif"],
      },
      externals: ["knex", "sqlite3", "d3"],
    },
    vuetify: {
      // https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
    },
  },
});
