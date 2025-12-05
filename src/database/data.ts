
// ======= MÃU ======
import SQLite, { SQLiteDatabase, ResultSet } from 'react-native-sqlite-storage';
import { Category, Product, User } from '../navigation/types';

SQLite.enablePromise(true);

let db: SQLiteDatabase | null = null;

const getDb = async (): Promise<SQLiteDatabase> => {
  if (!db) {
    db = await SQLite.openDatabase({ name: 'mydb.db', location: 'default' });
  }
  return db;
};

export const executeSql = async (
  sql: string,
  params: any[] = []
): Promise<ResultSet> => {
  const database = await getDb();
  const [result] = await database.executeSql(sql, params);
  return result;
};

export const normalize = <T = any>(result: ResultSet): T[] => {
  const items: T[] = [];
  for (let i = 0; i < result.rows.length; i++) {
    items.push(result.rows.item(i));
  }
  return items;
};

// ------------------ Initial Data ------------------
const initialCategories: Category[] = [
  { id: 1, name: 'Áo' },
  { id: 2, name: 'Giày' },
  { id: 3, name: 'Balo' },
  { id: 4, name: 'Mũ' },
  { id: 5, name: 'Túi' },
];

const initialProducts: Product[] = [
  { id: 1, name: 'Áo sơ mi', price: '250000', image: 'bomber_jacket', categoryId: 1 },
  { id: 2, name: 'Giày sneaker', price: '1100000', image: 'bomber_jacket', categoryId: 2 },
];

// ------------------ Init Database ------------------
export const initDatabase = async (): Promise<void> => {
  try {
    // Categories
    await executeSql(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY,
        name TEXT
      )
    `);

    for (const c of initialCategories) {
      await executeSql(
        'INSERT OR IGNORE INTO categories (id, name) VALUES (?, ?)',
        [c.id, c.name]
      );
    }

    // Products
    await executeSql(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        price REAL,
        img TEXT,
        categoryId INTEGER,
        FOREIGN KEY (categoryId) REFERENCES categories(id)
      )
    `);

    for (const p of initialProducts) {
      await executeSql(
        'INSERT OR IGNORE INTO products (id, name, price, img, categoryId) VALUES (?, ?, ?, ?, ?)',
        [p.id, p.name, p.price, p.image, p.categoryId]
      );
    }

    // Users
    await executeSql(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
      )
    `);

    await executeSql(`
      INSERT INTO users (username, password, role)
      SELECT 'admin', '123456', 'admin'
      WHERE NOT EXISTS (SELECT 1 FROM users WHERE username = 'admin')
    `);

    // Cart
    await executeSql(`
      CREATE TABLE IF NOT EXISTS cart (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        productId INTEGER,
        quantity INTEGER,
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);

    // Orders
    await executeSql(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        total REAL
      )
    `);

    // Order Items
    await executeSql(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        orderId INTEGER,
        productId INTEGER,
        quantity INTEGER,
        FOREIGN KEY (orderId) REFERENCES orders(id),
        FOREIGN KEY (productId) REFERENCES products(id)
      )
    `);

    console.log('Database initialized successfully!');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

// ------------------ Category ------------------
export const fetchCategories = async (): Promise<Category[]> => {
  const result = await executeSql('SELECT * FROM categories');
  return normalize<Category>(result);
};

export const updateCategory = async (id: number, name: string): Promise<void> => {
  await executeSql('UPDATE categories SET name = ? WHERE id = ?', [name, id]);
};

// ------------------ Product CRUD ------------------
export const fetchProducts = async (): Promise<Product[]> => {
  const result = await executeSql(`
    SELECT products.*, categories.name AS categoryName
    FROM products
    JOIN categories ON products.categoryId = categories.id
  `);
  const rows = normalize<any>(result);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    price: String(row.price),
    image: row.img,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
  }));
};

export const fetchProductsByCategory = async (categoryId: number): Promise<Product[]> => {
  const result = await executeSql(
    `SELECT products.*, categories.name AS categoryName
     FROM products
     JOIN categories ON products.categoryId = categories.id
     WHERE products.categoryId = ?`,
    [categoryId]
  );
  const rows = normalize<any>(result);

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    price: String(row.price),
    image: row.img,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
  }));
};

export const addProduct = async (product: Omit<Product, 'id'>): Promise<void> => {
  await executeSql(
    'INSERT INTO products (name, price, img, categoryId) VALUES (?, ?, ?, ?)',
    [product.name, product.price, product.image, product.categoryId]
  );
};

export const updateProduct = async (product: Product): Promise<void> => {
  await executeSql(
    'UPDATE products SET name = ?, price = ?, img = ?, categoryId = ? WHERE id = ?',
    [product.name, product.price, product.image, product.categoryId, product.id]
  );
};

export const deleteProduct = async (id: number): Promise<void> => {
  await executeSql('DELETE FROM products WHERE id = ?', [id]);
};

