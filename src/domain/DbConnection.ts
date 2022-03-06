import { Pool, PoolConfig, QueryResult } from "pg";
import { Sequelize, DataTypes } from "sequelize";

console.log("Constructing DB pool");

const poolConfig = {
  host     : process.env.DB_HOST,
  user     : process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database : process.env.DB_DATABASE
};

// Connect to mysql
export const pool = new Pool(poolConfig);

export const sequelize = new Sequelize(process.env.DB_DATABASE || "postgres",
                                process.env.DB_USER || "postgres",
                                process.env.DB_PASSWORD || "postgres",
                                {
                                    host: process.env.DB_HOST || "postgres",
                                    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
                                    dialect: "postgres",
                                    dialectOptions: {
                                        ssl: process.env.DB_SSL == "true"
                                    },
                                    schema: "open_certification_trainer"
                                });

export const User = sequelize.define("user", {
  id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal("gen_random_uuid()")
  },
  user_name: {
      type: DataTypes.STRING,
      allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  password_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  first_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  last_name: {
    type: DataTypes.STRING,
    allowNull: true
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()")
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("NOW()")
  }
}, { freezeTableName: true });
/*
export const Answer = sequelize.define("answer", {
  id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal("gen_random_uuid()")
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  question_id: {
    type: DataTypes.UUID,
    // TODO
  }
}, { freezeTableName: true });

export const AssessmentSession = sequelize.define("assessment_session", {
  id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: sequelize.literal("gen_random_uuid()")
  },
  key: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  is_correct: {
    type: DataTypes.BOOLEAN,
    allowNull: true
  },
  question_id: {
    type: DataTypes.UUID,
    // TODO
  }
}, { freezeTableName: true });

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
*/