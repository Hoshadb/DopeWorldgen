#!/usr/bin/env python3
"""
Extract the stable (static) West Postros map from the author's sketch.

Usage:
  python3 -I tools/extract_stable_map.py <sketch.jpg> <out.json> [--preview preview.png]

The sketch is classified by nearest reference colour into zone codes.
Result is a 200x150 grid (one cell = 1/200 of the sketch width).
Edit ZONES / macro-region polylines below, re-run, commit the JSON.
"""
import json, sys
import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as ndi

GRID_W, GRID_H = 200, 150
REF_W, REF_H = 2000, 1500  # coordinate space used for the polylines below

# code, id, name_ru, name_en, kind, sketch colour (RGB), display colour
ZONES = [
    # water
    ("~", "sea", "Море", "Sea", "water", None, "#2b4a6b"),
    # shores
    ("s", "north-sandy-shores", "Северные песчаные берега", "Northern sandy shores", "shore", (227, 185, 141), "#d9c58a"),
    # land
    ("g", "deciduous", "Лиственный/Нетронутые регионы", "Untouched regions (forest)", "land", (122, 122, 73), "#5f9f5f"),
    ("b", "ancient-swamps", "Древние болота", "Ancient swamps", "land", (48, 41, 33), "#2e2a24"),
    ("n", "snow", "Снежные пустоши", "Winter wastelands", "land", (211, 222, 235), "#c7d4e3"),
    ("v", "volcanic-dumps", "Вулканические отвалы/Стеклянные луга", "Volcanic dumps / Glass meadows", "land", (90, 94, 95), "#6f7476"),
    ("V", "volcano", "Вулканы", "Volcanoes", "land", (8, 8, 8), "#0a0a0a"),
    ("d", "dried-sea", "Сухое море", "Dried sea", "land", (102, 97, 94), "#6b6560"),
    ("w", "wastelands", "Пустоши", "Wastelands", "land", (98, 92, 89), "#625c58"),
    ("r", "rust-wastes", "Ржавые пустоши", "Rust wastelands", "land", (139, 101, 71), "#8b6547"),
    ("m", "misty-forest", "Лес туманов", "Misty forest", "land", (66, 136, 140), "#428a8c"),
    ("o", "soot-dunes", "Сажевые дюны", "Soot dunes", "land", (84, 88, 88), "#545858"),
    ("c", "cobalt-forest", "Кобальтовый лес", "Cobalt forest", "land", (32, 70, 80), "#204650"),
    ("x", "dead-regions", "Мёртвые регионы", "Dead regions", "land", (52, 46, 40), "#342e28"),
    ("D", "great-desert", "Большая пустыня", "Great desert", "land", (227, 189, 145), "#e3bd91"),
    ("k", "rocky-wastelands", "Скалистые пустоши", "Rocky wastelands", "land", (138, 127, 115), "#8a7f73"),
    ("a", "acid-lands", "Кислотные земли", "Acid lands", "land", (142, 130, 65), "#8e8241"),
]
SEA = ZONES[0]


def classify(rgb):
    h, w, _ = rgb.shape
    refs = [(z[0], np.array(z[5], float)) for z in ZONES if z[5] is not None]
    dist = np.stack([np.linalg.norm(rgb - c, axis=2) for _, c in refs])
    idx = dist.argmin(0)
    codes = np.array([c for c, _ in refs])
    return codes[idx]


def sea_mask(rgb):
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    bluish = (b > r + 18) & (b >= g - 5)
    teal = (g > r + 25) & (r < 110) & (b > r + 10)
    cand = bluish | teal
    lab, n = ndi.label(cand)
    border = set(np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))) - {0}
    return np.isin(lab, list(border))


def poly_side(points, x, y):
    """y of polyline at x (linear interpolation), points in REF coords."""
    xs, ys = zip(*points)
    return np.interp(x, xs, ys)


def build(src):
    im = Image.open(src).convert("RGB").resize((REF_W, REF_H), Image.LANCZOS)
    im = im.filter(ImageFilter.MedianFilter(9))
    rgb = np.asarray(im).astype(float)
    sea = sea_mask(rgb)
    codes = classify(rgb)
    codes[sea] = "~"
    # sampling to grid
    gx = ((np.arange(GRID_W) + 0.5) * REF_W / GRID_W).astype(int)
    gy = ((np.arange(GRID_H) + 0.5) * REF_H / GRID_H).astype(int)
    grid = codes[np.ix_(gy, gx)]
    # majority filter to remove speckle
    out = grid.copy()
    for y in range(GRID_H):
        for x in range(GRID_W):
            win = grid[max(0, y - 1):y + 2, max(0, x - 1):x + 2].ravel()
            vals, cnt = np.unique(win, return_counts=True)
            out[y, x] = vals[cnt.argmax()]
    return out


def shore_pass(grid):
    """Sand cells of the desert colour touching the sea become shore."""
    land = grid != "~"
    near_sea = ndi.binary_dilation(~land, iterations=6)
    res = grid.copy()
    res[(grid == "D") & near_sea] = "s"
    return res


def main():
    src, dst = sys.argv[1], sys.argv[2]
    grid = shore_pass(build(src))
    meta = {z[0]: {"id": z[1], "nameRu": z[2], "nameEn": z[3], "kind": z[4], "color": z[6]} for z in ZONES}
    data = {
        "id": "west-postros-stable",
        "width": GRID_W,
        "height": GRID_H,
        "legend": meta,
        "rows": ["".join(r) for r in grid],
        "locations": [],
    }
    with open(dst, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    if "--preview" in sys.argv:
        pv = sys.argv[sys.argv.index("--preview") + 1]
        img = Image.new("RGB", (GRID_W, GRID_H))
        cols = {c: tuple(int(m["color"][i:i + 2], 16) for i in (1, 3, 5)) for c, m in meta.items()}
        img.putdata([cols[c] for r in grid for c in r])
        img.resize((GRID_W * 4, GRID_H * 4), Image.NEAREST).save(pv)
    from collections import Counter
    print(Counter("".join(data["rows"])).most_common())


if __name__ == "__main__":
    main()
