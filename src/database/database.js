import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true);

export const getDBConnection = async () => {
  return SQLite.openDatabase({ name: 'SanPhamDB.db', location: 'default' });
};

export const createTable = async () => {
  const db = await getDBConnection();
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS SanPham (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      ten TEXT NOT NULL,
      gia REAL NOT NULL
    );
  `);
};

export const insertSanPham = async (ten, gia) => {
  const db = await getDBConnection();
  await db.executeSql(
    `INSERT INTO SanPham (ten, gia) VALUES (?, ?);`,
    [ten, gia]
  );
};

export const getAllSanPham = async () => {
  const db = await getDBConnection();
  const results = await db.executeSql(`SELECT * FROM SanPham;`);
  const rows = results[0].rows;
  const items = [];
  for (let i = 0; i < rows.length; i++) {
    items.push(rows.item(i));
  }
  return items;
};