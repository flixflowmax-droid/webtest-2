import json

cms_path = r"c:\Users\RDP\Downloads\website\user\cms_data.json"

with open(cms_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if "shop_categories" not in data:
    data["shop_categories"] = [
        {"id": "cat1", "name": "Dresses", "value": "Dresses"},
        {"id": "cat2", "name": "Outerwear", "value": "Outerwear"},
        {"id": "cat3", "name": "Knitwear", "value": "Knitwear"},
        {"id": "cat4", "name": "Accessories", "value": "Accessories"}
    ]

if "shop_sort_options" not in data:
    data["shop_sort_options"] = [
        {"id": "sort1", "name": "Featured", "value": "featured"},
        {"id": "sort2", "name": "Newest First", "value": "newest"},
        {"id": "sort3", "name": "Price: Low to High", "value": "price-low"},
        {"id": "sort4", "name": "Price: High to Low", "value": "price-high"}
    ]

with open(cms_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print("Updated cms_data.json with shop categories and sort options")
