#!/usr/bin/env python3
"""
Builds the static ("stable") West Postros map from the author's sketch.

Usage:
  python3 tools/extract_stable_map.py [sketch.jpg] [out.json] [preview.png]

Defaults read stable/west-postros-reference.jpg and write
../rustlike-2d-worldgen-ui/src/data/west-postros-stable.json.

The sketch is classified into zone classes by colour, with position rules
where colours coincide (for example sand = shores or desert, grey = several
wastelands). The result is a tile grid; each tile holds one class id.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
GRID_W, GRID_H = 200, 150  # 4:3, same as the sketch

# id, ru name, en name, display colour
CLASSES = [
    ("warm_sea", "Тёплое море", "Warm Sea", "#52907a"),
    ("new_sea", "Новое море", "New Sea", "#2b4a66"),
    ("black_sea", "Чёрное море", "Black Sea", "#1f4468"),
    ("deep_sea", "Глубокое море", "Deep Sea", "#173655"),
    ("north_sandy_shores", "Северные песчаные берега", "Northern Sandy Shores", "#e3b98d"),
    ("south_shores", "Южные берега", "Southern Shores", "#e1ba8d"),
    ("untouched_forest", "Нетронутые регионы (леса)", "Untouched Regions (forest)", "#6f8a3c"),
    ("ancient_swamps", "Древние болота", "Ancient Swamps", "#30291f"),
    ("snow_wastelands", "Снежные пустоши", "Snow Wastelands", "#d3deeb"),
    ("glass_meadows", "Стеклянные луга / вулканические отвалы", "Glass Meadows / Volcanic Dumps", "#5a5e5f"),
    ("volcanoes", "Вулканы", "Volcanoes", "#080808"),
    ("dry_sea", "Сухое море", "Dried Sea", "#66615e"),
    ("wastelands", "Пустоши", "Wastelands", "#625c59"),
    ("rust_wastes", "Ржавые пустоши", "Rust Wastes", "#8b6547"),
    ("misty_forest", "Лес туманов", "Misty Forest", "#428898"),
    ("soot_dunes", "Сажевые дюны", "Soot Dunes", "#545858"),
    ("cobalt_forest", "Кобальтовый лес", "Cobalt Forest", "#204650"),
    ("dead_regions", "Мёртвые регионы", "Dead Regions", "#342e28"),
    ("great_desert", "Большая пустыня (ксерические кустарники)", "Great Desert (Xeric Shrublands)", "#e3bd91"),
    ("rocky_wastes", "Скалистые пустоши", "Rocky Wastes", "#9a8b73"),
    ("acid_jungle", "Кислотные джунгли", "Acid Jungle", "#827036"),
    ("acid_forest", "Кислотный лес", "Acid Forest", "#8e8241"),
    ("acid_swamps", "Кислотные болота", "Acid Swamps", "#929046"),
    ("dead_forest", "Мёртвый лес", "Dead Forest", "#070707"),
]
IDX = {c[0]: i for i, c in enumerate(CLASSES)}
CHARS = "0123456789abcdefghijklmnopqrstuvwxyz"


def classify(rgb: np.ndarray, xs: np.ndarray, ys: np.ndarray) -> np.ndarray:
    """rgb: HxWx3 float, xs/ys: pixel coordinates in 2000x1500 sketch space."""
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    mx = rgb.max(axis=-1)
    mn = rgb.min(axis=-1)
    out = np.full(r.shape, IDX["wastelands"], dtype=np.int32)

    def put(mask: np.ndarray, name: str) -> None:
        out[mask] = IDX[name]

    # --- colour families -------------------------------------------------
    blue = (b > g + 5) & (b > r + 15) & (mx < 135)
    teal = (b > r + 20) & (g > r + 20) & (abs(g - b) < 22) & (mx >= 90)
    sea_teal = (g > b + 4) & (g > r + 25) & (mx < 150)
    snow = mn > 185
    black = mx < 38
    dark_brown = (mx < 75) & (r >= g) & (g >= b) & (~black)
    sand = (r > 195) & (g > 160) & (b > 105) & (r - b > 40)
    in_rocky_box = (xs > 770) & (xs < 1340) & (ys > 820) & (ys < 1200)
    rocky_sand = (r > 125) & (r < 175) & (g > 112) & (b > 90) & (r - b > 18) & (r - b < 55) & in_rocky_box
    ratio = g / np.maximum(r, 1.0)
    olive = (r > 100) & (g > 90) & (b < 95) & (r - b > 40) & (ratio >= 0.78)
    rust = (r > 110) & (g > 70) & (g < 130) & (b < 100) & (r - g > 18) & (ratio < 0.78)
    grey = (mx - mn < 24) & (mx < 135) & (mx >= 55)

    # --- land base: everything not water -> wastelands (dark grey) -------
    put(grey, "wastelands")

    # greys by position
    glass = grey & (xs < 620) & (ys > 480) & (ys < 760)
    put(glass, "glass_meadows")
    dry = grey & ((((xs - 530) / 330.0) ** 2 + ((ys - 1070) / 250.0) ** 2) < 1.0)
    put(dry, "dry_sea")
    soot = grey & (xs > 1200) & (xs < 1560) & (ys > 600) & (ys < 900)
    put(soot, "soot_dunes")

    put(rust, "rust_wastes")
    put(rocky_sand, "rocky_wastes")

    # olive (acid lands) split by position
    put(olive, "acid_forest")
    put(olive & (r < 132) & (ys < 330) & (xs < 1800), "acid_jungle")
    put(olive & (ratio > 0.88) & (xs > 1550) & (ys > 330), "acid_swamps")

    # NW green
    green = (g > r + 5) & (g >= b + 20) & (g > 90) & (xs < 700) & (ys < 500) & (~olive | (xs < 700))
    put(green | ((r > 100) & (g > 100) & (b < 90) & (xs < 560) & (ys < 420) & (ys > 175)), "untouched_forest")

    put(dark_brown, "ancient_swamps")
    put(dark_brown & (xs > 1850), "dead_regions")
    put(snow, "snow_wastelands")
    put(black & (xs < 900), "volcanoes")
    put(black & (xs >= 900), "dead_forest")

    # sand by position
    put(sand & (ys < 215), "north_sandy_shores")
    put(sand & (ys >= 215), "great_desert")
    put(sand & (xs < 1290) & (ys > 800) & (ys < 1230), "rocky_wastes")
    put(sand & (ys > 1260), "south_shores")
    put(sand & (xs < 600) & (ys > 1100), "south_shores")

    # lakes inside land
    put(teal & (xs > 900) & (xs < 1320) & (ys > 500) & (ys < 830), "misty_forest")
    put((mx < 120) & (b > r + 25) & (xs > 1480) & (xs < 1860) & (ys > 540) & (ys < 900), "cobalt_forest")

    # water
    put(sea_teal & (ys < 300), "warm_sea")
    put((ys < 135) & ~sand & ~black, "warm_sea")
    water_blue = blue & ~((xs > 1480) & (xs < 1860) & (ys > 540) & (ys < 900))
    put(water_blue, "black_sea")
    put(water_blue & (xs < 420) & (ys < 1250), "new_sea")
    put(water_blue & (xs > 1100) & (ys > 1380), "deep_sea")
    return out


def mode_filter(arr: np.ndarray, n_classes: int, passes: int = 2) -> np.ndarray:
    h, w = arr.shape
    for _ in range(passes):
        padded = np.pad(arr, 1, mode="edge")
        counts = np.zeros((n_classes, h, w), dtype=np.int32)
        for dy in range(3):
            for dx in range(3):
                window = padded[dy : dy + h, dx : dx + w]
                for k in np.unique(window):
                    counts[k] += (window == k)
        arr = counts.argmax(axis=0).astype(np.int32)
    return arr


def fill_uncertain(arr: np.ndarray, uncertain: np.ndarray, n_classes: int) -> np.ndarray:
    """Blend colours on zone borders land in the grey default class; give those
    cells the majority class of their already-certain neighbours."""
    arr = arr.copy()
    uncertain = uncertain.copy()
    h, w = arr.shape
    for _ in range(40):
        if not uncertain.any():
            break
        counts = np.zeros((n_classes, h, w), dtype=np.int32)
        pa = np.pad(arr, 1, mode="edge")
        pu = np.pad(uncertain, 1, mode="edge")
        for dy in range(3):
            for dx in range(3):
                win = pa[dy : dy + h, dx : dx + w]
                ok = ~pu[dy : dy + h, dx : dx + w]
                for k in np.unique(win[ok]):
                    counts[k] += (win == k) & ok
        best = counts.argmax(axis=0)
        has = counts.max(axis=0) > 0
        take = uncertain & has
        arr[take] = best[take]
        uncertain[take] = False
    return arr


def main() -> None:
    src = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / "stable" / "west-postros-reference.jpg"
    out_json = (
        Path(sys.argv[2])
        if len(sys.argv) > 2
        else ROOT.parent / "rustlike-2d-worldgen-ui" / "src" / "data" / "west-postros-stable.json"
    )
    out_png = Path(sys.argv[3]) if len(sys.argv) > 3 else ROOT / "stable" / "west-postros-stable-preview.png"

    img = Image.open(src).convert("RGB")
    # Median filter removes the thin map grid and label strokes before sampling.
    img = img.resize((GRID_W * 5, GRID_H * 5), Image.LANCZOS).filter(ImageFilter.MedianFilter(7))
    img = img.resize((GRID_W, GRID_H), Image.BOX)
    rgb = np.asarray(img).astype(float)

    xs = (np.arange(GRID_W)[None, :] + 0.5) / GRID_W * 2000.0 + np.zeros((GRID_H, 1))
    ys = (np.arange(GRID_H)[:, None] + 0.5) / GRID_H * 1500.0 + np.zeros((1, GRID_W))
    grid = classify(rgb, xs, ys)
    # Real "Wastelands" only exist in the south-west and south; elsewhere the
    # grey default is a blend artefact on a zone border.
    legit_wastes = (ys > 720) & (xs < 1900)
    uncertain = (grid == IDX["wastelands"]) & ~legit_wastes
    grid = fill_uncertain(grid, uncertain, len(CLASSES))
    grid = mode_filter(grid, len(CLASSES), passes=2)

    rows = ["".join(CHARS[v] for v in row) for row in grid]
    data = {
        "meta": {
            "id": "west-postros-stable",
            "nameRu": "Западный Построс (стабильная версия)",
            "nameEn": "West Postros (stable version)",
            "width": GRID_W,
            "height": GRID_H,
            "widthMeters": 8000,
            "heightMeters": 6000,
            "source": "stable/west-postros-reference.jpg",
            "note": "Static map extracted from the author's sketch. Meters are a placeholder scale.",
        },
        "classes": [
            {"id": c[0], "char": CHARS[i], "nameRu": c[1], "nameEn": c[2], "color": c[3]}
            for i, c in enumerate(CLASSES)
        ],
        "grid": rows,
        "pois": [],
    }
    out_json.parent.mkdir(parents=True, exist_ok=True)
    out_json.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")

    palette = np.array([[int(c[3][i : i + 2], 16) for i in (1, 3, 5)] for c in CLASSES], dtype=np.uint8)
    Image.fromarray(palette[grid]).resize((GRID_W * 5, GRID_H * 5), Image.NEAREST).save(out_png)

    counts = np.bincount(grid.ravel(), minlength=len(CLASSES))
    for i, c in enumerate(CLASSES):
        print(f"{c[0]:20s} {counts[i] / grid.size * 100:5.1f}%")
    print("wrote", out_json, out_png)


if __name__ == "__main__":
    main()
