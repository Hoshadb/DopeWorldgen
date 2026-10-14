#!/usr/bin/env python3
"""
Builds the West Postros catalog.

Source of truth: rustlike-2d-worldgen/catalog/*.json (edit these).
Outputs:
  - rustlike-2d-worldgen-ui/src/data/west-postros-catalog.json  (bundle used by the UI)
  - rustlike-2d-worldgen/catalog/README.md                      (human-readable index)

Locations get a `stableZone` field: the zone class of the stable map under the
location's point, so a location can be checked against the terrain it stands on.

Usage: python3 -I tools/build_catalog.py
"""

from __future__ import annotations

import json
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "catalog"
UI_DATA = ROOT.parent / "rustlike-2d-worldgen-ui" / "src" / "data"

KIND_RU = {
    "settlement": "Поселение",
    "industrial": "Промышленность",
    "military": "Военный объект",
    "science": "Научный объект",
    "medical": "Медицина",
    "service": "Сервис и торговля",
    "transport": "Транспорт",
    "infrastructure": "Инфраструктура",
    "landmark": "Достопримечательность",
    "nature": "Природный объект",
    "danger": "Опасное место",
}
TAG_RU = {"hostile": "враждебная (красная подпись)", "friendly": "дружественная (зелёная подпись)", "special": "особая (синяя подпись)"}


def load(name: str):
    return json.loads((CATALOG / name).read_text(encoding="utf-8"))


def stable_zone_lookup():
    stable = json.loads((UI_DATA / "west-postros-stable.json").read_text(encoding="utf-8"))
    by_char = {c["char"]: c["id"] for c in stable["classes"]}
    w, h = stable["meta"]["width"], stable["meta"]["height"]
    grid = stable["grid"]

    def zone(x: float, y: float) -> str:
        cx = min(w - 1, max(0, int(x * w)))
        cy = min(h - 1, max(0, int(y * h)))
        return by_char[grid[cy][cx]]

    return zone


