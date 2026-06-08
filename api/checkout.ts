import Stripe from 'stripe'

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  const secretKey = process.env.STRIPE_SECRET_KEY
  const priceId = process.env.STRIPE_PREMIUM_PRICE_ID

  if (!secretKey || !priceId) {
    return new Response(
      JSON.stringify({ message: 'Stripe no está configurado en el servidor (variables de entorno).' }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const stripe = new Stripe(secretKey)

  let body: { id?: string; email?: string; name?: string }
  try {
    body = await req.json()
  } catch {
    return new Response(
      JSON.stringify({ message: 'Cuerpo de la petición inválido.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  const { id: paymentMethodId, email, name } = body

  if (!paymentMethodId || !email) {
    return new Response(
      JSON.stringify({ message: 'Faltan datos: se requiere el método de pago y el correo.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    )
  }

  try {
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

    if (!subscription?.id) {
      return new Response(
        JSON.stringify({ message: 'No se pudo crear la suscripción.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      )
    }

    return new Response(
      JSON.stringify({ message: 'ok', subscriptionId: subscription.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } },
    )
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

    const isStripeExpectedError =
      typeof stripeLikeError?.type === 'string' &&
      (stripeLikeError.type.startsWith('Stripe') || stripeLikeError.type.endsWith('Error'))

    return new Response(JSON.stringify({ message: msg }), {
      status: isStripeExpectedError ? 400 : 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
