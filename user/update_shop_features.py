import json

cms_path = r"c:\Users\RDP\Downloads\website\user\cms_data.json"

with open(cms_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

if "shop_features" not in data:
    data["shop_features"] = [
        {"id": "feat1", "name": "Editor's Choice", "value": "featured"},
        {"id": "feat2", "name": "Best Seller", "value": "bestseller"},
        {"id": "feat3", "name": "Limited Edition", "value": "limited"}
    ]

with open(cms_path, 'w', encoding='utf-8') as f:
    json.dump(data, f, indent=4)

print("Added shop_features list to cms_data.json")