// ------------------ Cart ------------------
export const addToCart = async (productId: number, quantity: number = 1): Promise<void> => {
  const existing = await executeSql('SELECT * FROM cart WHERE productId = ?', [productId]);
  if (existing.rows.length > 0) {
    await executeSql('UPDATE cart SET quantity = quantity + ? WHERE productId = ?', [quantity, productId]);
  } else {
    await executeSql('INSERT INTO cart (productId, quantity) VALUES (?, ?)', [productId, quantity]);
  }
};

export const fetchCart = async (): Promise<(Product & { quantity: number })[]> => {
  const result = await executeSql(`
    SELECT cart.id as cartId, products.*, cart.quantity, categories.name AS categoryName
    FROM cart
    JOIN products ON cart.productId = products.id
    JOIN categories ON products.categoryId = categories.id
  `);
  const rows = normalize<any>(result);
  return rows.map(row => ({
    id: row.id,
    name: row.name,
    price: String(row.price),
    image: row.img,
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    quantity: row.quantity,
  }));
};

export const removeFromCart = async (productId: number): Promise<void> => {
  await executeSql('DELETE FROM cart WHERE productId = ?', [productId]);
};

export const clearCart = async (): Promise<void> => {
  await executeSql('DELETE FROM cart');
};

// ------------------ Orders ------------------
export const checkout = async (): Promise<void> => {
  const cartItems = await fetchCart();
  if (cartItems.length === 0) return;

  const total = cartItems.reduce((sum, item) => sum + parseInt(item.price) * item.quantity, 0);
  const date = new Date().toLocaleString();

  const orderResult = await executeSql('INSERT INTO orders (date, total) VALUES (?, ?)', [date, total]);
  const orderId = orderResult.insertId;

  for (const item of cartItems) {
    await executeSql(
      'INSERT INTO order_items (orderId, productId, quantity) VALUES (?, ?, ?)',
      [orderId, item.id, item.quantity]
    );
  }

  await clearCart();
};

export const fetchOrders = async (): Promise<any[]> => {
  const result = await executeSql('SELECT * FROM orders ORDER BY id DESC');
  const orders = normalize<any>(result);

  for (const order of orders) {
    const itemsResult = await executeSql(`
      SELECT order_items.*, products.name, products.price
      FROM order_items
      JOIN products ON order_items.productId = products.id
      WHERE order_items.orderId = ?
    `, [order.id]);
    order.items = normalize<any>(itemsResult);
  }

  return orders;
};

// ------------------ User Auth & CRUD ------------------
export const updateUserRole = async (id: number, role: string): Promise<void> => {
  await executeSql('UPDATE users SET role = ? WHERE id = ?', [role, id]);
};

export const getUserByUsername = async (username: string): Promise<User | null> => {
  const result = await executeSql('SELECT * FROM users WHERE username = ?', [username]);
  const user = normalize<User>(result)[0] || null;

  if (user && typeof user.role !== 'string') {
    user.role = String(user.role);
  }
  return user;
};

export const registerUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; message?: string }> => {
  const existed = await getUserByUsername(username);
  if (existed) {
    return { success: false, message: 'Username already exists' };
  }
  await executeSql(
    'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
    [username, password, 'user']
  );
  return { success: true };
};

export const loginUser = async (
  username: string,
  password: string
): Promise<{ success: boolean; user?: User; message?: string }> => {
  const result = await executeSql(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
  );
  const user = normalize<User>(result)[0];

  if (!user) {
    return { success: false, message: 'Invalid username or password' };
  }

  user.role = String(user.role).trim().toLowerCase();
  return { success: true, user };
};

export const addUser = async (username: string, password: string, role: string): Promise<boolean> => {
  try {
    const db = await getDb();
    await db.executeSql(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, password, role]
    );
    console.log('✅ User added');
    return true;
  } catch (error) {
    console.error('❌ Error adding user:', error);
    return false;
  }
};

export const changePassword = async (username: string, newPassword: string): Promise<void> => {
  await executeSql('UPDATE users SET password = ? WHERE username = ?', [newPassword, username]);
};

export const fetchUsers = async (): Promise<User[]> => {
  const result = await executeSql('SELECT * FROM users');
  return normalize<User>(result);
};

export const getUserById = async (id: number): Promise<User | null> => {
  const result = await executeSql('SELECT * FROM users WHERE id = ?', [id]);
  return normalize<User>(result)[0] || null;
};

export const getUserByCredentials = async (
  username: string,
  password: string
): Promise<User | null> => {
  const result = await executeSql(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password]
  );
  const user = normalize<User>(result)[0] || null;

  if (user) {
    user.role = String(user.role).trim().toLowerCase();
  }
  return user;
};

export const deleteUser = async (id: number): Promise<void> => {
  await executeSql('DELETE FROM users WHERE id = ?', [id]);
};