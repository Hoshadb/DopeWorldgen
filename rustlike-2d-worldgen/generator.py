#!/usr/bin/env python3
"""
2D procedural world generator prototype for Rust-like map logic.

Outputs:
- PNG image preview of biomes
- JSON with biome ids and generated points of interest
"""

from __future__ import annotations

import argparse
import json
import math
import random
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, List, Tuple

from PIL import Image


@dataclass(frozen=True)
class Biome:
    name: str
    min_height: float
    max_height: float
    min_moisture: float
    max_moisture: float
    color: Tuple[int, int, int]

    def matches(self, height: float, moisture: float) -> bool:
        return (
            self.min_height <= height < self.max_height
            and self.min_moisture <= moisture < self.max_moisture
        )


def clamp01(value: float) -> float:
    return max(0.0, min(1.0, value))


def smoothstep(t: float) -> float:
    return t * t * (3 - 2 * t)


def hash2d(x: int, y: int, seed: int) -> float:
    # Deterministic pseudo-random value in [0, 1).
    n = x * 374761393 + y * 668265263 + seed * 1274126177
    n = (n ^ (n >> 13)) * 1274126177
    n = n ^ (n >> 16)
    return (n & 0xFFFFFFFF) / 4294967296.0


def value_noise_2d(x: float, y: float, seed: int) -> float:
    x0 = math.floor(x)
    y0 = math.floor(y)
    x1 = x0 + 1
    y1 = y0 + 1

    sx = smoothstep(x - x0)
    sy = smoothstep(y - y0)

    v00 = hash2d(x0, y0, seed)
    v10 = hash2d(x1, y0, seed)
    v01 = hash2d(x0, y1, seed)
    v11 = hash2d(x1, y1, seed)

    ix0 = v00 + (v10 - v00) * sx
    ix1 = v01 + (v11 - v01) * sx
    return ix0 + (ix1 - ix0) * sy


def fbm_2d(
    x: float,
    y: float,
    seed: int,
    octaves: int = 5,
    lacunarity: float = 2.0,
    gain: float = 0.5,
) -> float:
    value = 0.0
    amplitude = 1.0
    frequency = 1.0
    amplitude_sum = 0.0

    for i in range(octaves):
        n = value_noise_2d(x * frequency, y * frequency, seed + i * 9973)
        value += n * amplitude
        amplitude_sum += amplitude
        amplitude *= gain
        frequency *= lacunarity

    return value / amplitude_sum if amplitude_sum > 0 else 0.0


def island_mask(x: int, y: int, width: int, height: int, strength: float) -> float:
    nx = (x / max(1, width - 1)) * 2.0 - 1.0
    ny = (y / max(1, height - 1)) * 2.0 - 1.0
    distance = math.sqrt(nx * nx + ny * ny)
    mask = 1.0 - clamp01(distance)
    return pow(mask, strength)


def load_biomes(raw_biomes: List[Dict]) -> List[Biome]:
    return [
        Biome(
            name=item["name"],
            min_height=float(item["min_height"]),
            max_height=float(item["max_height"]),
            min_moisture=float(item["min_moisture"]),
            max_moisture=float(item["max_moisture"]),
            color=tuple(item["color"]),
        )
        for item in raw_biomes
    ]


def pick_biome(height: float, moisture: float, biomes: List[Biome]) -> Biome:
    for biome in biomes:
        if biome.matches(height, moisture):
            return biome
    return biomes[-1]


def sample_spawn_candidates(
    biome_map: List[List[str]],
    allowed_biomes: List[str],
    min_distance: int,
    count: int,
    rng: random.Random,
) -> List[Dict[str, int]]:
    h = len(biome_map)
    w = len(biome_map[0]) if h > 0 else 0
    candidates = [
        (x, y)
        for y in range(h)
        for x in range(w)
        if biome_map[y][x] in allowed_biomes
    ]
    rng.shuffle(candidates)

    selected: List[Tuple[int, int]] = []
    for x, y in candidates:
        if len(selected) >= count:
            break
        if all(((x - sx) ** 2 + (y - sy) ** 2) >= min_distance**2 for sx, sy in selected):
            selected.append((x, y))

    return [{"x": x, "y": y} for x, y in selected]


