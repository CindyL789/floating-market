# Carmack-Style 3D Flight Upgrade

## Goal
Replace the 2D sky-flight canvas with a browser-native software-rendered 2.5D engine inspired by early Carmack raycasters, while preserving the game's existing React HUD, district docking, collectibles, hazards, lantern modes, and mobile controls.

## Risk slices

1. **Raycast corridor and depth projection**: cast one ray per screen column through a grid of sectors and render perspective-correct cloud-floor bands, horizon, and vertical market walls.
2. **World-space gameplay**: preserve the existing 1800x1600 world coordinates, input model, wind currents, storms, collectible interaction, and district proximity logic.
3. **Billboard entities**: project districts, collectibles, storm arcs, moon-koi, and skiff markers into the 3D view without introducing heavy models or asset imports.
4. **React lifecycle and state sync**: keep the renderer isolated in a component with safe animation-loop cleanup and sync the flight state back to React on unmount.
5. **Readable HUD/control affordances**: keep the existing global top navigation and add a raycaster-specific flight overlay that communicates speed, waypoint, lantern mode, and dock action.

## Verification criteria

- `pnpm lint` passes.
- `pnpm build` passes.
- Flight view is visibly 3D: horizon, perspective floor, depth-scaled entities, vertical landmark gates, and cockpit foreground.
- WASD/arrow movement, Space boost, keys 1/2/3 lantern modes, and F/E docking work.
- Collectibles are removed and reward existing `GameState` resources.
- Storm zones damage hull, while Storm-Run rig / Ward lantern mitigate damage as in the original behavior.
- District docking routes back into the existing district view.
- The renderer does not leak animation frames, keyboard listeners, or audio on unmount.
