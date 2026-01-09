-- =========================
-- ENUMS
-- =========================

CREATE TYPE player_status AS ENUM ('Actif', 'Blessé', 'Suspendu', 'Absent');
CREATE TYPE match_location AS ENUM ('Home', 'Outside');
CREATE TYPE match_type AS ENUM ('Championship', 'Friendly', 'Cup');
CREATE TYPE convocation_status AS ENUM ('Called', 'Refused', 'Waiting');
CREATE TYPE subscription_status AS ENUM ('Paid', 'Late', 'Not paid');

-- =========================
-- COACH (ADMIN)
-- =========================

CREATE TABLE coach (
    id_coach SERIAL PRIMARY KEY,
    surname TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    mail TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
);

-- =========================
-- TEAM
-- =========================

CREATE TABLE team (
    id_team SERIAL PRIMARY KEY,
    name TEXT NOT NULL,        -- ex: U16, Seniors A
    category TEXT,             -- Youth / Senior
    season TEXT                -- 2024-2025
);

-- =========================
-- PLAYER
-- =========================

CREATE TABLE player (
    id_player SERIAL PRIMARY KEY,
    surname TEXT NOT NULL,
    name TEXT NOT NULL,
    position TEXT,
    number INT,
    mail TEXT UNIQUE NOT NULL,
    phone TEXT,
    password TEXT NOT NULL,
    status player_status DEFAULT 'Actif',
    id_team INT,

    FOREIGN KEY (id_team) REFERENCES team(id_team)
);

-- =========================
-- TRAINING
-- =========================

CREATE TABLE training (
    id_training SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour TIME NOT NULL,
    type TEXT,
    location TEXT,
    id_team INT NOT NULL,
    id_coach INT,

    FOREIGN KEY (id_team) REFERENCES team(id_team),
    FOREIGN KEY (id_coach) REFERENCES coach(id_coach)
);

-- =========================
-- MATCH
-- =========================

CREATE TABLE match (
    id_match SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    hour TIME NOT NULL,
    opponent TEXT NOT NULL,
    location match_location NOT NULL,
    type match_type NOT NULL,
    score_home INT DEFAULT NULL,
    score_outside INT DEFAULT NULL,
    id_team INT NOT NULL,
    id_coach INT,

    FOREIGN KEY (id_team) REFERENCES team(id_team),
    FOREIGN KEY (id_coach) REFERENCES coach(id_coach)
);

-- =========================
-- CONVOCATION
-- =========================

CREATE TABLE convocation (
    id_convocation SERIAL PRIMARY KEY,
    id_player INT NOT NULL,
    id_match INT,
    id_training INT,
    status convocation_status DEFAULT 'Waiting',

    FOREIGN KEY (id_player) REFERENCES player(id_player),
    FOREIGN KEY (id_match) REFERENCES match(id_match),
    FOREIGN KEY (id_training) REFERENCES training(id_training),

    CHECK (
        (id_match IS NOT NULL AND id_training IS NULL) OR
        (id_match IS NULL AND id_training IS NOT NULL)
    )
);

-- =========================
-- PRESENCE
-- =========================

CREATE TABLE presence (
    id_presence SERIAL PRIMARY KEY,
    id_player INT NOT NULL,
    id_match INT,
    id_training INT,
    presence BOOLEAN,
    commentary TEXT,

    FOREIGN KEY (id_player) REFERENCES player(id_player),
    FOREIGN KEY (id_match) REFERENCES match(id_match),
    FOREIGN KEY (id_training) REFERENCES training(id_training),

    CHECK (
        (id_match IS NOT NULL AND id_training IS NULL) OR
        (id_match IS NULL AND id_training IS NOT NULL)
    )
);

-- =========================
-- SUBSCRIPTION (COTISATION)
-- =========================

CREATE TABLE subscription (
    id_subscription SERIAL PRIMARY KEY,
    id_player INT NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status subscription_status DEFAULT 'Not paid',
    payment_date DATE,

    FOREIGN KEY (id_player) REFERENCES player(id_player)
);

-- =========================
-- STATISTICS (PAR MATCH)
-- =========================

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
    FOREIGN KEY (id_match) REFERENCES match(id_match),

    UNIQUE (id_player, id_match)
);

-- =========================
-- REFRESH TOKENS
-- =========================

CREATE TABLE refresh_tokens (
    id SERIAL PRIMARY KEY,
    player_id INT REFERENCES player(id_player) ON DELETE CASCADE,
    coach_id INT REFERENCES coach(id_coach) ON DELETE CASCADE,
    token TEXT NOT NULL UNIQUE,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CHECK (
        (player_id IS NOT NULL AND coach_id IS NULL) OR
        (player_id IS NULL AND coach_id IS NOT NULL)
    )
);
