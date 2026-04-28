# Documentacion del API del Proyecto

## 1) Introduccion

Este documento describe el API del proyecto `bar-draft`.  
El objetivo es explicar, de forma simple y formal, como funciona cada endpoint, que datos recibe, que devuelve y que errores puede presentar.

Actualmente el proyecto utiliza dos servidores para el API:

- Servidor principal con **Hono** en el puerto `3000`.
- Servidor de **WatchParty** con **Express** en el puerto `3001`.

En desarrollo, el frontend usa Vite y un proxy para enviar las peticiones a esos puertos.

---

## 2) Arquitectura general del API

### 2.1 Servidor principal (Hono)
- Base URL local: `http://localhost:3000`
- Endpoints:
  - `POST /api/checkout`
  - `GET /api/usuarios`
  - `POST /api/chat`

### 2.2 Servidor WatchParty (Express)
- Base URL local: `http://localhost:3001`
- Endpoints:
  - `GET /api/watchparty/live-match`
  - `GET /api/watchparty/predictions`

### 2.3 Proxy desde Vite (Frontend)
Cuando se ejecuta el proyecto con `npm run dev` en la raiz:

- `/api/checkout` se redirige a `http://localhost:3000`
- `/api/watchparty/*` se redirige a `http://localhost:3001`

Esto permite hacer llamadas desde el frontend sin escribir el host completo.

---

## 3) Requisitos y variables de entorno

El backend carga variables desde el archivo `.env` ubicado en la raiz del proyecto.

### 3.1 Variables para pagos (Stripe)
- `STRIPE_SECRET_KEY`: clave secreta de Stripe.
- `STRIPE_PREMIUM_PRICE_ID`: ID del precio mensual de la membresia.

Si faltan estas variables, el endpoint de checkout responde que Stripe no esta configurado.

### 3.2 Variables para futbol en vivo (API-Football)
- `API_FOOTBALL_KEY`: API key para consultar partidos y predicciones.

Si falta esta variable o falla la API externa, se usa informacion dummy local.

### 3.3 Variables para chat y base de datos
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `OLLAMA_BASE_URL` (opcional, por defecto `http://localhost:11434/v1`)
- `OLLAMA_MODEL` (opcional, por defecto `qwen2.5:7b`)

---

## 4) Convenciones de respuesta

No existe un formato unico global para todos los endpoints, pero en general:

- Exito: se devuelve JSON con datos utiles para el frontend.
- Error controlado: se devuelve JSON con `message` o `error`.
- En algunos endpoints, si falla un servicio externo, se devuelve **fallback dummy** en lugar de error.

---

## 5) Endpoints del servidor principal (Hono)

## 5.1 POST `/api/checkout`

### Descripcion
Procesa el pago de la membresia premium con Stripe y crea una suscripcion.

### Request
- Metodo: `POST`
- Content-Type: `application/json`
- Body:

```json
{
  "id": "pm_xxxxx",
  "email": "usuario@correo.com",
  "name": "Nombre Usuario"
}
```

Campos obligatorios:
- `id`: ID del metodo de pago generado por Stripe.
- `email`: correo del cliente.

Campo opcional:
- `name`: nombre del titular.

### Respuesta exitosa
- Codigo: `200 OK`

```json
{
  "message": "ok",
  "subscriptionId": "sub_xxxxx"
}
```

### Errores comunes
- `503`: Stripe no configurado (faltan variables de entorno).
- `400`: cuerpo invalido, datos faltantes o error esperado de Stripe.
- `500`: error interno no esperado del servidor.

### Notas tecnicas
- Crea primero un `customer` en Stripe.
- Luego crea la `subscription` usando `STRIPE_PREMIUM_PRICE_ID`.
- Si no se obtiene `subscriptionId`, responde error.

---

## 5.2 GET `/api/usuarios`

### Descripcion
Obtiene usuarios de la tabla `usuarios` en Supabase.  
Actualmente devuelve un limite fijo de 3 registros en la llamada principal.

### Request
- Metodo: `GET`
- Parametros: no recibe parametros por URL.

### Respuesta exitosa
- Codigo: `200 OK`

```json
{
  "usuarios": [
    {
      "id": 1,
      "nombre": "..."
    }
  ]
}
```

