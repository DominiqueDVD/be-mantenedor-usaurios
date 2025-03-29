CREATE DATABASE basededatos;
\c basededatos;
CREATE TABLE users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modified TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    token VARCHAR(255) NOT NULL
);

CREATE TABLE phones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    number VARCHAR(50) NOT NULL,
    citycode VARCHAR(10) NOT NULL,
    countrycode VARCHAR(10) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE
);

INSERT INTO users (name, email, password, token) VALUES
('Juan Pérez', 'juan@example.com', 'Hashedpassword', 'tokenConJWT'),
('María López', 'maria@example.com', 'Hashedpassword', 'tokenConJWT'),
('Carlos Gómez', 'carlos@example.com', 'Hashedpassword', 'tokenConJWT');

INSERT INTO phones (number, citycode, countrycode, user_id) VALUES
('123456789', '1', '57', (SELECT id FROM users WHERE email='juan@example.com')),
('987654321', '2', '57', (SELECT id FROM users WHERE email='maria@example.com')),
('555666777', '3', '57', (SELECT id FROM users WHERE email='carlos@example.com'));
