-- Creazione tabella utenti
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione tabella categorie prodotti
CREATE TABLE IF NOT EXISTS product_categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Creazione tabella prodotti
CREATE TABLE IF NOT EXISTS products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  category_id INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES product_categories(id)
);

-- Creazione tabella specifiche prodotti
CREATE TABLE IF NOT EXISTS product_specifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  spec_key TEXT NOT NULL,
  spec_value TEXT NOT NULL,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Creazione tabella ordini
CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  customer_name TEXT,
  order_type TEXT NOT NULL,
  status TEXT NOT NULL,
  due_date TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creazione tabella elementi ordine
CREATE TABLE IF NOT EXISTS order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  quantity INTEGER NOT NULL,
  notes TEXT,
  FOREIGN KEY (order_id) REFERENCES orders(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Inserimento utente admin predefinito
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2a$10$JdJF7rQGfDlHVZL8zs1AYO6eSfO/ePa.LZJj0qTCj6Qw7Yl3Pn3Uu', 'admin');

-- Inserimento categorie di prodotti
INSERT INTO product_categories (name, description) 
VALUES 
  ('Torte', 'Torte di vari tipi e dimensioni'),
  ('Pasticceria', 'Prodotti di pasticceria classica'),
  ('Specialità', 'Specialità della casa e prodotti stagionali');

-- Inserimento prodotti di esempio
INSERT INTO products (name, description, category_id) 
VALUES 
  ('Torta Classica', 'Base classica con pan di spagna e crema pasticcera', 1),
  ('Torta al Cioccolato', 'Base al cioccolato con ganache e decorazioni in cioccolato', 1),
  ('Croissant', 'Croissant classico di pasta sfoglia', 2),
  ('Cannolo Siciliano', 'Cannolo con ripieno di ricotta e gocce di cioccolato', 2),
  ('Torta Nuziale', 'Torta a più piani per cerimonie', 3);

-- Inserimento specifiche prodotti
INSERT INTO product_specifications (product_id, spec_key, spec_value) 
VALUES 
  (1, 'Diametri disponibili', '18cm, 22cm, 26cm'),
  (1, 'Personalizzazione decorazioni', 'Disponibile'),
  (2, 'Diametri disponibili', '18cm, 22cm'),
  (2, 'Varietà di cioccolato', 'fondente, al latte, bianco'),
  (5, 'Numero piani', '2-5'),
  (5, 'Tempo di preparazione', '3-5 giorni');
