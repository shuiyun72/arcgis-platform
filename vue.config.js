const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  chainWebpack: config => {
    config.resolve.alias
      .set("@vue", resolve("node_modules/vue/dist/vue.min.js"))
      .set("@", resolve("src"))
      .set("@config", resolve("config"))
      .set("@public", resolve("public"))
      .set("@assets", resolve("src/assets"))
      .set("@router", resolve("src/router"))
      .set("@store", resolve("src/store"))
      .set("@api", resolve("src/api"))
      .set("@features", resolve("src/features"))
      .set("@services", resolve("src/services"))
      .set("@libs", resolve("src/libs"))
      .set("@common", resolve("src/common"))
      .set("@components", resolve("src/common/components"))
      .set("@util", resolve("src/common/util"))
      .set("@directives", resolve("src/common/directives"))
      .set("@filters", resolve("src/common/filters"));
  }
};
