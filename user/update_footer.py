import os
import glob
import re

user_dir = r"c:\Users\RDP\Downloads\website\user"
html_files = glob.glob(os.path.join(user_dir, "*.html"))

replacements = [
    # Branding text
    (r'<p class="text-gray-400 text-sm mb-6 leading-relaxed">Redefining.*?</p>',
     r'<p data-text-key="footer_about" class="text-gray-400 text-sm mb-6 leading-relaxed">Redefining modern luxury through sustainable practices and timeless craftsmanship. Join our journey into the future of fashion.</p>'),
    
    # Shop collections title
    (r'<h4 class="font-bold mb-6 text-lg">Shop Collections</h4>',
     r'<h4 data-text-key="footer_col_1_title" class="font-bold mb-6 text-lg">Shop Collections</h4>'),
    
    # Shop collections UL
    (r'<h4 data-text-key="footer_col_1_title" class="font-bold mb-6 text-lg">Shop Collections</h4>\s*<ul class="space-y-3 text-gray-400 text-sm">',
     r'<h4 data-text-key="footer_col_1_title" class="font-bold mb-6 text-lg">Shop Collections</h4>\n                    <ul id="cms-footer-col-1" class="space-y-3 text-gray-400 text-sm">'),
    
    # Customer Care title
    (r'<h4 class="font-bold mb-6 text-lg">Customer Care</h4>',
     r'<h4 data-text-key="footer_col_2_title" class="font-bold mb-6 text-lg">Customer Care</h4>'),
     
    # Customer Care UL
    (r'<h4 data-text-key="footer_col_2_title" class="font-bold mb-6 text-lg">Customer Care</h4>\s*<ul class="space-y-3 text-gray-400 text-sm">',
     r'<h4 data-text-key="footer_col_2_title" class="font-bold mb-6 text-lg">Customer Care</h4>\n                    <ul id="cms-footer-col-2" class="space-y-3 text-gray-400 text-sm">'),

    # Newsletter
    (r'<h4 class="font-bold mb-6 text-lg">The Destination for Modern Luxury</h4>',
     r'<h4 data-text-key="footer_newsletter_title" class="font-bold mb-6 text-lg">The Destination for Modern Luxury</h4>'),
    (r'<p class="text-gray-400 text-sm mb-4">Subscribe for early access to new collections and exclusive events.</p>',
     r'<p data-text-key="footer_newsletter_desc" class="text-gray-400 text-sm mb-4">Subscribe for early access to new collections and exclusive events.</p>'),
    (r'<button type="submit" class="btn-primary rounded-md px-4 py-3 font-bold uppercase text-sm tracking-wide">Subscribe</button>',
     r'<button type="submit" data-text-key="footer_newsletter_btn" class="btn-primary rounded-md px-4 py-3 font-bold uppercase text-sm tracking-wide">Subscribe</button>'),
     
    # SEO
    (r'<h1 class="font-bold text-gray-500 mb-2 text-xs">Premium Fashion Destination</h1>',
     r'<h1 data-text-key="footer_seo_title" class="font-bold text-gray-500 mb-2 text-xs">Premium Fashion Destination</h1>'),
    # for the SEO text, it's a naked text node.
    (r'<h1 data-text-key="footer_seo_title" class="font-bold text-gray-500 mb-2 text-xs">Premium Fashion Destination</h1>\s*Luxe Fashion is the leading premium fashion retailer.*?autumn/winter trends\.\.\.',
     r'<h1 data-text-key="footer_seo_title" class="font-bold text-gray-500 mb-2 text-xs">Premium Fashion Destination</h1>\n                <span data-text-key="footer_seo_text">Luxe Fashion is the leading premium fashion retailer, curating global top designers. We specialize in contemporary luxury, avant-garde pieces, structured blazers, high-performance tailoring, and artisanal leather accessories. Our platform offers an immersive shopping experience featuring the latest autumn/winter trends...</span>'),

    # Bottom links div
    (r'<div class="flex gap-6">\s*<a href="home.html" class="hover:text-white transition">Homepage</a>\s*<a href="privacy.html" class="hover:text-white transition">Privacy Policy</a>\s*<a href="terms.html" class="hover:text-white transition">Terms &amp; Conditions</a>\s*</div>',
     r'<div id="cms-footer-bottom-links" class="flex gap-6">\n                    <a href="home.html" class="hover:text-white transition">Homepage</a>\n                    <a href="privacy.html" class="hover:text-white transition">Privacy Policy</a>\n                    <a href="terms.html" class="hover:text-white transition">Terms &amp; Conditions</a>\n                </div>')
]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    modified = False
    for pattern, replacement in replacements:
        new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
        if new_content != content:
            content = new_content
            modified = True
            
    if modified:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
            print(f"Updated {file}")
