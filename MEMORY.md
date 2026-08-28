# Memory

- The repository is a Vite/React game with an existing 2D `SkyFlightCanvas` and a large React HUD/modal surface. A full WebDev re-scaffold is unnecessary because the user supplied this repository as the target environment.
- The authoritative world uses coordinates from `0..1800` x `0..1600`, with district and landmark positions in `src/data/gameData.ts`.
- Implemented `src/game/CarmackEngine.ts` as a Canvas2D software raycaster with perspective projection, procedural cloud floor, billboard districts/landmarks/collectibles/storms, skiff cockpit, koi companion, wind/boost movement, pickup logic, storm damage, and state sync on dispose.
- Replaced `src/components/SkyFlightCanvas.tsx` with a React adapter that owns only HUD, telemetry, responsive touch joystick, and the engine lifecycle.
- Adjusted `handleUndockToSky` to start just outside the active district facing east so the gate is visible immediately on launch.
- The browser smoke test reached flight view successfully with no console errors. The viewport showed the raycaster horizon, moon, perspective grid, cockpit, HUD, and dock affordance.
- Direct TypeScript compilation and Vite production build pass. The repository's `pnpm` wrapper currently stops on its ignored-build-script policy before scripts run; this is an environment/package-manager issue, so use direct binaries for local verification if it persists.
