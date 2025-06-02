import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../../../lib/supabaseClient'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { nombre, email, telefono, producto, codigo_ref } = body

  if (!nombre || !email || !codigo_ref) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  // Validar que el código exista
  const { data: vendedorData } = await supabase
    .from('vendedores')
    .select('id')
    .eq('codigo_referido', codigo_ref)
    .maybeSingle()

  if (!vendedorData) {
    return NextResponse.json({ error: 'Código de referido inválido' }, { status: 400 })
  }

  const fecha_ingreso = new Date().toISOString()

  const { data, error } = await supabase.from('leads').insert([
    { nombre, email, telefono, producto, codigo_ref, fecha_ingreso },
  ])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: 'Lead registrado con éxito', data })
}
