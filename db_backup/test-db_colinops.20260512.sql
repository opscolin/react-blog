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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.auth_group (
    id integer NOT NULL,
    name character varying(150) NOT NULL
);


ALTER TABLE public.auth_group OWNER TO colinops;

--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.auth_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_id_seq OWNER TO colinops;

--
-- Name: auth_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.auth_group_id_seq OWNED BY public.auth_group.id;


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.auth_group_permissions (
    id bigint NOT NULL,
    group_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_group_permissions OWNER TO colinops;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.auth_group_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_group_permissions_id_seq OWNER TO colinops;

--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.auth_group_permissions_id_seq OWNED BY public.auth_group_permissions.id;


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.auth_permission (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    content_type_id integer NOT NULL,
    codename character varying(100) NOT NULL
);


ALTER TABLE public.auth_permission OWNER TO colinops;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.auth_permission_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_permission_id_seq OWNER TO colinops;

--
-- Name: auth_permission_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.auth_permission_id_seq OWNED BY public.auth_permission.id;


--
-- Name: auth_user; Type: TABLE; Schema: public; Owner: colinops
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


ALTER TABLE public.auth_user OWNER TO colinops;

--
-- Name: auth_user_groups; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.auth_user_groups (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    group_id integer NOT NULL
);


ALTER TABLE public.auth_user_groups OWNER TO colinops;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.auth_user_groups_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_groups_id_seq OWNER TO colinops;

--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.auth_user_groups_id_seq OWNED BY public.auth_user_groups.id;


--
-- Name: auth_user_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.auth_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_id_seq OWNER TO colinops;

--
-- Name: auth_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.auth_user_id_seq OWNED BY public.auth_user.id;


--
-- Name: auth_user_user_permissions; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.auth_user_user_permissions (
    id bigint NOT NULL,
    user_id integer NOT NULL,
    permission_id integer NOT NULL
);


ALTER TABLE public.auth_user_user_permissions OWNER TO colinops;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.auth_user_user_permissions_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auth_user_user_permissions_id_seq OWNER TO colinops;

--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.auth_user_user_permissions_id_seq OWNED BY public.auth_user_user_permissions.id;


--
-- Name: cmdb_asset; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.cmdb_asset (
    id uuid NOT NULL,
    created_time timestamp with time zone NOT NULL,
    updated_time timestamp with time zone NOT NULL,
    deleted_time timestamp with time zone,
    is_deleted boolean NOT NULL,
    instance_id character varying(32),
    hostname character varying(32) NOT NULL,
    host_ip character varying(15) NOT NULL,
    all_ips jsonb,
    host_type smallint,
    extra jsonb,
    public_ip character varying(32),
    cpu_core smallint,
    cpu_type character varying(64),
    memory integer,
    disk jsonb,
    platform smallint,
    operation_sys character varying(32),
    manufacturer character varying(32),
    status smallint NOT NULL,
    serial character varying(64),
    cloud smallint,
    tags_id bigint,
    hosted_id uuid,
    add_time timestamp with time zone,
    CONSTRAINT cmdb_asset_cloud_check CHECK ((cloud >= 0)),
    CONSTRAINT cmdb_asset_cpu_core_check CHECK ((cpu_core >= 0)),
    CONSTRAINT cmdb_asset_host_type_check CHECK ((host_type >= 0)),
    CONSTRAINT cmdb_asset_platform_de46febd_check CHECK ((platform >= 0)),
    CONSTRAINT cmdb_asset_status_check CHECK ((status >= 0))
);


ALTER TABLE public.cmdb_asset OWNER TO colinops;

--
-- Name: cmdb_cabinet; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.cmdb_cabinet (
    id uuid NOT NULL,
    created_time timestamp with time zone NOT NULL,
    updated_time timestamp with time zone NOT NULL,
    deleted_time timestamp with time zone,
    is_deleted boolean NOT NULL,
    name character varying(64) NOT NULL,
    description character varying(256) NOT NULL,
    "position" smallint NOT NULL,
    CONSTRAINT cmdb_cabinet_position_check CHECK (("position" >= 0))
);


ALTER TABLE public.cmdb_cabinet OWNER TO colinops;

--
-- Name: cmdb_cdn; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.cmdb_cdn (
    id uuid NOT NULL,
    created_time timestamp with time zone NOT NULL,
    updated_time timestamp with time zone NOT NULL,
    deleted_time timestamp with time zone,
    is_deleted boolean NOT NULL,
    name character varying(64) NOT NULL,
    cname character varying(128) NOT NULL,
    status character varying(16) NOT NULL,
    area character varying(16) NOT NULL,
    type character varying(16) NOT NULL,
    source_type character varying(16) NOT NULL,
    source_addr character varying(128) NOT NULL,
    cloud smallint NOT NULL,
    CONSTRAINT cmdb_cdn_cloud_check CHECK ((cloud >= 0))
);


ALTER TABLE public.cmdb_cdn OWNER TO colinops;

--
-- Name: cmdb_dbinstance; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.cmdb_dbinstance (
    id uuid NOT NULL,
    created_time timestamp with time zone NOT NULL,
    updated_time timestamp with time zone NOT NULL,
    deleted_time timestamp with time zone,
    is_deleted boolean NOT NULL,
    instance_id character varying(64),
    instance_name character varying(64) NOT NULL,
    db_type smallint NOT NULL,
    is_master boolean NOT NULL,
    address character varying(64) NOT NULL,
    ipaddr character varying(64),
    port smallint NOT NULL,
    status smallint NOT NULL,
    version character varying(5),
    specs character varying(32),
    extra jsonb,
    cloud smallint,
    CONSTRAINT cmdb_dbinstance_cloud_check CHECK ((cloud >= 0)),
    CONSTRAINT cmdb_dbinstance_db_type_check CHECK ((db_type >= 0)),
    CONSTRAINT cmdb_dbinstance_port_check CHECK ((port >= 0)),
    CONSTRAINT cmdb_dbinstance_status_check CHECK ((status >= 0))
);


ALTER TABLE public.cmdb_dbinstance OWNER TO colinops;

--
-- Name: cmdb_hardware; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.cmdb_hardware (
    id uuid NOT NULL,
    created_time timestamp with time zone NOT NULL,
    updated_time timestamp with time zone NOT NULL,
    deleted_time timestamp with time zone,
    is_deleted boolean NOT NULL,
    hostname character varying(15) NOT NULL,
    "position" character varying(32),
    status smallint NOT NULL,
    cabinet_id uuid,
    begin_time timestamp with time zone,
    ip character varying(15),
    model character varying(15),
    sn character varying(15),
    CONSTRAINT cmdb_host_status_check CHECK ((status >= 0))
);


ALTER TABLE public.cmdb_hardware OWNER TO colinops;

--
-- Name: cmdb_mysqlextra; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.cmdb_mysqlextra (
    id uuid NOT NULL,
    created_time timestamp with time zone NOT NULL,
    updated_time timestamp with time zone NOT NULL,
    deleted_time timestamp with time zone,
    is_deleted boolean NOT NULL,
    databases character varying(512) NOT NULL,
    user_privilege jsonb,
    data_info jsonb,
    instance_id uuid
);


ALTER TABLE public.cmdb_mysqlextra OWNER TO colinops;

--
-- Name: cmdb_tag; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.cmdb_tag (
    id bigint NOT NULL,
    name character varying(32) NOT NULL
);


ALTER TABLE public.cmdb_tag OWNER TO colinops;

--
-- Name: cmdb_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.cmdb_tag_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cmdb_tag_id_seq OWNER TO colinops;

--
-- Name: cmdb_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.cmdb_tag_id_seq OWNED BY public.cmdb_tag.id;


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: colinops
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


ALTER TABLE public.django_admin_log OWNER TO colinops;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.django_admin_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_admin_log_id_seq OWNER TO colinops;

--
-- Name: django_admin_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.django_admin_log_id_seq OWNED BY public.django_admin_log.id;


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.django_content_type (
    id integer NOT NULL,
    app_label character varying(100) NOT NULL,
    model character varying(100) NOT NULL
);


ALTER TABLE public.django_content_type OWNER TO colinops;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.django_content_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_content_type_id_seq OWNER TO colinops;

--
-- Name: django_content_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.django_content_type_id_seq OWNED BY public.django_content_type.id;


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.django_migrations (
    id bigint NOT NULL,
    app character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    applied timestamp with time zone NOT NULL
);


ALTER TABLE public.django_migrations OWNER TO colinops;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: colinops
--

CREATE SEQUENCE public.django_migrations_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.django_migrations_id_seq OWNER TO colinops;

--
-- Name: django_migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: colinops
--

ALTER SEQUENCE public.django_migrations_id_seq OWNED BY public.django_migrations.id;


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: colinops
--

CREATE TABLE public.django_session (
    session_key character varying(40) NOT NULL,
    session_data text NOT NULL,
    expire_date timestamp with time zone NOT NULL
);


ALTER TABLE public.django_session OWNER TO colinops;

--
-- Name: auth_group id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_group ALTER COLUMN id SET DEFAULT nextval('public.auth_group_id_seq'::regclass);


--
-- Name: auth_group_permissions id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_group_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_group_permissions_id_seq'::regclass);


--
-- Name: auth_permission id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_permission ALTER COLUMN id SET DEFAULT nextval('public.auth_permission_id_seq'::regclass);


--
-- Name: auth_user id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user ALTER COLUMN id SET DEFAULT nextval('public.auth_user_id_seq'::regclass);


--
-- Name: auth_user_groups id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_groups ALTER COLUMN id SET DEFAULT nextval('public.auth_user_groups_id_seq'::regclass);


--
-- Name: auth_user_user_permissions id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_user_permissions ALTER COLUMN id SET DEFAULT nextval('public.auth_user_user_permissions_id_seq'::regclass);


--
-- Name: cmdb_tag id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_tag ALTER COLUMN id SET DEFAULT nextval('public.cmdb_tag_id_seq'::regclass);


--
-- Name: django_admin_log id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_admin_log ALTER COLUMN id SET DEFAULT nextval('public.django_admin_log_id_seq'::regclass);


--
-- Name: django_content_type id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_content_type ALTER COLUMN id SET DEFAULT nextval('public.django_content_type_id_seq'::regclass);


--
-- Name: django_migrations id; Type: DEFAULT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_migrations ALTER COLUMN id SET DEFAULT nextval('public.django_migrations_id_seq'::regclass);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.auth_group (id, name) FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.auth_group_permissions (id, group_id, permission_id) FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: colinops
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
25	Can add cabinet	7	add_cabinet
26	Can change cabinet	7	change_cabinet
27	Can delete cabinet	7	delete_cabinet
28	Can view cabinet	7	view_cabinet
29	Can add CDN资产	8	add_cdn
30	Can change CDN资产	8	change_cdn
31	Can delete CDN资产	8	delete_cdn
32	Can view CDN资产	8	view_cdn
33	Can add 数据库/缓存资产	9	add_dbinstance
34	Can change 数据库/缓存资产	9	change_dbinstance
35	Can delete 数据库/缓存资产	9	delete_dbinstance
36	Can view 数据库/缓存资产	9	view_dbinstance
37	Can add 资产标签	10	add_tag
38	Can change 资产标签	10	change_tag
39	Can delete 资产标签	10	delete_tag
40	Can view 资产标签	10	view_tag
41	Can add MySQL数据库扩展	11	add_mysqlextra
42	Can change MySQL数据库扩展	11	change_mysqlextra
43	Can delete MySQL数据库扩展	11	delete_mysqlextra
44	Can view MySQL数据库扩展	11	view_mysqlextra
45	Can add 主机资产	12	add_host
46	Can change 主机资产	12	change_host
47	Can delete 主机资产	12	delete_host
48	Can view 主机资产	12	view_host
49	Can add 主机资产	13	add_asset
50	Can change 主机资产	13	change_asset
51	Can delete 主机资产	13	delete_asset
52	Can view 主机资产	13	view_asset
53	Can add 硬件资产	12	add_hardware
54	Can change 硬件资产	12	change_hardware
55	Can delete 硬件资产	12	delete_hardware
56	Can view 硬件资产	12	view_hardware
\.


--
-- Data for Name: auth_user; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) FROM stdin;
1	pbkdf2_sha256$260000$oFzds4D8Sgc6SZRzGJR3As$YPOhR1HdNiUU8vqYXnmLHHlmmytiJM+RtYh+ookiswg=	2022-12-26 15:23:30.75368+08	t	kfzadmin			admin@kongfz.com	t	t	2022-12-23 17:41:12.434091+08
\.


