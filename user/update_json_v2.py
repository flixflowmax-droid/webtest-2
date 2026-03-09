import json

cms_path = r"c:\Users\RDP\Downloads\website\user\cms_data.json"

with open(cms_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_menus = [
    {"id": "mob1", "menu_title": "Home", "menu_location": "mobile_menu", "link_type": "path", "link_target": "home.html"},
    {"id": "mob2", "menu_title": "Shop", "menu_location": "mobile_menu", "link_type": "path", "link_target": "shop.html"},
    {"id": "mob3", "menu_title": "New Arrivals", "menu_location": "mobile_menu", "link_type": "path", "link_target": "shop.html?category=new"},
    {"id": "mob4", "menu_title": "Flash Sale", "menu_location": "mobile_menu", "link_type": "path", "link_target": "shop.html?category=sale"}
]

new_texts = [
    {"text_key": "shop_category_title", "text_value": "Category"},
    {"text_key": "sort_featured", "text_value": "Featured"},
    {"text_key": "sort_newest", "text_value": "Newest First"},
    {"text_key": "sort_price_low", "text_value": "Price: Low to High"},
    {"text_key": "sort_price_high", "text_value": "Price: High to Low"}
]

for m in new_menus:
    if not any(x['id'] == m['id'] for x in data['menus']):
        data['menus'].append(m)

for t in new_texts:
    if not any(x['text_key'] == t['text_key'] for x in data['texts']):
        data['texts'].append(t)

with open(cms_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated cms_data.json with shop filters and mobile menus")
