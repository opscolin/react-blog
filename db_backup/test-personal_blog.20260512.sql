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
-- Name: article_tags; Type: TABLE; Schema: public; Owner: bloguser
--

CREATE TABLE public.article_tags (
    article_id integer NOT NULL,
    tag_id integer NOT NULL
);


ALTER TABLE public.article_tags OWNER TO bloguser;

--
-- Name: articles; Type: TABLE; Schema: public; Owner: bloguser
--

CREATE TABLE public.articles (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    excerpt text,
    category_id integer,
    status text DEFAULT 'draft'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT articles_status_check CHECK ((status = ANY (ARRAY['draft'::text, 'published'::text])))
);


ALTER TABLE public.articles OWNER TO bloguser;

--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: bloguser
--

CREATE SEQUENCE public.articles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_id_seq OWNER TO bloguser;

--
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bloguser
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- Name: categories; Type: TABLE; Schema: public; Owner: bloguser
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name text NOT NULL,
    slug text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_banner boolean DEFAULT false,
    cover text
);


ALTER TABLE public.categories OWNER TO bloguser;

--
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: bloguser
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO bloguser;

--
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bloguser
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- Name: quotes; Type: TABLE; Schema: public; Owner: bloguser
--

CREATE TABLE public.quotes (
    id integer NOT NULL,
    content text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.quotes OWNER TO bloguser;

--
-- Name: quotes_id_seq; Type: SEQUENCE; Schema: public; Owner: bloguser
--

CREATE SEQUENCE public.quotes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.quotes_id_seq OWNER TO bloguser;

--
-- Name: quotes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bloguser
--

ALTER SEQUENCE public.quotes_id_seq OWNED BY public.quotes.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: bloguser
--

CREATE TABLE public.settings (
    key text NOT NULL,
    value text NOT NULL
);


ALTER TABLE public.settings OWNER TO bloguser;

--
-- Name: tags; Type: TABLE; Schema: public; Owner: bloguser
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tags OWNER TO bloguser;

--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: bloguser
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tags_id_seq OWNER TO bloguser;

--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bloguser
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: bloguser
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO bloguser;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: bloguser
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO bloguser;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bloguser
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- Name: quotes id; Type: DEFAULT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.quotes ALTER COLUMN id SET DEFAULT nextval('public.quotes_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: article_tags; Type: TABLE DATA; Schema: public; Owner: bloguser
--

COPY public.article_tags (article_id, tag_id) FROM stdin;
1	1
1	2
1	3
\.


--
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: bloguser
--

COPY public.articles (id, title, slug, content, excerpt, category_id, status, created_at, updated_at) FROM stdin;
1	OpenCode接入DeepSeek V4的三种方法实现AI编程	opencodedeepseek-v4ai	## 前言\n\nDeepSeek V4终于迎来了发布，在2026年4月24，普通的周五，DeepSeek V4悄悄的发布了。没有发布会，只有一篇官方公众号，里面是满满的技术干活。\n\n感兴趣的可以阅读  https://mp.weixin.qq.com/s/8bxXqS2R8Fx5-1TLDBiEDg\n\n## 配置步骤\n\n### 第一步：获取 DeepSeek API Key\n\n1. 登录 DeepSeek 开放平台：[https://platform.deepseek.com/](https://platform.deepseek.com/api_keys)\n2. 进入「API Key」管理页面\n3. 创建新的 API Key\n4. 记下 Key 值（`只显示一次，记得保存`）\n\n### 第二步：配置 OpenCode\n\n有三种配置方式，注意配置的时候选在base URL的格式\n\n+ OpenAI 格式 https://api.deepseek.com\n+ Anthropic 格式  https://api.deepseek.com/anthropic\n\n\n## OpenCode配置API Key的三种方案\n\n### 方式一、手动编辑\n\n找到 OpenCode 的配置文件\n\n```bash\n# 编辑配置文件\nvim ~/.config/opencode/opencode.json\n```\n\n添加 DeepSeek 相关配置：\n\n```json\n{\n  "providers": {\n    "deepseek": {\n      "npm": "@ai-sdk/anthropic",\n      "options": {\n        "baseURL": "https://api.deepseek.com/anthropic",\n        "apiKey": "sk-xxxxx"\n      },\n      "models": {\n        "deepseek-v4-flash": {\n          "name": "deepseek-v4-flash"\n        },\n        "deepseek-v4-pro": {\n          "name": "deepseek-v4-pro"\n        }\n      }\n    }\n  }\n}\n```\n\n### 方式二、基于命令行引导配置\n\n1. 执行 `opencode auth login` 或者是 先输入 opencode 回车进行交互模式之后，输入 `/connect` 效果一样\n2. 出现 `Select provider` 时选择 `DeepSeek`\n3.  出现`Enter your API key` 时 输入 API Key\n\n注意  `opencode` + `/connect` 的方式，会多一个选在 Variant \n\n![](https://cdn.jsdelivr.net/gh/opscolin/obsidian-images@main/obsidian/2026/0426143521-20260426143521614.webp)\n\n> [!important] \n> opencode的特性，本质是设置模型的**推理/思考强度**\n\n![](https://cdn.jsdelivr.net/gh/opscolin/obsidian-images@main/obsidian/2026/0426145436-20260426145436559.webp)\n\n\n### 方式三、基于命令行配置的auth配置文件\n\n说白了就是方式二，配置之后的落地配置文件，可以通过直接修改这个配置文件\n\n+ Mac/Linux  `~/.local/share/opencode/auth.json`\n+ Windows `%USERPROFILE%\\.local\\share\\opencode\\auth.json`\n\n具体配置格式如下\n\n```json\n{\n  "deepseek": {\n    "type": "api",\n    "key": "sk-xxxxxxx"\n  }\n}\n```\n\n\n### 验证配置\n\n在终端中执行：\n\n```bash\n# 检查 opencode 版本\nopencode --version\n\n# 查看可用的 provider\nopencode providers list\n\n# 查看 DeepSeek 提供的模型\nopencode models\n```\n\n然后输入 `opencode` 回车进入交互模式，使用 `/models` 选择 `deepseek-v4-flash` 或者 `deepseek-v4-pro` 模型。\n\n\n关于 flash和pro的区别详见 https://api-docs.deepseek.com/zh-cn/quick_start/pricing\n\n\n---\n\n## 实际使用效果\n\n配置完成后，在终端中测试：\n\n```bash\nopencode run "使用Python帮我写一个快速排序算法"\n```\n\n### 测试结果\n\n```bash\n> build · deepseek-v4-flash\n\n← Write bubble_sort.py\nWrote file successfully.\n\n已生成 `bubble_sort.py`，包含带提前退出优化的冒泡排序。\n\n```python\ndef bubble_sort(arr):\n    n = len(arr)\n    for i in range(n):\n        swapped = False\n        for j in range(0, n - i - 1):\n            if arr[j] > arr[j + 1]:\n                arr[j], arr[j + 1] = arr[j + 1], arr[j]\n                swapped = True\n        if not swapped:\n            break\n    return arr\n```\n\n运行：\n\n```bash\npython3 bubble_sort.py\n```\n\n刚做测试的费用\n![](https://cdn.jsdelivr.net/gh/opscolin/obsidian-images@main/obsidian/2026/0426151447-20260426151447758.webp)\n\n实际花费金额是0.02元，相对国外大模型价格实在是太优惠了\n\n\n---\n\n## 总结\n\nDeepSeek V4 是一款非常值得尝试的模型，配合 OpenCode 可以实现高效的 AI 编程。相比 V3，V4 在各方面都有明显提升，值得升级。\n\n后续将陆续分享基于 OpenCode 进行 AI 编程开发好玩好用的小工具、小网站系列教程，感兴趣的记得关注我哦~\n\n---\n\n## 相关文章\n\n+ [OpenCode 配置 MiniMax Token Plan 实现 AI 编程](https://mp.weixin.qq.com/s/JcixHXVN_GbxcTqhCUHktQ)\n+ [Qwen Code OAuth无免费额度之后如何切换模型的详细教程](https://mp.weixin.qq.com/s/k-lV4mIpgO134uJ9juYVjA)\n+ [扩展 Qwen-code 的能力跳出命令行操作模式](https://mp.weixin.qq.com/s/3QcVagaPFP6TXzyV3ynE3g)\n+ [利用 Qwen-Code 工具和本地目录构建个人知识库](https://mp.weixin.qq.com/s/Rx8iEAEB9-JMfgcjJ4J4RQ)\n+ [DeepSeek API 文档](https://api-docs.deepseek.com/zh-cn/quick_start/pricing/)	\N	1	published	2026-04-28 01:29:58.85	2026-04-28 09:29:58.9891
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: bloguser
--

COPY public.categories (id, name, slug, created_at, is_banner, cover) FROM stdin;
1	OpenCode知识库	opencode	2026-04-28 09:29:34.441133	f	\N
2	AI专区	ai	2026-05-04 18:21:19.200924	f	\N
3	TiDB数据库	tidb	2026-05-04 18:24:21.723042	f	\N
4	MySQL数据库	mysql	2026-05-04 18:24:29.941303	f	\N
5	Redis缓存	redis	2026-05-04 18:24:34.512246	f	\N
6	K8S容器化	k8s	2026-05-04 18:24:43.127252	f	\N
8	产品	55CG5a2m	2026-05-04 18:28:40.074125	f	\N
9	运维	6JCl6JCl	2026-05-04 19:35:19.332752	f	\N
10	Python博客教程	python	2026-05-04 19:44:51.854959	f	\N
11	测试机管理系统	5rWL6K-V5py6566h55CG57O757uf	2026-05-04 19:46:00.642663	f	\N
12	Python DRF博客教程	python-drf	2026-05-04 19:49:45.65201	f	\N
13	OpenCode知识库	opencode-knowledge	2026-05-04 21:06:46.777209	t	/images/banner-test.png
\.


--
-- Data for Name: quotes; Type: TABLE DATA; Schema: public; Owner: bloguser
--

COPY public.quotes (id, content, created_at) FROM stdin;
1	人生若只如初见，何事秋风悲画扇。	2026-05-04 18:10:34.876012
2	山重水复疑无路，柳暗花明又一村。	2026-05-04 18:10:34.876012
3	不以物喜，不以己悲。	2026-05-04 18:10:34.876012
4	路漫漫其修远兮，吾将上下而求索。	2026-05-04 18:10:34.876012
5	长风破浪会有时，直挂云帆济沧海。	2026-05-04 18:10:34.876012
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: bloguser
--

COPY public.settings (key, value) FROM stdin;
blogTitle	菩提墨
blogLogo	/images/blog-icon.jpeg
paginationSize	10
aboutContent	## 只要还在学习，就永远年轻\n\n--- \n\n## 我是谁\n\n你好，我拥有近15年互联网运维与开发经验，目前担任运维总监。我擅长运维规划、架构设计及SRE体系建设，精通MySQL、TiDB、Redis、MongoDB等数据库的维护与调优，致力于保障系统的高效稳定运行。\n\n同时，我也是一名活跃的个人开发者，可承接小程序、运维管理系统、公司官网等项目的全栈开发与维护工作。技术栈覆盖前后端，注重交付质量与落地实效。期待与您合作，共同解决技术挑战。\n\n## 开源项目\n\n个人博客 [https://github.com/opscolin/react-blog](https://github.com/opscolin/react-blog)\n\n\n## 推进中的项目\n\n- [x] Glimmer 小程序 - 微光，微习惯养成\n- [ ] CardyImage - 基于Markdown格式书写生成固定格式的图片，用于发布微信公众号贴图、小红书等\n- [ ] SnapShrink - 在线批量图片压缩和打水印工具\n\n## 测试表格\n\n|列名称1|列名称2|明恒3|\n|:---| :---: |---:|\n|James|Harry|Betty|\n\n\n## 测试图片 \n\n![](https://cdn.jsdelivr.net/gh/opscolin/obsidian-images@main/obsidian/2026/0509172922-20260509172922609.webp)\n\n## 测试列表\n\n+ Apple\n+ Banana\n+ Cat\n\n--- \n\n* Apple\n* Fruits\n  * Orange\n  * Peach\n* Vegetables\n\n--- \n\n1. hello\n2. world\n3. languages\n    1. Python\n    2. Golang\n    3. PHP\n4. MyLover\n\n## 测试代码块\n\n写个Python脚本\n```python\nprint("hello world")\n```\n\n写个go程序\n\n```go\nfmt.Println("hello golang")\n```\n\n写个JSON\n\n```json\n{\n    "name": "James"\n}\n```
enable_quote_cache	false
menuVisibility	{"categories":true,"tags":true,"archives":true,"about":true}
enable_banner_carousel	true
navigation_menus	{"首页":{"path":"/","visible":true},"文章":{"path":null,"visible":true,"children":[{"name":"归档","path":"/archive"},{"name":"分类","path":"/category"},{"name":"标签","path":"/tag"}]},"产品":{"path":null,"visible":true,"children":[{"name":"微光","path":"/products/weiguang"},{"name":"树年","path":"/products/shunian"}]},"我的":{"path":"/mine","visible":true},"友链":{"path":"/links","visible":true},"关于":{"path":"/about","visible":true}}
\.


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: bloguser
--

COPY public.tags (id, name, created_at) FROM stdin;
1	deepseek	2026-04-28 09:29:46.783913
2	deepseek-v4	2026-04-28 09:29:52.980673
3	opencode	2026-04-28 09:29:57.465398
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: bloguser
--

COPY public.users (id, username, password_hash, created_at) FROM stdin;
1	admin	$2b$12$B5qtqXQT6rGzSfJs4BB.keMi7MKi7s3A4tPMmbHNtBeU1sl7OCZlq	2026-04-27 23:01:26.016467
\.


--
-- Name: articles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bloguser
--

SELECT pg_catalog.setval('public.articles_id_seq', 1, true);


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bloguser
--

SELECT pg_catalog.setval('public.categories_id_seq', 13, true);


--
-- Name: quotes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bloguser
--

SELECT pg_catalog.setval('public.quotes_id_seq', 5, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bloguser
--

SELECT pg_catalog.setval('public.tags_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bloguser
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: article_tags article_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.article_tags
    ADD CONSTRAINT article_tags_pkey PRIMARY KEY (article_id, tag_id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_slug_key; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_slug_key UNIQUE (slug);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: categories categories_slug_key; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_slug_key UNIQUE (slug);


--
-- Name: quotes quotes_pkey; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.quotes
    ADD CONSTRAINT quotes_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (key);


--
-- Name: tags tags_name_key; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_name_key UNIQUE (name);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: idx_article_tags_article; Type: INDEX; Schema: public; Owner: bloguser
--

CREATE INDEX idx_article_tags_article ON public.article_tags USING btree (article_id);


--
-- Name: idx_article_tags_tag; Type: INDEX; Schema: public; Owner: bloguser
--

CREATE INDEX idx_article_tags_tag ON public.article_tags USING btree (tag_id);


--
-- Name: idx_articles_category; Type: INDEX; Schema: public; Owner: bloguser
--

CREATE INDEX idx_articles_category ON public.articles USING btree (category_id);


--
-- Name: idx_articles_created; Type: INDEX; Schema: public; Owner: bloguser
--

CREATE INDEX idx_articles_created ON public.articles USING btree (created_at);


--
-- Name: idx_articles_slug; Type: INDEX; Schema: public; Owner: bloguser
--

CREATE INDEX idx_articles_slug ON public.articles USING btree (slug);


--
-- Name: idx_articles_status; Type: INDEX; Schema: public; Owner: bloguser
--

CREATE INDEX idx_articles_status ON public.articles USING btree (status);


--
-- Name: idx_categories_slug; Type: INDEX; Schema: public; Owner: bloguser
--

CREATE INDEX idx_categories_slug ON public.categories USING btree (slug);


--
-- Name: idx_tags_name; Type: INDEX; Schema: public; Owner: bloguser
--

CREATE INDEX idx_tags_name ON public.tags USING btree (name);


--
-- Name: article_tags article_tags_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.article_tags
    ADD CONSTRAINT article_tags_article_id_fkey FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;


--
-- Name: article_tags article_tags_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.article_tags
    ADD CONSTRAINT article_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.tags(id) ON DELETE CASCADE;


--
-- Name: articles articles_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: bloguser
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id);


--
-- PostgreSQL database dump complete
--