--
-- Data for Name: auth_user_groups; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.auth_user_groups (id, user_id, group_id) FROM stdin;
\.


--
-- Data for Name: auth_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.auth_user_user_permissions (id, user_id, permission_id) FROM stdin;
\.


--
-- Data for Name: cmdb_asset; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.cmdb_asset (id, created_time, updated_time, deleted_time, is_deleted, instance_id, hostname, host_ip, all_ips, host_type, extra, public_ip, cpu_core, cpu_type, memory, disk, platform, operation_sys, manufacturer, status, serial, cloud, tags_id, hosted_id, add_time) FROM stdin;
\.


--
-- Data for Name: cmdb_cabinet; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.cmdb_cabinet (id, created_time, updated_time, deleted_time, is_deleted, name, description, "position") FROM stdin;
\.


--
-- Data for Name: cmdb_cdn; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.cmdb_cdn (id, created_time, updated_time, deleted_time, is_deleted, name, cname, status, area, type, source_type, source_addr, cloud) FROM stdin;
cbf96948-8226-4247-9906-32d75e8be250	2022-12-22 15:38:37.325523+08	2022-12-22 15:38:37.325568+08	\N	f	img.kongfz.cn	img.kongfz.cn.w.kunlungr.com	offline	domestic	web	oss	img-kongfz-cn.oss-cn-beijing.aliyuncs.com	1
1c0c2e66-1238-4cf8-b1e8-be333cc0198f	2022-12-22 15:38:37.349453+08	2022-12-22 15:38:37.349488+08	\N	f	res.kongfz.com	res.kongfz.com.w.kunlungr.com	offline	domestic	web	domain	res-source.kongfz.com	1
d1cf2b7f-5f89-4e6d-8300-c4473fa0fc53	2022-12-22 15:38:37.377628+08	2022-12-22 15:38:37.377655+08	\N	f	res2.kongfz.com	res2.kongfz.com.w.kunlungr.com	online	domestic	web	domain	res2-source.kongfz.com	1
b1d6814d-6001-4a34-aa8f-321e3d946e69	2022-12-22 15:38:37.404411+08	2022-12-22 15:38:37.404423+08	\N	f	booklibimg.kfzimg.com	booklibimg.kfzimg.com.w.kunlungr.com	offline	domestic	web	oss	booklibimg-kfzimg-com.oss-cn-beijing.aliyuncs.com	1
028d258d-bbd1-4b0d-b831-33f1ae6777d9	2022-12-22 15:38:37.426766+08	2022-12-22 15:38:37.426779+08	\N	f	zsg.kfzimg.com	zsg.kfzimg.com.w.kunlunar.com	offline	domestic	web	oss	zsg-kfzimg-com.oss-cn-beijing.aliyuncs.com	1
bd7171c3-a534-470e-8f55-4562594ef91e	2022-12-22 15:38:37.45007+08	2022-12-22 15:38:37.450083+08	\N	f	pmgs.kfzimg.com	pmgs.kfzimg.com.w.kunlungr.com	offline	domestic	web	oss	pmgs-kfzimg-com.oss-cn-beijing.aliyuncs.com	1
2f9cadf3-3abf-4e5b-bd5b-cdcbc19b6d6b	2022-12-22 15:38:37.470682+08	2022-12-22 15:38:37.470697+08	\N	f	video.kongfz.com	video.kongfz.com.w.kunlunca.com	online	domestic	video	oss	video-kfzimg-com.oss-cn-beijing.aliyuncs.com	1
5c1cd743-c854-489f-95bd-20c6ce0997bf	2022-12-22 15:38:37.491852+08	2022-12-22 15:38:37.491864+08	\N	f	app-package.kongfz.com	app-package.kongfz.com.w.kunlunca.com	online	domestic	download	oss	app-package-kongfz-com.oss-cn-beijing.aliyuncs.com	1
61cb6f71-6ac6-4000-ae68-fc2f9dad5b81	2022-12-22 15:38:37.513779+08	2022-12-22 15:38:37.513794+08	\N	f	video.kfzimg.com	video.kfzimg.com.w.kunlunca.com	online	domestic	video	oss	video-kfzimg-com.oss-cn-beijing.aliyuncs.com	1
12e04182-227c-4f36-8e4e-4061a17a212a	2022-12-22 15:38:37.53465+08	2022-12-22 15:38:37.534663+08	\N	f	img0.kfzimg.com	img0.kfzimg.com.w.kunlunar.com	offline	domestic	web	domain	img0-source.kfzimg.com	1
ad3c96c7-3481-4360-88c9-06b8d7c62041	2022-12-22 15:38:37.555622+08	2022-12-22 15:38:37.555635+08	\N	f	www.kfzimg.com	www.kfzimg.com.w.kunlunar.com	online	domestic	web	oss	www-kfzimg-com.oss-cn-beijing.aliyuncs.com	1
ff334abb-6b28-41da-949a-f57260b58bc6	2022-12-22 15:39:07.689869+08	2022-12-22 15:39:07.689897+08	\N	f	test.kongfz.com	test.kongfz.com.cdn.dnsv1.com	offline	mainland	web	domain	test-source.kongfz.com:80	2
99b469eb-c265-49ac-9039-f654afb32f9d	2022-12-22 15:39:07.713523+08	2022-12-22 15:39:07.713539+08	\N	f	service.kongfz.com	service.kongfz.com.cdn.dnsv1.com	offline	mainland	web	cos	service-kongfz-com-1251184211.cos.ap-beijing.myqcloud.com	2
16121b10-cf84-40b8-8cb2-56bd3de82469	2022-12-22 15:39:07.767704+08	2022-12-22 15:39:07.767742+08	\N	f	res2.kongfz.com	res2.kongfz.com.cdn.dnsv1.com	offline	global	web	domain	res2-source.kongfz.com	2
389c8a9a-d2d0-435d-b948-c5fccc84ba57	2022-12-22 15:39:07.826098+08	2022-12-22 15:39:07.826162+08	\N	f	neibuwww.kfzimg.com	neibuwww.kfzimg.com.cdn.dnsv1.com	online	mainland	web	cos	neibuwww-kfzimg-com-1251184211.cos.ap-beijing.myqcloud.com	2
1ef25d40-e23b-4e92-be26-18ab58e5ccef	2022-12-22 15:39:07.848134+08	2022-12-22 15:39:07.848174+08	\N	f	user.kfzimg.com	user.kfzimg.com.cdn.dnsv1.com	offline	mainland	web	domain	user-source.kfzimg.com	2
8532b863-5d5c-48c4-8672-4c93962d857c	2022-12-22 15:39:07.868384+08	2022-12-22 15:39:07.868401+08	\N	f	booklibimg.kfzimg.com	booklibimg.kfzimg.com.cdn.dnsv1.com	online	mainland	web	cos	booklibimg-kfzimg-com-1251184211.cos.ap-beijing.myqcloud.com	2
f1fa0c95-422f-49a3-ad8a-c88da1af646c	2022-12-22 15:39:07.890527+08	2022-12-22 15:39:07.890581+08	\N	f	pmgs.kfzimg.com	pmgs.kfzimg.com.cdn.dnsv1.com	online	global	web	domain	pmgs-source.kfzimg.com	2
67844006-7871-413a-b7cc-fb966a95f154	2022-12-22 15:39:07.951543+08	2022-12-22 15:39:07.951589+08	\N	f	zsg.kfzimg.com	zsg.kfzimg.com.cdn.dnsv1.com	online	global	web	cos	zsg-kfzimg-com-1251184211.cos.ap-beijing.myqcloud.com	2
585973d0-48c9-47cc-a5f5-5487172e27d2	2022-12-22 15:39:07.970755+08	2022-12-22 15:39:07.970806+08	\N	f	static.kongfz.com	static.kongfz.com.cdn.dnsv1.com	online	global	web	cos	static-kongfz-com-1251184211.cos.ap-beijing.myqcloud.com	2
9113b31e-5743-4073-a6eb-5859474c8c07	2022-12-22 15:39:07.995562+08	2022-12-22 15:39:07.995613+08	\N	f	shopimg.kfzimg.com	shopimg.kfzimg.com.cdn.dnsv1.com	online	mainland	web	cos	www-kfzimg-com-1251184211.cos.ap-beijing.myqcloud.com	2
935e815f-6022-4156-bbf2-fc3ed881e252	2022-12-22 15:39:08.017637+08	2022-12-22 15:39:08.017691+08	\N	f	img0.kfzimg.com	img0.kfzimg.com.cdn.dnsv1.com	online	global	web	cos	img0-kfzimg-com-1251184211.cos.ap-beijing.myqcloud.com	2
7d71c7d1-b8d8-4d3e-b3e2-e58bf53e0bb7	2022-12-22 15:39:08.044493+08	2022-12-22 15:39:08.04455+08	\N	f	www.kfzimg.com	www.kfzimg.com.cdn.dnsv1.com	online	global	web	cos	www-kfzimg-com-1251184211.cos.ap-beijing.myqcloud.com	2
9b38b984-c764-4d3f-a4df-3da94c9c1927	2022-12-22 15:39:08.071523+08	2022-12-22 15:39:08.071563+08	\N	f	img.kongfz.cn	img.kongfz.cn.cdn.dnsv1.com	online	global	web	cos	img-kongfz-cn-1251184211.cos.ap-beijing.myqcloud.com	2
\.


