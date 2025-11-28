-- ================================
-- COACHS
-- ================================
INSERT INTO coach (surname, name, mail, password)
VALUES
('Dupont', 'Jean', 'jean.dupont@club.com', 'mdp123'),
('Martin', 'Lucas', 'lucas.martin@club.com', 'coachpass');

-- ================================
-- JOUEURS
-- ================================
INSERT INTO player (surname, name, position, number, mail, phone, password, status)
VALUES
('Durand', 'Paul', 'Attaquant', 9, 'paul.durand@mail.com', '0601020304', 'pass1', 'Actif'),
('Morel', 'Antoine', 'Milieu', 8, 'antoine.morel@mail.com', '0611223344', 'pass2', 'Actif'),
('Leroy', 'Hugo', 'Défenseur', 4, 'hugo.leroy@mail.com', '0622334455', 'pass3', 'Blessé'),
('Bernard', 'Julien', 'Gardien', 1, 'julien.bernard@mail.com', '0633445566', 'pass4', 'Actif');

-- ================================
-- ENTRAINEMENTS
-- ================================
INSERT INTO training (date, hour, type, location, team, id_coach)
VALUES
('2025-01-12', '18:00:00', 'Physique', 'Stade Municipal', 'Seniors A', 1),
('2025-01-15', '19:00:00', 'Tactique', 'Terrain Synthétique', 'Seniors A', 1);

-- ================================
-- MATCHS
-- ================================
INSERT INTO match (date, hour, opponent, location, type, team, score_home, score_outside, id_coach)
VALUES
('2025-01-20', '15:00:00', 'US Lyon', 'Home', 'Championship', 'Seniors A', 2, 1, 1),
('2025-01-27', '16:00:00', 'FC Nice', 'Outside', 'Friendly', 'Seniors A', NULL, NULL, 1);

-- ================================
-- CONVOCATIONS MATCHS
-- ================================
INSERT INTO convocation (id_player, id_match, status)
VALUES
(1, 1, 'Called'),
(2, 1, 'Called'),
(3, 1, 'Called'),
(4, 1, 'Called'),
(1, 2, 'Waiting'),
(2, 2, 'Waiting');

-- ================================
-- CONVOCATIONS ENTRAINEMENTS
-- ================================
INSERT INTO convocation (id_player, id_training, status)
VALUES
(1, 1, 'Called'),
(2, 1, 'Called'),
(3, 1, 'Refused'),
(4, 2, 'Called');

-- ================================
-- PRESENCES MATCHS
-- ================================
INSERT INTO presence (id_player, id_match, presence, commentary)
VALUES
(1, 1, TRUE, 'Bon match'),
(2, 1, TRUE, 'Très actif'),
(3, 1, FALSE, 'Blessure'),
(4, 1, TRUE, NULL);

-- ================================
-- PRESENCES ENTRAINEMENTS
-- ================================
INSERT INTO presence (id_player, id_training, presence, commentary)
VALUES
(1, 1, TRUE, NULL),
(2, 1, TRUE, 'Bonne séance'),
(3, 1, FALSE, 'Toujours blessé'),
(4, 2, TRUE, 'En forme');

-- ================================
-- COTISATIONS
-- ================================
INSERT INTO Subscription (id_player, total, status, payment_date)
VALUES
(1, 200, 'Paid', '2025-01-01'),
(2, 200, 'Not paid', NULL),
(3, 200, 'Late', '2025-01-10'),
(4, 200, 'Paid', '2025-01-05');

-- ================================
-- STATISTIQUES DE MATCH
-- ================================
INSERT INTO statistics (id_player, id_match, goals, passes, yellow_cards, red_cards, minutes_played)
VALUES
(1, 1, 1, 0, 0, 0, 90),
(2, 1, 0, 1, 1, 0, 85),
(3, 1, 0, 0, 0, 0, 0),
(4, 1, 1, 0, 0, 0, 90);
