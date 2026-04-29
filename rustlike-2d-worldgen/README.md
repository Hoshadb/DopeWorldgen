# Rust-like 2D World Generator (Prototype)

Lightweight procedural map generator to prototype biome and POI rules before Unreal integration.

## What it does

- Generates height + moisture maps from deterministic noise.
- Applies island falloff (ocean around map edges).
- Classifies each tile into biomes based on your rules.
- Places points of interest (POI) with biome filters and minimum spacing.
- Exports:
  - `output/world_preview.png` - biome preview image
  - `output/world_data.json` - biome grid, height/moisture grids, POI positions

## Quick start

```bash
python3 generator.py --config rules.example.json --out-dir output
```

Open `output/world_preview.png` in any image viewer.

## Rules file

Edit `rules.example.json`:

- `world.width`, `world.height` - map size
- `world.seed` - deterministic map seed
- `world.island_falloff` - higher value = smaller central landmass
- `noise.*` - terrain shape controls
- `biomes[]` - biome classification ranges and colors
- `points_of_interest[]` - spawn rules:
  - `allowed_biomes`
  - `count`
  - `min_distance` (in tiles)

## Unreal integration idea

Use `world_data.json` as source data for UE:

- Convert `biome_map` to landscape layer masks.
- Use `points_of_interest` as spawn anchors for PCG volumes / actor placement.
- Keep seed and config synced to reproduce the same world offline/ingame.