def main() -> None:
    macro = load("macro_regions.json")
    water = load("water_regions.json")
    shores = load("shores.json")
    biomes = load("biomes.json")
    locations = load("locations.json")
    labels = load("map_labels.json")

    # --- validation -------------------------------------------------------
    ids = {
        "macro": {r["id"] for r in macro} | {r["id"] for r in water} | {"west-postros"},
        "biome": {b["id"] for b in biomes} | {s["id"] for s in shores},
        "micro": {f"{b['id']}:{m['id']}" for b in biomes for m in b.get("microBiomes", [])}
        | {f"{s['id']}:{m['id']}" for s in shores for m in s.get("microBiomes", [])},
    }
    for lbl in labels:
        if lbl["entityId"] not in ids[lbl["layer"]]:
            raise SystemExit(f"label {lbl['id']}: unknown entity {lbl['entityId']} for layer {lbl['layer']}")
    codes = {l["code"] for l in locations if l["code"]}
    for loc in locations:
        if loc["parentCode"] and loc["parentCode"] not in codes:
            raise SystemExit(f"{loc['id']}: unknown parent {loc['parentCode']}")
        if loc["kind"] not in KIND_RU:
            raise SystemExit(f"{loc['id']}: unknown kind {loc['kind']}")

    zone = stable_zone_lookup()
    for loc in locations:
        loc["stableZone"] = zone(loc["x"], loc["y"])

    bundle = {
        "meta": {"id": "west-postros-catalog", "mapId": "west-postros", "generatedBy": "tools/build_catalog.py"},
        "macroRegions": macro,
        "waterRegions": water,
        "shores": shores,
        "biomes": biomes,
        "locations": locations,
        "labels": labels,
    }
    out_json = UI_DATA / "west-postros-catalog.json"
    out_json.write_text(json.dumps(bundle, ensure_ascii=False, indent=1), encoding="utf-8")

    # --- README -----------------------------------------------------------
    micro_total = sum(len(b.get("microBiomes", [])) for b in biomes)
    shore_micro_total = sum(len(s.get("microBiomes", [])) for s in shores)
    added = [e for e in macro + water + biomes if e.get("source") == "sketch"]
    added_micro = [(b, m) for b in biomes for m in b.get("microBiomes", []) if m.get("source") == "sketch"]
    kinds = Counter(l["kind"] for l in locations)
    top = [l for l in locations if not l["parentCode"]]

    lines = [
        "# Каталог Западного Построса",
        "",
        "Каждая сущность хранится как отдельная запись в JSON. Правьте файлы в этой папке, затем запустите",
        "`python3 -I tools/build_catalog.py`: он проверит ссылки, добавит `stableZone` у локаций,",
        "обновит этот файл и соберёт `rustlike-2d-worldgen-ui/src/data/west-postros-catalog.json` для интерфейса.",
        "",
        "| Файл | Что внутри | Записей |",
        "|---|---|---|",
        f"| `macro_regions.json` | Макрорегионы суши | {len(macro)} |",
        f"| `water_regions.json` | Водные макрорегионы | {len(water)} |",
        f"| `biomes.json` | Биомы с вложенными микробиомами | {len(biomes)} (микробиомов: {micro_total}) |",
        f"| `shores.json` | Берега с микробиомами | {len(shores)} (микробиомов: {shore_micro_total}) |",
        f"| `locations.json` | Локации и подлокации | {len(locations)} |",
        f"| `map_labels.json` | Подписи на стабильной карте (макрорегионы, биомы, микробиомы) | {len(labels)} |",
        "",
        "Координаты `x`, `y` заданы долями от размера карты (0..1), начало слева сверху.",
        "Поле `source`: `ui-list` значит запись была в списках интерфейса, `sketch` значит её добавили по подписи на изображении.",
        "",
        "## Добавлено по изображениям (не было в списках)",
        "",
    ]
    for e in added:
        lines.append(f"- {e['nameRu']} (`{e['id']}`)")
    for b, m in added_micro:
        alias = f", то же что `{m['aliasOfBiomeId']}`" if m.get("aliasOfBiomeId") else ""
        lines.append(f"- {m['nameRu']}: микробиом биома «{b['nameRu']}» (`{b['id']}:{m['id']}`{alias})")
    lines += [f"- Локации: все {len(locations)} записей из `locations.json` (раньше локаций в проекте не было)", ""]

    lines += ["## Макрорегионы", "", "| id | Название | English |", "|---|---|---|"]
    lines += [f"| `{r['id']}` | {r['nameRu']} | {r.get('nameEn') or ''} |" for r in macro]
    lines += ["", "## Водные макрорегионы", "", "| id | Название | English |", "|---|---|---|"]
    lines += [f"| `{r['id']}` | {r['nameRu']} | {r.get('nameEn') or ''} |" for r in water]

    lines += ["", "## Биомы и микробиомы", "", "| id | Название | Микробиомы |", "|---|---|---|"]
    for b in biomes:
        micro = ", ".join(m["nameRu"] for m in b.get("microBiomes", []))
        lines.append(f"| `{b['id']}` | {b['nameRu']} | {micro} |")
    lines += ["", "## Берега", "", "| id | Название | Микробиомы |", "|---|---|---|"]
    for s in shores:
        micro = ", ".join(m["nameRu"] for m in s.get("microBiomes", []))
        lines.append(f"| `{s['id']}` | {s['nameRu']} | {micro} |")

    lines += ["", "## Локации", "", f"Типы: " + ", ".join(f"{KIND_RU[k]} {n}" for k, n in kinds.most_common()), ""]
    lines += ["| Код | Название | Тип | Метка | Зона под точкой |", "|---|---|---|---|---|"]
    for l in sorted(locations, key=lambda v: (v["code"] is None, v["code"] or "", v["nameRu"])):
        flags = []
        if l["safeZone"]:
            flags.append("Safe Zone")
        if l["tag"]:
            flags.append(TAG_RU[l["tag"]])
        if l.get("codeUncertain"):
            flags.append("код нечитаем на изображении")
        indent = "&nbsp;&nbsp;" if l["parentCode"] else ""
        lines.append(f"| {l['code'] or '—'} | {indent}{l['nameRu']} | {KIND_RU[l['kind']]} | {'; '.join(flags)} | {l['stableZone']} |")
    lines.append("")
    (CATALOG / "README.md").write_text("\n".join(lines), encoding="utf-8")

    print("macro", len(macro), "water", len(water), "biomes", len(biomes), "micro", micro_total,
          "shores", len(shores), "locations", len(locations), f"(top-level {len(top)})", "labels", len(labels))
    print("wrote", out_json)


if __name__ == "__main__":
    main()
