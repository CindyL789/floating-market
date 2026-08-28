# Memory

- The repository is a Vite/React game with an existing 2D `SkyFlightCanvas` and a large React HUD/modal surface. A full WebDev re-scaffold is unnecessary because the user supplied this repository as the target environment.
- The authoritative world uses coordinates from `0..1800` x `0..1600`, with district and landmark positions in `src/data/gameData.ts`.
- Implemented `src/game/CarmackEngine.ts` as a Canvas2D software raycaster with perspective projection, procedural cloud floor, billboard districts/landmarks/collectibles/storms, skiff cockpit, koi companion, wind/boost movement, pickup logic, storm damage, and state sync on dispose.
- Replaced `src/components/SkyFlightCanvas.tsx` with a React adapter that owns only HUD, telemetry, responsive touch joystick, and the engine lifecycle.
- Adjusted `handleUndockToSky` to start just outside the active district facing east so the gate is visible immediately on launch.
- The browser smoke test reached flight view successfully with no console errors. The viewport showed the raycaster horizon, moon, perspective grid, cockpit, HUD, and dock affordance.
- Direct TypeScript compilation and Vite production build pass. The repository's `pnpm` wrapper currently stops on its ignored-build-script policy before scripts run; this is an environment/package-manager issue, so use direct binaries for local verification if it persists.

## Enhancement pass

- Added `RadarBlip` telemetry with live player pose, district/landmark/collectible/storm markers, waypoint support, and a desktop radar overlay in the flight HUD.
- Added `SoundEngine.updateFlightSpatialAudio()` and `disposeFlightSpatialAudio()` with stereo panning and intensity-driven wind/storm oscillators; the engine updates these from nearby wind-current and storm-front geometry and cleans them up on unmount.
- Added procedural architectural facades to district gates: tiled wall planes, brass bands, glowing windows, roof triangles, banners, and plank/deck detailing, all depth-scaled by the raycaster.
- Browser visual check shows the radar and detailed facade silhouettes in flight view; console has no runtime errors.

## Flight combat pass

The flight deck now has collectible power-ups for wind-glider charges, grappling charges, shock cells, and hull patches. B deploys a timed high-speed wind-glider boost, G fires a directional grapple toward the best forward anchor and pulls the skiff through space, and X fires a forward shock pulse that can scatter raider skiffs. Raider skiffs drift through the world and periodically damage the hull unless the Ward lantern or Storm-Run rig protects the player. Combat HUD buttons, charge counters, radar markers, procedural entity visuals, and synthesized action cues are integrated. TypeScript, production build, browser action smoke tests, and console checks passed.
