-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.cartera (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  id_usuario uuid,
  balance_real numeric,
  balance_virtual numeric,
  CONSTRAINT cartera_pkey PRIMARY KEY (id),
  CONSTRAINT cartera_id_usuario_fkey FOREIGN KEY (id_usuario) REFERENCES public.profiles(id)
);
CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categories_id_seq'::regclass),
  name character varying NOT NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);
CREATE TABLE public.friendships (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  friend_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'accepted'::text, 'request'::text])),
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT friendships_pkey PRIMARY KEY (id),
  CONSTRAINT friendships_friend_id_fkey FOREIGN KEY (friend_id) REFERENCES auth.users(id),
  CONSTRAINT friendships_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.logros (
  id bigint NOT NULL,
  nombre text,
  descripcion text,
  url_image text,
  CONSTRAINT logros_pkey PRIMARY KEY (id)
);
CREATE TABLE public.logros_obtenidos_usuarios (
  id bigint NOT NULL,
  fecha_obtencion timestamp with time zone,
  logro_id bigint,
  usuario_id uuid,
  CONSTRAINT logros_obtenidos_usuarios_pkey PRIMARY KEY (id),
  CONSTRAINT logros_obtenidos_usuarios_logro_id_fkey FOREIGN KEY (logro_id) REFERENCES public.logros(id),
  CONSTRAINT logros_obtenidos_usuarios_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.news_articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  guid text NOT NULL UNIQUE,
  title text,
  link text,
  description text,
  image_url text,
  pub_date timestamp with time zone,
  fetched_at timestamp with time zone DEFAULT now(),
  CONSTRAINT news_articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.predicciones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  partido_id text,
  ganador text,
  goles_local integer,
  goles_visitante integer,
  goles_total text,
  primer_goleador text,
  resultado_medio_tiempo integer,
  user_id uuid,
  CONSTRAINT predicciones_pkey PRIMARY KEY (id),
  CONSTRAINT predicciones_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT predicciones_partido_id_fkey FOREIGN KEY (partido_id) REFERENCES public.fixtures(fixture_id)
);
CREATE TABLE public.products (
  id integer NOT NULL DEFAULT nextval('products_id_seq'::regclass),
  category_id integer NOT NULL,
  name character varying NOT NULL,
  image_url text,
  price numeric NOT NULL,
  premium boolean DEFAULT false,
  stock smallint,
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id)
);
CREATE TABLE public.profiles (
  id uuid NOT NULL,
  email text,
  membership boolean DEFAULT false,
  monedas numeric DEFAULT '0'::numeric,
  puntos bigint NOT NULL DEFAULT '0'::bigint,
  nivel smallint NOT NULL DEFAULT '0'::smallint CHECK (nivel >= 1 AND nivel <= 5),
  logro bigint,
  nombre text,
  url_avatar text,
  logros bigint NOT NULL DEFAULT '0'::bigint,
  predicciones bigint DEFAULT '0'::bigint,
  pais text DEFAULT ''::text,
  role text NOT NULL DEFAULT 'user'::text,
  is_banned boolean DEFAULT false,
  banned_until timestamp with time zone,
  insignia integer,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_logro_fkey FOREIGN KEY (logro) REFERENCES public.logros(id),
  CONSTRAINT profiles_insignia_fkey FOREIGN KEY (insignia) REFERENCES public.products(id)
);
CREATE TABLE public.purchases (
  id integer NOT NULL DEFAULT nextval('purchases_id_seq'::regclass),
  user_id uuid NOT NULL,
  product_id integer NOT NULL,
  amount numeric NOT NULL,
  CONSTRAINT purchases_pkey PRIMARY KEY (id),
  CONSTRAINT purchases_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id),
  CONSTRAINT purchases_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.transacciones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  cartera_id uuid,
  monto numeric,
  typo_transaccion text,
  fecha_transaccion timestamp with time zone,
  CONSTRAINT transacciones_pkey PRIMARY KEY (id),
  CONSTRAINT transacciones_cartera_id_fkey FOREIGN KEY (cartera_id) REFERENCES public.cartera(id)
);
CREATE TABLE public.user_video_actions (
  user_id uuid NOT NULL,
  video_id uuid NOT NULL,
  liked boolean DEFAULT false,
  created_at timestamp without time zone DEFAULT now(),
  watched boolean,
  CONSTRAINT user_video_actions_pkey PRIMARY KEY (user_id, video_id),
  CONSTRAINT user_video_actions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT user_video_actions_video_id_fkey FOREIGN KEY (video_id) REFERENCES public.videos(id)
);
CREATE TABLE public.usuarios_predicciones (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid,
  prediccion_id uuid,
  fecha_prediccion timestamp with time zone,
  CONSTRAINT usuarios_predicciones_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_predicciones_prediccion_id_fkey FOREIGN KEY (prediccion_id) REFERENCES public.predicciones(id),
  CONSTRAINT usuarios_predicciones_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.videos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  video_url text NOT NULL,
  thumbnail_url text,
  caption text,
  duration integer,
  category text,
  order_index integer,
  is_active boolean DEFAULT true,
  created_at timestamp without time zone DEFAULT now(),
  like_count integer DEFAULT 0,
  CONSTRAINT videos_pkey PRIMARY KEY (id)
);
CREATE TABLE public.watch_parties (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  name text NOT NULL,
  fixture_id text NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  match_date timestamp with time zone NOT NULL,
  privacy text NOT NULL DEFAULT 'publica'::text CHECK (privacy = ANY (ARRAY['publica'::text, 'privada'::text])),
  created_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT watch_parties_pkey PRIMARY KEY (id),
  CONSTRAINT watch_parties_created_by_fkey FOREIGN KEY (created_by) REFERENCES auth.users(id),
  CONSTRAINT watch_parties_fixture_id_fkey FOREIGN KEY (fixture_id) REFERENCES public.fixtures(fixture_id)
);
CREATE TABLE public.wordle_words (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  word text NOT NULL UNIQUE,
  used_on date UNIQUE,
  CONSTRAINT wordle_words_pkey PRIMARY KEY (id)
);
CREATE TABLE public.wordle_sessions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  date date NOT NULL,
  guesses ARRAY DEFAULT '{}'::text[],
  status text DEFAULT 'in_progress'::text,
  coins_awarded boolean DEFAULT false,
  CONSTRAINT wordle_sessions_pkey PRIMARY KEY (id),
  CONSTRAINT wordle_sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
