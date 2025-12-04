CREATE TABLE coach (
    id_coach SERIAL PRIMARY KEY,
    surname TEXT,
    name TEXT,
    mail TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);
CREATE TYPE player_status AS ENUM ('Actif', 'Blessé', 'Suspendu', 'Absent');
CREATE TABLE player (
    id_player SERIAL PRIMARY KEY,
    surname TEXT,
    name TEXT,
    position TEXT,
    number INT,
    mail TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    status player_status DEFAULT 'Actif'
);
CREATE TABLE training (
    id_training SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour TIME NOT NULL,
    type TEXT,
    location TEXT,
    team TEXT,
    id_coach INT,
    FOREIGN KEY (id_coach) REFERENCES coach(id_coach)
);
CREATE TYPE match_location AS ENUM ('Home', 'Outside');
CREATE TYPE match_type AS ENUM ('Championship', 'Friendly', 'Cup');
CREATE TABLE match (
    id_match SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour TIME NOT NULL,
    opponent TEXT NOT NULL,
    location match_location NOT NULL,
    type match_type NOT NULL,
    team TEXT,
    score_home INT DEFAULT NULL,
    score_outside INT DEFAULT NULL,
    id_coach INT,
    FOREIGN KEY (id_coach) REFERENCES coach(id_coach)
);
CREATE TYPE convocation_status AS ENUM ('Called', 'Refused', 'Waiting');
CREATE TABLE convocation (
    id_convocation SERIAL PRIMARY KEY,
    id_player INT NOT NULL,
    id_match INT NULL,
    id_training INT NULL,
    status convocation_status DEFAULT 'Waiting',

    FOREIGN KEY (id_player) REFERENCES player(id_player),
    FOREIGN KEY (id_match) REFERENCES match(id_match),
    FOREIGN KEY (id_training) REFERENCES training(id_training)
);
CREATE TABLE presence (
    id_presence SERIAL PRIMARY KEY,
    id_player INT NOT NULL,
    id_match INT NULL,
    id_training INT NULL,
    presence BOOLEAN,
    commentary TEXT,

    FOREIGN KEY (id_player) REFERENCES player(id_player),
    FOREIGN KEY (id_match) REFERENCES match(id_match),
    FOREIGN KEY (id_training) REFERENCES training(id_training)
);
CREATE TYPE subscription_status AS ENUM ('Paid', 'Late', 'Not paid');
CREATE TABLE Subscription (
    id_subscription SERIAL PRIMARY KEY,
    id_player INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status subscription_status DEFAULT 'Not paid',
    payment_date DATE NULL,

    FOREIGN KEY (id_player) REFERENCES player(id_player)
);
CREATE TABLE statistics (
    id_statistics SERIAL PRIMARY KEY,
    id_player INT NOT NULL,
    id_match INT NOT NULL,
    goals INT DEFAULT 0,
    passes INT DEFAULT 0,
    yellow_cards INT DEFAULT 0,
    red_cards INT DEFAULT 0,
    minutes_played INT DEFAULT 0,

    FOREIGN KEY (id_player) REFERENCES player(id_player),
    FOREIGN KEY (id_match) REFERENCES match (id_match)
);

CREATE TABLE refresh_tokens (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  token TEXT NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  revoked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
