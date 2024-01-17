import main from "./main";
import * as Environment from "./environment";

registerPlugin({
  name: Environment.pluginName,
  version: Environment.pluginVersion,
  authors: Environment.pluginAuthors,
  type: "local",
  licence: "MIT",
  targetApiVersion: 81,
  main
});
