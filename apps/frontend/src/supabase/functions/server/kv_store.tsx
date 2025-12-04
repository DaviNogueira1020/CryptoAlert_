/* ARQUIVO AUTOGENERADO - NÃO EDITE O CONTEÚDO */

/* Esquema da tabela:
CREATE TABLE kv_store_e49cbdd6 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
*/

// Veja em https://supabase.com/dashboard/project/judxilogunkqcqflsjll/database/tables

// Este arquivo fornece uma interface simples de chave-valor para armazenar dados do Figma Make. Deve ser adequado para a maioria dos casos de uso em pequena escala.
import { createClient } from "jsr:@supabase/supabase-js@2.49.8";

const client = () => createClient(
  Deno.env.get("SUPABASE_URL"),
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
);

// Armazena um par chave-valor no banco de dados.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const set = async (key: string, value: any): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_e49cbdd6").upsert({
    key,
    value
  });
  if (error) {
    throw new Error(error.message);
  }
};

// Recupera um par chave-valor do banco de dados.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = async (key: string): Promise<any> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_e49cbdd6").select("value").eq("key", key).maybeSingle();
  if (error) {
    throw new Error(error.message);
  }
  return data?.value;
};

// Deleta um par chave-valor do banco de dados.
export const del = async (key: string): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_e49cbdd6").delete().eq("key", key);
  if (error) {
    throw new Error(error.message);
  }
};

// Armazena múltiplos pares chave-valor no banco de dados.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mset = async (keys: string[], values: any[]): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_e49cbdd6").upsert(keys.map((k, i) => ({ key: k, value: values[i] })));
  if (error) {
    throw new Error(error.message);
  }
};

// Recupera múltiplos pares chave-valor do banco de dados.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mget = async (keys: string[]): Promise<any[]> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_e49cbdd6").select("value").in("key", keys);
  if (error) {
    throw new Error(error.message);
  }
  return data?.map((d) => d.value) ?? [];
};

// Deleta múltiplos pares chave-valor do banco de dados.
export const mdel = async (keys: string[]): Promise<void> => {
  const supabase = client()
  const { error } = await supabase.from("kv_store_e49cbdd6").delete().in("key", keys);
  if (error) {
    throw new Error(error.message);
  }
};

// Pesquisa por pares chave-valor por prefixo.
export const getByPrefix = async (prefix: string): Promise<any[]> => {
  const supabase = client()
  const { data, error } = await supabase.from("kv_store_e49cbdd6").select("key, value").like("key", prefix + "%");
  if (error) {
    throw new Error(error.message);
  }
  return data?.map((d) => d.value) ?? [];
};