CREATE TABLE public.barcelona_varonil_jugadores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  numero integer,
  posicion text,
  goles integer DEFAULT 0,
  asistencias integer DEFAULT 0,
  atajadas integer DEFAULT 0,
  goles_recibidos integer DEFAULT 0,
  partidos_jugados integer DEFAULT 0,
  minutos_jugados integer DEFAULT 0,
  imagen_url text,
  CONSTRAINT barcelona_varonil_jugadores_pkey PRIMARY KEY (id)
);
CREATE TABLE public.barcelona_femenil_jugadores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  numero integer,
  posicion text,
  goles integer DEFAULT 0,
  asistencias integer DEFAULT 0,
  atajadas integer DEFAULT 0,
  goles_recibidos integer DEFAULT 0,
  partidos_jugados integer DEFAULT 0,
  minutos_jugados integer DEFAULT 0,
  imagen_url text,
  CONSTRAINT barcelona_femenil_jugadores_pkey PRIMARY KEY (id)
);
CREATE TABLE public.estadisticas_mes_varonil (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  jugador_id uuid,
  mes text NOT NULL,
  año integer NOT NULL,
  goles integer DEFAULT 0,
  CONSTRAINT estadisticas_mes_varonil_pkey PRIMARY KEY (id),
  CONSTRAINT estadisticas_mes_varonil_jugador_id_fkey FOREIGN KEY (jugador_id) REFERENCES public.barcelona_varonil_jugadores(id)
);
CREATE TABLE public.estadisticas_mes_femenil (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  jugadora_id uuid,
  mes text NOT NULL,
  año integer NOT NULL,
  goles integer DEFAULT 0,
  CONSTRAINT estadisticas_mes_femenil_pkey PRIMARY KEY (id),
  CONSTRAINT estadisticas_mes_femenil_jugadora_id_fkey FOREIGN KEY (jugadora_id) REFERENCES public.barcelona_femenil_jugadores(id)
);
CREATE TABLE public.live_match_cache (
  fixture_id bigint NOT NULL,
  fixture_date timestamp with time zone NOT NULL,
  status_elapsed integer,
  venue_name text,
  venue_city text,
  league_name text,
  league_round text,
  home_team_name text,
  away_team_name text,
  goals_home integer,
  goals_away integer,
  source_payload jsonb NOT NULL,
  fetched_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT live_match_cache_pkey PRIMARY KEY (fixture_id)
);
CREATE TABLE public.palmares_barcelona_unificado (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  equipo text CHECK (equipo = ANY (ARRAY['Varonil'::text, 'Femenil'::text])),
  nombre_oficial text NOT NULL,
  nombre_agrupado text NOT NULL,
  ambito text CHECK (ambito = ANY (ARRAY['Internacional'::text, 'Nacional'::text, 'Regional'::text])),
  cantidad integer DEFAULT 0,
  CONSTRAINT palmares_barcelona_unificado_pkey PRIMARY KEY (id)
);
CREATE TABLE public.fixtures (
  fixture_id text NOT NULL,
  category text NOT NULL CHECK (category = ANY (ARRAY['varonil'::text, 'femenil'::text])),
  match_date timestamp with time zone NOT NULL,
  home_team text NOT NULL,
  away_team text NOT NULL,
  competition text,
  venue text,
  status USER-DEFINED DEFAULT 'scheduled'::match_status,
  home_goals integer DEFAULT 0,
  away_goals integer DEFAULT 0,
  total_goals integer DEFAULT 0,
  winner text,
  first_scorer text,
  halftime_result integer CHECK (halftime_result = ANY (ARRAY[1, 0, '-1'::integer])),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT fixtures_pkey PRIMARY KEY (fixture_id)
);
CREATE TABLE public.selected_articles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  title text,
  link text,
  description text,
  image_url text,
  pub_date timestamp with time zone,
  selected_at timestamp with time zone DEFAULT now(),
  CONSTRAINT selected_articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.reportes (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  denunciante_id uuid NOT NULL,
  denunciado_id uuid NOT NULL,
  watch_party_id uuid,
  motivo text NOT NULL,
  detalles text,
  estado text NOT NULL DEFAULT 'pendiente'::text,
  creado_en timestamp with time zone DEFAULT timezone('utc'::text, now()),
  resuelto_en timestamp with time zone,
  resuelto_por uuid,
  CONSTRAINT reportes_pkey PRIMARY KEY (id),
  CONSTRAINT reportes_denunciante_id_fkey FOREIGN KEY (denunciante_id) REFERENCES public.profiles(id),
  CONSTRAINT reportes_denunciado_id_fkey FOREIGN KEY (denunciado_id) REFERENCES public.profiles(id),
  CONSTRAINT reportes_watch_party_id_fkey FOREIGN KEY (watch_party_id) REFERENCES public.watch_parties(id),
  CONSTRAINT reportes_resuelto_por_fkey FOREIGN KEY (resuelto_por) REFERENCES public.profiles(id)
);
CREATE TABLE public.trofeos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  file_url text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  tipo_trofeo bigint,
  CONSTRAINT trofeos_pkey PRIMARY KEY (id),
  CONSTRAINT trofeos_tipo_trofeo_fkey FOREIGN KEY (tipo_trofeo) REFERENCES public.tipo_trofeo(id)
);
CREATE TABLE public.ubicacion_trofeo (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  trofeo_id uuid NOT NULL,
  latitud text NOT NULL,
  longitud text NOT NULL,
  nombre_lugar text,
  CONSTRAINT ubicacion_trofeo_pkey PRIMARY KEY (id),
  CONSTRAINT ubicacion_trofeo_fk FOREIGN KEY (trofeo_id) REFERENCES public.trofeos(id)
);
CREATE TABLE public.usuarios_trofeos (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  usuario_id uuid NOT NULL,
  trofeo_id uuid NOT NULL,
  fecha_obtencion timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT usuarios_trofeos_pkey PRIMARY KEY (id),
  CONSTRAINT usuarios_trofeos_user_fk FOREIGN KEY (usuario_id) REFERENCES public.profiles(id),
  CONSTRAINT usuarios_trofeos_trofeo_fk FOREIGN KEY (trofeo_id) REFERENCES public.trofeos(id)
);
CREATE TABLE public.tipo_trofeo (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  tipo_trofeo text NOT NULL,
  trofeo_url text,
  CONSTRAINT tipo_trofeo_pkey PRIMARY KEY (id)
);
CREATE TABLE public.error_reports (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamp with time zone DEFAULT now(),
  user_id uuid NOT NULL DEFAULT gen_random_uuid(),
  description text NOT NULL,
  location text NOT NULL,
  screenshot_url text,
  resolved boolean NOT NULL DEFAULT false,
  CONSTRAINT error_reports_pkey PRIMARY KEY (id),
  CONSTRAINT error_reports_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.matches_schedule (
  fixture_id bigint NOT NULL,
  team_category character varying NOT NULL,
  home_team character varying NOT NULL,
  away_team character varying NOT NULL,
  match_date timestamp with time zone NOT NULL,
  status_short character varying NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT matches_schedule_pkey PRIMARY KEY (fixture_id)
);
CREATE TABLE public.rifas (
  id integer NOT NULL DEFAULT nextval('rifas_id_seq'::regclass),
  name text NOT NULL,
  type text NOT NULL CHECK (type = ANY (ARRAY['boleto'::text, 'experiencia'::text, 'viaje'::text])),
  total_boletos integer NOT NULL DEFAULT 100,
  costo_monedas numeric NOT NULL DEFAULT 2000,
  premium boolean NOT NULL DEFAULT false,
  image_url text,
  estado text NOT NULL DEFAULT 'activa'::text CHECK (estado = ANY (ARRAY['activa'::text, 'terminada'::text])),
  fecha_cierre date,
  ganador_id uuid,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rifas_pkey PRIMARY KEY (id),
  CONSTRAINT rifas_ganador_id_fkey FOREIGN KEY (ganador_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.rifa_boletos (
  id integer NOT NULL DEFAULT nextval('rifa_boletos_id_seq'::regclass),
  rifa_id integer NOT NULL,
  user_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT rifa_boletos_pkey PRIMARY KEY (id),
  CONSTRAINT rifa_boletos_rifa_id_fkey FOREIGN KEY (rifa_id) REFERENCES public.rifas(id),
  CONSTRAINT rifa_boletos_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.rifa_ganadores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  rifa_id integer NOT NULL UNIQUE,
  ganador_id uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  video_url text,
  estado text NOT NULL DEFAULT 'pendiente'::text CHECK (estado = ANY (ARRAY['pendiente'::text, 'aceptado'::text, 'denegado'::text])),
  CONSTRAINT rifa_ganadores_pkey PRIMARY KEY (id),
  CONSTRAINT rifa_ganadores_rifa_id_fkey FOREIGN KEY (rifa_id) REFERENCES public.rifas(id),
  CONSTRAINT rifa_ganadores_ganador_id_fkey FOREIGN KEY (ganador_id) REFERENCES public.profiles(id)
);
CREATE TABLE public.laliga_jugadores (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  equipo text,
  categoria text,
  CONSTRAINT laliga_jugadores_pkey PRIMARY KEY (id)
);