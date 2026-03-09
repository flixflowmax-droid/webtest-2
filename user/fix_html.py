import os
import glob
import re

# Get the EXACT and correct search bar from home.html
with open('home.html', 'r', encoding='utf-8') as f:
    text = f.read()
    
# Get from <!-- Mobile Search Bar --> to just before <!-- Cart Drawer & Overlay -->
match = re.search(r'(<!-- Mobile Search Bar -->.*?)\s*<!-- Cart Drawer & Overlay -->', text, flags=re.DOTALL)
if not match:
    print("Failed to find correct block in home.html")
    exit(1)

correct_search_block = match.group(1).strip() + "\n\n    "
cart_drawer_start = "<!-- Cart Drawer"

html_files = glob.glob('*.html')
html_files = [f for f in html_files if f != 'home.html' and f != 'header_ui.html']

for f in html_files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    
    # We want to replace from the first <!-- Mobile Search Bar --> down to the first <!-- Cart Drawer
    # This will remove any duplicate <!-- Mobile Search Bar --> and incomplete code
    
    new_content = re.sub(r'<!-- Mobile Search Bar -->.*?(?=<!-- Cart Drawer)', correct_search_block, content, flags=re.DOTALL)
    
    if new_content != content:
        with open(f, 'w', encoding='utf-8') as file:
            file.write(new_content)
        print(f"Fixed {f}")
    else:
        print(f"No match to fix in {f}")
