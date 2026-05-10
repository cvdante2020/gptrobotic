// pages/vendedor/registro.tsx
import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/router'

export default function RegistroVendedor() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [telefono, setTelefono] = useState('')
  const [codigoReferido, setCodigoReferido] = useState('')
  const [error, setError] = useState('')
  const [successUrl, setSuccessUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccessUrl('')

    if (!nombre || !email || !telefono || !codigoReferido) {
      setError('Por favor completa todos los campos.')
      return
    }

    // Verificar si el código ya existe
    const { data: existentes, error: errorBusqueda } = await supabase
      .from('vendedores')
      .select('codigo_referido')
      .eq('codigo_referido', codigoReferido)

    if (errorBusqueda) {
      setError('Error validando el código.')
      return
    }

    if (existentes.length > 0) {
      setError('Este código ya está en uso. Elige otro.')
      return
    }

    // Insertar vendedor
    const { error: errorInsert } = await supabase.from('vendedores').insert({
      nombre,
      email,
      telefono,
      codigo_referido: codigoReferido,
      fecha_registro: new Date().toISOString(),
    })

    if (errorInsert) {
      setError('Hubo un error registrando al vendedor.')
    } else {
      setSuccessUrl(`https://gptrobotic.com/vendedor/${codigoReferido}`)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Registro de Vendedor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" placeholder="Nombre completo" className="w-full p-2 border rounded"
          value={nombre} onChange={(e) => setNombre(e.target.value)} />

        <input type="email" placeholder="Email" className="w-full p-2 border rounded"
          value={email} onChange={(e) => setEmail(e.target.value)} />

        <input type="tel" placeholder="Teléfono" className="w-full p-2 border rounded"
          value={telefono} onChange={(e) => setTelefono(e.target.value)} />

        <input type="text" placeholder="Código de referido" className="w-full p-2 border rounded uppercase"
          value={codigoReferido} onChange={(e) => setCodigoReferido(e.target.value.toUpperCase())} />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Registrarme
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {successUrl && (
        <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
          Registro exitoso. Comparte tu link:<br />
          <a href={successUrl} className="text-blue-700 underline" target="_blank" rel="noopener noreferrer">
            {successUrl}
          </a>
        </div>
      )}
    </div>
  )
}
