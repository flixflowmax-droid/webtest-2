import json

cms_path = r"c:\Users\RDP\Downloads\website\user\cms_data.json"

with open(cms_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

new_texts = [
    {"text_key": "header_search_placeholder", "text_value": "Search trends..."},
    {"text_key": "header_cart_title", "text_value": "Bag"},
    {"text_key": "shop_filter_title", "text_value": "Filters"},
    {"text_key": "shop_clear_all", "text_value": "Clear All"},
    {"text_key": "shop_main_title", "text_value": "The Complete Collection"},
    {"text_key": "shop_products_label", "text_value": "Products"}
]

for t in new_texts:
    if not any(x['text_key'] == t['text_key'] for x in data['texts']):
        data['texts'].append(t)

with open(cms_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=2)

print("Updated cms_data.json with final shop UI texts")
