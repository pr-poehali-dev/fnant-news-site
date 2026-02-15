CREATE TABLE chat_messages (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  avatar VARCHAR(10) DEFAULT '😎',
  color VARCHAR(20) DEFAULT '#a855f7',
  title VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW()
);