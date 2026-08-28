# Renderer Structure

The existing React app remains the frame and owns `GameState`, district screens, modals, quest drawers, and the global top navigation. `src/components/SkyFlightCanvas.tsx` becomes the flight-view adapter and HUD, while `src/game/CarmackEngine.ts` owns the framework-agnostic simulation and software raycaster.

`CarmackEngine` uses a small grid-backed 2.5D world: each screen column is raycast against a set of rectangular vertical wall segments and a procedural cloud-floor depth ramp. Billboard entities are projected with camera-relative forward/right vectors and depth-scaled into the framebuffer. The engine exposes a frame snapshot and callbacks rather than coupling to React.

The engine reuses the original world coordinate convention (`0..1800`, `0..1600`) and `GameState`-compatible concepts: districts, collectibles, wind currents, storm zones, lantern modes, gear rigs, and moon-koi companion. Rendering is intentionally lightweight and Canvas2D-based so the project remains self-contained and deterministic in browser software-rendering environments.

The existing district and modal UI is intentionally unchanged. Only the flight renderer is replaced, minimizing integration risk.
