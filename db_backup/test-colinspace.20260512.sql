--
-- PostgreSQL database dump
--

-- Dumped from database version 14.6
-- Dumped by pg_dump version 14.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: demo_schema; Type: SCHEMA; Schema: -; Owner: kfz_djuser
--

CREATE SCHEMA demo_schema;


ALTER SCHEMA demo_schema OWNER TO kfz_djuser;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: demo_app; Type: TABLE; Schema: demo_schema; Owner: postgres
--

CREATE TABLE demo_schema.demo_app (
    id integer NOT NULL,
    name character varying(23),
    age integer
);


ALTER TABLE demo_schema.demo_app OWNER TO postgres;

--
-- Name: demoapp_cmdb3; Type: TABLE; Schema: demo_schema; Owner: kfz_djuser
--

CREATE TABLE demo_schema.demoapp_cmdb3 (
    id bigint NOT NULL,
    hostname character varying(32) NOT NULL
);


ALTER TABLE demo_schema.demoapp_cmdb3 OWNER TO kfz_djuser;

--
-- Name: demoapp_cmdb3_id_seq; Type: SEQUENCE; Schema: demo_schema; Owner: kfz_djuser
--

CREATE SEQUENCE demo_schema.demoapp_cmdb3_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE demo_schema.demoapp_cmdb3_id_seq OWNER TO kfz_djuser;

--
-- Name: demoapp_cmdb3_id_seq; Type: SEQUENCE OWNED BY; Schema: demo_schema; Owner: kfz_djuser
--

ALTER SEQUENCE demo_schema.demoapp_cmdb3_id_seq OWNED BY demo_schema.demoapp_cmdb3.id;


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO kfz_djuser;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO kfz_djuser;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO kfz_djuser;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO kfz_djuser;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO kfz_djuser;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO kfz_djuser;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.auth_user (
    id integer NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    username character varying(150) NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    email character varying(254) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL
);


ALTER TABLE public.auth_user OWNER TO kfz_djuser;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO kfz_djuser;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO kfz_djuser;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO kfz_djuser;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO kfz_djuser;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO kfz_djuser;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: demo_app; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.demo_app (
    id integer NOT NULL,
    name character varying(23)
);


ALTER TABLE public.demo_app OWNER TO postgres;

--
-- Name: demo_schema.demoapp_cmdb2; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public."demo_schema.demoapp_cmdb2" (
    id bigint NOT NULL,
    hostname character varying(32) NOT NULL
);


ALTER TABLE public."demo_schema.demoapp_cmdb2" OWNER TO kfz_djuser;

--
-- Name: demo_schema.demoapp_cmdb2_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public."demo_schema.demoapp_cmdb2_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."demo_schema.demoapp_cmdb2_id_seq" OWNER TO kfz_djuser;

--
-- Name: demo_schema.demoapp_cmdb2_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public."demo_schema.demoapp_cmdb2_id_seq" OWNED BY public."demo_schema.demoapp_cmdb2".id;


--
-- Name: demoapp_cmdb; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.demoapp_cmdb (
    id bigint NOT NULL,
    hostname character varying(32) NOT NULL
);


ALTER TABLE public.demoapp_cmdb OWNER TO kfz_djuser;

--
-- Name: demoapp_cmdb_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.demoapp_cmdb_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.demoapp_cmdb_id_seq OWNER TO kfz_djuser;

--
-- Name: demoapp_cmdb_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.demoapp_cmdb_id_seq OWNED BY public.demoapp_cmdb.id;


--
-- Name: demoapp_user; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.demoapp_user (
    id bigint NOT NULL,
    name character varying(32) NOT NULL
);


ALTER TABLE public.demoapp_user OWNER TO kfz_djuser;

--
-- Name: demoapp_user_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.demoapp_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.demoapp_user_id_seq OWNER TO kfz_djuser;

