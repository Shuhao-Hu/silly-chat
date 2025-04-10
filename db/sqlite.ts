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
  console.log(db);
  return await db.getAllAsync(`SELECT * FROM messages`);
};

export const getUserConversationSummary = async (db: SQLiteDatabase, userId: number) => {
  await waitForDbReady();
  return await db.getAllAsync(`
    SELECT
        c.chatting_user_id,
        COUNT(CASE WHEN m.read = 0 AND m.sender_id = c.chatting_user_id THEN 1 END) AS unread_count,
        (
            SELECT content
            FROM messages
            WHERE sender_id = c.chatting_user_id
            AND recipient_id = c.user_id
            AND read = 0
            ORDER BY timestamp DESC
            LIMIT 1
        ) AS last_unread_message,
        c.last_updated
    FROM
        conversations c
    LEFT JOIN
        messages m ON m.sender_id = c.chatting_user_id AND m.recipient_id = c.user_id
    WHERE
        c.user_id = ?
    GROUP BY
        c.chatting_user_id
    ORDER BY
        c.last_updated DESC;
  `, [userId]);
};

export const markMessagesRead = async (db: SQLiteDatabase, contactUserId: number) => {
  const stmt = await db.prepareAsync(`
    UPDATE messages 
    SET read = 1 
    WHERE sender_id = $chatUserId 
    AND read = 0
  `);
  try {
    await stmt.executeAsync({ $chatUserId: contactUserId });
  } finally {
    await stmt.finalizeAsync();
  }
};
 
