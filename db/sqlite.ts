import { SQLiteDatabase } from "expo-sqlite";

export const createDbIfNeeded = async (db: SQLiteDatabase) => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER NOT NULL,
      recipient_id INTEGER NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      content TEXT NOT NULL,
      read BOOLEAN DEFAULT 0
    )`);

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS conversations (
      user_id INTEGER NOT NULL,
      chatting_user_id INTEGER NOT NULL,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (user_id, chatting_user_id)
    );`)
}

export const insertConversation = async (db: SQLiteDatabase, userID: number, chattingID: number) => {
  await db.runAsync(`
      INSERT OR IGNORE INTO conversations (user_id, chatting_user_id)
      VALUES (?, ?);
  `, [userID, chattingID]);
}
