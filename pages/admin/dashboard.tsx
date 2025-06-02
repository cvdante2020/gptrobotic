// pages/vendedor/dashboard/[codigo_ref].tsx
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../../lib/supabaseClient'

export default function DashboardVendedor() {
  const router = useRouter()
  const [leads, setLeads] = useState<any[]>([])
  const [vendedor, setVendedor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [codigoRef, setCodigoRef] = useState<string>('')

  useEffect(() => {
    if (!router.isReady) return

    const codigo = router.query.codigo_ref
    const ref = typeof codigo === 'string' ? codigo : ''

    if (!ref) return

    setCodigoRef(ref)

    const fetchData = async () => {
      // Buscar vendedor
      const { data: vendedorData } = await supabase
        .from('vendedores')
        .select('*')
        .eq('codigo_referido', ref)
        .maybeSingle()

      setVendedor(vendedorData)

      // Buscar leads
      const { data: leadsData } = await supabase
        .from('leads')
        .select('*')
        .eq('codigo_ref', ref)
        .order('fecha_ingreso', { ascending: false })

      setLeads(leadsData || [])
      setLoading(false)
    }

    fetchData()
  }, [router.isReady, router.query.codigo_ref])

  if (loading) return <p className="text-center mt-10">Cargando dashboard...</p>

  return (
    <div className="max-w-5xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Dashboard de {vendedor?.nombre}</h1>

      <div className="mb-6 text-gray-700">
        <p><strong>Código de referido:</strong> {codigoRef}</p>
        <p><strong>Total de leads:</strong> {leads.length}</p>
        <p><strong>Último registro:</strong> {leads[0]?.fecha_ingreso ? new Date(leads[0].fecha_ingreso).toLocaleString() : 'N/A'}</p>
      </div>

      <table className="w-full border">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-2 border">Nombre</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Teléfono</th>
            <th className="p-2 border">Producto</th>
            <th className="p-2 border">Fecha</th>
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => (
            <tr key={lead.id} className="hover:bg-gray-50">
              <td className="p-2 border">{lead.nombre}</td>
              <td className="p-2 border">{lead.email}</td>
              <td className="p-2 border">{lead.telefono}</td>
              <td className="p-2 border">{lead.producto}</td>
              <td className="p-2 border">{new Date(lead.fecha_ingreso).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