--
-- Name: demoapp_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.demoapp_user_id_seq OWNED BY public.demoapp_user.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.django_admin_log (
    id integer NOT NULL,
    action_time timestamp with time zone NOT NULL,
    object_id text,
    object_repr character varying(200) NOT NULL,
    action_flag smallint NOT NULL,
    change_message text NOT NULL,
    content_type_id integer,
    user_id integer NOT NULL,
    CONSTRAINT django_admin_log_action_flag_check CHECK ((action_flag >= 0))
);


ALTER TABLE public.django_admin_log OWNER TO kfz_djuser;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO kfz_djuser;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO kfz_djuser;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO kfz_djuser;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO kfz_djuser;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: kfz_djuser
--

CREATE SEQUENCE public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO kfz_djuser;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: kfz_djuser
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: kfz_djuser
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO kfz_djuser;

--
-- Name: demoapp_cmdb3 id; Type: DEFAULT; Schema: demo_schema; Owner: kfz_djuser
--

ALTER TABLE ONLY demo_schema.demoapp_cmdb3 ALTER COLUMN id SET DEFAULT nextval('demo_schema.demoapp_cmdb3_id_seq'::regclass);


--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: demo_schema.demoapp_cmdb2 id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public."demo_schema.demoapp_cmdb2" ALTER COLUMN id SET DEFAULT nextval('public."demo_schema.demoapp_cmdb2_id_seq"'::regclass);


--
-- Name: demoapp_cmdb id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.demoapp_cmdb ALTER COLUMN id SET DEFAULT nextval('public.demoapp_cmdb_id_seq'::regclass);


--
-- Name: demoapp_user id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.demoapp_user ALTER COLUMN id SET DEFAULT nextval('public.demoapp_user_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Data for Name: demo_app; Type: TABLE DATA; Schema: demo_schema; Owner: postgres
--

COPY demo_schema.demo_app (id, name, age) FROM stdin;
\.


--
-- Data for Name: demoapp_cmdb3; Type: TABLE DATA; Schema: demo_schema; Owner: kfz_djuser
--

COPY demo_schema.demoapp_cmdb3 (id, hostname) FROM stdin;
1	devops-jenkins-01-vpc
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.auth_permission (id, name, content_type_id, codename) FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add user	4	add_user
14	Can change user	4	change_user
15	Can delete user	4	delete_user
16	Can view user	4	view_user
17	Can add content type	5	add_contenttype
18	Can change content type	5	change_contenttype
19	Can delete content type	5	delete_contenttype
20	Can view content type	5	view_contenttype
21	Can add session	6	add_session
22	Can change session	6	change_session
23	Can delete session	6	delete_session
24	Can view session	6	view_session
25	Can add user	7	add_user
26	Can change user	7	change_user
27	Can delete user	7	delete_user
28	Can view user	7	view_user
29	Can add cmdb	8	add_cmdb
30	Can change cmdb	8	change_cmdb
31	Can delete cmdb	8	delete_cmdb
32	Can view cmdb	8	view_cmdb
33	Can add cmdb v2	9	add_cmdb2
34	Can change cmdb v2	9	change_cmdb2
35	Can delete cmdb v2	9	delete_cmdb2
36	Can view cmdb v2	9	view_cmdb2
37	Can add cmdb v3	10	add_cmdb3
38	Can change cmdb v3	10	change_cmdb3
39	Can delete cmdb v3	10	delete_cmdb3
40	Can view cmdb v3	10	view_cmdb3
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: demo_app; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.demo_app (id, name) FROM stdin;
\.


--
-- Data for Name: demo_schema.demoapp_cmdb2; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public."demo_schema.demoapp_cmdb2" (id, hostname) FROM stdin;
\.


--
-- Data for Name: demoapp_cmdb; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.demoapp_cmdb (id, hostname) FROM stdin;
1	host-from-public-schema-01
\.


--
-- Data for Name: demoapp_user; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.demoapp_user (id, name) FROM stdin;
1	colinspace
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	demoapp	user
8	demoapp	cmdb
9	demoapp	cmdb2
10	demoapp	cmdb3
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2022-12-13 16:55:29.103346+08
2	auth	0001_initial	2022-12-13 16:55:29.206232+08
3	admin	0001_initial	2022-12-13 16:55:29.23244+08
4	admin	0002_logentry_remove_auto_add	2022-12-13 16:55:29.243715+08
5	admin	0003_logentry_add_action_flag_choices	2022-12-13 16:55:29.255233+08
6	contenttypes	0002_remove_content_type_name	2022-12-13 16:55:29.2796+08
7	auth	0002_alter_permission_name_max_length	2022-12-13 16:55:29.291928+08
8	auth	0003_alter_user_email_max_length	2022-12-13 16:55:29.302975+08
9	auth	0004_alter_user_username_opts	2022-12-13 16:55:29.31431+08
10	auth	0005_alter_user_last_login_null	2022-12-13 16:55:29.327415+08
11	auth	0006_require_contenttypes_0002	2022-12-13 16:55:29.330526+08
12	auth	0007_alter_validators_add_error_messages	2022-12-13 16:55:29.341168+08
13	auth	0008_alter_user_username_max_length	2022-12-13 16:55:29.360015+08
14	auth	0009_alter_user_last_name_max_length	2022-12-13 16:55:29.371055+08
15	auth	0010_alter_group_name_max_length	2022-12-13 16:55:29.386047+08
16	auth	0011_update_proxy_permissions	2022-12-13 16:55:29.401334+08
17	auth	0012_alter_user_first_name_max_length	2022-12-13 16:55:29.414324+08
18	demoapp	0001_initial	2022-12-13 16:55:29.423226+08
19	sessions	0001_initial	2022-12-13 16:55:29.440564+08
20	demoapp	0002_cmdb	2022-12-13 17:15:23.369311+08
21	demoapp	0003_auto_20221216_0740	2022-12-16 15:40:42.891619+08
22	demoapp	0004_cmdb3	2022-12-16 15:43:30.328875+08
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: kfz_djuser
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
\.


--
-- Name: demoapp_cmdb3_id_seq; Type: SEQUENCE SET; Schema: demo_schema; Owner: kfz_djuser
--

SELECT pg_catalog.setval('demo_schema.demoapp_cmdb3_id_seq', 1, true);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 40, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, false);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: demo_schema.demoapp_cmdb2_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public."demo_schema.demoapp_cmdb2_id_seq"', 1, false);


