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
    id uuid DEFAULT public.gen_random_uuid() PRIMARY KEY,
    key character varying(255),
    text text,
    is_correct boolean,
    question_id uuid
);


ALTER TABLE answer OWNER TO postgres;

--
-- Name: certification; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE certification (
    id uuid DEFAULT public.gen_random_uuid() PRIMARY KEY,
    name character varying(255),
    unique_name character varying(255)
);


ALTER TABLE certification OWNER TO postgres;

--
-- Name: question; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE question (
    id uuid DEFAULT public.gen_random_uuid() PRIMARY KEY,
    key character varying(255),
    text text,
    certification_id uuid,
    position integer
);


ALTER TABLE question OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: open_certification_trainer; Owner: postgres
--

CREATE TABLE "user" (
    id uuid DEFAULT public.gen_random_uuid() PRIMARY KEY,
    user_name character varying(255),
    email character varying(255),
    is_admin boolean,
    password_hash character(60),
    first_name character varying(255),
    last_name character varying(255)
);


ALTER TABLE "user" OWNER TO postgres;

--
-- Data for Name: answer; Type: TABLE DATA; Schema: open_certification_trainer; Owner: postgres
--

COPY answer (id, key, text, is_correct, question_id) FROM stdin;
\.


--
-- Data for Name: certification; Type: TABLE DATA; Schema: open_certification_trainer; Owner: postgres
--

COPY certification (id, name, unique_name) FROM stdin;
\.


--
-- Data for Name: question; Type: TABLE DATA; Schema: open_certification_trainer; Owner: postgres
--

COPY question (id, key, text, certification_id) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: open_certification_trainer; Owner: postgres
--

COPY "user" (id, user_name, email, is_admin, password_hash, first_name, last_name) FROM stdin;
f39f13b4-b8c6-4013-ace6-087a45dbd23d	root	root@local.domain	t	$2a$10$yTZcbz9AlfP3aKuSpTx8t.56yt/SAYo.VlrTP9829CPPlL0bvQ4ki	root	root
\.


--
-- Name: answer answer_pkey; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY answer
    ADD CONSTRAINT answer_pkey PRIMARY KEY (id);


--
-- Name: certification id; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY certification
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- Name: user user_name; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_name UNIQUE (user_name);


--
-- Name: ux_user_case_insensitive_user_name; Type: INDEX; Schema: open_certification_trainer; Owner: postgres
--

CREATE UNIQUE INDEX ux_user_case_insensitive_user_name ON "user" USING btree (lower((user_name)::text));


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
-- Name: user user_pkey; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


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
-- PostgreSQL database dump complete
--
