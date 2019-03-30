TRUNCATE todos RESTART IDENTITY;

ALTER SEQUENCE todos_id_seq RESTART 1;

INSERT INTO todos (title, date, time, complete) VALUES ('test todo', null, null, false);