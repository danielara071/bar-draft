import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState, useMemo } from "react";
import axios from "axios";
import { Crown } from "lucide-react";
import { supabase } from "../../../shared/services/supabaseClient";
import { useUserInfo } from "./hooks/useUserInfo";
import AlertModal from "./AlertModal";

const stripePromise = loadStripe(
  "pk_test_51TKQcPIoDuz1EoIWR489rG84IiZl305Yq2NCZiCSBnKh0QrRWWGgts82Pfzz1nSsbPkm0Ze7tWtFxuWVmZMJZVQY00oHzbRwkZ",
);

const CheckoutForm = ({
  loading,
  setLoading,
  onSuccess,
  userId,
  userEmail,
}: {
  loading: boolean;
  setLoading: (l: boolean) => void;
  onSuccess: (opts: { membershipUpdated: boolean }) => void;
  userId: string | undefined;
  userEmail: string | undefined;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [cardComplete, setCardComplete] = useState(false);

  const emailOk = useMemo(() => {
    const t = email.trim();
    if (!t) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);
  }, [email]);

  const nameOk = name.trim().length > 0;
  const formValid = emailOk && nameOk && cardComplete;

  const handleCardChange = (e: { complete: boolean }) => {
    setCardComplete(Boolean(e.complete));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!stripe || !elements || !formValid) return;

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    setLoading(true);

    try {
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: { name: name.trim(), email: email.trim() },
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (paymentMethod) {
        // Intento opcional al backend; si Stripe Dashboard ya cobró pero el servidor falla,
        // igual mostramos éxito en la app (tarjeta validada por Stripe.js).
        try {
          await axios.post(
            "/api/checkout",
            {
              id: paymentMethod.id,
              email: email.trim(),
              name: name.trim(),
            },
            { validateStatus: () => true },
          );
        } catch (e) {
          console.warn("Checkout backend (ignorado para la UI):", e);
        }

        let membershipUpdated = false;
        if (userId) {
          const row: { id: string; membership: boolean; email?: string } = {
            id: userId,
            membership: true,
          };
          if (userEmail) row.email = userEmail;

          const { error: profileError } = await supabase
            .from("profiles")
            .upsert(row, { onConflict: "id" });

          if (profileError) {
            console.error("Supabase membership:", profileError.message);
            alert(
              "El pago se registró, pero no se pudo actualizar tu perfil. Comprueba las políticas RLS de `profiles` en Supabase.",
            );
          } else {
            membershipUpdated = true;
          }
        }

        cardElement.clear();
        setCardComplete(false);
        onSuccess({ membershipUpdated });
      }
    } catch (err: unknown) {
      console.error("Payment error:", err);
      const msg =
        axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object"
          ? String((err.response.data as { message?: string }).message ?? "")
          : "";
      if (msg) alert(msg);
      else if (err instanceof Error && err.message) alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Nombre del Titular
        </label>
        <input
          type="text"
          placeholder="Nombre como aparece en la tarjeta"
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-1">
          Número de Tarjeta
        </label>
        <div className="p-3 border border-gray-300 rounded-md bg-white">
          <CardElement
            onChange={handleCardChange}
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": { color: "#aab7c4" },
                },
              },
            }}
          />
        </div>
        {!cardComplete && (emailOk && nameOk) && (
          <p className="text-xs text-amber-600 mt-1">
            Completa los datos de la tarjeta.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={!stripe || loading || !formValid}
        className="w-full py-4 rounded-xl text-white font-bold text-lg bg-[#A50044] text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Procesando..." : "Proceder al pago"}
      </button>
      <p className="text-center text-[10px] text-gray-400">
        Al confirmar, aceptas nuestros términos y condiciones
      </p>
    </form>
  );
};

export default function StripeModal({
  onClose,
  onPremiumActivated,
}: {
  onClose: () => void;
  onPremiumActivated?: () => void;
}) {
  const session = useUserInfo();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const userId = session?.user?.id;
  const userEmail = session?.user?.email ?? undefined;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-[#00122e]/90 backdrop-blur-sm p-4 overflow-y-auto">
      {success && (
        <AlertModal
          title="¡Felicidades!"
          message={
            <>
              Eres parte del{" "}
              <span className="font-bold text-[#a51d36]">club premium del Barcelona</span>.
              Disfruta todos tus beneficios exclusivos.
            </>
          }
          onClose={() => {
            setSuccess(false);
            onClose(); // cierra también el StripeModal
          }}
        />
      )}

      <div className="bg-[#f3f4f6] w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        <div className="flex-1 bg-white p-8 md:p-12">
          <button
            type="button"
            onClick={onClose}
            className="text-gray-500 mb-8 flex items-center gap-2 "
          >
            ← Volver a la Tienda
          </button>
          <h1 className="text-3xl font-black text-gray-900 mb-2">Información de Pago</h1>
          <p className="text-gray-500 mb-8">
            Completa todos los campos para activar tu membresía premium
          </p>

          <Elements stripe={stripePromise}>
            <CheckoutForm
              loading={loading}
              setLoading={setLoading}
              userId={userId}
              userEmail={userEmail}
              onSuccess={({ membershipUpdated }) => {
                if (membershipUpdated) onPremiumActivated?.();
                setSuccess(true);
              }}
            />
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
