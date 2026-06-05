# Més Que Un Club

Plataforma digital para la comunidad global del FC Barcelona, diseñada para fortalecer el fan engagement mediante experiencias interactivas, contenido personalizado y herramientas de participación tanto para seguidores del equipo masculino como del femenino.

## Descripción

Més Que Un Club es una aplicación web enfocada en acercar a los aficionados del FC Barcelona a su club mediante una experiencia digital moderna e interactiva.

La plataforma integra funcionalidades como:

* Watch Parties para partidos en vivo.
* Predicciones deportivas.
* Chat inteligente impulsado por IA.
* Sistema de membresías premium.
* Integración con estadísticas y datos futbolísticos.
* Gestión de usuarios mediante Supabase.

## Requisitos Previos

Antes de ejecutar el proyecto debes tener instalado:

* Node.js 18+
* npm 9+
* Cuenta de Supabase
* Cuenta de Stripe
* API Key de API-Football

Verificar instalación:

```bash
node -v
npm -v
```

## Instalación

### 1. Clonar repositorio

```bash
git clone https://github.com/danielara071/bar-draft.git
cd bar-draft
```

### 2. Instalar dependencias

```bash
npm install
```

## Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto.

### Supabase

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

### Chat IA

```env
VITE_API_KEY=

OLLAMA_BASE_URL=http://localhost:11434/v1
OLLAMA_MODEL=qwen2.5:7b
```

### Stripe

```env
STRIPE_SECRET_KEY=
STRIPE_PREMIUM_PRICE_ID=
```

### API-Football

```env
API_FOOTBALL_KEY=
```

## Ejecución Local

### Frontend

```bash
npm run dev
```

La aplicación estará disponible en:

```text
http://localhost:5173
```

### Backend Principal

```bash
npm run server
```

Disponible en:

```text
http://localhost:3000
```

## Construcción para Producción

Generar build optimizado:

```bash
npm run build
```

Los archivos serán generados en:

```text
dist/
```

## Vista Previa de Producción

```bash
npm run preview
```

## Despliegue en Vercel

La aplicación puede desplegarse fácilmente utilizando Vercel gracias a su integración automática con GitHub.

### 1. Preparar el repositorio

Asegúrate de que todos los cambios estén sincronizados con GitHub:

```bash
git add .
git commit -m "Preparar despliegue"
git push origin main
```

### 2. Crear un proyecto en Vercel

1. Ingresa a https://vercel.com
2. Inicia sesión con tu cuenta de GitHub.
3. Haz clic en **Add New Project**.
4. Importa el repositorio `bar-draft`.
5. Vercel detectará automáticamente que se trata de una aplicación desarrollada con Vite.

### 3. Configurar el proyecto

Utiliza la siguiente configuración:

```text
Framework Preset: Vite

Build Command:
npm run build

Output Directory:
dist

Install Command:
npm install
```

### 4. Configurar Variables de Entorno

En **Settings → Environment Variables**, agrega las variables necesarias para la aplicación:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=

VITE_API_KEY=

API_FOOTBALL_KEY=

STRIPE_SECRET_KEY=
STRIPE_PREMIUM_PRICE_ID=

OLLAMA_BASE_URL=
OLLAMA_MODEL=
```

### 5. Realizar el despliegue

1. Haz clic en **Deploy**.
2. Espera a que finalice el proceso de compilación.
3. Vercel generará automáticamente una URL pública para acceder a la aplicación.

### 6. Despliegues automáticos

Una vez conectado el repositorio, cada cambio enviado a la rama principal generará automáticamente un nuevo despliegue:

```bash
git add .
git commit -m "Nueva funcionalidad"
git push origin main
```

Vercel ejecutará automáticamente:

```bash
npm install
npm run build
```

y publicará la nueva versión de la aplicación.

## Equipo de Desarrollo

Proyecto desarrollado por Jela'an.

