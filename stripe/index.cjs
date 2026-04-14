require('dotenv').config();
const express = require("express");
const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.post("/api/checkout", async (req, res) => {
  const { id, email, name } = req.body;

  try {
    if (!id || !email) {
      return res.status(400).json({
        message: "Faltan datos: se requiere el método de pago y el correo.",
      });
    }

    const customer = await stripe.customers.create({
      email,
      name,
      payment_method: id,
      invoice_settings: { default_payment_method: id },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID }],
      default_payment_method: id,
      payment_settings: {
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
    });

    const subId = subscription && subscription.id;
    if (!subId) {
      return res.status(500).json({
        message: "No se pudo crear la suscripción.",
      });
    }

    return res.status(200).json({
      message: "ok",
      subscriptionId: subId,
    });
  } catch (error) {
    console.error("Stripe error:", error);
    const msg =
      (error && error.raw && error.raw.message) ||
      (error && error.message) ||
      "Error al crear la suscripción en Stripe";
    return res.status(400).json({ message: String(msg) });
  }
});

app.listen(5174, () => console.log("Server on port 5174"));