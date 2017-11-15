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

--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: open_certification_trainer; Owner: postgres
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: open_certification_trainer; Type: ACL; Schema: -; Owner: postgres
--

GRANT ALL ON SCHEMA open_certification_trainer TO dev;


--
-- Name: user; Type: ACL; Schema: open_certification_trainer; Owner: postgres
--

GRANT ALL ON TABLE "user" TO dev;


--
-- PostgreSQL database dump complete
--

