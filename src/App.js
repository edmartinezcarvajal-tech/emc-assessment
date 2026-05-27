import { useState, useEffect, useCallback } from 'react'
import { supabase } from './supabaseClient'
import { AREAS } from './data/areas'
import './index.css'

const fmtDate = (ts) => {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const sessionAvg = (session) => {
  const vals = Object.values(session.scores || {}).filter(v => v > 0)
  if (!vals.length) return null
  return vals.reduce((a, b) => a + b, 0) / vals.length
}

const ScorePill = ({ avg, short }) => {
  if (avg === null || avg === undefined) return <span className="score-pill pill-gray">—</span>
  const v = parseFloat(avg)
  const cls = v <= 2 ? 'pill-red' : v <= 3 ? 'pill-amber' : 'pill-green'
  const label = short ? v.toFixed(1) : (v <= 2 ? 'Critical' : v <= 3 ? 'At risk' : v <= 4 ? 'Developing' : 'Healthy')
  return <span className={`score-pill ${cls}`}>{label}</span>
}

// DASHBOARD VIEW
function Dashboard({ onSelectClient }) {
  const [clients, setClients] = useState([])
  const [sessions, setSessions] = useState({})
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ company: '', contact: '', role: '', industry: '', team_size: '' })

  const load = useCallback(async () => {
    setLoading(true)
    const { data: clientData } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    const clients = clientData || []
    setClients(clients)
    const sessionMap = {}
    for (const c of clients) {
      const { data } = await supabase.from('sessions').select('*').eq('client_id', c.id).order('created_at', { ascending: false })
      sessionMap[c.id] = data || []
    }
    setSessions(sessionMap)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const createClient = async () => {
    if (!form.company.trim()) return alert('Please enter a company name.')
    const { data, error } = await supabase.from('clients').insert([{ company: form.company, contact: form.contact, role: form.role, industry: form.industry, team_size: form.team_size }]).select().single()
    if (error) return alert('Error: ' + error.message)
    setShowModal(false)
    setForm({ company: '', contact: '', role: '', industry: '', team_size: '' })
    await load()
    onSelectClient(data)
  }

  const totalSessions = Object.values(sessions).reduce((a, b) => a + b.length, 0)
  const allAvgs = Object.values(sessions).flat().map(s => sessionAvg(s)).filter(v => v !== null)
  const overallAvg = allAvgs.length ? (allAvgs.reduce((a, b) => a + b, 0) / allAvgs.length).toFixed(1) : '—'
  const critical = allAvgs.filter(v => v <= 2.5).length

  return (
    <div>
      <div className="header-row">
        <div>
          <div className="page-title">Client assessments</div>
          <div className="page-sub">All sessions saved to your database</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New client</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Total clients</div><div className="stat-value">{clients.length}</div><div className="stat-sub">tracked</div></div>
        <div className="stat-card"><div className="stat-label">Sessions</div><div className="stat-value">{totalSessions}</div><div className="stat-sub">total</div></div>
        <div className="stat-card"><div className="stat-label">Avg score</div><div className="stat-value">{overallAvg}</div><div className="stat-sub">across all</div></div>
        <div className="stat-card"><div className="stat-label">Critical cases</div><div className="stat-value">{critical}</div><div className="stat-sub">score ≤ 2.5</div></div>
      </div>

      <div className="section-header">
        <div className="section-title">Clients</div>
      </div>

      {loading ? (
        <div className="empty-state"><span className="empty-icon">⏳</span>Loading clients...</div>
      ) : clients.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">👥</span>No clients yet. Create your first client to start tracking.</div>
      ) : (
        clients.map(c => {
          const cSessions = sessions[c.id] || []
          const latest = cSessions[0]
          const avg = latest ? sessionAvg(latest) : null
          const initials = (c.company || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
          return (
            <div key={c.id} className="client-row" onClick={() => onSelectClient(c)}>
              <div className="client-avatar">{initials}</div>
              <div className="client-info">
                <div className="client-name">{c.company}</div>
                <div className="client-meta">{[c.contact, c.role, c.industry, c.team_size].filter(Boolean).join(' · ') || 'No details'}</div>
              </div>
              <div className="client-right">
                <ScorePill avg={avg} short={false} />
                <div className="session-count">{cSessions.length} session{cSessions.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          )
        })
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowModal(false)}>
          <div className="modal">
            <div className="modal-title">New client</div>
            <div className="form-row">
              <div className="field"><label>Company name *</label><input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} placeholder="Acme Corp" /></div>
              <div className="field"><label>Contact name</label><input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="John Smith" /></div>
            </div>
            <div className="form-row">
              <div className="field"><label>Role / title</label><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} placeholder="VP Operations" /></div>
              <div className="field"><label>Industry</label>
                <select value={form.industry} onChange={e => setForm({ ...form, industry: e.target.value })}>
                  <option value="">Select...</option>
                  <option>BPO / Call center</option>
                  <option>Sales team</option>
                  <option>Customer service</option>
                  <option>Remote operations</option>
                  <option>SMB - General</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-row single">
              <div className="field"><label>Team size</label><input value={form.team_size} onChange={e => setForm({ ...form, team_size: e.target.value })} placeholder="e.g. 30 agents, 5 team leads" /></div>
            </div>
            <div className="modal-footer">
              <button className="btn" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={createClient}>Create client</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// CLIENT VIEW
function ClientView({ client, onBack, onStartSession, onOpenSession }) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const { data } = await supabase.from('sessions').select('*').eq('client_id', client.id).order('created_at', { ascending: false })
    setSessions(data || [])
    setLoading(false)
  }, [client.id])

  useEffect(() => { load() }, [load])

  const deleteSession = async (id) => {
    if (!window.confirm('Delete this session? This cannot be undone.')) return
    await supabase.from('sessions').delete().eq('id', id)
    await load()
  }

  const latestAvg = sessions[0] ? sessionAvg(sessions[0]) : null
  const firstDate = sessions.length ? sessions[sessions.length - 1].created_at : null

  return (
    <div>
      <div className="assess-back" onClick={onBack}>← All clients</div>
      <div className="header-row">
        <div>
          <div className="page-title">{client.company}</div>
          <div className="page-sub">{[client.contact, client.role, client.industry, client.team_size].filter(Boolean).join(' · ') || 'No details'}</div>
        </div>
        <button className="btn btn-primary" onClick={onStartSession}>+ New session</button>
      </div>

      <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <div className="stat-card"><div className="stat-label">Sessions</div><div className="stat-value">{sessions.length}</div><div className="stat-sub">total</div></div>
        <div className="stat-card"><div className="stat-label">Latest score</div><div className="stat-value">{latestAvg !== null ? latestAvg.toFixed(1) : '—'}</div><div className="stat-sub">{latestAvg !== null ? (latestAvg <= 2 ? 'critical' : latestAvg <= 3 ? 'at risk' : latestAvg <= 4 ? 'developing' : 'healthy') : 'no sessions'}</div></div>
        <div className="stat-card"><div className="stat-label">First touch</div><div className="stat-value" style={{ fontSize: 15, paddingTop: 4 }}>{fmtDate(firstDate)}</div><div className="stat-sub">{sessions.length > 1 ? 'Last: ' + fmtDate(sessions[0].created_at) : 'first session'}</div></div>
      </div>

      <div className="section-header"><div className="section-title">Session history</div></div>

      {loading ? (
        <div className="empty-state">Loading sessions...</div>
      ) : sessions.length === 0 ? (
        <div className="empty-state"><span className="empty-icon">📋</span>No sessions yet. Start with a discovery call.</div>
      ) : (
        sessions.map(s => {
          const avg = sessionAvg(s)
          const areas = Object.values(s.scores || {}).filter(v => v > 0).length
          return (
            <div key={s.id} className="session-row">
              <div className="session-date">{fmtDate(s.created_at)}</div>
              <span className="session-type">{s.mode === 'diagnostic' ? 'Diagnostic' : 'Discovery'}</span>
              <div className="session-desc">{areas} area{areas !== 1 ? 's' : ''} scored</div>
              <ScorePill avg={avg} short={true} />
              <div className="session-actions">
                <button className="btn btn-sm" onClick={() => onOpenSession(s)}>Edit</button>
                <button className="btn btn-sm btn-danger" onClick={() => deleteSession(s.id)}>Delete</button>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

// ASSESSMENT VIEW
function AssessmentView({ client, session: initSession, onBack }) {
  const [session, setSession] = useState(initSession)
  const [mode, setMode] = useState(initSession.mode || 'discovery')
  const [openAreas, setOpenAreas] = useState({})
  const [probes, setProbes] = useState({})
  const [saving, setSaving] = useState(false)

  const save = useCallback(async (updated) => {
    setSaving(true)
    const avg = (() => {
      const vals = Object.values(updated.scores || {}).filter(v => v > 0)
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
    })()
    await supabase.from('sessions').update({ scores: updated.scores, notes: updated.notes, flags: updated.flags, mode: updated.mode, overall_score: avg }).eq('id', updated.id)
    setTimeout(() => setSaving(false), 800)
  }, [])

  const setScore = async (areaId, n) => {
    const updated = { ...session, scores: { ...session.scores, [areaId]: n } }
    setSession(updated)
    await save(updated)
  }

  const saveNote = async (areaId, val) => {
    const updated = { ...session, notes: { ...session.notes, [areaId]: val } }
    setSession(updated)
    await save(updated)
  }

  const toggleFlag = async (areaId, label, color) => {
    const key = `${areaId}|${label}`
    const flags = { ...session.flags }
    if (flags[key]) delete flags[key]
    else flags[key] = color
    const updated = { ...session, flags }
    setSession(updated)
    await save(updated)
  }

  const switchMode = async (m) => {
    setMode(m)
    const updated = { ...session, mode: m }
    setSession(updated)
    await save(updated)
  }

  const vals = Object.values(session.scores || {}).filter(v => v > 0)
  const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
  const avgR = avg ? Math.round(avg * 10) / 10 : null

  const getRisk = (v) => {
    if (!v) return { label: '—', sub: 'pending' }
    if (v <= 2) return { label: 'High', sub: 'immediate action' }
    if (v <= 3) return { label: 'Elevated', sub: 'gaps present' }
    if (v <= 4) return { label: 'Moderate', sub: 'optimize' }
    return { label: 'Low', sub: 'scale-ready' }
  }
  const risk = getRisk(avgR)

  const exportTxt = () => {
    const lines = [
      `OPERATIONAL ASSESSMENT — ${client.company}`,
      `Date: ${fmtDate(session.created_at)}`,
      `Contact: ${client.contact || '—'} · ${client.role || '—'}`,
      `Industry: ${client.industry || '—'} · Team: ${client.team_size || '—'}`,
      `Session type: ${mode === 'diagnostic' ? 'Deep diagnostic' : 'Discovery call'}`,
      `Overall score: ${avgR || '—'}/5`,
      '',
      '— SCORES —',
      ...AREAS.map(a => `  ${a.name}: ${(session.scores || {})[a.id] || '—'}/5`),
      '',
      '— FLAGS —',
      ...Object.entries(session.flags || {}).map(([k, v]) => `  [${v.toUpperCase()}] ${k.split('|')[1]}`),
      '',
      '— CONSULTANT NOTES —',
      ...AREAS.filter(a => (session.notes || {})[a.id]).map(a => `  ${a.name}:\n  ${session.notes[a.id]}`)
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `assessment-${client.company.replace(/\s+/g, '-').toLowerCase()}-${fmtDate(session.created_at).replace(/\s/g, '-')}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const generateDebrief = () => {
    if (vals.length < 3) return alert('Please score at least 3 areas before generating a debrief.')
    const scored = AREAS.filter(a => (session.scores || {})[a.id] > 0)
    const critical = scored.filter(a => session.scores[a.id] <= 2).map(a => a.name)
    const moderate = scored.filter(a => session.scores[a.id] === 3).map(a => a.name)
    const healthy = scored.filter(a => session.scores[a.id] >= 4).map(a => a.name)
    const redFlags = Object.entries(session.flags || {}).filter(([, v]) => v === 'red').map(([k]) => k.split('|')[1])
    const amberFlags = Object.entries(session.flags || {}).filter(([, v]) => v === 'amber').map(([k]) => k.split('|')[1])
    const notesStr = AREAS.filter(a => (session.notes || {})[a.id]).map(a => `${a.name}: ${session.notes[a.id]}`).join(' | ')
    alert(`Debrief ready to generate!\n\nClient: ${client.company}\nScore: ${avgR}/5\nCritical: ${critical.join(', ') || 'none'}\nAt risk: ${moderate.join(', ') || 'none'}\nHealthy: ${healthy.join(', ') || 'none'}\nRed flags: ${redFlags.join(', ') || 'none'}\n\nCopy this data and paste it to Claude to generate your full executive debrief.`)
  }

  return (
    <div>
      <div className="assess-back" onClick={onBack}>← {client.company}</div>
      <div className="header-row">
        <div>
          <div className="page-title">{client.company}</div>
          <div className="page-sub">{fmtDate(session.created_at)} · {mode === 'diagnostic' ? 'Deep diagnostic' : 'Discovery call'}</div>
        </div>
        <div className="mode-toggle">
          <button className={`mode-btn ${mode === 'discovery' ? 'active' : ''}`} onClick={() => switchMode('discovery')}>Discovery</button>
          <button className={`mode-btn ${mode === 'diagnostic' ? 'active' : ''}`} onClick={() => switchMode('diagnostic')}>Diagnostic</button>
        </div>
      </div>

      <div className="score-summary">
        <div className="sc-card"><div className="sc-label">Score</div><div className="sc-value">{avgR ? avgR.toFixed(1) : '—'}</div><div className="sc-sub">{avgR ? (avgR <= 2 ? 'critical' : avgR <= 3 ? 'at risk' : avgR <= 4 ? 'developing' : 'healthy') : 'no scores yet'}</div></div>
        <div className="sc-card"><div className="sc-label">Areas</div><div className="sc-value">{vals.length}/9</div><div className="sc-sub">assessed</div></div>
        <div className="sc-card"><div className="sc-label">Risk</div><div className="sc-value">{risk.label}</div><div className="sc-sub">{risk.sub}</div></div>
      </div>

      {AREAS.map(area => {
        const score = (session.scores || {})[area.id] || 0
        const isOpen = openAreas[area.id]
        return (
          <div key={area.id} className="area-card">
            <div className="area-header" onClick={() => setOpenAreas(p => ({ ...p, [area.id]: !p[area.id] }))}>
              <span className="area-icon">{area.icon}</span>
              <span className="area-name">{area.name}</span>
              {score > 0 && <ScorePill avg={score} short={true} />}
              {!score && <span className="score-pill pill-gray">—</span>}
              <span className={`area-chevron ${isOpen ? 'open' : ''}`}>▼</span>
            </div>

            {isOpen && (
              <div className="area-body">
                <div className="score-row">
                  <span className="score-label">Score</span>
                  <div className="score-dots">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} className={`dot-btn ${score === n ? 's' + n : ''}`} onClick={() => setScore(area.id, n)}>{n}</button>
                    ))}
                  </div>
                  <span className="score-hint">1–2 critical · 3 moderate · 4–5 healthy</span>
                </div>

                <div className="qs-label">{mode === 'discovery' ? 'Discovery questions' : 'Deep diagnostic questions'}</div>
                {(mode === 'discovery' ? area.discovery : area.diagnostic).map((item, i) => {
                  const pk = `${area.id}-${i}`
                  return (
                    <div key={i} className="q-item">
                      <span className="q-num">{i + 1}</span>
                      <div className="q-body">
                        <div className="q-text">{item.q}</div>
                        {item.probe && (
                          <>
                            <button className="probe-btn" onClick={() => setProbes(p => ({ ...p, [pk]: !p[pk] }))}>
                              {probes[pk] ? '− probe' : '+ probe'}
                            </button>
                            <div className={`q-probe ${probes[pk] ? 'show' : ''}`}>{item.probe}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}

                <div className="flags-label">Quick flags</div>
                <div className="flags-row">
                  {area.flags.map(f => {
                    const key = `${area.id}|${f.label}`
                    const active = (session.flags || {})[key]
                    return (
                      <span key={f.label} className={`flag-chip ${active ? 'active-' + f.color : ''}`} onClick={() => toggleFlag(area.id, f.label, f.color)}>{f.label}</span>
                    )
                  })}
                </div>

                <div className="notes-label">Notes & observations</div>
                <textarea className="notes-ta" placeholder="Key observations, client quotes, red flags..." defaultValue={(session.notes || {})[area.id] || ''} onBlur={e => saveNote(area.id, e.target.value)} />
              </div>
            )}
          </div>
        )
      })}

      <div className="save-indicator">
        <div className="save-dot"></div>
        {saving ? 'Saving...' : 'Auto-saved to Supabase'}
      </div>

      <div className="action-row">
        <button className="btn btn-primary" onClick={generateDebrief}>Generate debrief</button>
        <button className="btn" onClick={exportTxt}>Export session (.txt)</button>
      </div>
    </div>
  )
}

// MAIN APP
export default function App() {
  const [view, setView] = useState('dashboard')
  const [currentClient, setCurrentClient] = useState(null)
  const [currentSession, setCurrentSession] = useState(null)

  const startSession = async () => {
    const { data, error } = await supabase.from('sessions').insert([{ client_id: currentClient.id, mode: 'discovery', scores: {}, notes: {}, flags: {} }]).select().single()
    if (error) return alert('Error creating session: ' + error.message)
    setCurrentSession(data)
    setView('assessment')
  }

  const openSession = (session) => {
    setCurrentSession(session)
    setView('assessment')
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-brand" onClick={() => setView('dashboard')} style={{ cursor: 'pointer' }}>
          <div className="nav-logo">E</div>
          <div>
            <div className="nav-name">EMC Operational Systems</div>
            <div className="nav-sub">Assessment Platform</div>
          </div>
        </div>
        <div className="nav-right">
          {view !== 'dashboard' && <button className="btn btn-ghost btn-sm" onClick={() => setView('dashboard')}>← Dashboard</button>}
        </div>
      </nav>

      <main className="main">
        {view === 'dashboard' && (
          <Dashboard
            onSelectClient={(c) => { setCurrentClient(c); setView('client') }}
          />
        )}
        {view === 'client' && currentClient && (
          <ClientView
            client={currentClient}
            onBack={() => setView('dashboard')}
            onStartSession={startSession}
            onOpenSession={openSession}
          />
        )}
        {view === 'assessment' && currentClient && currentSession && (
          <AssessmentView
            client={currentClient}
            session={currentSession}
            onBack={() => setView('client')}
          />
        )}
      </main>
    </div>
  )
}