def write_png(path: Path, pixels: List[List[Tuple[int, int, int]]]) -> None:
    height = len(pixels)
    width = len(pixels[0]) if height > 0 else 0
    image = Image.new("RGB", (width, height))
    flat_pixels = [pixel for row in pixels for pixel in row]
    image.putdata(flat_pixels)
    image.save(path, format="PNG")


def generate_world(config: Dict) -> Dict:
    width = int(config["world"]["width"])
    height = int(config["world"]["height"])
    seed = int(config["world"]["seed"])

    noise_scale_h = float(config["noise"]["height_scale"])
    noise_scale_m = float(config["noise"]["moisture_scale"])
    octaves = int(config["noise"]["octaves"])
    lacunarity = float(config["noise"]["lacunarity"])
    gain = float(config["noise"]["gain"])
    island_strength = float(config["world"]["island_falloff"])

    biomes = load_biomes(config["biomes"])

    biome_map: List[List[str]] = []
    preview_pixels: List[List[Tuple[int, int, int]]] = []
    height_map: List[List[float]] = []
    moisture_map: List[List[float]] = []

    for y in range(height):
        biome_row: List[str] = []
        pixel_row: List[Tuple[int, int, int]] = []
        h_row: List[float] = []
        m_row: List[float] = []
        for x in range(width):
            h_noise = fbm_2d(x / noise_scale_h, y / noise_scale_h, seed, octaves, lacunarity, gain)
            m_noise = fbm_2d(
                x / noise_scale_m, y / noise_scale_m, seed + 17389, octaves, lacunarity, gain
            )

            mask = island_mask(x, y, width, height, island_strength)
            height_value = clamp01(h_noise * mask * 1.2)
            moisture_value = clamp01(m_noise)

            biome = pick_biome(height_value, moisture_value, biomes)
            biome_row.append(biome.name)
            pixel_row.append(biome.color)
            h_row.append(round(height_value, 4))
            m_row.append(round(moisture_value, 4))

        biome_map.append(biome_row)
        preview_pixels.append(pixel_row)
        height_map.append(h_row)
        moisture_map.append(m_row)

    rng = random.Random(seed + 404)
    poi_result = {}
    for poi in config["points_of_interest"]:
        poi_result[poi["id"]] = sample_spawn_candidates(
            biome_map=biome_map,
            allowed_biomes=poi["allowed_biomes"],
            min_distance=int(poi["min_distance"]),
            count=int(poi["count"]),
            rng=rng,
        )

    return {
        "meta": {"width": width, "height": height, "seed": seed},
        "biome_map": biome_map,
        "height_map": height_map,
        "moisture_map": moisture_map,
        "points_of_interest": poi_result,
        "_preview_pixels": preview_pixels,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate 2D procedural world")
    parser.add_argument("--config", required=True, help="Path to JSON rules config")
    parser.add_argument("--out-dir", default="output", help="Where to write outputs")
    args = parser.parse_args()

    config_path = Path(args.config)
    out_dir = Path(args.out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    with config_path.open("r", encoding="utf-8") as f:
        config = json.load(f)

    world = generate_world(config)
    preview_pixels = world.pop("_preview_pixels")

    image_path = out_dir / "world_preview.png"
    json_path = out_dir / "world_data.json"

    write_png(image_path, preview_pixels)
    with json_path.open("w", encoding="utf-8") as f:
        json.dump(world, f, ensure_ascii=False, indent=2)

    print(f"Generated image: {image_path}")
    print(f"Generated data:  {json_path}")


if __name__ == "__main__":
    main()
