import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const SUPABASE_URL  = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON = import.meta.env.VITE_SUPABASE_ANON_KEY

function fmt(iso) {
  if (!iso) return '–'
  return new Date(iso).toLocaleDateString('en-BH', { year: 'numeric', month: 'short', day: 'numeric' })
}

function StatPill({ icon, label, value }) {
  return (
    <div className="flex flex-col items-center px-6 py-4 bg-white rounded-2xl shadow-sm border border-gray-100 min-w-[100px]">
      <span className="material-icons-round text-[#2D5A3D] text-2xl mb-1">{icon}</span>
      <span className="text-xl font-black text-gray-900">{value}</span>
      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{label}</span>
    </div>
  )
}

export default function VerifyCV() {
  const { token } = useParams()
  const navigate  = useNavigate()
  const [state, setState] = useState('loading') // loading | valid | revoked | not_found | error
  const [record, setRecord] = useState(null)

  useEffect(() => {
    if (!token) { setState('not_found'); return }

    fetch(`${SUPABASE_URL}/functions/v1/verify-cv?token=${encodeURIComponent(token)}`, {
      headers: { apikey: SUPABASE_ANON, 'Content-Type': 'application/json' },
    })
      .then(r => r.json())
      .then(data => {
        if (!data.found) { setState('not_found'); return }
        setRecord(data)
        setState(data.is_revoked ? 'revoked' : 'valid')
      })
      .catch(() => setState('error'))
  }, [token])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-[#F5F2EC] flex items-center justify-center">
        <span className="material-icons-round text-[#2D5A3D] text-5xl animate-spin">sync</span>
      </div>
    )
  }

  // ── Not found / error ────────────────────────────────────────────────────
  if (state === 'not_found' || state === 'error') {
    return (
      <div className="min-h-screen bg-[#F5F2EC] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-6">
          <span className="material-icons-round text-gray-400 text-4xl">search_off</span>
        </div>
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Record Not Found</h1>
        <p className="text-gray-500 font-medium max-w-sm">
          We couldn't find a Tawwa volunteer record for this code.
          The link may be invalid or the token may have been mistyped.
        </p>
        <button onClick={() => navigate('/')} className="mt-8 px-6 py-3 bg-[#2D5A3D] text-white rounded-xl font-bold text-sm">
          Go to Tawwa
        </button>
      </div>
    )
  }

  // ── Revoked ──────────────────────────────────────────────────────────────
  if (state === 'revoked') {
    const profile = record.profile_snapshot || {}
    return (
      <div className="min-h-screen bg-[#F5F2EC] flex flex-col items-center justify-center px-6 text-center">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-md overflow-hidden">
          <div className="bg-red-500 px-6 py-5">
            <span className="material-icons-round text-white text-4xl">block</span>
            <h1 className="text-white text-xl font-extrabold mt-2">CV Revoked</h1>
          </div>
          <div className="px-6 py-6">
            <p className="text-gray-700 font-medium mb-1">
              This CV was revoked by <strong>{profile.display_name || 'the volunteer'}</strong>.
            </p>
            <p className="text-gray-400 text-sm">
              The record is no longer considered valid. Please request a new CV from the volunteer.
            </p>
          </div>
        </div>
        <button onClick={() => navigate('/')} className="mt-6 text-[#2D5A3D] font-bold text-sm hover:underline">
          Go to Tawwa
        </button>
      </div>
    )
  }

  // ── Valid ─────────────────────────────────────────────────────────────────
  const profile  = record.profile_snapshot || {}
  const sessions = record.sessions_snapshot || []

  return (
    <div className="min-h-screen bg-[#F5F2EC]">

      {/* Header */}
      <div className="bg-[#2D5A3D] px-6 py-8 text-center">
        <p className="text-[#B8D4C4] text-xs font-bold uppercase tracking-widest mb-1">Verified Record</p>
        <h1 className="text-white text-3xl font-extrabold">{profile.display_name}</h1>
        <span className="inline-block mt-3 px-4 py-1.5 rounded-full bg-[#C9A961] text-[#2D5A3D] text-xs font-black uppercase tracking-wide">
          {record.tier_at_export} Volunteer
        </span>
      </div>

      {/* Verified badge */}
      <div className="flex justify-center -mt-5">
        <div className="flex items-center gap-2 px-5 py-2.5 bg-white rounded-full shadow-lg border border-green-100">
          <span className="material-icons-round text-green-500 text-lg">verified</span>
          <span className="text-green-700 font-bold text-sm">Authenticated by Tawwa</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">

        {/* Stats */}
        <div className="flex justify-center gap-3 flex-wrap">
          <StatPill icon="schedule"    label="Hours"    value={Number(record.total_hours).toFixed(1)} />
          <StatPill icon="volunteer_activism" label="Sessions" value={record.total_sessions} />
          <StatPill icon="stars"       label="Points"   value={record.total_points.toLocaleString()} />
        </div>

        {/* Meta */}
        <div className="flex justify-between text-xs text-gray-400 font-medium px-1">
          <span>Generated: {fmt(record.generated_at)}</span>
          <span>Token: <span className="font-mono">{token?.slice(0, 8)}…</span></span>
        </div>

        {/* Sessions table */}
        {sessions.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
            <div className="px-5 py-4 border-b border-gray-50">
              <h2 className="font-extrabold text-gray-800 text-base">Confirmed Sessions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#F5F2EC] text-gray-500 uppercase tracking-wide">
                    <th className="text-left px-4 py-3 font-bold">Date</th>
                    <th className="text-left px-4 py-3 font-bold">Organisation</th>
                    <th className="text-left px-4 py-3 font-bold">Event</th>
                    <th className="text-left px-4 py-3 font-bold">Cat.</th>
                    <th className="text-right px-4 py-3 font-bold">Hrs</th>
                    <th className="text-right px-4 py-3 font-bold">Pts</th>
                    <th className="text-right px-4 py-3 font-bold">Ref</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((row, i) => (
                    <tr key={i} className={`border-t border-gray-50 ${i % 2 === 1 ? 'bg-gray-50/50' : ''}`}>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{fmt(row.date)}</td>
                      <td className="px-4 py-3 text-gray-700 font-medium">{row.org || '–'}</td>
                      <td className="px-4 py-3 text-gray-700">{row.event || '–'}</td>
                      <td className="px-4 py-3 text-gray-500">{row.category || '–'}</td>
                      <td className="px-4 py-3 text-right text-gray-700 font-semibold">{row.hours ?? 0}</td>
                      <td className="px-4 py-3 text-right text-[#2D5A3D] font-bold">{row.points ?? 0}</td>
                      <td className="px-4 py-3 text-right font-mono text-gray-400">{row.ref}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 pb-6">
          This record is an immutable snapshot generated by Tawwa at time of export.<br />
          Session data cannot be altered retroactively. · <strong className="text-[#2D5A3D]">tawwa.online</strong>
        </p>
      </div>
    </div>
  )
}
