# Cartographer for OpenRCT2

![Preview](https://github.com/user-attachments/assets/87c0f46c-cea6-4544-8976-4e3f187f489c)

This is a plugin for OpenRCT2. It will draw a map of your park. Instead of the weird diagonal map that is built in to the game, this map is orthogonally-oriented and thus easier to read. It uses solid colors to represent different surface textures, footpaths, rides, water, scenery, and rides, each of which can be toggled on and off.

You can also toggle a heatmap that shows which tiles have peeps on them, which uses a white-yellow-orange gradient coloring. If a tile has more than 15 peeps, it will show up in pink to indicate a possible peep trap.

It doesn't really do anything else, but it looks neat. You could take a screenshot of the map, import it into some image program, and then do something fun with it.

### Planned features / known issues

The map does not automatically refresh during construction (this would cause an enormous performance hit). Instead, you can toggle any of the show/hide buttons to reload data, or simply close and re-open the map.

Currently, the OpenRCT2 API does not allow for clicking on the map to pan in-game to a location.

Please submit any ideas under [issues](https://github.com/fidwell/OpenRct2-Cartographer/issues).

## Installation

1. This plugin requires at least OpenRCT2 version v0.3.3 (release) or the newest develop version.
2. Download the latest version of the plugin from the [Releases page](https://github.com/fidwell/OpenRct2-Cartographer/releases).
3. Put the downloaded .js file into your `/OpenRCT2/plugin` folder.
4. The plugin settings window can be found in-game in the dropdown menu under the map icon.

## Modifying this plugin

This plugin's codebase is based on [wisnia74's TypeScript template](https://github.com/wisnia74/openrct2-typescript-mod-template). See the steps in [Basssiiie's Ride Vehicle Editor plugin README](https://github.com/Basssiiie/OpenRCT2-RideVehicleEditor#building-the-source-code) for instructions on building and running the source code.

## Notes

Thanks to [wisnia74](https://github.com/wisnia74/openrct2-typescript-mod-template) for providing the template for this mod and readme. Thanks to [Basssiiie](https://github.com/Basssiiie/OpenRCT2-RideVehicleEditor) for additional templating for the source code and this README.
