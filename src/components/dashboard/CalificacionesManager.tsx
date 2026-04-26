'use client'

import { useState, useRef } from 'react'
import { Upload, CheckCircle, AlertCircle, Loader2, FileSpreadsheet, Download } from 'lucide-react'

interface RowResult {
  row: number
  curp: string
  status: 'ok' | 'error'
  message?: string
}

const CSV_EJEMPLO = `CURP,materia_clave,trimestre,calificacion
GOML100215MMSRNS08,ESP2,1,8.5
GOML100215MMSRNS08,MAT2,1,9.0`

export default function CalificacionesManager() {
  const [file, setFile] = useState<File | null>(null)
  const [results, setResults] = useState<RowResult[]>([])
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null
    setFile(f)
    setResults([])
    setDone(false)
  }

  async function handleUpload() {
    if (!file) return
    setLoading(true)
    setResults([])
    setDone(false)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/calificaciones/import', { method: 'POST', body: fd })
      const data = await res.json()
      setResults(data.results ?? [])
      setDone(true)
    } catch {
      setResults([{ row: 0, curp: '', status: 'error', message: 'Error de conexión.' }])
    } finally {
      setLoading(false)
    }
  }

  function downloadEjemplo() {
    const blob = new Blob([CSV_EJEMPLO], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'ejemplo_calificaciones.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const ok = results.filter(r => r.status === 'ok').length
  const errors = results.filter(r => r.status === 'error').length

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <h3 className="font-bold text-blue-800 text-sm mb-2">Formato del archivo CSV</h3>
        <p className="text-blue-700 text-sm mb-3">
          El archivo debe tener exactamente estas columnas en el encabezado:
        </p>
        <code className="block bg-white border border-blue-200 rounded-xl px-4 py-3 text-xs font-mono text-blue-900">
          CURP, materia_clave, trimestre (1/2/3), calificacion (0-10)
        </code>
        <button
          onClick={downloadEjemplo}
          className="mt-3 flex items-center gap-1.5 text-blue-700 text-xs font-semibold hover:underline"
        >
          <Download className="w-3.5 h-3.5" /> Descargar CSV de ejemplo
        </button>
      </div>

      {/* Upload area */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <label
          onClick={() => inputRef.current?.click()}
          className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-green-500 hover:bg-green-50 transition-all"
        >
          <FileSpreadsheet className="w-10 h-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 font-medium">
            {file ? file.name : 'Haz clic para seleccionar el archivo CSV'}
          </p>
          <p className="text-xs text-gray-400 mt-1">Solo archivos .csv</p>
          <input
            ref={inputRef}
            type="file"
            accept=".csv"
            onChange={handleFile}
            className="hidden"
          />
        </label>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-4 w-full bg-green-700 hover:bg-green-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
          {loading ? 'Importando...' : 'Importar Calificaciones'}
        </button>
      </div>

      {/* Results */}
      {done && (
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
            <h3 className="font-bold text-gray-800">Resultado de la importación</h3>
            <div className="flex gap-3 text-sm">
              <span className="flex items-center gap-1 text-green-700 font-semibold">
                <CheckCircle className="w-4 h-4" /> {ok} correctos
              </span>
              {errors > 0 && (
                <span className="flex items-center gap-1 text-red-600 font-semibold">
                  <AlertCircle className="w-4 h-4" /> {errors} errores
                </span>
              )}
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="text-left px-5 py-2.5 font-semibold text-gray-600">Fila</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600">CURP</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Estado</th>
                  <th className="text-left px-3 py-2.5 font-semibold text-gray-600">Mensaje</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {results.map((r, i) => (
                  <tr key={i} className={r.status === 'error' ? 'bg-red-50' : ''}>
                    <td className="px-5 py-2.5 text-gray-500">{r.row}</td>
                    <td className="px-3 py-2.5 font-mono text-xs">{r.curp}</td>
                    <td className="px-3 py-2.5">
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {r.status === 'ok' ? 'OK' : 'Error'}
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-gray-500 text-xs">{r.message ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
