import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './supabaseClient'
import { AREAS } from './data/areas'
import './index.css'

const STAGES = [
  { id: 'lead', label: 'Lead', color: '#6366f1', bg: '#eef2ff' },
  { id: 'meeting_done', label: 'Meeting done', color: '#0891b2', bg: '#ecfeff' },
  { id: 'follow_up', label: 'Follow-up', color: '#d97706', bg: '#fffbeb' },
  { id: 'proposal', label: 'Proposal', color: '#7c3aed', bg: '#f5f3ff' },
  { id: 'won', label: 'Won', color: '#16a34a', bg: '#f0fdf4' },
  { id: 'lost', label: 'Lost', color: '#dc2626', bg: '#fef2f2' },
]

const fmtDate = (ts) => {
  if (!ts) return '—'
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

const fmtDateShort = (ts) => {
  if (!ts) return ''
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
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

const StageBadge = ({ stageId }) => {
  const s = STAGES.find(s => s.id === stageId) || STAGES[0]
  return <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 99, background: s.bg, color: s.color, border: `1px solid ${s.color}22` }}>{s.label}</span>
}

// PIPELINE VIEW
function Pipeline({ clients, sessions, onSelectClient, onUpdateClient, onDeleteClient }) {
  const [view, setView] = useState('kanban')
  const [filterStage, setFilterStage] = useState('all')
  const [showActionModal, setShowActionModal] = useState(null)
  const [actionForm, setActionForm] = useState({ stage: '', next_action: '', next_action_date: '', pipeline_notes: '' })

  const openAction = (client, e) => {
    e.stopPropagation()
    setActionForm({
      stage: client.stage || 'lead',
      next_action: client.next_action || '',
      next_action_date: client.next_action_date ? client.next_action_date.split('T')[0] : '',
      pipeline_notes: client.pipeline_notes || ''
    })
    setShowActionModal(client)
  }

  const saveAction = async () => {
    const updates = { ...actionForm }
    await onUpdateClient(showActionModal.id, updates)
    setShowActionModal(null)
  }

  const stageClients = (stageId) => clients.filter(c => (c.stage || 'lead') === stageId)

  const filteredClients = filterStage === 'all' ? clients : clients.filter(c => (c.stage || 'lead') === filterStage)

  const wonCount = clients.filter(c => c.stage === 'won').length
  const lostCount = clients.filter(c => c.stage === 'lost').length
  const activeCount = clients.filter(c => c.stage !== 'won' && c.stage !== 'lost').length
  const followUpDue = clients.filter(c => c.next_action_date && new Date(c.next_action_date) <= new Date() && c.stage !== 'won' && c.stage !== 'lost').length

  return (
    <div>
      <div className="header-row">
        <div>
          <div className="page-title">Pipeline</div>
          <div className="page-sub">Track every client from first touch to close</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`mode-btn ${view === 'kanban' ? 'active' : ''}`} onClick={() => setView('kanban')}>Kanban</button>
          <button className={`mode-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-label">Active</div><div className="stat-value">{activeCount}</div><div className="stat-sub">in pipeline</div></div>
        <div className="stat-card"><div className="stat-label">Follow-ups due</div><div className="stat-value" style={{ color: followUpDue > 0 ? '#d97706' : undefined }}>{followUpDue}</div><div className="stat-sub">today or overdue</div></div>
        <div className="stat-card"><div className="stat-label">Won</div><div className="stat-value" style={{ color: '#16a34a' }}>{wonCount}</div><div className="stat-sub">closed</div></div>
        <div className="stat-card"><div className="stat-label">Lost</div><div className="stat-value" style={{ color: '#dc2626' }}>{lostCount}</div><div className="stat-sub">closed</div></div>
      </div>

      {view === 'kanban' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 10, overflowX: 'auto' }}>
          {STAGES.map(stage => (
            <div key={stage.id} style={{ minWidth: 160 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10, padding: '6px 10px', borderRadius: 8, background: stage.bg }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: stage.color, flex: 1 }}>{stage.label}</span>
                <span style={{ fontSize: 11, color: stage.color, fontWeight: 500 }}>{stageClients(stage.id).length}</span>
              </div>
              {stageClients(stage.id).length === 0 && (
                <div style={{ border: '1px dashed #e0e0dc', borderRadius: 8, padding: '16px 10px', textAlign: 'center', fontSize: 11, color: '#ccc' }}>Empty</div>
              )}
              {stageClients(stage.id).map(c => {
                const cSessions = sessions[c.id] || []
                const latest = cSessions[0]
                const avg = latest ? sessionAvg(latest) : null
                const initials = (c.company || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
                const isOverdue = c.next_action_date && new Date(c.next_action_date) <= new Date()
                return (
                  <div key={c.id} className="pipeline-card" onClick={() => onSelectClient(c)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div className="client-avatar" style={{ width: 28, height: 28, fontSize: 10 }}>{initials}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.company}</div>
                        <div style={{ fontSize: 10, color: '#aaa' }}>{c.contact || '—'}</div>
                      </div>
                    </div>
                    {avg !== null && <div style={{ marginBottom: 6 }}><ScorePill avg={avg} short={true} /></div>}
                    {c.next_action && (
                      <div style={{ fontSize: 10, color: isOverdue ? '#dc2626' : '#888', marginBottom: 4, display: 'flex', gap: 4, alignItems: 'center' }}>
                        <span>{isOverdue ? '⚠' : '→'}</span>
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.next_action}</span>
                      </div>
                    )}
                    {c.next_action_date && <div style={{ fontSize: 10, color: isOverdue ? '#dc2626' : '#bbb', fontWeight: isOverdue ? 600 : 400 }}>{fmtDateShort(c.next_action_date)}</div>}
                    <button className="pipeline-action-btn" onClick={(e) => openAction(c, e)}>Manage</button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {view === 'list' && (
        <div>
          <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexWrap: 'wrap' }}>
            <button className={`mode-btn ${filterStage === 'all' ? 'active' : ''}`} onClick={() => setFilterStage('all')}>All</button>
            {STAGES.map(s => (
              <button key={s.id} className={`mode-btn ${filterStage === s.id ? 'active' : ''}`} onClick={() => setFilterStage(s.id)} style={filterStage === s.id ? { background: s.color, borderColor: s.color, color: '#fff' } : {}}>{s.label}</button>
            ))}
          </div>
          {filteredClients.length === 0 && <div className="empty-state"><span className="empty-icon">📋</span>No clients in this stage.</div>}
          {filteredClients.map(c => {
            const cSessions = sessions[c.id] || []
            const latest = cSessions[0]
            const avg = latest ? sessionAvg(latest) : null
            const initials = (c.company || '?').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
            const isOverdue = c.next_action_date && new Date(c.next_action_date) <= new Date()
            return (
              <div key={c.id} className="client-row" onClick={() => onSelectClient(c)}>
                <div className="client-avatar">{initials}</div>
                <div className="client-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <div className="client-name">{c.company}</div>
                    <StageBadge stageId={c.stage || 'lead'} />
                  </div>
                  <div className="client-meta">
                    {c.contact && <span>{c.contact}</span>}
                    {c.next_action && <span style={{ color: isOverdue ? '#dc2626' : '#888' }}> · Next: {c.next_action}</span>}
                    {c.next_action_date && <span style={{ color: isOverdue ? '#dc2626' : '#bbb' }}> ({fmtDateShort(c.next_action_date)})</span>}
                  </div>
                  {c.pipeline_notes && <div style={{ fontSize: 11, color: '#aaa', marginTop: 2, fontStyle: 'italic' }}>{c.pipeline_notes}</div>}
                </div>
                <div className="client-right">
                  <ScorePill avg={avg} short={false} />
                  <div className="session-count">{cSessions.length} session{cSessions.length !== 1 ? 's' : ''}</div>
                </div>
                <button className="btn btn-sm" onClick={(e) => openAction(c, e)}>Manage</button>
              </div>
            )
          })}
        </div>
      )}

      {showActionModal && (
        <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && setShowActionModal(null)}>
          <div className="modal" style={{ maxWidth: 520 }}>
            <div className="modal-title">{showActionModal.company}</div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label>Stage</label>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 6 }}>
                {STAGES.map(s => (
                  <button key={s.id} type="button" onClick={() => setActionForm(f => ({ ...f, stage: s.id }))}
                    style={{ fontSize: 12, fontWeight: 500, padding: '5px 12px', borderRadius: 99, border: `1px solid ${actionForm.stage === s.id ? s.color : '#e0e0dc'}`, background: actionForm.stage === s.id ? s.bg : '#fff', color: actionForm.stage === s.id ? s.color : '#888', cursor: 'pointer', transition: 'all 0.15s' }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="field">
                <label>Next action</label>
                <input value={actionForm.next_action} onChange={e => setActionForm(f => ({ ...f, next_action: e.target.value }))} placeholder="e.g. Send proposal, Follow up call" />
              </div>
              <div className="field">
                <label>Due date</label>
                <input type="date" value={actionForm.next_action_date} onChange={e => setActionForm(f => ({ ...f, next_action_date: e.target.value }))} />
              </div>
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label>Pipeline notes</label>
              <textarea className="notes-ta" style={{ minHeight: 72 }} value={actionForm.pipeline_notes} onChange={e => setActionForm(f => ({ ...f, pipeline_notes: e.target.value }))} placeholder="Key context, objections, follow-up notes..." />
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <button className="btn btn-danger btn-sm" onClick={async () => { if (window.confirm('Delete this client and all their sessions? This cannot be undone.')) { await onDeleteClient(showActionModal.id); setShowActionModal(null) } }}>Delete client</button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn" onClick={() => setShowActionModal(null)}>Cancel</button>
                <button className="btn btn-primary" onClick={saveAction}>Save changes</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// DASHBOARD VIEW
function Dashboard({ onSelectClient, clients, sessions, loading, onCreateClient }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ company: '', contact: '', role: '', industry: '', team_size: '' })

  const createClient = async () => {
    if (!form.company.trim()) return alert('Please enter a company name.')
    await onCreateClient({ ...form, stage: 'lead' })
    setShowModal(false)
    setForm({ company: '', contact: '', role: '', industry: '', team_size: '' })
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

      <div className="section-header"><div className="section-title">Clients</div></div>

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
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <div className="client-name">{c.company}</div>
                  <StageBadge stageId={c.stage || 'lead'} />
                </div>
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
function ClientView({ client, onBack, onStartSession, onOpenSession, onUpdateClient }) {
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
  const stage = STAGES.find(s => s.id === (client.stage || 'lead')) || STAGES[0]

  return (
    <div>
      <div className="assess-back" onClick={onBack}>← All clients</div>
      <div className="header-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <div className="page-title">{client.company}</div>
            <StageBadge stageId={client.stage || 'lead'} />
          </div>
          <div className="page-sub">{[client.contact, client.role, client.industry, client.team_size].filter(Boolean).join(' · ') || 'No details'}</div>
          {client.next_action && <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>→ Next: {client.next_action} {client.next_action_date ? `(${fmtDateShort(client.next_action_date)})` : ''}</div>}
          {client.pipeline_notes && <div style={{ fontSize: 12, color: '#aaa', marginTop: 2, fontStyle: 'italic' }}>{client.pipeline_notes}</div>}
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
    const text = `Generate an operational assessment debrief for ${client.company} (contact: ${client.contact || 'not specified'}, session date: ${fmtDate(session.created_at)}, industry: ${client.industry || 'general'}, team: ${client.team_size || 'unknown'}).\n\nOverall score: ${avgR}/5 across ${vals.length} areas.\nSession type: ${mode === 'diagnostic' ? 'Deep diagnostic' : 'Discovery call'}.\nCritical areas (1-2): ${critical.join(', ') || 'none'}.\nModerate (3): ${moderate.join(', ') || 'none'}.\nHealthy (4-5): ${healthy.join(', ') || 'none'}.\nRed flags: ${redFlags.join(', ') || 'none'}.\nAmber flags: ${amberFlags.join(', ') || 'none'}.\nNotes: ${notesStr || 'none'}.\n\nUse the Operations & Performance Consultant persona. Generate: 1) Executive Summary, 2) Top 3 operational risks, 3) Quick wins (30 days), 4) Strategic priorities. Direct, structured, premium consulting tone.`
    navigator.clipboard.writeText(text).then(() => alert('Debrief prompt copied to clipboard! Paste it into Claude to generate your full executive debrief.')).catch(() => alert(text))
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
              {score > 0 ? <ScorePill avg={score} short={true} /> : <span className="score-pill pill-gray">—</span>}
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
                            <button className="probe-btn" onClick={() => setProbes(p => ({ ...p, [pk]: !p[pk] }))}>{probes[pk] ? '− probe' : '+ probe'}</button>
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
                    return <span key={f.label} className={`flag-chip ${active ? 'active-' + f.color : ''}`} onClick={() => toggleFlag(area.id, f.label, f.color)}>{f.label}</span>
                  })}
                </div>
                <div className="notes-label">Notes & observations</div>
                <textarea className="notes-ta" placeholder="Key observations, client quotes, red flags..." defaultValue={(session.notes || {})[area.id] || ''} onBlur={e => saveNote(area.id, e.target.value)} />
              </div>
            )}
          </div>
        )
      })}

      <div className="save-indicator"><div className="save-dot"></div>{saving ? 'Saving...' : 'Auto-saved to Supabase'}</div>
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
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentClient, setCurrentClient] = useState(null)
  const [currentSession, setCurrentSession] = useState(null)
  const [clients, setClients] = useState([])
  const [sessions, setSessions] = useState({})
  const [loading, setLoading] = useState(true)

  const loadAll = useCallback(async () => {
    setLoading(true)
    const { data: clientData } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
    const cls = clientData || []
    setClients(cls)
    const sessionMap = {}
    for (const c of cls) {
      const { data } = await supabase.from('sessions').select('*').eq('client_id', c.id).order('created_at', { ascending: false })
      sessionMap[c.id] = data || []
    }
    setSessions(sessionMap)
    setLoading(false)
  }, [])

  useEffect(() => { loadAll() }, [loadAll])

  const createClient = async (form) => {
    const { data, error } = await supabase.from('clients').insert([form]).select().single()
    if (error) return alert('Error: ' + error.message)
    await loadAll()
    setCurrentClient(data)
    setView('client')
  }

  const updateClient = async (id, updates) => {
    await supabase.from('clients').update(updates).eq('id', id)
    await loadAll()
    if (currentClient && currentClient.id === id) setCurrentClient(c => ({ ...c, ...updates }))
  }

  const deleteClient = async (id) => {
    await supabase.from('clients').delete().eq('id', id)
    await loadAll()
  }

  const startSession = async () => {
    const { data, error } = await supabase.from('sessions').insert([{ client_id: currentClient.id, mode: 'discovery', scores: {}, notes: {}, flags: {} }]).select().single()
    if (error) return alert('Error: ' + error.message)
    setCurrentSession(data)
    setView('assessment')
  }

  const openSession = (session) => {
    setCurrentSession(session)
    setView('assessment')
  }

  const selectClient = (c) => {
    setCurrentClient(c)
    setView('client')
  }

  const goToDashboard = () => {
    setView('dashboard')
    setActiveTab('dashboard')
    loadAll()
  }

  const goToPipeline = () => {
    setView('pipeline')
    setActiveTab('pipeline')
    loadAll()
  }

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-brand" onClick={goToDashboard} style={{ cursor: 'pointer' }}>
          <div className="nav-logo">E</div>
          <div>
            <div className="nav-name">EMC Operational Systems</div>
            <div className="nav-sub">Assessment Platform</div>
          </div>
        </div>
        <div className="nav-right">
          <button className={`mode-btn ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={goToDashboard}>Assessments</button>
          <button className={`mode-btn ${activeTab === 'pipeline' ? 'active' : ''}`} onClick={goToPipeline}>Pipeline</button>
        </div>
      </nav>

      <main className="main">
        {view === 'dashboard' && <Dashboard onSelectClient={selectClient} clients={clients} sessions={sessions} loading={loading} onCreateClient={createClient} />}
        {view === 'pipeline' && <Pipeline clients={clients} sessions={sessions} onSelectClient={selectClient} onUpdateClient={updateClient} onDeleteClient={deleteClient} />}
        {view === 'client' && currentClient && <ClientView client={currentClient} onBack={goToDashboard} onStartSession={startSession} onOpenSession={openSession} onUpdateClient={updateClient} />}
        {view === 'assessment' && currentClient && currentSession && <AssessmentView client={currentClient} session={currentSession} onBack={() => { setView('client'); loadAll() }} />}
      </main>
    </div>
  )
}
