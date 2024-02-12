CREATE TABLE movies_trending 
(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    release_date VARCHAR (20),
    poster_path VARCHAR (255),
    overview TEXT,
    comment TEXT
);