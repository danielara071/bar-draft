import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";
import axios from "axios";
// 1. Importar el icono Crown de lucide-react
import { Crown } from "lucide-react";

const stripePromise = loadStripe('tu_llave_aqui');

const CheckoutForm = ({ loading, setLoading }: { loading: boolean, setLoading: (l: boolean) => void }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: { name }
    });

    if (!error && paymentMethod) {
      try {
        await axios.post("http://localhost:5173/tienda/checkout", {
          id: paymentMethod.id,
          amount: 5000,
        });
        cardElement.clear();
      } catch (err) {
        console.error(err);
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Número de Tarjeta</label>
        <div className="p-3 border border-gray-300 rounded-md bg-white">
          <CardElement options={{
            style: {
              base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
            },
          }} />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">Nombre del Titular</label>
        <input
          type="text"
          placeholder="Nombre como aparece en la tarjeta"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <button
        disabled={!stripe || loading}
        className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all bg-gradient-to-r from-[#6b1d4b] via-[#a51d36] to-[#1a3668] hover:opacity-90 disabled:opacity-50"
      >
        {loading ? "Procesando..." : "Confirmar Pago – $50/mes"}
      </button>
      <p className="text-center text-[10px] text-gray-400">Al confirmar, aceptas nuestros términos y condiciones</p>
    </form>
  );
};

export default function StripeModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#00122e]/90 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#f3f4f6] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">

        <div className="flex-1 bg-white p-8 md:p-12">
          <button onClick={onClose} className="text-gray-500 mb-8 flex items-center gap-2 hover:text-black transition">
            ← Volver a la Tienda
          </button>
          
          <h1 className="text-3xl font-black text-gray-900 mb-2">Información de Pago</h1>
          <p className="text-gray-500 mb-8">Completa tus datos para activar tu membresía premium</p>

          <Elements stripe={stripePromise}>
            <CheckoutForm loading={loading} setLoading={setLoading} />
          </Elements>
        </div>

        <div className="w-full md:w-[400px] bg-[#1a3668] p-8 text-white flex flex-col justify-between">
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[#a51d36] to-[#6b1d4b] p-6 rounded-2xl shadow-lg border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-bold text-xl">Membresía Premium</h2>
                  <p className="text-xs opacity-80 uppercase tracking-widest">FC BARCELONA</p>
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2">✓ Acceso a rifas exclusivas</li>
                <li className="flex items-center gap-2">✓ Descuentos en tienda</li>
                <li className="flex items-center gap-2">✓ Contenido exclusivo</li>
                <li className="flex items-center gap-2">✓ Badge de socio premium</li>
              </ul>
              <div className="mt-6 pt-6 border-t border-white/20 flex justify-between items-end">
                <span className="text-sm">Precio mensual</span>
                <span className="text-3xl font-bold">$50</span>
              </div>
              <p className="text-[10px] mt-2 opacity-60">Renovación automática cada mes</p>
            </div>

            <div className="bg-white text-black p-6 rounded-2xl border border-white/5">
              <h3 className="font-bold mb-4">¿Por qué Premium?</h3>
              <ul className="text-sm space-y-3 opacity-90">
                <li className="flex gap-2">• Participa en sorteos de viajes a Barcelona</li>
                <li className="flex gap-2">• Gana boletos VIP para partidos</li>
                <li className="flex gap-2">• Tours exclusivos por el Camp Nou</li>
                <li className="flex gap-2">• Oportunidad de aparecer en el estadio</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}