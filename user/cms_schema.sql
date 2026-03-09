CREATE TABLE IF NOT EXISTS global_menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    menu_location VARCHAR(50) NOT NULL, -- e.g., 'header', 'footer_col_1', 'footer_col_2', 'bottom_links', 'mobile'
    menu_title VARCHAR(100) NOT NULL,
    link_type ENUM('path', 'url') NOT NULL DEFAULT 'path',
    link_target VARCHAR(255) NOT NULL,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS global_texts (
    text_key VARCHAR(100) PRIMARY KEY, -- e.g., 'hero_title', 'footer_copyright', 'about_text'
    text_value TEXT NOT NULL,
    page_location VARCHAR(50) DEFAULT 'global',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
