-- Таблица пользователей
CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       username VARCHAR(50) NOT NULL UNIQUE,
                       email VARCHAR(100) NOT NULL UNIQUE,
                       password_hash VARCHAR(255) NOT NULL,
                       full_name VARCHAR(100),
                       is_active BOOLEAN DEFAULT TRUE,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица категорий товаров
CREATE TABLE categories (
                            id INTEGER PRIMARY KEY AUTOINCREMENT,
                            name VARCHAR(50) NOT NULL,
                            parent_category_id INTEGER,
                            description TEXT,
                            FOREIGN KEY (parent_category_id) REFERENCES categories(id)
);

-- Таблица товаров
CREATE TABLE products (
                          id INTEGER PRIMARY KEY AUTOINCREMENT,
                          name VARCHAR(100) NOT NULL,
                          description TEXT,
                          price DECIMAL(10, 2) NOT NULL,
                          category_id INTEGER NOT NULL,
                          created_by INTEGER,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (category_id) REFERENCES categories(id),
                          FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Таблица заказов
CREATE TABLE orders (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        user_id INTEGER NOT NULL,
                        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                        status VARCHAR(20) DEFAULT 'pending',
                        total_amount DECIMAL(10, 2),
                        FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Таблица товаров в заказе
CREATE TABLE order_items (
                             id INTEGER PRIMARY KEY AUTOINCREMENT,
                             order_id INTEGER NOT NULL,
                             product_id INTEGER NOT NULL,
                             quantity INTEGER NOT NULL,
                             price_at_time DECIMAL(10, 2) NOT NULL,
                             FOREIGN KEY (order_id) REFERENCES orders(id),
                             FOREIGN KEY (product_id) REFERENCES products(id)
);