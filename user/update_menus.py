import os
import re
import glob

# Read the modern header from home.html
with open('home.html', 'r', encoding='utf-8') as f:
    index_html = f.read()

# Extract header
header_match = re.search(r'(<header.*?>)(.*?)(</header>)', index_html, flags=re.DOTALL)
if not header_match:
    print("Could not find header in home.html")
    exit(1)

header_inner = header_match.group(2)

# Extract mobile menu overlay
menu_match = re.search(r'(<!-- Full-Screen Menu Overlay -->.*?</div>\s*<!-- Mobile Search Bar -->)', index_html, flags=re.DOTALL)
if not menu_match:
    # try matching div id="mobile-menu"
    menu_match = re.search(r'(<!-- Full-Screen Menu Overlay -->.*?</div>)', index_html, flags=re.DOTALL)

# Extract mobile search bar
search_match = re.search(r'(<!-- Mobile Search Bar -->.*?</div>)', index_html, flags=re.DOTALL)

menu_code = menu_match.group(1) if menu_match else ""
search_code = search_match.group(1) if search_match else ""

to_inject = "\n\n    " + menu_code + "\n\n    " + search_code + "\n"

# Get all html files
html_files = glob.glob('*.html')
html_files = [f for f in html_files if f not in ['home.html', 'header_ui.html']]

count = 0
for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Update the inner header
    new_content = re.sub(r'(<header.*?>).*?(</header>)', r'\g<1>' + header_inner + r'\g<2>', content, flags=re.DOTALL)
    
    # 2. Check if mobile-menu exists
    has_menu = 'id="mobile-menu"' in new_content
    has_search = 'id="mobile-search-bar"' in new_content

    if not has_menu and not has_search:
        # inject directly after </header>
        new_content = re.sub(r'(</header>)', r'\g<1>' + to_inject.replace('\\', '\\\\'), new_content, count=1)
    elif not has_menu:
        # this shouldn't normally happen unless partially matched, but just in case
        print(f"Partial match in {file}")

    if content != new_content:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(new_content)
        count += 1
        print(f"Updated {file}")

print(f"Updated {count} files.")
