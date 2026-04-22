export type Usuario = {
  id: string;
  nombre_usuario: string;
  url_avatar: string;
  nivel : number;
  experiencia : number;
  usuario_premium : boolean;
  logro : string;
  logros : number;
  predicciones : number;
  pais : string;
};
export type Logro = {
  logro_id: number;
  nombre: string;
  descripcion: string;
  url_image: string;
  desbloqueado: boolean;
  user_id: string;
};


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAPIKey =import.meta.env.VITE_SUPABASE_APIKEY


async function handleResponse<T>(response: Response, defaultMessage: string): Promise<T> {
  if (!response.ok) {
    console.log("Error response from DummyAPI: ", response);
    throw new Error(defaultMessage);
  }

  return response.json() as Promise<T>;
}

export async function fetchUsuarioByName(user_id: string): Promise<Usuario[]> {
  console.log(user_id, "   NOMBRE DEL USUARIO")
  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/get_user_with_logro`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAPIKey,
      },
      body: JSON.stringify({ "user_id": user_id })
    }
  );

  return handleResponse<Usuario[]>(response, "No se pudo cargar el usuario");
}


export async function fetchUsuarioLogros(id: string): Promise<Logro[]> {
  console.log(supabaseUrl, "FROm fetchUsuarioByName but apikey ", supabaseAPIKey);
  
  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/get_user_logros`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAPIKey,
      },
      body: JSON.stringify({ "p_id": id }),
    }
  );

  const data = await handleResponse<Logro[]>(response, "No se pudo cargar los logros del usuario");

  // agregamos el user id con el que fue llamado el endpoint
  for (let i = 0; i < data.length; i++) {
    (data[i] as any).user_id = id;
  }

  return data;
}
export async function updateUsuarioLogro(user_id: string, nuevo_logro: number): Promise<void> {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/rpc/update_logro`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAPIKey,
      },
      body: JSON.stringify(    {
    user_id: user_id,
    nuevo_logro: nuevo_logro
    })
    }
  );
  console.log("Response from updateUsuarioLogro: ", response);
  return handleResponse<void>(response, "");
}