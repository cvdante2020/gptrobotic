import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';



function generarCodigoRef(longitud = 6) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < longitud; i++) {
    codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
  }
  return codigo;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Método no permitido' });

  const { nombre, email } = req.body;

  if (!nombre || !email) return res.status(400).json({ message: 'Faltan campos' });

  let codigo_ref = generarCodigoRef();

  // Verificar si el código ya existe (por colisión rara)
  let intento = 0;
  while (intento < 5) {
    const { data: existe } = await supabase
      .from('vendedores')
      .select('id')
      .eq('codigo_ref', codigo_ref)
      .single();

    if (!existe) break;
    codigo_ref = generarCodigoRef();
    intento++;
  }

  const { error } = await supabase.from('vendedores').insert([
    { nombre, email, codigo_ref }
  ]);

  if (error) return res.status(500).json({ message: 'Error al registrar vendedor' });

  return res.status(200).json({ codigo_ref });
}
