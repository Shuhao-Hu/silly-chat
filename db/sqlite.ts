import { Message } from "@/types/types";
import { SQLiteDatabase } from "expo-sqlite";

let dbReady = false;

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
    );`);

  dbReady = true;
};

const waitForDbReady = async () => {
  while (!dbReady) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
};

export const insertConversation = async (db: SQLiteDatabase, userId: number, chattingId: number) => {
  await waitForDbReady();
  await db.runAsync(`
      INSERT OR IGNORE INTO conversations (user_id, chatting_user_id)
      VALUES (?, ?);
  `, [userId, chattingId]);
};

export const insertMessage = async (db: SQLiteDatabase, senderId: number, recipientId: number, content: string, timestamp: string, read: boolean) => {
  await waitForDbReady();
  await db.runAsync(
    `INSERT INTO messages (sender_id, recipient_id, content, read, timestamp) VALUES (?, ?, ?, ?, ?)`,
    [senderId, recipientId, content, read, timestamp]
  );
};

export const dropTablesIfNeeded = async (db: SQLiteDatabase) => {
  await db.execAsync("DROP TABLE IF EXISTS messages;");
  await db.execAsync("DROP TABLE IF EXISTS conversations;");
};

export const getChatHistory = async (
  db: SQLiteDatabase,
  userId: number,
  recipientId: number
) => {
  await waitForDbReady();
  const result: Message[] = await db.getAllAsync(
    `SELECT * FROM messages 
     WHERE (sender_id = ? AND recipient_id = ?) 
        OR (sender_id = ? AND recipient_id = ?) 
     ORDER BY timestamp DESC`,
    [userId, recipientId, recipientId, userId]
  );
  return result;
};

export const selectAllMessages = async (db: SQLiteDatabase) => {
  await waitForDbReady();
  return await db.getAllAsync(`SELECT * FROM messages`);
};