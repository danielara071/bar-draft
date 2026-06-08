# Més Que Un Club

Plataforma digital para la comunidad global del FC Barcelona, diseñada para fortalecer el fan engagement mediante experiencias interactivas, contenido personalizado y herramientas de participación tanto para seguidores del equipo masculino como del femenino.

---

## Tabla de Contenidos

1. [Descripción](#descripción)
2. [Requisitos Previos](#requisitos-previos)
3. [Configuración de Supabase](#configuración-de-supabase)
4. [Configuración de Google Auth](#configuración-de-google-auth)
5. [Configuración de Stripe](#configuración-de-stripe)
6. [Configuración de API-Football](#configuración-de-api-football)
7. [Instalación del Proyecto](#instalación-del-proyecto)
8. [Variables de Entorno](#variables-de-entorno)
9. [Esquema de Base de Datos](#esquema-de-base-de-datos)
10. [Storage Buckets](#storage-buckets)
11. [Edge Functions](#edge-functions)
12. [Cron Jobs](#cron-jobs)
13. [Ejecución Local](#ejecución-local)
14. [Despliegue en Vercel](#despliegue-en-vercel)
15. [Equipo de Desarrollo](#equipo-de-desarrollo)

---

## Descripción

Més Que Un Club es una aplicación web enfocada en acercar a los aficionados del FC Barcelona a su club mediante una experiencia digital moderna e interactiva.

La plataforma integra funcionalidades como:

- Watch Parties para partidos en vivo
- Predicciones deportivas con sistema de puntos
- Wordle diario temático del Barcelona
- Rifas y sorteos con monedas virtuales
- Sistema de trofeos y logros coleccionables
- Chat inteligente impulsado por IA
- Sistema de membresías premium con Stripe
- Noticias del club actualizadas automáticamente
- Estadísticas de jugadores varonil y femenil
- Agenda de partidos en tiempo real
- Gestión de usuarios con roles (user, admin, repartidor)

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado lo siguiente en tu máquina:

- [Node.js 18+](https://nodejs.org/)
- [npm 9+](https://www.npmjs.com/)
- Una cuenta de [Supabase](https://supabase.com/) (gratuita)
- Una cuenta de [Stripe](https://stripe.com/)
- Una cuenta en [API-Football](https://www.api-football.com/)
- Una cuenta de [Google Cloud](https://console.cloud.google.com/) (para autenticación con Google)
- Una API Key de [NewsAPI](https://newsapi.org/) (para noticias automáticas)

Para verificar que Node.js y npm están instalados correctamente, ejecuta:

```bash
node -v
npm -v
```

---

## Configuración de Supabase

Supabase es el backend principal de la aplicación. Sigue estos pasos para crear y configurar tu propio proyecto.

### 1. Crear una cuenta en Supabase

1. Ve a [https://supabase.com](https://supabase.com) y haz clic en **Start your project**.
2. Regístrate con tu correo electrónico o con tu cuenta de GitHub.

### 2. Crear un nuevo proyecto

1. En el dashboard, haz clic en **New Project**.
2. Completa los campos:
   - **Name**: `mes-que-un-club` (o el nombre que prefieras)
   - **Database Password**: elige una contraseña segura y guárdala
   - **Region**: selecciona la región más cercana a tus usuarios
3. Haz clic en **Create new project** y espera a que termine de configurarse.

### 3. Obtener las credenciales

1. Ve a **Project Settings → API**.
2. Copia los siguientes valores:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`

> ADVERTENCIA: Nunca expongas la `service_role` key en el frontend. Solo usa la `anon` key en el cliente.

### 4. Habilitar extensiones necesarias

Ve a **Database → Extensions** y activa las siguientes:

- **pg_cron** — para los cron jobs automáticos
- **pg_net** — para que los cron jobs puedan hacer llamadas HTTP a las Edge Functions

---

## Configuración de Google Auth

### Parte 1: Google Cloud Console

1. Ve a [https://console.cloud.google.com](https://console.cloud.google.com) e inicia sesión.
2. Crea un nuevo proyecto y selecciónalo.
3. Ve a **APIs & Services → OAuth consent screen**.
   - Selecciona **External** y haz clic en **Create**.
   - Completa **App name**, **User support email** y **Developer contact information**.
4. Ve a **APIs & Services → Credentials → Create Credentials → OAuth 2.0 Client IDs**.
5. Selecciona **Web application**.
6. En **Authorized redirect URIs**, agrega:
```
https://<TU_PROJECT_REF>.supabase.co/auth/v1/callback
```
7. Haz clic en **Create** y copia el **Client ID** y **Client Secret**.

### Parte 2: Activar en Supabase

1. En Supabase, ve a **Authentication → Providers → Google**.
2. Activa el toggle y pega el **Client ID** y **Client Secret**.
3. Haz clic en **Save**.

### Parte 3: Configurar redirect URLs

1. Ve a **Authentication → URL Configuration**.
2. En **Site URL** agrega: `http://localhost:5173`
3. En **Redirect URLs** agrega:
   - `http://localhost:5173`
   - `https://tu-dominio-en-vercel.vercel.app`
4. Haz clic en **Save**.

> ADVERTENCIA: Sin este paso, el login con Google fallará silenciosamente después del callback.

---

## Configuración de Stripe

### 1. Crear cuenta y obtener claves

1. Ve a [https://stripe.com](https://stripe.com) y regístrate.
2. En el dashboard, ve a **Developers → API keys**.
3. Copia la **Secret key** (comienza con `sk_test_`) → `STRIPE_SECRET_KEY`.

### 2. Crear el precio de membresía premium

1. Ve a **Products → Add product**.
2. Nombre: `Membresía Premium`, elige precio recurrente mensual.
3. Guarda y copia el **Price ID** (comienza con `price_`) → `STRIPE_PREMIUM_PRICE_ID`.

---

## Configuración de API-Football

1. Ve a [https://www.api-football.com](https://www.api-football.com) y regístrate.
2. En tu perfil, copia tu **API Key** → `API_FOOTBALL_KEY`.

---

## Instalación del Proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/danielara071/bar-draft.git
cd bar-draft
```

### 2. Instalar dependencias

```bash
npm install
```

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```env
# Supabase
VITE_SUPABASE_URL=https://<TU_PROJECT_REF>.supabase.co
VITE_SUPABASE_ANON_KEY=<TU_ANON_KEY>

# Chat IA
VITE_API_KEY=<TU_API_KEY_DE_IA>
OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen2.5:7b

# Stripe
STRIPE_SECRET_KEY=sk_test_<TU_SECRET_KEY>
STRIPE_PREMIUM_PRICE_ID=price_<TU_PRICE_ID>

# API-Football
API_FOOTBALL_KEY=<TU_API_FOOTBALL_KEY>
```

> ADVERTENCIA: El archivo `.env` está en `.gitignore`. Nunca lo subas a un repositorio público.

---

## Esquema de Base de Datos

El repositorio incluye el archivo `supabase/schema.sql` con toda la estructura de la base de datos: tablas, tipos, funciones, triggers y políticas RLS.

### Aplicar el esquema con la CLI

Instala la CLI de Supabase si no la tienes:

```bash
npm install -g supabase
```

Inicia sesión y vincula el proyecto:

```bash
supabase login
supabase link --project-ref <TU_PROJECT_REF>
```

El `project-ref` aparece en la URL del dashboard:

```
https://supabase.com/dashboard/project/<TU_PROJECT_REF>
```

Crea una migración a partir del archivo incluido en el repositorio:

```bash
supabase migration new initial_schema
```

Esto genera un archivo en `supabase/migrations/`. Copia el contenido de `supabase/schema.sql` dentro de esa migración y luego aplícala:

```bash
supabase db push
```

Para verificar que la migración se puede aplicar sin errores antes de ejecutarla:

```bash
supabase db push --dry-run
```

Si la base de datos de destino ya tiene tablas, extensiones o políticas con los mismos nombres, Postgres puede marcar errores por objetos duplicados. En ese caso usa una instancia nueva o adapta el SQL antes de ejecutarlo.

### Tablas incluidas en el esquema

| Tabla | Descripción |
|---|---|
| `profiles` | Perfil extendido de cada usuario, vinculado a `auth.users` |
| `categories` | Categorías de productos de la tienda |
| `products` | Catálogo de productos con soporte para membresía premium |
| `purchases` | Historial de compras de usuarios |
| `cartera` | Billetera virtual por usuario |
| `transacciones` | Registro de movimientos de la cartera |
| `fixtures` | Partidos del FC Barcelona (varonil y femenil) |
| `matches_schedule` | Agenda de próximos partidos |
| `live_match_cache` | Caché del partido en vivo, actualizado cada 2 minutos |
| `predicciones` | Predicciones de resultado por usuario y partido |
| `usuarios_predicciones` | Relación entre usuarios y sus predicciones |
| `barcelona_varonil_jugadores` | Plantilla del equipo masculino |
| `barcelona_femenil_jugadores` | Plantilla del equipo femenino |
| `estadisticas_mes_varonil` | Estadísticas mensuales de jugadores varonil |
| `estadisticas_mes_femenil` | Estadísticas mensuales de jugadoras femenil |
| `palmares_barcelona_unificado` | Palmarés histórico de ambos equipos |
| `laliga_jugadores` | Jugadores de LaLiga para predicciones |
| `watch_parties` | Salas de Watch Party creadas por usuarios |
| `wordle_words` | Banco de palabras para el Wordle diario |
| `wordle_sessions` | Sesiones de juego del Wordle por usuario y fecha |
| `logros` | Catálogo de logros disponibles |
| `logros_obtenidos_usuarios` | Logros desbloqueados por cada usuario |
| `tipo_trofeo` | Tipos de trofeo (Liga, Copa, etc.) |
| `trofeos` | Trofeos del club con modelo 3D |
| `ubicacion_trofeo` | Coordenadas geográficas de cada trofeo |
| `usuarios_trofeos` | Trofeos desbloqueados por cada usuario |
| `rifas` | Sorteos disponibles con costo en monedas |
| `rifa_boletos` | Boletos adquiridos por usuarios |
| `rifa_ganadores` | Registro de ganadores de rifas |
| `news_articles` | Artículos de noticias obtenidos automáticamente |
| `selected_articles` | Artículos seleccionados por el administrador |
| `friendships` | Relaciones de amistad entre usuarios |
| `videos` | Feed de videos del club |
| `user_video_actions` | Likes y vistas de videos por usuario |
| `reportes` | Reportes de conducta en Watch Parties |
| `error_reports` | Reportes de errores enviados por usuarios |

---

## Storage Buckets

La aplicación usa los siguientes buckets en **Storage**. Créalos desde **Storage → New bucket** en el dashboard de Supabase.

| Bucket | Acceso | Uso |
|---|---|---|
| `profile-pictures` | Público | Fotos de perfil de usuarios |
| `videos` | Público | Videos del feed |
| `thumbnails` | Público | Miniaturas de videos |
| `productos` | Público | Imágenes de productos de la tienda |
| `trofeos_bucket` | Público | Archivos 3D de trofeos (.glb/.gltf) |
| `trofeos_png` | Público | Imágenes PNG de trofeos |
| `error-screenshots` | Público | Capturas de pantalla de reportes de error |
| `video_rifas` | Público | Videos de revelación de ganadores de rifas |
| `cat` | Público | Imágenes de categorías |
| `icons` | Público | Íconos de la app |
| `jugadores` | Privado | Fotos de jugadores varonil |
| `jugadoras` | Privado | Fotos de jugadoras femenil |
| `logros` | Privado | Imágenes de logros |
| `logo` | Privado | Logo del club |

---

## Edge Functions

Las Edge Functions se despliegan por separado desde el repositorio. Primero instala y vincula la CLI:

```bash
npm install -g supabase
supabase login
supabase link --project-ref <TU_PROJECT_REF>
```

### Configurar secretos

Antes de desplegar, configura los secretos que usan las funciones:

```bash
supabase secrets set NEWS_API_KEY=tu_newsapi_key
supabase secrets set API_FOOTBALL_KEY=tu_api_football_key
supabase secrets set STRIPE_SECRET_KEY=tu_stripe_secret_key
supabase secrets set STRIPE_PREMIUM_PRICE_ID=price_xxxxxxx
```

Supabase inyecta automáticamente `SUPABASE_URL` y `SUPABASE_ANON_KEY`. Si alguna función necesita privilegios administrativos, agrega también:

```bash
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

Puedes encontrar la `service_role` key en **Project Settings → API**.

> ADVERTENCIA: La `service_role` key puede saltarse las políticas RLS. Nunca la expongas en el frontend.

Verifica los secretos cargados con:

```bash
supabase secrets list
```

### Desplegar las funciones

```bash
supabase functions deploy fetch-news
supabase functions deploy create-subscription
supabase functions deploy barca-matches --no-verify-jwt
supabase functions deploy fetch_live_match --no-verify-jwt
supabase functions deploy update-schedule
supabase functions deploy llamar_scrapper
```

> `barca-matches` y `fetch_live_match` se despliegan con `--no-verify-jwt` porque son invocadas directamente por los cron jobs de `pg_cron` sin un JWT de usuario.

### Descripción de las funciones

| Función | JWT requerido | Descripción |
|---|---|---|
| `fetch-news` | Sí | Consulta NewsAPI y guarda artículos nuevos en `news_articles`. Se ejecuta diariamente por cron. |
| `create-subscription` | Sí | Crea una suscripción de membresía premium en Stripe y actualiza el perfil del usuario. |
| `barca-matches` | No | Sincroniza los fixtures del FC Barcelona desde API-Football hacia la tabla `fixtures`. |
| `fetch_live_match` | No | Consulta el partido en vivo actual y actualiza la tabla `live_match_cache`. |
| `update-schedule` | Sí | Actualiza la tabla `matches_schedule` con los próximos partidos. |
| `llamar_scrapper` | Sí | Invoca el scraper externo para obtener datos de partidos del equipo femenil. |

---

## Cron Jobs

El proyecto usa `pg_cron` para automatizar tareas periódicas. Una vez que hayas habilitado las extensiones `pg_cron` y `pg_net`, ejecuta los siguientes scripts en el **SQL Editor** de tu proyecto para recrear los jobs.

> ADVERTENCIA: Reemplaza `<TU_SERVICE_ROLE_KEY>` con tu propia `service_role` key y `<TU_PROJECT_REF>` con el ID de tu proyecto en cada comando.

### Noticias: fetch diario y limpieza

```sql
-- Obtener nuevas noticias cada día a medianoche
SELECT cron.schedule(
  'fetch news',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://<TU_PROJECT_REF>.supabase.co/functions/v1/fetch-news',
    headers := jsonb_build_object(
      'Authorization', 'Bearer <TU_SERVICE_ROLE_KEY>',
      'Content-Type', 'application/json'
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 1000
  );
  $$
);

-- Eliminar noticias con más de 5 días de antigüedad
SELECT cron.schedule(
  'delete-news',
  '0 0 * * *',
  $$DELETE FROM news_articles WHERE pub_date < now() - interval '5 days';$$
);
```

### Wordle: rotación de palabra diaria

```sql
SELECT cron.schedule(
  'select_word',
  '0 0 * * *',
  $$
  UPDATE public.wordle_words
  SET used_on = current_date
  WHERE word = (
    SELECT word FROM public.wordle_words
    WHERE used_on = (NOW() AT TIME ZONE 'America/Mexico_City')::date
    LIMIT 1
  );
  $$
);
```

### Partido en vivo: actualización cada 2 minutos

```sql
SELECT cron.schedule(
  'fetch_current_match',
  '*/2 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://<TU_PROJECT_REF>.supabase.co/functions/v1/fetch_live_match',
    headers := '{}'::jsonb,
    timeout_milliseconds := 1000
  );
  $$
);
```

### Fixtures: sincronización cada 12 horas

```sql
SELECT cron.schedule(
  'sync-barca-fixtures',
  '0 */12 * * *',
  $$
  SELECT net.http_post(
    url := 'https://<TU_PROJECT_REF>.supabase.co/functions/v1/barca-matches/sync',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <TU_SERVICE_ROLE_KEY>'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

### Agenda de partidos: actualización diaria

```sql
SELECT cron.schedule(
  'update-schedule-daily',
  '0 0 * * *',
  $$
  SELECT net.http_post(
    url := 'https://<TU_PROJECT_REF>.supabase.co/functions/v1/update-schedule',
    headers := jsonb_build_object(
      'Authorization', 'Bearer <TU_ANON_KEY>'
    )::jsonb,
    timeout_milliseconds := 1000
  );
  $$
);
```

### Scraper de partidos femenil: cada 12 horas

```sql
SELECT cron.schedule(
  'sync-fixtures-every-12h',
  '0 */12 * * *',
  $$
  SELECT net.http_post(
    url := 'https://<TU_PROJECT_REF>.supabase.co/functions/v1/llamar_scrapper',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer <TU_SERVICE_ROLE_KEY>'
    ),
    body := '{}'::jsonb
  );
  $$
);
```

### Limpieza de banneos expirados: cada minuto

```sql
SELECT cron.schedule(
  'limpiar-banneos-expirados',
  '* * * * *',
  $$
  UPDATE public.profiles
  SET banned_until = NULL
  WHERE banned_until IS NOT NULL AND banned_until <= NOW();
  $$
);
```

### Resumen de cron jobs

| Job | Frecuencia | Qué hace |
|---|---|---|
| `fetch news` | Diario (00:00) | Obtiene noticias nuevas del Barcelona desde NewsAPI |
| `delete-news` | Diario (00:00) | Elimina noticias con más de 5 días |
| `select_word` | Diario (00:00) | Rota la palabra del Wordle |
| `update-schedule-daily` | Diario (00:00) | Actualiza agenda de próximos partidos |
| `sync-barca-fixtures` | Cada 12h | Sincroniza fixtures desde API-Football |
| `sync-fixtures-every-12h` | Cada 12h | Ejecuta el scraper del equipo femenil |
| `fetch_current_match` | Cada 2 min | Actualiza caché del partido en vivo |
| `limpiar-banneos-expirados` | Cada minuto | Levanta banneos temporales expirados |

---

## Ejecución Local

### Frontend

```bash
npm run dev
```

La aplicación estará disponible en:

```
http://localhost:5173
```

### Backend Principal

```bash
npm run server
```

Disponible en:

```
http://localhost:3000
```

---

## Construcción para Producción

```bash
npm run build
```

Los archivos serán generados en `dist/`. Para previsualizar antes de desplegar:

```bash
npm run preview
```

---

## Despliegue en Vercel

### 1. Preparar el repositorio

```bash
git add .
git commit -m "Preparar despliegue"
git push origin main
```

### 2. Crear proyecto en Vercel

1. Ve a [https://vercel.com](https://vercel.com) e inicia sesión con GitHub.
2. Haz clic en **Add New Project** e importa el repositorio `bar-draft`.

### 3. Configuración de build

| Campo | Valor |
|---|---|
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm install` |

### 4. Variables de entorno

En **Settings → Environment Variables**, agrega todas las variables de tu `.env`:

| Variable | Descripción |
|---|---|
| `VITE_SUPABASE_URL` | URL de tu proyecto de Supabase |
| `VITE_SUPABASE_ANON_KEY` | Anon key de Supabase |
| `VITE_API_KEY` | API Key del chat de IA |
| `API_FOOTBALL_KEY` | API Key de API-Football |
| `STRIPE_SECRET_KEY` | Secret Key de Stripe |
| `STRIPE_PREMIUM_PRICE_ID` | Price ID de la membresía premium |
| `OLLAMA_BASE_URL` | URL base del servidor Ollama |
| `OLLAMA_MODEL` | Modelo de Ollama a utilizar |

### 5. Desplegar

Haz clic en **Deploy** y espera a que termine la compilación. Vercel generará una URL pública automáticamente.

> ADVERTENCIA: Después del primer despliegue, recuerda agregar la URL de Vercel en **Supabase → Authentication → URL Configuration → Redirect URLs**, de lo contrario el login con Google no funcionará en producción.

### 6. Despliegues automáticos

Cada push a `main` genera un nuevo despliegue automáticamente:

```bash
git add .
git commit -m "Nueva funcionalidad"
git push origin main
```

---

## Equipo de Desarrollo

Proyecto desarrollado por **Jela'an**.
