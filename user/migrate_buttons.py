import json

cms_path = r"c:\Users\RDP\Downloads\website\user\cms_data.json"

with open(cms_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

# Identify keys that act as buttons or links
move_keys = [
    "hero_btn_1", "hero_btn_2", "curated_view_all", 
    "cat1_btn", "cat2_btn", "cat3_btn", "flash_btn"
]

# Mapping keys to their likely targets
targets = {
    "hero_btn_1": "shop.html",
    "hero_btn_2": "#",
    "curated_view_all": "shop.html",
    "cat1_btn": "shop.html?category=women",
    "cat2_btn": "shop.html?category=men",
    "cat3_btn": "shop.html?category=accessories",
    "flash_btn": "shop.html?sale=true"
}

# 1. Filter out from texts and move to menus
new_texts = []
for t in data['texts']:
    if t['text_key'] in move_keys:
        # Create a menu entry
        menu_id = f"btn_{t['text_key']}"
        # Prevent duplicates
        if not any(m['id'] == menu_id for m in data['menus']):
            data['menus'].append({
                "id": menu_id,
                "menu_title": t['text_value'],
                "menu_location": f"data-attr-{t['text_key']}", # Special marker for the JS
                "link_type": "path",
                "link_target": targets.get(t['text_key'], "#")
            })
    else:
        new_texts.append(t)

data['texts'] = new_texts

with open(cms_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("JSON data migrated: Buttons moved from texts to menus.")
