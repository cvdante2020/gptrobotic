import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'
import LeadForm from '@/components/LeadForm'

export default function ReferidoPage() {
  const router = useRouter()

  const [vendedor, setVendedor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [codigoRefStr, setCodigoRefStr] = useState('')

  useEffect(() => {
    if (!router.isReady) return

    const codigo_ref = router.query.codigo_ref

    const codigo = typeof codigo_ref === 'string' ? codigo_ref : ''
    if (!codigo) return

    setCodigoRefStr(codigo)

    const fetchVendedor = async () => {
      const { data, error } = await supabase
        .from('vendedores')
        .select('*')
        .eq('codigo_referido', codigo)
        .single()

      if (error || !data) {
        setNotFound(true)
      } else {
        setVendedor(data)
      }

      setLoading(false)
    }

    fetchVendedor()
  }, [router.isReady, router.query.codigo_ref])

  if (loading) return <p className="text-center mt-10">Cargando...</p>

  if (notFound) {
    return (
      <div className="text-center mt-10 text-red-600">
        <h2 className="text-xl font-bold">Código de referido no válido</h2>
        <p>Verifica que el link esté correcto.</p>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-4">¡Bienvenido!</h1>
      <p className="text-center text-gray-700 mb-6">
        Estás siendo referido por <strong>{vendedor?.nombre}</strong>
      </p>

      {codigoRefStr && <LeadForm codigoRef={codigoRefStr} />}
    </div>
  )
}
