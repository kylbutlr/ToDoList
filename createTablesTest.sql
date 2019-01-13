CREATE TABLE IF NOT EXISTS todos (
  id SERIAL,
  title VARCHAR(128) NOT NULL,
  complete BOOL NOT NULL DEFAULT FALSE
);

TRUNCATE todos RESTART IDENTITY;

INSERT INTO todos (title, date, time, complete) VALUES ('test todo', null, null, false);