/*
Created: 18/02/2025
Modified: 04/03/2025
Project: Cinema
Model: PostgreSQL 12
Database: PostgreSQL 12
*/

-- Create tables section -------------------------------------------------

-- Table theaters

CREATE TABLE "theaters"
(
  "theater_id" Serial NOT NULL,
  "code_country" Character varying(2),
  "name" Character varying(250) NOT NULL,
  "creation_date" Timestamp(6) DEFAULT now() NOT NULL,
  "modification_date" Timestamp(6) DEFAULT now() NOT NULL,
  "deletion_date" Timestamp(6),
  "adress" Text NOT NULL,
  "zip_code" Smallint NOT NULL,
  "city" Character varying(60) NOT NULL,
  "opening_time" Time NOT NULL,
  "closing_time" Time NOT NULL,
  "phone_number" Character varying(32) NOT NULL,
  "telephone_code" Integer NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_cou_cin" ON "theaters" ("code_country")
;

ALTER TABLE "theaters" ADD CONSTRAINT "PK_theaters" PRIMARY KEY ("theater_id")
;

ALTER TABLE "theaters" ADD CONSTRAINT "theater_id" UNIQUE ("theater_id")
;

-- Table countries

CREATE TABLE "countries"
(
  "code_country" Character varying(2) NOT NULL,
  "name" Character varying(64) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "countries" ADD CONSTRAINT "PK_countries" PRIMARY KEY ("code_country")
;

ALTER TABLE "countries" ADD CONSTRAINT "code_country" UNIQUE ("code_country")
;

-- Table users_profiles

CREATE TABLE "users_profiles"
(
  "user_profil_id" Smallserial NOT NULL,
  "name" Character varying(64) NOT NULL,
  "description" Text NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "users_profiles" ADD CONSTRAINT "PK_users_profiles" PRIMARY KEY ("user_profil_id")
;

ALTER TABLE "users_profiles" ADD CONSTRAINT "user_profil_id" UNIQUE ("user_profil_id")
;

-- Table users

CREATE TABLE "users"
(
  "user_id" Serial NOT NULL,
  "email" Character varying NOT NULL,
  "password" Character varying(255) NOT NULL,
  "reset_password_token" Character varying(255),
  "reset_password_expires" Timestamp(6),
  "lastname" Character varying(64) NOT NULL,
  "firstname" Character varying(64) NOT NULL,
  "has_disability" Boolean DEFAULT false,
  "adress" Text,
  "zip_code" Smallint,
  "city" Character varying(60),
  "code_country" Character varying(2),
  "is_deleted" Boolean DEFAULT false,
  "phone_number" Character varying(32),
  "telephone_code" Integer,
  "user_profil_id" Smallint
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_cou_use" ON "users" ("code_country")
;

CREATE INDEX "IX_fk_use_pro" ON "users" ("user_profil_id")
;

ALTER TABLE "users" ADD CONSTRAINT "PK_users" PRIMARY KEY ("user_id")
;

ALTER TABLE "users" ADD CONSTRAINT "user_id" UNIQUE ("user_id")
;

ALTER TABLE "users" ADD CONSTRAINT "email" UNIQUE ("email")
;

-- Table movies

CREATE TABLE "movies"
(
  "movie_id" Serial NOT NULL,
  "title" Character varying(250) NOT NULL,
  "image" Text,
  "description" Text NOT NULL,
  "minimum_age" Smallint NOT NULL,
  "is_favorite" Boolean DEFAULT false NOT NULL,
  "length" Smallint NOT NULL,
  "average_rating" Numeric DEFAULT 10 NOT NULL,
  "movie_externe_id" Bigint,
  "average_rating_externe" Numeric
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "movies" ADD CONSTRAINT "PK_movies" PRIMARY KEY ("movie_id")
;

ALTER TABLE "movies" ADD CONSTRAINT "movie_id" UNIQUE ("movie_id")
;

-- Table movies_reviews

CREATE TABLE "movies_reviews"
(
  "movie_review_id" Serial NOT NULL,
  "movie_id" Integer,
  "user_id" Integer,
  "note" Numeric NOT NULL,
  "review" Text,
  "is_validated" Boolean DEFAULT false NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_mov_mov_rev" ON "movies_reviews" ("movie_id")
;

CREATE INDEX "IX_fk_use_mov_rev" ON "movies_reviews" ("user_id")
;

ALTER TABLE "movies_reviews" ADD CONSTRAINT "PK_movies_reviews" PRIMARY KEY ("movie_review_id")
;

ALTER TABLE "movies_reviews" ADD CONSTRAINT "movie_review_id" UNIQUE ("movie_review_id")
;

-- Table theaters_qualities

CREATE TABLE "theaters_qualities"
(
  "theater_quality_id" Smallint NOT NULL,
  "name" Character varying(64) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

ALTER TABLE "theaters_qualities" ADD CONSTRAINT "PK_theaters_qualities" PRIMARY KEY ("theater_quality_id")
;

ALTER TABLE "theaters_qualities" ADD CONSTRAINT "theater_quality_id" UNIQUE ("theater_quality_id")
;

-- Table movies_theaters

CREATE TABLE "movies_theaters"
(
  "movie_theater_id" Serial NOT NULL,
  "theater_id" Integer,
  "number_seats" Smallint NOT NULL,
  "number_seats_disabled" Smallint DEFAULT 0 NOT NULL,
  "room_number" Smallint NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_the_mov_the" ON "movies_theaters" ("theater_id")
;

ALTER TABLE "movies_theaters" ADD CONSTRAINT "PK_movies_theaters" PRIMARY KEY ("movie_theater_id")
;

ALTER TABLE "movies_theaters" ADD CONSTRAINT "movie_theater_id" UNIQUE ("movie_theater_id")
;

-- Table problems_movies_theaters

CREATE TABLE "problems_movies_theaters"
(
  "problem_movie_theater_id" Serial NOT NULL,
  "user_id" Integer,
  "movie_theater_id" Integer,
  "creation_date" Timestamp(6) DEFAULT now() NOT NULL,
  "modification_date" Timestamp(6) DEFAULT now() NOT NULL,
  "deletion_date" Timestamp(6),
  "description" Text NOT NULL,
  "is_deleted" Boolean DEFAULT false
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_use_pro_mov_the" ON "problems_movies_theaters" ("user_id")
;

CREATE INDEX "IX_fk_mov_the_pro_mov_the" ON "problems_movies_theaters" ("movie_theater_id")
;

ALTER TABLE "problems_movies_theaters" ADD CONSTRAINT "PK_problems_movies_theaters" PRIMARY KEY ("problem_movie_theater_id")
;

ALTER TABLE "problems_movies_theaters" ADD CONSTRAINT "problem_movie_theater_id" UNIQUE ("problem_movie_theater_id")
;

-- Table sessions_cinemas

CREATE TABLE "sessions_cinemas"
(
  "session_cinema_id" Serial NOT NULL,
  "movie_theater_id" Integer,
  "movie_id" Integer,
  "theater_quality_id" Smallint,
  "start_time" Timestamp(6) NOT NULL,
  "end_time" Timestamp(6) NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_mov_the_ses_cin" ON "sessions_cinemas" ("movie_theater_id")
;

CREATE INDEX "IX_fk_the_qua_ses_cin" ON "sessions_cinemas" ("theater_quality_id")
;

CREATE INDEX "IX_fk_mov_ses_cin" ON "sessions_cinemas" ("movie_id")
;

ALTER TABLE "sessions_cinemas" ADD CONSTRAINT "PK_sessions_cinemas" PRIMARY KEY ("session_cinema_id")
;

ALTER TABLE "sessions_cinemas" ADD CONSTRAINT "session_cinema_id" UNIQUE ("session_cinema_id")
;

-- Table bookings

CREATE TABLE "bookings"
(
  "booking_id" Serial NOT NULL,
  "session_cinema_id" Integer,
  "user_id" Integer,
  "number_seats" Smallint NOT NULL,
  "number_seats_disabled" Smallint DEFAULT 0,
  "total_price" Numeric NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_ses_cin_boo" ON "bookings" ("session_cinema_id")
;

CREATE INDEX "IX_fk_use_boo" ON "bookings" ("user_id")
;

ALTER TABLE "bookings" ADD CONSTRAINT "PK_bookings" PRIMARY KEY ("booking_id")
;

ALTER TABLE "bookings" ADD CONSTRAINT "booking_id" UNIQUE ("booking_id")
;

-- Table notifications

CREATE TABLE "notifications"
(
  "notification_id" Serial NOT NULL,
  "user_id" Integer,
  "creation_date" Timestamp(6) DEFAULT now() NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_use_not" ON "notifications" ("user_id")
;

ALTER TABLE "notifications" ADD CONSTRAINT "PK_notifications" PRIMARY KEY ("notification_id")
;

ALTER TABLE "notifications" ADD CONSTRAINT "notification_id" UNIQUE ("notification_id")
;

-- Table prices

CREATE TABLE "prices"
(
  "price_id" Serial NOT NULL,
  "theater_id" Integer,
  "theater_quality_id" Smallint,
  "price" Numeric NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fk_the_qua_pri" ON "prices" ("theater_quality_id")
;

CREATE INDEX "IX_fk_the_pri" ON "prices" ("theater_id")
;

ALTER TABLE "prices" ADD CONSTRAINT "PK_prices" PRIMARY KEY ("price_id")
;

ALTER TABLE "prices" ADD CONSTRAINT "price_id" UNIQUE ("price_id")
;

-- Table bookings_details

CREATE TABLE "bookings_details"
(
  "booking_detail_id" Serial NOT NULL,
  "booking_id" Integer,
  "seat_number" Smallint NOT NULL,
  "is_validated" Boolean DEFAULT false NOT NULL
)
WITH (
  autovacuum_enabled=true)
;

CREATE INDEX "IX_fc_boo_boo_det" ON "bookings_details" ("booking_id")
;

ALTER TABLE "bookings_details" ADD CONSTRAINT "PK_bookings_details" PRIMARY KEY ("booking_detail_id")
;

-- Create foreign keys (relationships) section -------------------------------------------------

ALTER TABLE "theaters"
  ADD CONSTRAINT "fk_cou_the"
    FOREIGN KEY ("code_country")
    REFERENCES "countries" ("code_country")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "users"
  ADD CONSTRAINT "fk_cou_use"
    FOREIGN KEY ("code_country")
    REFERENCES "countries" ("code_country")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "movies_reviews"
  ADD CONSTRAINT "fk_mov_mov_rev"
    FOREIGN KEY ("movie_id")
    REFERENCES "movies" ("movie_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "movies_reviews"
  ADD CONSTRAINT "fk_use_mov_rev"
    FOREIGN KEY ("user_id")
    REFERENCES "users" ("user_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "movies_theaters"
  ADD CONSTRAINT "fk_the_mov_the"
    FOREIGN KEY ("theater_id")
    REFERENCES "theaters" ("theater_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "problems_movies_theaters"
  ADD CONSTRAINT "fk_use_pro_mov_the"
    FOREIGN KEY ("user_id")
    REFERENCES "users" ("user_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "problems_movies_theaters"
  ADD CONSTRAINT "fk_mov_the_pro_mov_the"
    FOREIGN KEY ("movie_theater_id")
    REFERENCES "movies_theaters" ("movie_theater_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "sessions_cinemas"
  ADD CONSTRAINT "fk_mov_the_ses_cin"
    FOREIGN KEY ("movie_theater_id")
    REFERENCES "movies_theaters" ("movie_theater_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "sessions_cinemas"
  ADD CONSTRAINT "fk_the_qua_ses_cin"
    FOREIGN KEY ("theater_quality_id")
    REFERENCES "theaters_qualities" ("theater_quality_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "bookings"
  ADD CONSTRAINT "fk_ses_cin_boo"
    FOREIGN KEY ("session_cinema_id")
    REFERENCES "sessions_cinemas" ("session_cinema_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "bookings"
  ADD CONSTRAINT "fk_use_boo"
    FOREIGN KEY ("user_id")
    REFERENCES "users" ("user_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "sessions_cinemas"
  ADD CONSTRAINT "fk_mov_ses_cin"
    FOREIGN KEY ("movie_id")
    REFERENCES "movies" ("movie_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "notifications"
  ADD CONSTRAINT "fk_use_not"
    FOREIGN KEY ("user_id")
    REFERENCES "users" ("user_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "prices"
  ADD CONSTRAINT "fk_the_qua_pri"
    FOREIGN KEY ("theater_quality_id")
    REFERENCES "theaters_qualities" ("theater_quality_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "prices"
  ADD CONSTRAINT "fk_the_pri"
    FOREIGN KEY ("theater_id")
    REFERENCES "theaters" ("theater_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "users"
  ADD CONSTRAINT "fk_use_pro"
    FOREIGN KEY ("user_profil_id")
    REFERENCES "users_profiles" ("user_profil_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

ALTER TABLE "bookings_details"
  ADD CONSTRAINT "fc_boo_boo_det"
    FOREIGN KEY ("booking_id")
    REFERENCES "bookings" ("booking_id")
      ON DELETE NO ACTION
      ON UPDATE NO ACTION
;