### Error
- `500`: si falla la consulta en Supabase.

```json
{
  "error": "detalle del error"
}
```

---

## 5.3 POST `/api/chat`

### Descripcion
Recibe historial de mensajes, invoca el modelo de IA y permite que el modelo use herramientas para consultar datos en Supabase.

### Request
- Metodo: `POST`
- Content-Type: `application/json`
- Body esperado:

```json
{
  "messages": [
    { "role": "user", "content": "Hola" }
  ]
}
```

### Respuesta exitosa
- Codigo: `200 OK`
- Tipo de respuesta: **streaming de texto** (no JSON tradicional).

### Error
- `500`: si hay error al preparar el stream o al leer la peticion.

```json
{
  "error": "detalle del error"
}
```

### Nota
Este endpoint esta orientado a una interfaz de chat, por eso devuelve datos por partes (chunks).

---

## 6) Endpoints del servidor WatchParty (Express)

## 6.1 GET `/api/watchparty/live-match`

### Descripcion
Obtiene el partido en vivo actual desde API-Football.

### Comportamiento
- Si existe `API_FOOTBALL_KEY`, consulta `fixtures?live=all`.
- Si la API externa falla, no hay partidos o hay error interno, devuelve un archivo dummy local.

### Respuesta
- Codigo: normalmente `200 OK` (incluso en fallback).
- JSON con objeto de partido en vivo (estructura variable segun API-Football o dummy).

---

## 6.2 GET `/api/watchparty/predictions`

### Descripcion
Obtiene predicciones del partido en vivo y devuelve un formato simplificado para la interfaz.

### Flujo interno
1. Busca partido en vivo (`fixtures?live=all`) para obtener `fixtureId`.
2. Consulta odds (`odds?fixture=...`) como paso adicional.
3. Consulta predicciones (`predictions?fixture=...`).
4. Construye una lista con tres elementos clave:
   - Equipo con mas probabilidad
   - Marcador estimado
   - Probabilidad de empate

### Respuesta exitosa
- Codigo: `200 OK`

```json
{
  "fixtureId": 123456,
  "predictions": [
    { "label": "Equipo con mas probabilidad", "value": "Barcelona (58%)" },
    { "label": "Marcador estimado", "value": "Barcelona: 2 | Rival: 1" },
    { "label": "Probabilidad de empate", "value": "24%" }
  ]
}
```

### Fallback
Si falta API key, falla API-Football o no existe fixture en vivo, devuelve datos dummy locales con la misma idea general.

---

## 7) Manejo de errores y fallback

### 7.1 Errores de servicios externos
- Stripe: se responde con mensaje del error cuando es posible.
- API-Football: en lugar de romper la funcionalidad, se usan archivos dummy.

### 7.2 Errores de configuracion
- Si faltan variables clave, los endpoints de pago o DB no pueden operar correctamente.
- Es importante validar `.env` antes de probar compras o chat.

### 7.3 Recomendacion de depuracion
Para revisar fallos:
- Ver consola del servidor principal (`3000`) para checkout/chat/usuarios.
- Ver consola del servidor watchparty (`3001`) para live-match/predictions.

---

## 8) Ejemplos rapidos de prueba (manual)

### 8.1 Probar usuarios
```bash
curl http://localhost:3000/api/usuarios
```

### 8.2 Probar checkout
```bash
curl -X POST http://localhost:3000/api/checkout \
  -H "Content-Type: application/json" \
  -d '{"id":"pm_test","email":"test@correo.com","name":"Usuario Test"}'
```

### 8.3 Probar partido en vivo
```bash
curl http://localhost:3001/api/watchparty/live-match
```

### 8.4 Probar predicciones
```bash
curl http://localhost:3001/api/watchparty/predictions
```

---

## 9) Conclusiones

El API del proyecto esta dividido en dos servicios para separar responsabilidades:
- pagos/chat/usuarios en el servidor principal;
- datos de watchparty en un servidor especializado.

Tambien se implemento una estrategia practica de fallback para que la aplicacion siga funcionando cuando hay fallas en servicios externos.  
Como mejora futura, se recomienda unificar el formato de errores y agregar autenticacion formal en rutas sensibles.

