Cette transaction va effectuer plusieurs opérations :
-Vérifier si la session de cinéma existe et a encore des places disponibles (en tenant compte des places pour personnes à mobilité réduite).
-Vérifier que le user existe
-Vérifier que le nombre de place disponible et reservé par ce client est cohérent
-Insérer une nouvelle entrée dans la table bookings.
-Insérer plusieurs entrées dans la table bookings_details pour chaque siège réservé.

L'idée est de vérifier quand le client paye ses places, si tout est cohérent.


CREATE OR REPLACE FUNCTION make_booking(
    p_session_cinema_id INTEGER, -- ID de la session de cinéma
    p_user_id INTEGER,  -- ID du client de la réservation
    p_number_seats INTEGER,  -- Nombre de sièges standards réservés
    p_number_seats_disabled INTEGER -- Nombre de sièges pour personnes à mobilité réduite réservés
)
RETURNS VOID AS '
DECLARE
    booking_id INTEGER;
    movie_theater_id INTEGER;
    total_seats INTEGER;
    reserved_seats INTEGER;
    available_seats INTEGER;
    available_seats_disabled INTEGER;
    total_seats_to_book INTEGER := p_number_seats + p_number_seats_disabled;
    user_exists BOOLEAN; -- Variable pour vérifier l''existence de l''utilisateur

-- Début de la transaction
BEGIN
    -- 1. Vérifier l''existence de la session
    SELECT mt.id, mt."numberSeats", mt."numberSeatsDisabled"
    INTO movie_theater_id, available_seats, available_seats_disabled
    FROM session_cinema sc
    JOIN movie_theater mt ON sc."movieTheaterId" = mt.id
    WHERE sc.id = p_session_cinema_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION ''La session de cinéma avec l''''ID % n''''existe pas.'', p_session_cinema_id;
    END IF;
    
      -- 2. Vérifier l''existence de l''utilisateur (NOUVELLE ÉTAPE)
    SELECT EXISTS (SELECT 1 FROM "user" WHERE id = p_user_id) INTO user_exists;

    IF NOT user_exists THEN
        RAISE EXCEPTION ''L''''utilisateur avec l''''ID % n''''existe pas.'', p_user_id;
    END IF;

    -- 3. Calculer le nombre de sièges déjà réservés pour cette session
    SELECT COALESCE(SUM(b."numberSeats" + b."numberSeatsDisabled"), 0)
    INTO reserved_seats
    FROM booking b
    WHERE b."sessionCinemaId" = p_session_cinema_id;

    -- 4. Vérifier la disponibilité des places
    total_seats := available_seats + available_seats_disabled;

    IF total_seats < reserved_seats + total_seats_to_book THEN
        RAISE EXCEPTION ''Places insuffisantes pour la session % (Total: %, Réservés: %, Demandés: %).'',
            p_session_cinema_id, total_seats, reserved_seats, total_seats_to_book;
    END IF;

    IF available_seats < p_number_seats OR available_seats_disabled < p_number_seats_disabled THEN
        RAISE EXCEPTION ''Pas assez de sièges standard (% restants) ou PMR (% restants).'',
            available_seats, available_seats_disabled;
    END IF;

    -- 5. Insérer la réservation
    INSERT INTO booking ("sessionCinemaId", "userId", "numberSeats", "numberSeatsDisabled", "totalPrice")
    VALUES (p_session_cinema_id, p_user_id, p_number_seats, p_number_seats_disabled, 0)
    RETURNING id INTO booking_id;

    -- 6. Détails de sièges standard
    FOR i IN 1..p_number_seats LOOP
        INSERT INTO booking_detail ("bookingId", "seatNumber", "isValidated")
        VALUES (booking_id, i, false);
    END LOOP;

    -- 7. Détails de sièges PMR
    FOR i IN 1..p_number_seats_disabled LOOP
        INSERT INTO booking_detail ("bookingId", "seatNumber", "isValidated")
        VALUES (booking_id, i, false);
    END LOOP;

    RAISE NOTICE ''Réservation créée avec ID : %'', booking_id;
END;
' LANGUAGE plpgsql;

SELECT make_booking(3, 13, 2, 1);
