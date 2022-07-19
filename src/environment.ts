/// <reference path="environment.d.ts" />

export const pluginVersion = "1.3";
export const pluginName = "Cartographer";
export const pluginAuthors = ["fidwell"];
export const buildConfiguration: BuildConfiguration = __BUILD_CONFIGURATION__;
export const isProduction = (buildConfiguration === "production");
export const isDevelopment = (buildConfiguration === "development");
export const isUiAvailable = (typeof ui !== "undefined");
export const namespace = "cartographer";