--
-- Data for Name: cmdb_dbinstance; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.cmdb_dbinstance (id, created_time, updated_time, deleted_time, is_deleted, instance_id, instance_name, db_type, is_master, address, ipaddr, port, status, version, specs, extra, cloud) FROM stdin;
93341fff-b1e0-4264-82d8-ec0133e82dc0	2022-12-22 11:39:16.239104+08	2022-12-22 11:39:16.239154+08	\N	f	rm-2zelucds92xvk1nlb	livedb	1	t	rm-2zelucds92xvk1nlb.mysql.rds.aliyuncs.com	172.17.116.20	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
411d4e5b-9254-4560-8da5-b9d296320069	2022-12-22 11:39:16.345014+08	2022-12-22 11:39:16.345105+08	\N	f	rr-2zew930xd3745vuik	paydb-slave	1	f	rr-2zew930xd3745vuik.mysql.rds.aliyuncs.com	172.18.238.59	3306	1	5.7	mysqlro.x8.large.1	{"cpu": 4, "disk": 0, "iops": 9000, "memory": 32, "max_conns": 5000}	1
7abd0645-9a19-4507-b18d-ce1f1569ea37	2022-12-22 11:39:16.433875+08	2022-12-22 11:39:16.433942+08	\N	f	rr-2ze255llo0j6j6m9k	product_b2_slave	1	f	rr-2ze255llo0j6j6m9k.mysql.rds.aliyuncs.com	172.17.115.150	3306	1	5.7	mysqlro.x8.xlarge.1	{"cpu": 8, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
4e6ae84f-4095-468e-99a3-705f0f5b7f73	2022-12-22 11:39:16.515277+08	2022-12-22 11:39:16.515332+08	\N	f	rr-2zed7k9myd78j813t	product_a2_slave	1	f	rr-2zed7k9myd78j813t.mysql.rds.aliyuncs.com	172.17.115.149	3306	1	5.7	mysqlro.x4.2xlarge.1	{"cpu": 16, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
740ac543-7832-49f2-aa54-84180b727ab6	2022-12-22 11:39:16.631103+08	2022-12-22 11:39:16.631185+08	\N	f	rr-2ze36z231854ps827	product_b1_slave	1	f	rr-2ze36z231854ps827.mysql.rds.aliyuncs.com	172.17.115.148	3306	1	5.7	mysqlro.x4.2xlarge.1	{"cpu": 16, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
0a823b61-572a-49e5-98a8-605f0519e38e	2022-12-22 11:39:16.794238+08	2022-12-22 11:39:16.794313+08	\N	f	rr-2ze7wr3j0t937gz6s	product_a1_slave	1	f	rr-2ze7wr3j0t937gz6s.mysql.rds.aliyuncs.com	172.17.115.147	3306	1	5.7	mysqlro.x4.2xlarge.1	{"cpu": 16, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
c25fa473-27ba-4660-bd26-af11a05aa084	2022-12-22 11:39:16.860667+08	2022-12-22 11:39:16.860752+08	\N	f	rm-2ze57282c5sve7v7e	product_b2db	1	t	rm-2ze57282c5sve7v7e.mysql.rds.aliyuncs.com	172.18.238.58	3306	1	5.7	mysql.x4.2xlarge.2	{"cpu": 16, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
cec797de-4de4-4d35-9a7d-d6e1f864316b	2022-12-22 11:39:16.947397+08	2022-12-22 11:39:16.947429+08	\N	f	rm-2zep9o9sj2995l2xq	product_a2db	1	t	rm-2zep9o9sj2995l2xq.mysql.rds.aliyuncs.com	172.18.238.57	3306	1	5.7	mysql.x8.xlarge.2	{"cpu": 8, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
47b5c4ec-8ad7-403c-add9-633eafb6e06e	2022-12-22 11:39:17.007122+08	2022-12-22 11:39:17.007199+08	\N	f	rm-2ze1ap96k2apin7tz	product_b1db	1	t	rm-2ze1ap96k2apin7tz.mysql.rds.aliyuncs.com	172.18.238.56	3306	1	5.7	mysql.x8.xlarge.2	{"cpu": 8, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
fb9a694b-490c-4fbd-9be9-d1aba379b0e1	2022-12-22 11:39:17.086691+08	2022-12-22 11:39:17.086754+08	\N	f	rm-2ze0xl9zz0ap1iw29	product_a1db	1	t	rm-2ze0xl9zz0ap1iw29.mysql.rds.aliyuncs.com	172.17.115.144	3306	1	5.7	mysql.x8.xlarge.2	{"cpu": 8, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
ac7c6660-60b2-41c0-9caf-aea9f88e1247	2022-12-22 11:39:17.168573+08	2022-12-22 11:39:17.168633+08	\N	f	rr-2zedx42hj369cm65b	shopdb-slave	1	f	rr-2zedx42hj369cm65b.mysql.rds.aliyuncs.com	172.17.115.126	3306	1	5.7	rds.mysql.c1.xlarge	{"cpu": 8, "disk": 0, "iops": 12000, "memory": 32, "max_conns": 8000}	1
2b6b97ce-4a53-47ab-912b-f4d307dcf50a	2022-12-22 11:39:17.232097+08	2022-12-22 11:39:17.23214+08	\N	f	rm-2zeisjts5660tmd47	hisdb	1	t	rm-2zeisjts5660tmd47.mysql.rds.aliyuncs.com	172.17.115.110	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
c3da6020-3ff0-4955-b487-54e29a39de82	2022-12-22 11:39:17.299416+08	2022-12-22 11:39:17.299484+08	\N	f	rr-2zer45v5cak3k3i3w	pmdb-slave	1	f	rr-2zer45v5cak3k3i3w.mysql.rds.aliyuncs.com	172.17.115.108	3306	1	5.7	mysqlro.x8.large.1	{"cpu": 4, "disk": 0, "iops": 9000, "memory": 32, "max_conns": 5000}	1
b2ddfa13-74d6-450f-80bc-aaa36429324b	2022-12-22 11:39:17.367894+08	2022-12-22 11:39:17.367954+08	\N	f	rm-2ze5v72ie59i7ob0a	smalldb	1	t	rm-2ze5v72ie59i7ob0a.mysql.rds.aliyuncs.com	172.17.115.106	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
42ec6016-9cc8-403e-bf82-4b93868cd1d4	2022-12-22 11:39:17.423586+08	2022-12-22 11:39:17.423668+08	\N	f	rm-2zep65c1t2153055i	shoplogdb	1	t	rm-2zep65c1t2153055i.mysql.rds.aliyuncs.com	172.17.115.105	3306	1	5.7	rds.mysql.s2.xlarge	{"cpu": 2, "disk": 0, "iops": 4000, "memory": 8, "max_conns": 2000}	1
860d889f-eef0-47bc-94b9-97224c1f3892	2022-12-22 11:39:17.491891+08	2022-12-22 11:39:17.491968+08	\N	f	rm-2ze8n303mx6u2hj3i	userdb	1	t	rm-2ze8n303mx6u2hj3i.mysql.rds.aliyuncs.com	172.17.115.104	3306	1	5.7	mysql.x8.xlarge.2	{"cpu": 8, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
682186ed-9cb8-45c1-91c8-0bdb9742e24b	2022-12-22 11:39:17.55972+08	2022-12-22 11:39:17.559766+08	\N	f	rm-2ze5ozm3k6o632suw	thirddb	1	t	rm-2ze5ozm3k6o632suw.mysql.rds.aliyuncs.com	172.17.115.102	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
83cbc690-1eb0-438b-94e2-b0259020403e	2022-12-22 11:39:17.626682+08	2022-12-22 11:39:17.626744+08	\N	f	rm-2zev3m0c986ivap2u	product	1	t	rm-2zev3m0c986ivap2u.mysql.rds.aliyuncs.com	172.17.115.101	3306	1	5.7	mysql.x4.large.2	{"cpu": 4, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
e553dc77-2e00-413c-a486-a230c33c1762	2022-12-22 11:39:17.716219+08	2022-12-22 11:39:17.716251+08	\N	f	rm-2zep75tll2dd018xf	paydb	1	t	rm-2zep75tll2dd018xf.mysql.rds.aliyuncs.com	172.17.115.100	3306	1	5.7	mysql.x4.2xlarge.2	{"cpu": 16, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
7a76d374-25c0-42dc-8637-4056a75974f8	2022-12-22 11:39:17.804638+08	2022-12-22 11:39:17.804682+08	\N	f	rm-2zeg6ngc3llb7zfw7	shopdb	1	t	rm-2zeg6ngc3llb7zfw7.mysql.rds.aliyuncs.com	172.17.115.99	3306	1	5.7	mysql.x4.2xlarge.2	{"cpu": 16, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
a7ba04ca-28d6-466b-8f69-826919c680e7	2022-12-22 11:39:17.884055+08	2022-12-22 11:39:17.884115+08	\N	f	rm-2ze73m5n370av91o6	booklib	1	t	rm-2ze73m5n370av91o6.mysql.rds.aliyuncs.com	172.17.115.98	3306	1	5.7	mysql.x8.large.2	{"cpu": 4, "disk": 0, "iops": 9000, "memory": 32, "max_conns": 5000}	1
c754c7eb-e149-4613-a07b-3bd6ecddb080	2022-12-22 11:39:17.995368+08	2022-12-22 11:39:17.995457+08	\N	f	rm-2zem707e872fy4071	pmdb	1	t	rm-2zem707e872fy4071.mysql.rds.aliyuncs.com	172.17.115.97	3306	1	5.7	mysql.x8.xlarge.2	{"cpu": 8, "disk": 0, "iops": 18000, "memory": 64, "max_conns": 10000}	1
28d59852-cf28-4dc4-a414-7173bc907cd8	2022-12-22 11:39:18.056614+08	2022-12-22 11:39:18.056701+08	\N	f	rm-2zelh5615c6k2sd0g	product-seo	1	t	rm-2zelh5615c6k2sd0g.mysql.rds.aliyuncs.com	172.17.115.96	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
4be95ed6-d5e7-47a8-bf46-3284b9d1947e	2022-12-22 11:39:18.139593+08	2022-12-22 11:39:18.139644+08	\N	f	rm-2zef0u5a7yo6mi07m	library	1	t	rm-2zef0u5a7yo6mi07m.mysql.rds.aliyuncs.com	172.17.115.95	3306	1	5.7	rds.mysql.s2.large	{"cpu": 2, "disk": 0, "iops": 2000, "memory": 4, "max_conns": 1200}	1
4439f263-8f24-47a7-82ad-8abdc93391d1	2022-12-22 11:39:18.199566+08	2022-12-22 11:39:18.19959+08	\N	f	rm-2ze4l9gto73w55nrm	pmgs	1	t	rm-2ze4l9gto73w55nrm.mysql.rds.aliyuncs.com	172.17.115.93	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
04d8d81f-f2c4-4fdd-8e13-6514c98ced35	2022-12-22 11:39:18.255737+08	2022-12-22 11:39:18.25578+08	\N	f	rm-2zeg0847t13170h0w	message	1	t	rm-2zeg0847t13170h0w.mysql.rds.aliyuncs.com	172.17.115.92	3306	1	5.7	mysql.x8.large.2	{"cpu": 4, "disk": 0, "iops": 9000, "memory": 32, "max_conns": 5000}	1
780f6f1c-3b15-4798-8b02-3982229ba6c4	2022-12-22 11:39:18.32018+08	2022-12-22 11:39:18.320246+08	\N	f	rm-2zem4vo2865v101l4	footprint	1	t	rm-2zem4vo2865v101l4.mysql.rds.aliyuncs.com	172.17.115.91	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
3a4c3f18-bff2-4ade-b60d-f349be81bd36	2022-12-22 11:39:18.401287+08	2022-12-22 11:39:18.401339+08	\N	f	rm-2ze72676ns3jj2v0o	search	1	t	rm-2ze72676ns3jj2v0o.mysql.rds.aliyuncs.com	172.17.115.90	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
003307d4-5f0f-4cc1-ae8d-6063a43b7cac	2022-12-22 11:39:18.479254+08	2022-12-22 11:39:18.479334+08	\N	f	rm-2ze41w87668hx2jzb	zabbix	1	t	rm-2ze41w87668hx2jzb.mysql.rds.aliyuncs.com	172.17.115.86	3306	1	5.7	rds.mysql.c1.large	{"cpu": 8, "disk": 0, "iops": 8000, "memory": 16, "max_conns": 4000}	1
c3d4d454-3fd7-472a-9fb6-658341737a2c	2022-12-22 11:39:18.546377+08	2022-12-22 11:39:18.54646+08	\N	f	rm-2ze93klhl2ookgl1k	express	1	t	rm-2ze93klhl2ookgl1k.mysql.rds.aliyuncs.com	172.17.115.82	3306	1	5.7	mysql.x8.medium.2	{"cpu": 2, "disk": 0, "iops": 4500, "memory": 16, "max_conns": 2500}	1
d0fd9ce9-1113-454c-b138-8ab032b85cb3	2022-12-22 11:39:18.613139+08	2022-12-22 11:39:18.613222+08	\N	f	rm-2ze85k76w05c3hq9h	tag	1	t	rm-2ze85k76w05c3hq9h.mysql.rds.aliyuncs.com	172.17.115.79	3306	1	5.7	rds.mysql.s2.xlarge	{"cpu": 2, "disk": 0, "iops": 4000, "memory": 8, "max_conns": 2000}	1
097edd3e-c2f9-498c-a238-92ed539a2d85	2022-12-22 11:44:18.117556+08	2022-12-22 11:44:18.117647+08	\N	f	r-2ze2hbc18zw65c6cfm	pm-bid-service-cache	2	f	r-2ze2hbc18zw65c6cfm.redis.rds.aliyuncs.com	172.17.116.24	6379	1	5.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
f0ccbc73-1f29-49f5-a52d-224b3e05ae20	2022-12-22 11:44:18.156898+08	2022-12-22 11:44:18.15698+08	\N	f	r-2zels1xztxba9whzht	recommend-data	2	f	r-2zels1xztxba9whzht.redis.rds.aliyuncs.com	172.17.116.22	6379	1	5.0	4GB主从版	{"qps": 80000, "memory": 4096, "band_width": 24, "max_connection": 10000}	1
7433f4bb-cf6b-4e62-aff4-ac43b11531cc	2022-12-22 11:44:18.182988+08	2022-12-22 11:44:18.183329+08	\N	f	r-2ze8i2srfmvp1bf8tg	redis-sharing	2	f	r-2ze8i2srfmvp1bf8tg.redis.rds.aliyuncs.com	172.17.116.15	6379	1	5.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
767f627e-792c-4626-b202-ec70d0f391ff	2022-12-22 11:44:18.206156+08	2022-12-22 11:44:18.206236+08	\N	f	r-2zeo8y0i0dbzm30xu4	redis-live-service-cache	2	f	r-2zeo8y0i0dbzm30xu4.redis.rds.aliyuncs.com	172.17.116.13	6379	1	5.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
8c7d79e6-6f0a-44e0-9bfc-7a533a7818ab	2022-12-22 11:44:18.244327+08	2022-12-22 11:44:18.244417+08	\N	f	r-2zeudw7ov6gflbnm72	redis-live-socket-service	2	f	r-2zeudw7ov6gflbnm72.redis.rds.aliyuncs.com	172.17.116.11	6379	1	5.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
b673dc09-5ea5-41e6-981e-359253b9a2a4	2022-12-22 11:44:18.271481+08	2022-12-22 11:44:18.271568+08	\N	f	r-2ze7t0fdpekoz5pul3	redis-pay-task-cache	2	f	r-2ze7t0fdpekoz5pul3.redis.rds.aliyuncs.com	172.17.116.6	6379	1	5.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
53095b1a-9381-4553-a510-17a7ca774272	2022-12-22 11:44:18.297743+08	2022-12-22 11:44:18.297809+08	\N	f	r-2ze5g21p0gvp024o8s	redis-search-sentinel-service-counter	2	f	r-2ze5g21p0gvp024o8s.redis.rds.aliyuncs.com	172.17.116.0	6379	1	5.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
77b63222-d836-4ae1-be1b-6a361eaba34f	2022-12-22 11:44:18.324989+08	2022-12-22 11:44:18.32508+08	\N	f	r-2zeilfzpu1jz6z2nnw	redis-cart-task	2	f	r-2zeilfzpu1jz6z2nnw.redis.rds.aliyuncs.com	172.17.115.249	6379	1	5.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
adef7368-2c1f-458f-872f-1fb32c1d00f6	2022-12-22 11:44:18.346707+08	2022-12-22 11:44:18.346779+08	\N	f	r-2zeaiq6c1a4v00v4wf	pm-live-socket-service	2	f	r-2zeaiq6c1a4v00v4wf.redis.rds.aliyuncs.com	172.17.115.241	6379	1	5.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
ce9f9e24-fac2-4464-96b3-5dbe0b2c584f	2022-12-22 11:44:18.369351+08	2022-12-22 11:44:18.369389+08	\N	f	r-2zesump34mlrbbc7ic	item-search-service-redis	2	f	r-2zesump34mlrbbc7ic.redis.rds.aliyuncs.com	172.16.28.138	6379	1	5.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
e037550a-f270-493a-acd2-77d6d3982a3d	2022-12-22 11:44:18.395825+08	2022-12-22 11:44:18.395868+08	\N	f	r-2ze0gzfigxg4zntm73	redis-wechat-service-cache	2	f	r-2ze0gzfigxg4zntm73.redis.rds.aliyuncs.com	172.17.115.224	6379	1	5.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
2267b55c-138f-4807-b42b-9bfffab7c8ef	2022-12-22 11:44:18.449002+08	2022-12-22 11:44:18.449063+08	\N	f	r-2ze2vcvlegcvb8iqk8	redis-prohibit-word	2	f	r-2ze2vcvlegcvb8iqk8.redis.rds.aliyuncs.com	172.16.28.128	6379	1	5.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
3771267e-2fdb-4a98-9e2c-fbba6e9cfb88	2022-12-22 11:44:18.472307+08	2022-12-22 11:44:18.472335+08	\N	f	r-2zeo2hqbfom10rqrks	product-search-service	2	f	r-2zeo2hqbfom10rqrks.redis.rds.aliyuncs.com	172.17.115.203	6379	1	5.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
53dec460-4f73-4580-a399-074c5d4794f5	2022-12-22 11:44:18.497714+08	2022-12-22 11:44:18.497743+08	\N	f	r-2ze9qcwj3q40baivkq	admin-service-cache	2	f	r-2ze9qcwj3q40baivkq.redis.rds.aliyuncs.com	172.17.115.173	6379	1	5.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
c3870b56-a174-4f0e-b020-8d1c48a32fd4	2022-12-22 11:44:18.51765+08	2022-12-22 11:44:18.517696+08	\N	f	r-2zejsxkmhmoczhlm8e	redis-verify-common	2	f	r-2zejsxkmhmoczhlm8e.redis.rds.aliyuncs.com	172.17.115.135	6379	1	4.0	4GB主从版	{"qps": 80000, "memory": 4096, "band_width": 24, "max_connection": 10000}	1
f62cc1bb-efe8-492a-bfd4-27eb55eac5c2	2022-12-22 11:44:18.582525+08	2022-12-22 11:44:18.582569+08	\N	f	r-2ze5t2n3jn8sgu6hcg	redis-store-cache	2	f	r-2ze5t2n3jn8sgu6hcg.redis.rds.aliyuncs.com	172.17.115.123	6379	1	5.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
0c10ed98-7449-48c0-b940-3cdb010d5a53	2022-12-22 11:44:18.603974+08	2022-12-22 11:44:18.604025+08	\N	f	r-2zevynmvdypvuxxfwy	redis-search-spider	2	f	r-2zevynmvdypvuxxfwy.redis.rds.aliyuncs.com	172.17.115.119	6379	1	4.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
b6d591d7-53e6-4ad2-b87b-4e6366d12aca	2022-12-22 11:44:18.635703+08	2022-12-22 11:44:18.635756+08	\N	f	r-2ze4njrpj9ncj5elx8	redis-hotword-cache	2	f	r-2ze4njrpj9ncj5elx8.redis.rds.aliyuncs.com	172.17.115.72	6379	1	4.0	4GB主从版	{"qps": 80000, "memory": 4096, "band_width": 24, "max_connection": 10000}	1
de47e77d-5288-4727-b0f3-6523b62add7f	2022-12-22 11:44:18.657961+08	2022-12-22 11:44:18.658034+08	\N	f	r-2zee29ztnzv4mvz7k1	redis-old-pm-cache	2	f	r-2zee29ztnzv4mvz7k1.redis.rds.aliyuncs.com	172.17.115.70	6379	1	4.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
b60e55a5-f551-4e13-a400-756f5ea04ee3	2022-12-22 11:44:18.682143+08	2022-12-22 11:44:18.682205+08	\N	f	r-2zeqa2ko9l63ww09rq	redis-pm-data	2	f	r-2zeqa2ko9l63ww09rq.redis.rds.aliyuncs.com	172.17.115.69	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
07d7ea69-dfcf-454d-996f-1959fccbb2bc	2022-12-22 11:44:18.708843+08	2022-12-22 11:44:18.708909+08	\N	f	r-2zemmcfe2lflb40mhu	redis-login	2	f	r-2zemmcfe2lflb40mhu.redis.rds.aliyuncs.com	172.17.115.68	6379	1	4.0	4GB主从版	{"qps": 80000, "memory": 4096, "band_width": 24, "max_connection": 10000}	1
5b724061-14ee-4a0f-9a3a-efa736328486	2022-12-22 11:44:18.739833+08	2022-12-22 11:44:18.73991+08	\N	f	r-2zewzi1s284rm2bh7h	redis-common-data	2	f	r-2zewzi1s284rm2bh7h.redis.rds.aliyuncs.com	172.17.115.67	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
7a8869d0-b3b0-42ae-8500-cda0c00a32d1	2022-12-22 11:44:18.767718+08	2022-12-22 11:44:18.767789+08	\N	f	r-2zeevlepyijufgzmzh	redis-message-old	2	f	r-2zeevlepyijufgzmzh.redis.rds.aliyuncs.com	172.17.115.66	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
ea524194-5053-43c6-91c8-af0e8f4ba791	2022-12-22 11:44:18.801327+08	2022-12-22 11:44:18.801387+08	\N	f	r-2zedlep8bc85de0y5i	redis-count	2	f	r-2zedlep8bc85de0y5i.redis.rds.aliyuncs.com	172.17.115.65	6379	1	4.0	8GB主从版	{"qps": 80000, "memory": 8192, "band_width": 24, "max_connection": 10000}	1
ad7722bb-0f12-41c8-a68e-265931c9b595	2022-12-22 11:44:18.823549+08	2022-12-22 11:44:18.823619+08	\N	f	r-2zesngxzt4elpkgqh8	redis-shop-cache	2	f	r-2zesngxzt4elpkgqh8.redis.rds.aliyuncs.com	172.17.115.64	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
838185aa-d337-48b6-ad62-dc3888da229e	2022-12-22 11:44:18.88118+08	2022-12-22 11:44:18.881197+08	\N	f	r-2zewdln87h6sx6pb3r	redis-open-cache	2	f	r-2zewdln87h6sx6pb3r.redis.rds.aliyuncs.com	172.17.115.63	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
22c7d4b7-0d87-4cc8-979f-b339e27b5484	2022-12-22 11:44:18.913233+08	2022-12-22 11:44:18.913283+08	\N	f	r-2ze3lkzxzerpm1unvn	redis-queue	2	f	r-2ze3lkzxzerpm1unvn.redis.rds.aliyuncs.com	172.17.115.61	6379	1	4.0	4GB主从版	{"qps": 80000, "memory": 4096, "band_width": 24, "max_connection": 10000}	1
5dbbac81-8c40-49e3-9850-d54ffe9ab005	2022-12-22 11:44:18.942209+08	2022-12-22 11:44:18.942267+08	\N	f	r-2zecxcs2yuvfsmlkin	redis-search-error-queue	2	f	r-2zecxcs2yuvfsmlkin.redis.rds.aliyuncs.com	172.17.115.60	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
15d44ad1-c5f8-420e-9721-f99314345018	2022-12-22 11:44:18.964051+08	2022-12-22 11:44:18.964117+08	\N	f	r-2zeh6ebiyos26b1wy0	redis-social-data	2	f	r-2zeh6ebiyos26b1wy0.redis.rds.aliyuncs.com	172.17.115.57	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
f551ab76-3764-49be-b380-ac6a3d525a7f	2022-12-22 11:44:18.989578+08	2022-12-22 11:44:18.989633+08	\N	f	r-2zeeyd76qediynk7hn	redis-search-common-queue	2	f	r-2zeeyd76qediynk7hn.redis.rds.aliyuncs.com	172.17.115.56	6379	1	4.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
1d8be5f0-2039-40da-a9df-6da957651ec2	2022-12-22 11:44:19.019539+08	2022-12-22 11:44:19.01961+08	\N	f	r-2zezxx5gzxwu05si9p	redis-search-index-update-queue	2	f	r-2zezxx5gzxwu05si9p.redis.rds.aliyuncs.com	172.17.115.55	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
8faab482-d0b9-4784-b8ec-6294de94cea8	2022-12-22 11:44:19.043565+08	2022-12-22 11:44:19.043602+08	\N	f	r-2ze0fc88x3d1q4xufk	redis-search-passedItems	2	f	r-2ze0fc88x3d1q4xufk.redis.rds.aliyuncs.com	172.17.115.54	6379	1	4.0	64GB主从版	{"qps": 80000, "memory": 65536, "band_width": 48, "max_connection": 10000}	1
31dfcc30-ce97-43ca-a97c-45f13f7b4b97	2022-12-22 11:44:19.074939+08	2022-12-22 11:44:19.074984+08	\N	f	r-2zeyhkf1vg0rr76u3p	redis-search-trustItems	2	f	r-2zeyhkf1vg0rr76u3p.redis.rds.aliyuncs.com	172.17.115.53	6379	1	4.0	8GB主从版	{"qps": 80000, "memory": 8192, "band_width": 24, "max_connection": 10000}	1
4c4fb55b-ad1c-4779-a384-ed49e7ff4ba8	2022-12-22 11:44:19.101735+08	2022-12-22 11:44:19.101842+08	\N	f	r-2zez3ebv9xren0y17m	redis-search-shield	2	f	r-2zez3ebv9xren0y17m.redis.rds.aliyuncs.com	172.17.115.52	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
feef9875-52b4-49e9-ac96-7c5637244f04	2022-12-22 11:44:19.137767+08	2022-12-22 11:44:19.137795+08	\N	f	r-2ze0xqj6t2w2tb7mmo	redis-book-cache	2	f	r-2ze0xqj6t2w2tb7mmo.redis.rds.aliyuncs.com	172.17.115.50	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
702842f1-b4ee-485e-9655-947e29e0e94e	2022-12-22 11:44:19.159469+08	2022-12-22 11:44:19.159518+08	\N	f	r-2zekjlnukpk8ru7upo	redis-pm-search-web	2	f	r-2zekjlnukpk8ru7upo.redis.rds.aliyuncs.com	172.16.28.48	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
d30d0382-7881-4bba-8d98-ef67e1d990ee	2022-12-22 11:44:19.179653+08	2022-12-22 11:44:19.179697+08	\N	f	r-2ze4wj1h3pwve07q71	redis-staff-service	2	f	r-2ze4wj1h3pwve07q71.redis.rds.aliyuncs.com	172.16.28.41	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
ee6495af-3911-48e7-b94e-7a0fa788c462	2022-12-22 11:44:19.211307+08	2022-12-22 11:44:19.211361+08	\N	f	r-2ze8ry1yqchhve62vg	redis-h5-gateway	2	f	r-2ze8ry1yqchhve62vg.redis.rds.aliyuncs.com	172.16.28.40	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
4edda86c-84a5-447b-a7db-9b05637a57bf	2022-12-22 11:44:19.231883+08	2022-12-22 11:44:19.231913+08	\N	f	r-2zedch7szh544vq0eh	redis-order-data	2	f	r-2zedch7szh544vq0eh.redis.rds.aliyuncs.com	172.16.28.11	6379	1	4.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
d22d952c-abb2-41b8-ba14-8a5332003cc8	2022-12-22 11:44:19.253475+08	2022-12-22 11:44:19.253524+08	\N	f	r-2zeunbz2yeffspc2tr	redis-order-cache	2	f	r-2zeunbz2yeffspc2tr.redis.rds.aliyuncs.com	172.16.28.10	6379	1	4.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
9c672b3f-4716-45fb-9c7d-3e9dc28430bb	2022-12-22 11:44:19.284998+08	2022-12-22 11:44:19.285062+08	\N	f	r-2ze1ndzf0r3g2czqwd	redis-crm-cache	2	f	r-2ze1ndzf0r3g2czqwd.redis.rds.aliyuncs.com	172.16.28.4	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
eb2c7e3e-f6eb-44d7-8b7f-192175fb9c67	2022-12-22 11:44:19.329101+08	2022-12-22 11:44:19.329187+08	\N	f	r-2ze88juy5jfxqlzdx0	redis-pm-web	2	f	r-2ze88juy5jfxqlzdx0.redis.rds.aliyuncs.com	172.16.27.255	6379	1	4.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
9ca4503f-f8a5-4fa0-b906-af91ff9d10af	2022-12-22 11:44:19.355789+08	2022-12-22 11:44:19.355859+08	\N	f	r-2ze4let1zeynoq5m56	redis-suggestion	2	f	r-2ze4let1zeynoq5m56.redis.rds.aliyuncs.com	172.16.27.239	6379	1	5.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
1b4fae8c-4d99-4c3f-a1e5-5bb4ebb3c36f	2022-12-22 11:44:19.377014+08	2022-12-22 11:44:19.377033+08	\N	f	r-2zeqdkfmjrs5phq8bd	redis-interest-book-cache	2	f	r-2zeqdkfmjrs5phq8bd.redis.rds.aliyuncs.com	172.16.27.235	6379	1	4.0	32GB主从版	{"qps": 80000, "memory": 32768, "band_width": 32, "max_connection": 10000}	1
57dcbda6-89a9-4523-a74a-562fc5ceed13	2022-12-22 11:44:19.402729+08	2022-12-22 11:44:19.402769+08	\N	f	r-2zendb0d0o4jmtx235	redis-monitor-ops	2	f	r-2zendb0d0o4jmtx235.redis.rds.aliyuncs.com	172.17.115.12	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
c30dd685-5dfa-4428-8fac-7d7433aa670d	2022-12-22 11:44:19.425254+08	2022-12-22 11:44:19.425305+08	\N	f	r-2ze8ssz5umtiwp5whw	redis-home	2	f	r-2ze8ssz5umtiwp5whw.redis.rds.aliyuncs.com	172.16.27.231	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
8c2c3712-b631-4b05-8ccd-9fe8d63f9c7b	2022-12-22 11:44:19.451341+08	2022-12-22 11:44:19.451414+08	\N	f	r-2ze6m3ubo8omsrukxv	redis-pm-service-cache	2	f	r-2ze6m3ubo8omsrukxv.redis.rds.aliyuncs.com	172.16.27.229	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
2d6c57b7-18fe-4f3f-be04-6e43657b8c72	2022-12-22 11:44:19.517035+08	2022-12-22 11:44:19.517186+08	\N	f	r-2zegrxy5fqx1obsjxo	redis-pc-gateway	2	f	r-2zegrxy5fqx1obsjxo.redis.rds.aliyuncs.com	172.16.27.228	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
c9d51bfb-61eb-4a83-a5d7-b898de28c8cd	2022-12-22 11:44:19.53927+08	2022-12-22 11:44:19.539345+08	\N	f	r-2zehfvszvsn60dsbxk	redis-xinyu-cache	2	f	r-2zehfvszvsn60dsbxk.redis.rds.aliyuncs.com	172.16.27.214	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
5e29f9d6-d63a-438a-82b4-f7c36c452c35	2022-12-22 11:44:19.567316+08	2022-12-22 11:44:19.567377+08	\N	f	r-2ze8ag1p4z7bgq4nv1	redis-user-cache	2	f	r-2ze8ag1p4z7bgq4nv1.redis.rds.aliyuncs.com	172.16.27.213	6379	1	4.0	1GB主从版	{"qps": 80000, "memory": 1024, "band_width": 10, "max_connection": 10000}	1
908df90a-cd97-4cf7-83fc-5d6173cb5aa5	2022-12-22 11:44:19.626244+08	2022-12-22 11:44:19.62632+08	\N	f	r-2ze10bqv15izrjr8z6	redis-express-cache	2	f	r-2ze10bqv15izrjr8z6.redis.rds.aliyuncs.com	172.16.27.211	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
22b30946-3d47-4ba8-b348-eac98a1d5905	2022-12-22 11:44:19.654868+08	2022-12-22 11:44:19.654943+08	\N	f	r-2ze6xzyzkoa3uzihga	redis-recommend-cache	2	f	r-2ze6xzyzkoa3uzihga.redis.rds.aliyuncs.com	172.16.27.206	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
151fcf0b-14d5-45e2-8475-29b1f5df52e8	2022-12-22 11:44:19.682013+08	2022-12-22 11:44:19.682073+08	\N	f	r-2zernhp1shmpg08yho	redis-seo	2	f	r-2zernhp1shmpg08yho.redis.rds.aliyuncs.com	172.16.27.194	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
e719ab37-908d-433b-a68b-9db1f92440d5	2022-12-22 11:44:19.80561+08	2022-12-22 11:44:19.805657+08	\N	f	r-2zetujc2j0h500gz42	redis-social-cache	2	f	r-2zetujc2j0h500gz42.redis.rds.aliyuncs.com	172.16.27.179	6379	1	4.0	4GB主从版	{"qps": 80000, "memory": 4096, "band_width": 24, "max_connection": 10000}	1
87d4f0a9-4033-4dff-80bd-babc78c4f182	2022-12-22 11:44:19.830191+08	2022-12-22 11:44:19.830221+08	\N	f	r-2ze54co72cc0m708jn	redis-message-data	2	f	r-2ze54co72cc0m708jn.redis.rds.aliyuncs.com	172.16.27.178	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
39baf8d7-6ef8-4e14-a48d-b120107612bb	2022-12-22 11:44:19.852816+08	2022-12-22 11:44:19.852861+08	\N	f	r-2ze75wonpyhc3glh12	redis-message-service	2	f	r-2ze75wonpyhc3glh12.redis.rds.aliyuncs.com	172.16.27.176	6379	1	4.0	16GB主从版	{"qps": 80000, "memory": 16384, "band_width": 32, "max_connection": 10000}	1
13dc8442-41f1-4086-a018-fda6ed3a16f8	2022-12-22 11:44:19.878611+08	2022-12-22 11:44:19.87863+08	\N	f	r-2zeypq4u3ql71vas71	redis-sub-service	2	f	r-2zeypq4u3ql71vas71.redis.rds.aliyuncs.com	172.16.27.175	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
ed63ffd1-3e4b-4f16-9857-1c16c2f39255	2022-12-22 11:44:19.90143+08	2022-12-22 11:44:19.901472+08	\N	f	r-2zehg8apz2ewhkis3x	redis-im-service	2	f	r-2zehg8apz2ewhkis3x.redis.rds.aliyuncs.com	172.16.27.174	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
cb969e6d-0a58-4b36-b1f4-838f3359b51e	2022-12-22 11:44:19.930178+08	2022-12-22 11:44:19.93024+08	\N	f	r-2ze06wckchx41oiwhh	redis-recommend-train	2	f	r-2ze06wckchx41oiwhh.redis.rds.aliyuncs.com	172.16.27.148	6379	1	4.0	8GB主从版	{"qps": 80000, "memory": 8192, "band_width": 24, "max_connection": 10000}	1
34a3839c-ede5-4126-b5fc-fdf7c9f6115d	2022-12-22 11:44:19.962663+08	2022-12-22 11:44:19.96273+08	\N	f	r-2zeg9rsofo9ubo45ic	redis-user-service	2	f	r-2zeg9rsofo9ubo45ic.redis.rds.aliyuncs.com	172.16.27.135	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
286010f9-4b3c-4193-8792-e95ea685a512	2022-12-22 11:44:19.991036+08	2022-12-22 11:44:19.991103+08	\N	f	r-2zez0b4ys0cyj65yfk	redis-analysis	2	f	r-2zez0b4ys0cyj65yfk.redis.rds.aliyuncs.com	172.16.27.134	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
8d28a3e5-3bc0-4e09-80f6-063b5107729f	2022-12-22 11:44:20.018492+08	2022-12-22 11:44:20.018562+08	\N	f	r-2zedm4lk6b232og4mx	redis-app-gateway	2	f	r-2zedm4lk6b232og4mx.redis.rds.aliyuncs.com	172.16.27.130	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
a804b4dd-e6a7-4f4a-aa9e-29a83934eafb	2022-12-22 11:44:20.047906+08	2022-12-22 11:44:20.04797+08	\N	f	r-2ze28785f2e3d1e4	redis-search-cache	2	f	r-2ze28785f2e3d1e4.redis.rds.aliyuncs.com	172.16.27.115	6379	1	4.0	80 GB集群版（8分片）	{"qps": 800000, "memory": 81920, "band_width": 768, "max_connection": 80000}	1
f265781d-5e3a-42b5-8420-933825ae1495	2022-12-22 11:44:20.073118+08	2022-12-22 11:44:20.073185+08	\N	f	r-2zef7d34c01fe474	a-useless	2	f	r-2zef7d34c01fe474.redis.rds.aliyuncs.com	172.16.27.109	6379	1	4.0	256MB主从版	{"qps": 80000, "memory": 256, "band_width": 10, "max_connection": 10000}	1
2382fb5e-8222-4990-8c3e-70b6947004a4	2022-12-22 11:44:20.117195+08	2022-12-22 11:44:20.11725+08	\N	f	r-2zeefad66b2ced94	redis-product-cache	2	f	r-2zeefad66b2ced94.redis.rds.aliyuncs.com	172.16.27.108	6379	1	4.0	128 GB集群版（16分片）	{"qps": 1600000, "memory": 131072, "band_width": 768, "max_connection": 160000}	1
2d6eb972-449e-4371-820b-4f52f61c7887	2022-12-22 11:44:20.143529+08	2022-12-22 11:44:20.143595+08	\N	f	r-2zecbefdf5d66974	redis-message-cache	2	f	r-2zecbefdf5d66974.redis.rds.aliyuncs.com	172.16.27.106	6379	1	4.0	4GB主从版	{"qps": 80000, "memory": 4096, "band_width": 24, "max_connection": 10000}	1
2b1a88f9-8fdd-4eab-855f-a05da3718209	2022-12-22 11:44:20.169674+08	2022-12-22 11:44:20.16973+08	\N	f	r-2ze08adefdb2b8b4	redis-auth	2	f	r-2ze08adefdb2b8b4.redis.rds.aliyuncs.com	172.16.27.99	6379	1	4.0	2GB主从版	{"qps": 80000, "memory": 2048, "band_width": 16, "max_connection": 10000}	1
\.


--
-- Data for Name: cmdb_hardware; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.cmdb_hardware (id, created_time, updated_time, deleted_time, is_deleted, hostname, "position", status, cabinet_id, begin_time, ip, model, sn) FROM stdin;
\.


--
-- Data for Name: cmdb_mysqlextra; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.cmdb_mysqlextra (id, created_time, updated_time, deleted_time, is_deleted, databases, user_privilege, data_info, instance_id) FROM stdin;
\.


--
-- Data for Name: cmdb_tag; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.cmdb_tag (id, name) FROM stdin;
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.django_admin_log (id, action_time, object_id, object_repr, action_flag, change_message, content_type_id, user_id) FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.django_content_type (id, app_label, model) FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	auth	user
5	contenttypes	contenttype
6	sessions	session
7	cmdb	cabinet
8	cmdb	cdn
9	cmdb	dbinstance
10	cmdb	tag
11	cmdb	mysqlextra
13	cmdb	asset
12	cmdb	hardware
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.django_migrations (id, app, name, applied) FROM stdin;
1	contenttypes	0001_initial	2022-12-22 11:02:34.243565+08
2	auth	0001_initial	2022-12-22 11:02:35.078521+08
3	admin	0001_initial	2022-12-22 11:02:35.39575+08
4	admin	0002_logentry_remove_auto_add	2022-12-22 11:02:35.471555+08
5	admin	0003_logentry_add_action_flag_choices	2022-12-22 11:02:35.578847+08
6	contenttypes	0002_remove_content_type_name	2022-12-22 11:02:35.76447+08
7	auth	0002_alter_permission_name_max_length	2022-12-22 11:02:35.924851+08
8	auth	0003_alter_user_email_max_length	2022-12-22 11:02:36.04757+08
9	auth	0004_alter_user_username_opts	2022-12-22 11:02:36.163862+08
10	auth	0005_alter_user_last_login_null	2022-12-22 11:02:36.282629+08
11	auth	0006_require_contenttypes_0002	2022-12-22 11:02:36.378558+08
12	auth	0007_alter_validators_add_error_messages	2022-12-22 11:02:36.492843+08
13	auth	0008_alter_user_username_max_length	2022-12-22 11:02:36.617598+08
14	auth	0009_alter_user_last_name_max_length	2022-12-22 11:02:36.767167+08
15	auth	0010_alter_group_name_max_length	2022-12-22 11:02:36.916371+08
16	auth	0011_update_proxy_permissions	2022-12-22 11:02:37.013986+08
17	auth	0012_alter_user_first_name_max_length	2022-12-22 11:02:37.200236+08
18	cmdb	0001_initial	2022-12-22 11:02:38.077165+08
19	sessions	0001_initial	2022-12-22 11:02:38.266797+08
20	cmdb	0002_auto_20221222_1143	2022-12-22 11:43:14.885942+08
21	cmdb	0003_auto_20221223_1720	2022-12-23 17:34:35.248776+08
22	cmdb	0004_host	2022-12-23 17:38:59.865814+08
23	cmdb	0005_rename_host_hardware	2022-12-23 17:40:02.817803+08
24	cmdb	0006_cabinet_position	2022-12-23 17:47:35.595272+08
25	cmdb	0007_auto_20221224_2310	2022-12-24 23:10:34.322583+08
26	cmdb	0008_asset_add_time	2022-12-24 23:19:40.406919+08
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: colinops
--

COPY public.django_session (session_key, session_data, expire_date) FROM stdin;
9g8qh77jo08pqz8l00y8mjmj4bv68m2n	.eJxVjEEOwiAURO_C2hDKh0Jduu8ZyOcDUjWQlHZlvLs06UKX8-bNvJnDfctub3F1S2BXNrDLL_NIz1iOIjyw3CunWrZ18fxQ-Nk2PtcQX7fT_TvI2HJfa9IC_UDaIqEBM8kRxjT5BMIGkawCAKUMEHSA1pMASzYkqYPqQbLPF9K6N2Y:1p8eYL:dIYg9A35F1PN3eoy3ZViQKVNaQAFxr6iEg3UkHgOW7s	2023-01-06 17:41:21.246621+08
n0ph1jqh3ufi90kp1vp0zdootvwhdet4	.eJxVjEEOwiAURO_C2hDKh0Jduu8ZyOcDUjWQlHZlvLs06UKX8-bNvJnDfctub3F1S2BXNrDLL_NIz1iOIjyw3CunWrZ18fxQ-Nk2PtcQX7fT_TvI2HJfa9IC_UDaIqEBM8kRxjT5BMIGkawCAKUMEHSA1pMASzYkqYPqQbLPF9K6N2Y:1p9hpa:x0j6vuU__4cN8LHoJnC3q9P0OpGa7IyEXyWzXyl2nsg	2023-01-09 15:23:30.785507+08
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.auth_group_id_seq', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.auth_group_permissions_id_seq', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.auth_permission_id_seq', 56, true);


--
-- Name: auth_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.auth_user_groups_id_seq', 1, false);


--
-- Name: auth_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.auth_user_id_seq', 1, true);


--
-- Name: auth_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.auth_user_user_permissions_id_seq', 1, false);


--
-- Name: cmdb_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.cmdb_tag_id_seq', 1, false);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.django_admin_log_id_seq', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.django_content_type_id_seq', 13, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: colinops
--

SELECT pg_catalog.setval('public.django_migrations_id_seq', 27, true);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_name_key UNIQUE (name);


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_permission_id_0cd325b0_uniq UNIQUE (group_id, permission_id);


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_group
    ADD CONSTRAINT auth_group_pkey PRIMARY KEY (id);


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_codename_01ab375a_uniq UNIQUE (content_type_id, codename);


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_pkey PRIMARY KEY (id);


--
-- Name: auth_user_groups auth_user_groups_user_id_group_id_94350c0c_uniq; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_group_id_94350c0c_uniq UNIQUE (user_id, group_id);


--
-- Name: auth_user auth_user_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_pkey PRIMARY KEY (id);


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_permission_id_14a6b632_uniq; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_permission_id_14a6b632_uniq UNIQUE (user_id, permission_id);


--
-- Name: auth_user auth_user_username_key; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user
    ADD CONSTRAINT auth_user_username_key UNIQUE (username);


--
-- Name: cmdb_asset cmdb_asset_hostname_host_ip_410f93b9_uniq; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_asset
    ADD CONSTRAINT cmdb_asset_hostname_host_ip_410f93b9_uniq UNIQUE (hostname, host_ip);


--
-- Name: cmdb_asset cmdb_asset_hostname_key; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_asset
    ADD CONSTRAINT cmdb_asset_hostname_key UNIQUE (hostname);


--
-- Name: cmdb_asset cmdb_asset_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_asset
    ADD CONSTRAINT cmdb_asset_pkey PRIMARY KEY (id);


--
-- Name: cmdb_cabinet cmdb_cabinet_name_key; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_cabinet
    ADD CONSTRAINT cmdb_cabinet_name_key UNIQUE (name);


--
-- Name: cmdb_cabinet cmdb_cabinet_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_cabinet
    ADD CONSTRAINT cmdb_cabinet_pkey PRIMARY KEY (id);


--
-- Name: cmdb_cdn cmdb_cdn_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_cdn
    ADD CONSTRAINT cmdb_cdn_pkey PRIMARY KEY (id);


--
-- Name: cmdb_dbinstance cmdb_dbinstance_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_dbinstance
    ADD CONSTRAINT cmdb_dbinstance_pkey PRIMARY KEY (id);


--
-- Name: cmdb_hardware cmdb_hardware_ip_key; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_hardware
    ADD CONSTRAINT cmdb_hardware_ip_key UNIQUE (ip);


--
-- Name: cmdb_hardware cmdb_hardware_model_key; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_hardware
    ADD CONSTRAINT cmdb_hardware_model_key UNIQUE (model);


--
-- Name: cmdb_hardware cmdb_hardware_sn_key; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_hardware
    ADD CONSTRAINT cmdb_hardware_sn_key UNIQUE (sn);


--
-- Name: cmdb_hardware cmdb_host_hostname_key; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_hardware
    ADD CONSTRAINT cmdb_host_hostname_key UNIQUE (hostname);


--
-- Name: cmdb_hardware cmdb_host_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_hardware
    ADD CONSTRAINT cmdb_host_pkey PRIMARY KEY (id);


--
-- Name: cmdb_mysqlextra cmdb_mysqlextra_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_mysqlextra
    ADD CONSTRAINT cmdb_mysqlextra_pkey PRIMARY KEY (id);


--
-- Name: cmdb_tag cmdb_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_tag
    ADD CONSTRAINT cmdb_tag_pkey PRIMARY KEY (id);


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_pkey PRIMARY KEY (id);


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_app_label_model_76bd3d3b_uniq UNIQUE (app_label, model);


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_content_type
    ADD CONSTRAINT django_content_type_pkey PRIMARY KEY (id);


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_migrations
    ADD CONSTRAINT django_migrations_pkey PRIMARY KEY (id);


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_session
    ADD CONSTRAINT django_session_pkey PRIMARY KEY (session_key);


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_group_name_a6ea08ec_like ON public.auth_group USING btree (name varchar_pattern_ops);


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_group_permissions_group_id_b120cbf9 ON public.auth_group_permissions USING btree (group_id);


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_group_permissions_permission_id_84c5c92e ON public.auth_group_permissions USING btree (permission_id);


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_permission_content_type_id_2f476e4b ON public.auth_permission USING btree (content_type_id);


--
-- Name: auth_user_groups_group_id_97559544; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_user_groups_group_id_97559544 ON public.auth_user_groups USING btree (group_id);


--
-- Name: auth_user_groups_user_id_6a12ed8b; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_user_groups_user_id_6a12ed8b ON public.auth_user_groups USING btree (user_id);


--
-- Name: auth_user_user_permissions_permission_id_1fbb5f2c; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_user_user_permissions_permission_id_1fbb5f2c ON public.auth_user_user_permissions USING btree (permission_id);


--
-- Name: auth_user_user_permissions_user_id_a95ead1b; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_user_user_permissions_user_id_a95ead1b ON public.auth_user_user_permissions USING btree (user_id);


--
-- Name: auth_user_username_6821ab7c_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX auth_user_username_6821ab7c_like ON public.auth_user USING btree (username varchar_pattern_ops);


--
-- Name: cmdb_asset_hosted_id_120156a0; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_asset_hosted_id_120156a0 ON public.cmdb_asset USING btree (hosted_id);


--
-- Name: cmdb_asset_hostname_88c50414_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_asset_hostname_88c50414_like ON public.cmdb_asset USING btree (hostname varchar_pattern_ops);


--
-- Name: cmdb_asset_tags_id_c7032992; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_asset_tags_id_c7032992 ON public.cmdb_asset USING btree (tags_id);


--
-- Name: cmdb_cabinet_name_b1ceb636_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_cabinet_name_b1ceb636_like ON public.cmdb_cabinet USING btree (name varchar_pattern_ops);


--
-- Name: cmdb_hardware_ip_2b676230_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_hardware_ip_2b676230_like ON public.cmdb_hardware USING btree (ip varchar_pattern_ops);


--
-- Name: cmdb_hardware_model_67d120e9_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_hardware_model_67d120e9_like ON public.cmdb_hardware USING btree (model varchar_pattern_ops);


--
-- Name: cmdb_hardware_sn_4de09f79_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_hardware_sn_4de09f79_like ON public.cmdb_hardware USING btree (sn varchar_pattern_ops);


--
-- Name: cmdb_host_cabinet_id_5040e8c2; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_host_cabinet_id_5040e8c2 ON public.cmdb_hardware USING btree (cabinet_id);


--
-- Name: cmdb_host_hostname_cb8dddf3_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_host_hostname_cb8dddf3_like ON public.cmdb_hardware USING btree (hostname varchar_pattern_ops);


--
-- Name: cmdb_mysqlextra_instance_id_682f25cb; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX cmdb_mysqlextra_instance_id_682f25cb ON public.cmdb_mysqlextra USING btree (instance_id);


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX django_admin_log_content_type_id_c4bce8eb ON public.django_admin_log USING btree (content_type_id);


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX django_admin_log_user_id_c564eba6 ON public.django_admin_log USING btree (user_id);


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX django_session_expire_date_a5c62663 ON public.django_session USING btree (expire_date);


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: colinops
--

CREATE INDEX django_session_session_key_c0390e0f_like ON public.django_session USING btree (session_key varchar_pattern_ops);


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissio_permission_id_84c5c92e_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_group_permissions
    ADD CONSTRAINT auth_group_permissions_group_id_b120cbf9_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_permission
    ADD CONSTRAINT auth_permission_content_type_id_2f476e4b_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_group_id_97559544_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_group_id_97559544_fk_auth_group_id FOREIGN KEY (group_id) REFERENCES public.auth_group(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_groups auth_user_groups_user_id_6a12ed8b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_groups
    ADD CONSTRAINT auth_user_groups_user_id_6a12ed8b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm FOREIGN KEY (permission_id) REFERENCES public.auth_permission(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_user_user_permissions auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.auth_user_user_permissions
    ADD CONSTRAINT auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: cmdb_asset cmdb_asset_hosted_id_120156a0_fk_cmdb_hardware_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_asset
    ADD CONSTRAINT cmdb_asset_hosted_id_120156a0_fk_cmdb_hardware_id FOREIGN KEY (hosted_id) REFERENCES public.cmdb_hardware(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: cmdb_asset cmdb_asset_tags_id_c7032992_fk_cmdb_tag_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_asset
    ADD CONSTRAINT cmdb_asset_tags_id_c7032992_fk_cmdb_tag_id FOREIGN KEY (tags_id) REFERENCES public.cmdb_tag(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: cmdb_hardware cmdb_host_cabinet_id_5040e8c2_fk_cmdb_cabinet_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_hardware
    ADD CONSTRAINT cmdb_host_cabinet_id_5040e8c2_fk_cmdb_cabinet_id FOREIGN KEY (cabinet_id) REFERENCES public.cmdb_cabinet(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: cmdb_mysqlextra cmdb_mysqlextra_instance_id_682f25cb_fk_cmdb_dbinstance_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.cmdb_mysqlextra
    ADD CONSTRAINT cmdb_mysqlextra_instance_id_682f25cb_fk_cmdb_dbinstance_id FOREIGN KEY (instance_id) REFERENCES public.cmdb_dbinstance(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_content_type_id_c4bce8eb_fk_django_co FOREIGN KEY (content_type_id) REFERENCES public.django_content_type(id) DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_auth_user_id; Type: FK CONSTRAINT; Schema: public; Owner: colinops
--

ALTER TABLE ONLY public.django_admin_log
    ADD CONSTRAINT django_admin_log_user_id_c564eba6_fk_auth_user_id FOREIGN KEY (user_id) REFERENCES public.auth_user(id) DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

