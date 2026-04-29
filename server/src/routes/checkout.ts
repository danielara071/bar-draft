import type { Hono } from 'hono'
import Stripe from 'stripe'

export function registerCheckoutRoutes(app: Hono) {
  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID

  if (!secretKey || !priceId) {
    console.warn(
      '[checkout] Definir STRIPE_SECRET_KEY y STRIPE_PREMIUM_PRICE_ID en la raíz del repo (.env)',
    )
  }

  const stripe = secretKey ? new Stripe(secretKey) : null

  app.post('/api/checkout', async (c) => {
    if (!stripe || !priceId) {
      return c.json(
        { message: 'Stripe no está configurado en el servidor (variables de entorno).' },
        503,
      )
    }

    let body: { id?: string; email?: string; name?: string }
    try {
      body = await c.req.json()
    } catch {
      return c.json({ message: 'Cuerpo de la petición inválido.' }, 400)
    }

    const { id: paymentMethodId, email, name } = body

    try {
      if (!paymentMethodId || !email) {
        return c.json(
          {
            message: 'Faltan datos: se requiere el método de pago y el correo.',
          },
          400,
        )
      }

      const customer = await stripe.customers.create({
        email,
        name: name || undefined,
        payment_method: paymentMethodId,
        invoice_settings: { default_payment_method: paymentMethodId },
      })

      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        default_payment_method: paymentMethodId,
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
      })

      const subId = subscription?.id
      if (!subId) {
        return c.json({ message: 'No se pudo crear la suscripción.' }, 500)
      }

      return c.json({
        message: 'ok',
        subscriptionId: subId,
      })
    } catch (error: unknown) {
      console.error('Stripe checkout:', error)
      const stripeLikeError =
        typeof error === 'object' && error !== null
          ? (error as { message?: unknown; type?: unknown })
          : null

      const msg =
        typeof stripeLikeError?.message === 'string' && stripeLikeError.message.trim()
          ? stripeLikeError.message
          : error instanceof Error && error.message
            ? error.message
            : 'Error al crear la suscripción en Stripe'

      // Si Stripe reporta errores esperados (tarjeta, validación, etc.), responde 400.
      const isStripeExpectedError =
        typeof stripeLikeError?.type === 'string' &&
        (stripeLikeError.type.startsWith('Stripe') || stripeLikeError.type.endsWith('Error'))

      return c.json({ message: msg }, isStripeExpectedError ? 400 : 500)
    }
  })
}
