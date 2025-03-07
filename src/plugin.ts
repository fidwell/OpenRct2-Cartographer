import * as Environment from "./environment";
import main from "./main";

registerPlugin({
  name: Environment.pluginName,
  version: Environment.pluginVersion,
  authors: Environment.pluginAuthors,
  type: "local",
  licence: "MIT",
  targetApiVersion: 104,
  main
});
