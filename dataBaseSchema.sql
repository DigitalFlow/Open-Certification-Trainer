--
-- Guide: Insert this file inside a query window in PostgreSql. Exchange dev user at the bottom with the user you want to use for accesing the database
-- There will be a root login for the open certification trainer with username and passwort root
--

--
-- Don't remove: pgcrypto extensions needs to be loaded
--
CREATE EXTENSION IF NOT EXISTS pgcrypto;

--
-- PostgreSQL database dump
--

-- Dumped from database version 10.1
-- Dumped by pg_dump version 10.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: open_certification_trainer; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA open_certification_trainer;


ALTER SCHEMA open_certification_trainer OWNER TO postgres;

SET search_path = open_certification_trainer, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: answer; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE answer (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    key character varying(255),
    text text,
    is_correct boolean,
    question_id uuid
);


ALTER TABLE answer OWNER TO postgres;

--
-- Name: assessment_session; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE assessment_session (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_id uuid,
    certification_id uuid,
    session json,
    in_progress boolean,
    created_on timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE assessment_session OWNER TO postgres;

--
-- Name: certification; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE certification (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    name character varying(255),
    unique_name character varying(255),
    is_published boolean,
    version character varying(255)
);


ALTER TABLE certification OWNER TO postgres;

--
-- Name: post; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE post (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    content text,
    created_on timestamp without time zone DEFAULT timezone('utc'::text, now())
);


ALTER TABLE post OWNER TO postgres;

--
-- Name: question; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE question (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    key character varying(255) NOT NULL,
    text text,
    certification_id uuid,
    "position" integer,
    explanation text
);


ALTER TABLE question OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE "user" (
    id uuid DEFAULT public.gen_random_uuid() NOT NULL,
    user_name character varying(255),
    email character varying(255),
    is_admin boolean,
    password_hash character(60),
    first_name character varying(255),
    last_name character varying(255)
);


ALTER TABLE "user" OWNER TO postgres;


--
-- Data for Name: user; Type: TABLE DATA; Schema: open_certification_trainer; Owner: postgres
--

COPY "user" (id, user_name, email, is_admin, password_hash, first_name, last_name) FROM stdin;
f39f13b4-b8c6-4013-ace6-087a45dbd23d	root	root@local.domain	t	$2a$10$covQWp6GhzWOIik3T6oiveFVnIxTVG7X1c9ziHRM3jTiEFPT0cjd2	root	root
\.


--
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);


--
-- Name: assessment_session assessment_session_pkey; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY assessment_session
    ADD CONSTRAINT assessment_session_pkey PRIMARY KEY (id);


--
-- Name: certification id; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY certification
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- Name: post post_pkey; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY post
    ADD CONSTRAINT post_pkey PRIMARY KEY (id);


--
-- Name: question question_key_certification_id_unique; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY question
    ADD CONSTRAINT question_key_certification_id_unique UNIQUE (key, certification_id);


--
-- Name: question question_pkey; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY question
    ADD CONSTRAINT question_pkey PRIMARY KEY (id);


--
-- Name: certification unique_name; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY certification
    ADD CONSTRAINT unique_name UNIQUE (unique_name);


--
-- Name: user user_name; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_name UNIQUE (user_name);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: user_id_certification_id_unique; Type: INDEX; Schema: open_certification_trainer; Owner: postgres
--

CREATE UNIQUE INDEX user_id_certification_id_unique ON assessment_session USING btree (user_id, certification_id) WHERE in_progress;


--
-- Name: ux_user_case_insensitive_user_name; Type: INDEX; Schema: open_certification_trainer; Owner: postgres
--

CREATE UNIQUE INDEX ux_user_case_insensitive_user_name ON "user" USING btree (lower((user_name)::text));


--
-- Name: answer answer_question_id_fkey; Type: FK CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY answer
    ADD CONSTRAINT answer_question_id_fkey FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE;


--
-- Name: question question_certification_id_fkey; Type: FK CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY question
    ADD CONSTRAINT question_certification_id_fkey FOREIGN KEY (certification_id) REFERENCES certification(id) ON DELETE CASCADE;


--
-- Name: open_certification_trainer; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA open_certification_trainer TO dev;


--
-- Name: answer; Type: ACL; Schema: open_certification_trainer; Owner: postgres
--

GRANT ALL ON TABLE answer TO dev;


--
-- Name: assessment_session; Type: ACL; Schema: open_certification_trainer; Owner: postgres
--

GRANT ALL ON TABLE assessment_session TO dev;


--
-- Name: certification; Type: ACL; Schema: open_certification_trainer; Owner: postgres
--

GRANT ALL ON TABLE certification TO dev;


--
-- Name: post; Type: ACL; Schema: open_certification_trainer; Owner: postgres
--

GRANT ALL ON TABLE post TO dev;


--
-- Name: question; Type: ACL; Schema: open_certification_trainer; Owner: postgres
--

GRANT ALL ON TABLE question TO dev;


--
-- Name: user; Type: ACL; Schema: open_certification_trainer; Owner: postgres
--

GRANT ALL ON TABLE "user" TO dev;


--
-- PostgreSQL database dump complete
--
