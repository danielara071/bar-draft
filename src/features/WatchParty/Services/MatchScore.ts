export const fetchBarcelonaMatch = async (demo = false) => {
  const url = demo
    ? "/watchparty-api/api/barcelona-live?demo=true"
    : "/watchparty-api/api/barcelona-live";

  const res = await fetch(url);
  const data = await res.json();

  return data;
};