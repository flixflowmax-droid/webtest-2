import os
import re

home_path = r"c:\Users\RDP\Downloads\website\user\home.html"

with open(home_path, 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    # Desktop Header Nav
    (r'<nav class="hidden md:flex gap-8 text-xs font-semibold tracking-wide text-gray-800 uppercase">.*?</nav>',
     r'<nav id="cms-header-nav" class="hidden md:flex gap-8 text-xs font-semibold tracking-wide text-gray-800 uppercase"></nav>'),
    
    # Hero Subtitle
    (r'<p class="text-\[#ff0055\] font-bold tracking-\[0\.2em\] mb-4 text-xs uppercase">Winter 2024 Premiere</p>',
     r'<p data-text-key="hero_subtitle" class="text-[#ff0055] font-bold tracking-[0.2em] mb-4 text-xs uppercase">Winter 2024 Premiere</p>'),
     
    # Hero Desc
    (r'<p class="text-base md:text-lg font-light mb-10 opacity-90 max-w-md">Discover the artisanal craftsmanship and avant-garde aesthetics of our latest collection. Limited pieces now available.</p>',
     r'<p data-text-key="hero_desc" class="text-base md:text-lg font-light mb-10 opacity-90 max-w-md">Discover the artisanal craftsmanship and avant-garde aesthetics of our latest collection. Limited pieces now available.</p>'),
     
    # Hero Buttons
    (r'Shop Collection <i class="fa-solid fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform"></i>',
     r'<span data-text-key="hero_btn_1">Shop Collection</span> <i class="fa-solid fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform"></i>'),
    
    (r'<a href="#" class="border border-white/50 bg-black/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3\.5 rounded-full font-bold tracking-wide transition-colors text-sm">\s*Watch Runway\s*</a>',
     r'<a href="#" data-text-key="hero_btn_2" class="border border-white/50 bg-black/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-bold tracking-wide transition-colors text-sm">Watch Runway</a>'),
     
    # Curated Shop
    (r'<h2 class="text-3xl font-bold tracking-tight mb-1">Curated Shop</h2>',
     r'<h2 data-text-key="curated_title" class="text-3xl font-bold tracking-tight mb-1">Curated Shop</h2>'),
    
    (r'<p class="text-gray-500 text-sm">Explore our most sought-after categories</p>',
     r'<p data-text-key="curated_desc" class="text-gray-500 text-sm">Explore our most sought-after categories</p>'),
     
    (r'View All <i class="fa-solid fa-arrow-right"></i>',
     r'<span data-text-key="curated_view_all">View All</span> <i class="fa-solid fa-arrow-right"></i>'),
     
    # Categories
    (r'<h3 class="text-2xl text-white font-bold mb-1 drop-shadow-sm">Essential Women</h3>',
     r'<h3 data-text-key="cat1_title" class="text-2xl text-white font-bold mb-1 drop-shadow-sm">Essential Women</h3>'),
    (r'<p class="text-white/90 mb-6 text-sm drop-shadow-sm">Elevated basics for every day</p>',
     r'<p data-text-key="cat1_desc" class="text-white/90 mb-6 text-sm drop-shadow-sm">Elevated basics for every day</p>'),
    (r'<span class="bg-white text-black px-6 py-2\.5 rounded-full w-max text-xs font-bold transition-transform group-hover:scale-105">Shop Now</span>',
     r'<span data-text-key="cat1_btn" class="bg-white text-black px-6 py-2.5 rounded-full w-max text-xs font-bold transition-transform group-hover:scale-105">Shop Now</span>'),

    (r'<h3 class="text-2xl text-white font-bold mb-1 drop-shadow-sm">The Modern Man</h3>',
     r'<h3 data-text-key="cat2_title" class="text-2xl text-white font-bold mb-1 drop-shadow-sm">The Modern Man</h3>'),
    (r'<p class="text-white/90 mb-6 text-sm drop-shadow-sm">Tailored to perfection</p>',
     r'<p data-text-key="cat2_desc" class="text-white/90 mb-6 text-sm drop-shadow-sm">Tailored to perfection</p>'),
     
    (r'<h3 class="text-2xl text-white font-bold mb-1 drop-shadow-sm">Statement Accents</h3>',
     r'<h3 data-text-key="cat3_title" class="text-2xl text-white font-bold mb-1 drop-shadow-sm">Statement Accents</h3>'),
    (r'<p class="text-white/90 mb-6 text-sm drop-shadow-sm">The finishing touch</p>',
     r'<p data-text-key="cat3_desc" class="text-white/90 mb-6 text-sm drop-shadow-sm">The finishing touch</p>'),
     
    # Flash Sale
    (r'<h2 class="text-4xl font-black italic mb-1 tracking-tighter">FLASH SALE EVENT</h2>',
     r'<h2 data-text-key="flash_title" class="text-4xl font-black italic mb-1 tracking-tighter">FLASH SALE EVENT</h2>'),
    (r'<p class="text-sm opacity-90 font-medium tracking-wide">Extra 40% OFF all seasonal items\. Ends in:</p>',
     r'<p data-text-key="flash_desc" class="text-sm opacity-90 font-medium tracking-wide">Extra 40% OFF all seasonal items. Ends in:</p>'),
    (r'<a href="shop\.html\?sale=true" class="bg-\[#0f172a\] hover:bg-black text-white px-8 py-3\.5 rounded-full font-bold transition-colors text-sm tracking-wide shadow-lg">Claim Offer</a>',
     r'<a href="shop.html?sale=true" data-text-key="flash_btn" class="bg-[#0f172a] hover:bg-black text-white px-8 py-3.5 rounded-full font-bold transition-colors text-sm tracking-wide shadow-lg">Claim Offer</a>'),
     
    # New Arrivals
    (r'<h2 class="text-3xl font-bold tracking-tight mb-0">New Arrivals</h2>',
     r'<h2 data-text-key="arrivals_title" class="text-3xl font-bold tracking-tight mb-0">New Arrivals</h2>'),
]

for pattern, replacement in replacements:
    html = re.sub(pattern, replacement, html, flags=re.DOTALL)

with open(home_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("Updated home.html texts and menus")
