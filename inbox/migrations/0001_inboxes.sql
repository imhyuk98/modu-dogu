CREATE TABLE IF NOT EXISTS inboxes (
  id TEXT PRIMARY KEY,
  owner_hash TEXT NOT NULL,
  mode TEXT NOT NULL,
  creator TEXT NOT NULL,
  answers TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS inbox_expiry ON inboxes(expires_at);
CREATE TABLE IF NOT EXISTS responses (
  inbox_id TEXT NOT NULL REFERENCES inboxes(id) ON DELETE CASCADE,
  submission_id TEXT NOT NULL,
  guest TEXT NOT NULL,
  replies TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  PRIMARY KEY (inbox_id, submission_id)
);