--
-- Name: demoapp_cmdb_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.demoapp_cmdb_id_seq', 1, true);


--
-- Name: demoapp_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.demoapp_user_id_seq', 1, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 10, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: kfz_djuser
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 22, true);


--
-- Name: demo_app demo_app_pkey; Type: CONSTRAINT; Schema: demo_schema; Owner: postgres
--

ALTER TABLE ONLY demo_schema.demo_app
    ADD CONSTRAINT demo_app_pkey PRIMARY KEY (id);


--
-- Name: demoapp_cmdb3 demoapp_cmdb3_pkey; Type: CONSTRAINT; Schema: demo_schema; Owner: kfz_djuser
--

ALTER TABLE ONLY demo_schema.demoapp_cmdb3
    ADD CONSTRAINT demoapp_cmdb3_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: demo_app demo_app_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.demo_app
    ADD CONSTRAINT demo_app_pkey PRIMARY KEY (id);


--
-- Name: demo_schema.demoapp_cmdb2 demo_schema.demoapp_cmdb2_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public."demo_schema.demoapp_cmdb2"
    ADD CONSTRAINT "demo_schema.demoapp_cmdb2_pkey" PRIMARY KEY (id);


--
-- Name: demoapp_cmdb demoapp_cmdb_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.demoapp_cmdb
    ADD CONSTRAINT demoapp_cmdb_pkey PRIMARY KEY (id);


--
-- Name: demoapp_user demoapp_user_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.demoapp_user
    ADD CONSTRAINT demoapp_user_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: kfz_djuser
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: kfz_djuser
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

