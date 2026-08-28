# Assets

**Art direction:** A sharp, atmospheric Carmack-era 2.5D software-renderer look for a floating night market: midnight navy and deep indigo skies, cyan emissive route lines and lantern glass, amber brass and warm coral market lamps, chunky geometric silhouettes, crisp perspective-correct vertical walls, subtle scanline texture, and readable compact flight HUD. The camera is first-person from a bronze-and-teal courier skiff over a glowing cloud sea.

## Visual target

- `/home/ubuntu/webdev-static-assets/floating-market-raycaster-reference.png` — generated in-game screenshot reference for the raycaster composition.

## Runtime assets

The first implementation uses procedural geometry and Canvas2D rendering rather than external GLB files or large committed image assets. The generated target remains the art-direction anchor while the runtime scene draws reusable shapes for the skiff cockpit, district gates/platforms, cloud floor, droplets, salvage capsules, storm arcs, lanterns, and HUD.
