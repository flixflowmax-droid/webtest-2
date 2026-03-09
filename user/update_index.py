import sys

with open('c:/Users/RDP/Downloads/website/user/home.html', 'r', encoding='utf-8') as f:
    html = f.read()

start_marker = '<!-- Global Header -->'
end_marker = '</main>'

if start_marker not in html or end_marker not in html:
    print("Markers not found.")
    sys.exit(1)

start_idx = html.find(start_marker)
end_idx = html.find(end_marker) + len(end_marker)

new_content = """<!-- Global Header -->
    <header id="main-header" class="fixed w-full top-0 z-50 transition-all duration-300 py-4 bg-[#f8f6f5] border-b border-black/5 text-black group">
        <div class="container mx-auto px-6 lg:px-12 flex justify-between items-center">
            <!-- Logo -->
            <a href="home.html" class="flex items-center gap-2 text-xl font-black tracking-tighter">
                <div class="bg-[#ff0055] text-white w-7 h-7 rounded-full flex items-center justify-center">
                    <i class="fa-solid fa-heart text-[10px]"></i>
                </div>
                <span>LUXE FASHION</span>
            </a>

            <!-- Navigation Links (Desktop) -->
            <nav class="hidden md:flex gap-8 text-xs font-semibold tracking-wide text-gray-800 uppercase">
                <a href="shop.html?category=new" class="hover:text-[#ff0055] transition">New Arrivals</a>
                <div class="relative group cursor-pointer flex items-center gap-1">
                    <span class="hover:text-[#ff0055] transition">Collections</span>
                    <i class="fa-solid fa-chevron-down text-[8px] text-gray-400"></i>
                </div>
                <a href="shop.html?category=women" class="hover:text-[#ff0055] transition">Women</a>
                <a href="shop.html?category=men" class="hover:text-[#ff0055] transition">Men</a>
                <a href="shop.html?category=sale" class="text-[#ff0055] hover:text-[#e0004b] transition">Flash Sale</a>
            </nav>

            <!-- Search, User, Cart -->
            <div class="flex items-center gap-6 relative">
                <!-- Search Bar -->
                <div class="hidden md:flex relative items-center">
                    <div class="relative">
                        <i class="fa-solid fa-magnifying-glass absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
                        <input type="text" id="desk-search" placeholder="Search trends..." class="pl-10 pr-4 py-2 rounded-full bg-black/5 border border-transparent focus:bg-white focus:border-gray-200 focus:outline-none text-xs transition-all w-56 text-black placeholder-gray-500">
                    </div>
                </div>

                <a href="wishlist.html" class="hover:text-[#ff0055] transition text-gray-800" title="Wishlist">
                    <i class="fa-solid fa-heart text-lg"></i>
                </a>
                
                <a href="#" class="cart-toggle relative hover:text-[#ff0055] transition text-gray-800" title="Bag">
                    <i class="fa-solid fa-bag-shopping text-lg"></i>
                    <span class="cart-badge absolute -top-1.5 -right-2 bg-[#ff0055] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center shadow-sm">0</span>
                </a>
                
                <button class="md:hidden hover:text-[#ff0055] transition text-gray-800">
                    <i class="fa-solid fa-bars text-xl"></i>
                </button>
            </div>
        </div>
    </header>

    <!-- Cart Drawer & Overlay -->
    <div id="cart-overlay" class="cart-overlay"></div>
    <div id="cart-drawer" class="cart-drawer px-6 py-6 font-sans">
        <div class="flex justify-between items-center mb-6 border-b pb-4">
            <h2 class="text-2xl font-bold tracking-tight">Your Bag</h2>
            <button id="close-cart" class="text-gray-400 hover:text-black transition">
                <i class="fa-solid fa-xmark text-xl"></i>
            </button>
        </div>
        
        <!-- Cart Items List -->
        <div id="cart-items" class="flex-1 overflow-y-auto pr-2 space-y-4">
            <!-- Dynamically populated by JS -->
        </div>

        <!-- Cart Footer -->
        <div class="mt-6 border-t pt-4">
            <div class="flex justify-between items-center mb-2">
                <span class="text-gray-500">Subtotal</span>
                <span id="cart-subtotal" class="text-xl font-bold">$0.00</span>
            </div>
            <p class="text-xs text-gray-400 mb-4">Delivery & taxes calculated at checkout.</p>
            <a href="checkout.html" class="btn-primary w-full block text-center py-4 rounded-md font-semibold text-lg tracking-wide">
                Proceed to Checkout <i class="fa-solid fa-arrow-right ml-2 relative top-[1px]"></i>
            </a>
            <a href="cart.html" class="w-full block text-center mt-3 text-sm text-gray-500 underline hover:text-black relative z-50">View Full Cart</a>
        </div>
    </div>

    <!-- MAIN CONTENT -->
    <main class="pt-[71px]">
        <!-- Hero Section -->
        <section class="relative w-full h-[85vh] flex items-center overflow-hidden bg-[#e6e2df]">
            <!-- Background Image -->
            <img src="assets/hero-1.jpg" alt="Fashion Hero" class="absolute w-full h-full object-cover mix-blend-multiply opacity-90 scale-105 animate-[transform_20s_ease-out_infinite]">
            
            <div class="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-transparent"></div>
            
            <div class="relative z-10 text-left text-white px-6 lg:px-24 reveal active max-w-3xl">
                <p class="text-[#ff0055] font-bold tracking-[0.2em] mb-4 text-xs uppercase">Winter 2024 Premiere</p>
                <h1 class="text-6xl md:text-[5.5rem] font-black mb-6 tracking-tighter leading-[0.9]">THE NEW<br>STANDARD.</h1>
                <p class="text-base md:text-lg font-light mb-10 opacity-90 max-w-md">Discover the artisanal craftsmanship and avant-garde aesthetics of our latest collection. Limited pieces now available.</p>
                <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <a href="shop.html" class="bg-[#ff0055] hover:bg-[#e0004b] text-white px-8 py-3.5 rounded-full font-bold tracking-wide flex items-center justify-center transition-colors text-sm">
                        Shop Collection <i class="fa-solid fa-arrow-right ml-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                    </a>
                    <a href="#" class="border border-white/50 bg-black/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-3.5 rounded-full font-bold tracking-wide transition-colors text-sm">
                        Watch Runway
                    </a>
                </div>
            </div>

            <!-- Slider Controls -->
            <div class="absolute bottom-12 right-12 hidden md:flex gap-4 z-10">
                <button class="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm">
                    <i class="fa-solid fa-chevron-left text-xs"></i>
                </button>
                <button class="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors backdrop-blur-sm">
                    <i class="fa-solid fa-chevron-right text-xs"></i>
                </button>
            </div>
        </section>

        <!-- Categories Section -->
        <section class="py-20 bg-[#f9f9f9] container mx-auto px-6 lg:px-12">
            <div class="flex justify-between items-end mb-10 reveal border-gray-200">
                <div>
                    <h2 class="text-3xl font-bold tracking-tight mb-1">Curated Shop</h2>
                    <p class="text-gray-500 text-sm">Explore our most sought-after categories</p>
                </div>
                <a href="shop.html" class="text-[#ff0055] font-bold hover:text-[#e0004b] transition flex items-center gap-2 text-sm">View All <i class="fa-solid fa-arrow-right"></i></a>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6 reveal">
                <!-- Cat 1 -->
                <a href="shop.html?category=women" class="group relative h-[450px] rounded-[2rem] overflow-hidden shadow-sm">
                    <img src="assets/women-cat.jpg" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Women">
                    <!-- Adjusted gradient to show text clearly -->
                    <div class="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/50 via-black/5 to-transparent">
                        <h3 class="text-2xl text-white font-bold mb-1 drop-shadow-sm">Essential Women</h3>
                        <p class="text-white/90 mb-6 text-sm drop-shadow-sm">Elevated basics for every day</p>
                        <span class="bg-white text-black px-6 py-2.5 rounded-full w-max text-xs font-bold transition-transform group-hover:scale-105">Shop Now</span>
                    </div>
                </a>
                <!-- Cat 2 -->
                <a href="shop.html?category=men" class="group relative h-[450px] rounded-[2rem] overflow-hidden shadow-sm">
                    <img src="assets/men-cat.jpg" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Men">
                    <div class="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/50 via-black/5 to-transparent">
                        <h3 class="text-2xl text-white font-bold mb-1 drop-shadow-sm">The Modern Man</h3>
                        <p class="text-white/90 mb-6 text-sm drop-shadow-sm">Tailored to perfection</p>
                        <span class="bg-white text-black px-6 py-2.5 rounded-full w-max text-xs font-bold transition-transform group-hover:scale-105">Shop Now</span>
                    </div>
                </a>
                <!-- Cat 3 -->
                <a href="shop.html?category=accessories" class="group relative h-[450px] rounded-[2rem] overflow-hidden shadow-sm">
                    <img src="assets/acc-cat.jpg" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Accessories">
                    <div class="absolute inset-0 flex flex-col justify-end p-8 bg-gradient-to-t from-black/50 via-black/5 to-transparent">
                        <h3 class="text-2xl text-white font-bold mb-1 drop-shadow-sm">Statement Accents</h3>
                        <p class="text-white/90 mb-6 text-sm drop-shadow-sm">The finishing touch</p>
                        <span class="bg-white text-black px-6 py-2.5 rounded-full w-max text-xs font-bold transition-transform group-hover:scale-105">Shop Now</span>
                    </div>
                </a>
            </div>
        </section>

        <!-- Flash Sale Banner -->
        <section class="w-full bg-[#ff0055] text-white py-10 reveal">
            <div class="container mx-auto px-6 lg:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
                <div>
                    <h2 class="text-4xl font-black italic mb-1 tracking-tighter">FLASH SALE EVENT</h2>
                    <p class="text-sm opacity-90 font-medium tracking-wide">Extra 40% OFF all seasonal items. Ends in:</p>
                </div>
                
                <div class="flex gap-4 items-center mr-auto md:mr-0 ml-0 md:ml-auto">
                    <div class="bg-white text-black w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold shadow-md">
                        <span id="flash-hours" class="text-lg leading-none">02</span>
                        <span class="text-[7px] uppercase mt-0.5 text-gray-500 tracking-wider">Hours</span>
                    </div>
                    <div class="bg-white text-black w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold shadow-md">
                        <span id="flash-mins" class="text-lg leading-none">45</span>
                        <span class="text-[7px] uppercase mt-0.5 text-gray-500 tracking-wider">Mins</span>
                    </div>
                    <div class="bg-white text-black w-14 h-14 rounded-full flex flex-col items-center justify-center font-bold shadow-md">
                        <span id="flash-secs" class="text-lg leading-none">18</span>
                        <span class="text-[7px] uppercase mt-0.5 text-gray-500 tracking-wider">Secs</span>
                    </div>
                </div>

                <a href="shop.html?sale=true" class="bg-[#0f172a] hover:bg-black text-white px-8 py-3.5 rounded-full font-bold transition-colors text-sm tracking-wide shadow-lg">Claim Offer</a>
            </div>
        </section>

        <!-- New Arrivals -->
        <section class="py-20 bg-[#faf9f8] container mx-auto px-6 lg:px-12">
            <div class="flex flex-col md:flex-row justify-between items-end mb-10 reveal border-b border-gray-200 pb-2">
                <div>
                    <h2 class="text-3xl font-bold tracking-tight mb-0">New Arrivals</h2>
                </div>
                <!-- Mini filter inside Home -->
                <div class="flex gap-8 text-xs font-semibold text-gray-400 mt-4 md:mt-0">
                    <button class="text-[#ff0055] border-b-[3px] border-[#ff0055] pb-2 -mb-[3px] font-bold">All</button>
                    <button class="hover:text-black pb-2 transition">Dresses</button>
                    <button class="hover:text-black pb-2 transition">Outerwear</button>
                    <button class="hover:text-black pb-2 transition">Knitwear</button>
                </div>
            </div>

            <!-- Products Grid (Filled by JS) -->
            <div id="home-products-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
                <!-- Products will be dynamically inserted here -->
            </div>
            
        </section>
    </main>"""

