import json
import os

cms_path = r"c:\Users\RDP\Downloads\website\user\cms_data.json"

with open(cms_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_menus = [
    {"id": "mh1", "menu_title": "New Arrivals", "menu_location": "header", "link_type": "path", "link_target": "shop.html?category=new"},
    {"id": "mh2", "menu_title": "Women", "menu_location": "header", "link_type": "path", "link_target": "shop.html?category=women"},
    {"id": "mh3", "menu_title": "Men", "menu_location": "header", "link_type": "path", "link_target": "shop.html?category=men"},
    {"id": "mh4", "menu_title": "Flash Sale", "menu_location": "header", "link_type": "path", "link_target": "shop.html?category=sale"}
]

new_texts = [
    {"text_key": "hero_subtitle", "text_value": "Winter 2024 Premiere"},
    {"text_key": "hero_desc", "text_value": "Discover the artisanal craftsmanship and avant-garde aesthetics of our latest collection. Limited pieces now available."},
    {"text_key": "hero_btn_1", "text_value": "Shop Collection"},
    {"text_key": "hero_btn_2", "text_value": "Watch Runway"},
    {"text_key": "curated_title", "text_value": "Curated Shop"},
    {"text_key": "curated_desc", "text_value": "Explore our most sought-after categories"},
    {"text_key": "curated_view_all", "text_value": "View All"},
    {"text_key": "cat1_title", "text_value": "Essential Women"},
    {"text_key": "cat1_desc", "text_value": "Elevated basics for every day"},
    {"text_key": "cat1_btn", "text_value": "Shop Now"},
    {"text_key": "cat2_title", "text_value": "The Modern Man"},
    {"text_key": "cat2_desc", "text_value": "Tailored to perfection"},
    {"text_key": "cat2_btn", "text_value": "Shop Now"},
    {"text_key": "cat3_title", "text_value": "Statement Accents"},
    {"text_key": "cat3_desc", "text_value": "The finishing touch"},
    {"text_key": "cat3_btn", "text_value": "Shop Now"},
    {"text_key": "flash_title", "text_value": "FLASH SALE EVENT"},
    {"text_key": "flash_desc", "text_value": "Extra 40% OFF all seasonal items. Ends in:"},
    {"text_key": "flash_btn", "text_value": "Claim Offer"},
    {"text_key": "arrivals_title", "text_value": "New Arrivals"}
]

for m in new_menus:
    if not any(x['id'] == m['id'] for x in data['menus']):
        data['menus'].append(m)

for t in new_texts:
    if not any(x['text_key'] == t['text_key'] for x in data['texts']):
        data['texts'].append(t)

with open(cms_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated cms_data.json")
