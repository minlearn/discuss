CREATE TABLE admin_users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT,
  role TEXT NOT NULL DEFAULT 'agent',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX idx_admin_users_email
  ON admin_users(email);

CREATE TABLE channel_accounts (
  id TEXT PRIMARY KEY,
  channel_type TEXT NOT NULL,
  display_name TEXT NOT NULL,
  external_account_id TEXT,
  credential_ciphertext TEXT,
  webhook_secret_ciphertext TEXT,
  outbound_url TEXT,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_channel_accounts_status
  ON channel_accounts(status);

CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  channel_account_id TEXT NOT NULL,
  external_contact_id TEXT NOT NULL,
  external_thread_id TEXT NOT NULL,
  contact_name TEXT,
  contact_avatar_url TEXT,
  is_anonymous INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'open',
  handoff_status TEXT NOT NULL DEFAULT 'agent',
  assignee_admin_user_id TEXT,
  last_message_id TEXT,
  last_message_at TEXT,
  unread_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  resolved_at TEXT,
  FOREIGN KEY (channel_account_id) REFERENCES channel_accounts(id),
  FOREIGN KEY (assignee_admin_user_id) REFERENCES admin_users(id)
);

CREATE UNIQUE INDEX idx_conversations_external_thread
  ON conversations(channel_account_id, external_thread_id);

CREATE INDEX idx_conversations_status
  ON conversations(status, last_message_at);

CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  channel_account_id TEXT NOT NULL,
  external_message_id TEXT,
  direction TEXT NOT NULL,
  sender_type TEXT NOT NULL,
  sender_admin_user_id TEXT,
  message_type TEXT NOT NULL DEFAULT 'text',
  content TEXT,
  attachments_json TEXT NOT NULL DEFAULT '[]',
  raw_payload_json TEXT,
  ai_metadata_json TEXT NOT NULL DEFAULT '{}',
  ai_references_json TEXT NOT NULL DEFAULT '[]',
  status TEXT NOT NULL DEFAULT 'received',
  error_message TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id),
  FOREIGN KEY (channel_account_id) REFERENCES channel_accounts(id),
  FOREIGN KEY (sender_admin_user_id) REFERENCES admin_users(id)
);

CREATE INDEX idx_messages_conversation
  ON messages(conversation_id, created_at);

CREATE UNIQUE INDEX idx_messages_external
  ON messages(channel_account_id, external_message_id)
  WHERE external_message_id IS NOT NULL;

CREATE TABLE kb_documents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'upload',
  ai_search_instance_id TEXT NOT NULL,
  ai_search_item_id TEXT,
  ai_search_path TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded',
  file_name TEXT,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT,
  checksum TEXT,
  metadata_json TEXT NOT NULL DEFAULT '{}',
  error_message TEXT,
  created_by_admin_user_id TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  indexed_at TEXT,
  deleted_at TEXT,
  FOREIGN KEY (created_by_admin_user_id) REFERENCES admin_users(id)
);

CREATE INDEX idx_kb_documents_status
  ON kb_documents(status, updated_at);

CREATE INDEX idx_kb_documents_ai_item
  ON kb_documents(ai_search_instance_id, ai_search_item_id);
INSERT OR IGNORE INTO admin_users (
  id,
  email,
  name,
  password_hash,
  role,
  status,
  created_at,
  updated_at
)
VALUES (
  'admin_1',
  'admin@example.com',
  'Default Admin',
  NULL,
  'owner',
  'active',
  datetime('now'),
  datetime('now')
);
UPDATE admin_users
SET password_hash = 'pbkdf2_sha256$100000$c3VwcG9ydGx5LWRlZmF1bA$qnLv7IH2_NfwzB-JI6RznuftNxtKWXEO0debRM3J9mk',
    updated_at = datetime('now')
WHERE id = 'admin_1'
  AND password_hash IS NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_kb_documents_ai_item_unique
  ON kb_documents(ai_search_instance_id, ai_search_item_id)
  WHERE ai_search_item_id IS NOT NULL;
ALTER TABLE messages ADD COLUMN client_message_id TEXT;

CREATE UNIQUE INDEX idx_messages_client_message
  ON messages(conversation_id, sender_type, sender_admin_user_id, client_message_id)
  WHERE client_message_id IS NOT NULL;

INSERT OR IGNORE INTO admin_users (
  id,
  email,
  name,
  password_hash,
  role,
  status,
  created_at,
  updated_at
)
VALUES (
  'admin_1',
  'admin@example.com',
  'Default Admin',
  'pbkdf2_sha256$100000$c3VwcG9ydGx5LWRlZmF1bA$qnLv7IH2_NfwzB-JI6RznuftNxtKWXEO0debRM3J9mk',
  'owner',
  'active',
  datetime('now'),
  datetime('now')
);

UPDATE admin_users
SET password_hash = 'pbkdf2_sha256$100000$c3VwcG9ydGx5LWRlZmF1bA$qnLv7IH2_NfwzB-JI6RznuftNxtKWXEO0debRM3J9mk',
    updated_at = datetime('now')
WHERE id = 'admin_1'
  AND password_hash IS NULL;

CREATE TABLE IF NOT EXISTS end_users (
  id TEXT PRIMARY KEY,
  username TEXT NOT NULL,
  email TEXT,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_end_users_username
  ON end_users(username);

CREATE UNIQUE INDEX IF NOT EXISTS idx_end_users_email
  ON end_users(email)
  WHERE email IS NOT NULL;

ALTER TABLE end_users ADD COLUMN raw_payload_json TEXT;