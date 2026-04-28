import { useState } from "react";
import {
  friend_send_request,
  friend_accept_request,
  friend_remove,
}  from "../../lib/DummyAPI"

//enviar solicitud
export function useSendFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendRequest = async ( user_id: string, friend_id: string) => {
    try {
      setLoading(true);
      setError(null);
      await friend_send_request(user_id, friend_id);
    } catch (err: any) {
      setError(err.message || "Error sending request");
    } finally {
      setLoading(false);
    }
  };

  return { sendRequest, loading, error };
}

//aceptar solicitud
export function useAcceptFriendRequest() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptRequest = async (user_id: string, friend_id: string) => {
    try {
      setLoading(true);
      setError(null);
      await friend_accept_request(user_id, friend_id);
    } catch (err: any) {
      setError(err.message || "Error accepting request");
    } finally {
      setLoading(false);
    }
  };

  return { acceptRequest, loading, error };
}

//eliminar amigo
export function useRemoveFriend() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeFriend = async (user_id: string, friend_id: string) => {
    try {
      setLoading(true);
      setError(null);
      await friend_remove(user_id, friend_id);
    } catch (err: any) {
      setError(err.message || "Error removing friend");
    } finally {
      setLoading(false);
    }
  };

  return { removeFriend, loading, error };
}