html = html[:start_idx] + new_content + html[end_idx:]

script_start = "homeGrid.innerHTML = newProducts.map(item => `"
script_end = "`).join('');"
idx1 = html.find(script_start)
idx2 = html.find(script_end, idx1)

if idx1 != -1 and idx2 != -1:
    new_script = '''homeGrid.innerHTML = newProducts.map((item, i) => `
                    <div class="product-card group cursor-pointer animate-[fadeIn_0.5s_ease-in-out]" onclick="window.location.href='product.html?id=${item.id}'">
                        <div class="relative ${i===0?'bg-[#375a4d]':i===1?'bg-[#ffa040]':i===2?'bg-[#8f9972]':'bg-[#c2d7b8]'} rounded-3xl overflow-hidden aspect-[4/5] mb-4">
                            <span class="absolute top-4 left-4 bg-[#ff0055] text-white text-[9px] font-bold px-3 py-1 rounded-full z-20 shadow-sm uppercase">NEW</span>
                            ${item.isFlashSale ? `<span class="absolute top-4 left-16 bg-black text-white text-[9px] font-bold px-3 py-1 rounded-full z-20 shadow-sm uppercase">SALE</span>` : ''}
                            
                            <button onclick="event.stopPropagation(); addToCart('${item.id}', 1)" class="absolute bottom-4 right-4 bg-white shadow-md w-10 h-10 rounded-full flex items-center justify-center text-gray-800 hover:text-[#ff0055] transition-colors z-20">
                                <i class="fa-solid fa-cart-shopping text-[13px]"></i>
                            </button>
                            
                            <img src="${item.image1}" class="w-full h-full object-cover img-primary" style="opacity: ${i===0?'0.5':'1'}" alt="${item.name}">
                            <img src="${item.image2 || item.image1}" class="w-full h-full object-cover img-secondary" style="opacity: ${i===0?'0.5':'1'}" alt="${item.name}">
                        </div>
                        <div>
                            <div class="flex justify-between items-center mb-1">
                                <p class="text-[9px] text-gray-500 uppercase tracking-widest font-semibold">${item.category}</p>
                                <div class="flex gap-1 items-center">
                                    <span class="w-2.5 h-2.5 rounded-full bg-black border border-gray-200"></span>
                                    <span class="w-2.5 h-2.5 rounded-full bg-gray-300 border border-gray-200"></span>
                                </div>
                            </div>
                            <h3 class="font-bold text-sm mb-1 text-gray-900 group-hover:text-[#ff0055] transition-colors">${item.name}</h3>
                            <div class="flex gap-2 items-center">
                                <span class="font-bold text-sm text-gray-900">$${item.price.toFixed(2)}</span>
                                ${item.originalPrice ? `<span class="text-gray-400 line-through text-xs">$${item.originalPrice.toFixed(2)}</span>` : ''}
                            </div>
                        </div>
                    </div>
                `).join('');'''
    html = html[:idx1] + new_script + html[idx2+len(script_end):]

with open('c:/Users/RDP/Downloads/website/user/home.html', 'w', encoding='utf-8') as f:
    f.write(html)
