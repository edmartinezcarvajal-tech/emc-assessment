* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f8f8f6;
  color: #1a1a1a;
  font-size: 14px;
  line-height: 1.6;
}

button { cursor: pointer; font-family: inherit; }
input, textarea, select { font-family: inherit; }

::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #d0d0cc; border-radius: 3px; }

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* NAV */
.nav {
  background: #fff;
  border-bottom: 1px solid #ebebeb;
  padding: 0 2rem;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-brand { display: flex; align-items: center; gap: 10px; }
.nav-logo {
  width: 30px; height: 30px;
  background: #1a1a1a;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
}
.nav-name { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.nav-sub { font-size: 11px; color: #888; margin-top: 1px; }
.nav-right { display: flex; align-items: center; gap: 8px; }

/* MAIN */
.main { flex: 1; padding: 2rem; max-width: 960px; margin: 0 auto; width: 100%; }

/* BUTTONS */
.btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  border: 1px solid #e0e0dc;
  background: #fff;
  color: #1a1a1a;
  transition: all 0.15s;
}
.btn:hover { background: #f5f5f3; border-color: #ccc; }
.btn:active { transform: scale(0.98); }
.btn-primary { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
.btn-primary:hover { background: #333; border-color: #333; }
.btn-danger { color: #991f1f; border-color: #f09595; }
.btn-danger:hover { background: #fef2f2; }
.btn-sm { padding: 5px 12px; font-size: 12px; }
.btn-ghost { border-color: transparent; background: transparent; }
.btn-ghost:hover { background: #f5f5f3; border-color: transparent; }

/* CARDS */
.card {
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 12px;
  overflow: hidden;
}
.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid #ebebeb;
  background: #fafaf8;
}
.card-body { padding: 20px; }

/* STATS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 24px;
}
.stat-card {
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  padding: 16px;
}
.stat-label { font-size: 11px; font-weight: 500; color: #999; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.stat-value { font-size: 24px; font-weight: 600; color: #1a1a1a; }
.stat-sub { font-size: 11px; color: #999; margin-top: 3px; }

/* SCORE PILLS */
.score-pill {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 500;
}
.pill-red { background: #fef2f2; color: #991f1f; }
.pill-amber { background: #fffbeb; color: #854d0e; }
.pill-green { background: #f0fdf4; color: #166534; }
.pill-gray { background: #f5f5f3; color: #888; }

/* SECTION HEADER */
.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.section-title { font-size: 15px; font-weight: 600; color: #1a1a1a; }

/* CLIENT ROW */
.client-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.client-row:hover { border-color: #ccc; background: #fafaf8; transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
.client-avatar {
  width: 40px; height: 40px;
  border-radius: 50%;
  background: #1a1a1a;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 600;
  flex-shrink: 0;
}
.client-info { flex: 1; min-width: 0; }
.client-name { font-size: 14px; font-weight: 600; color: #1a1a1a; }
.client-meta { font-size: 12px; color: #888; margin-top: 2px; }
.client-right { text-align: right; flex-shrink: 0; }
.session-count { font-size: 11px; color: #aaa; margin-top: 3px; }

/* MODAL */
.modal-backdrop {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.3);
  display: flex; align-items: center; justify-content: center;
  z-index: 200;
  padding: 20px;
}
.modal {
  background: #fff;
  border-radius: 14px;
  padding: 24px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
}
.modal-title { font-size: 16px; font-weight: 600; margin-bottom: 20px; }
.modal-footer { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }

/* FORM */
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
.form-row.single { grid-template-columns: 1fr; }
.field label { display: block; font-size: 12px; font-weight: 500; color: #555; margin-bottom: 5px; }
.field input, .field select, .field textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e0e0dc;
  border-radius: 8px;
  font-size: 13px;
  color: #1a1a1a;
  background: #fff;
  outline: none;
  transition: border-color 0.15s;
}
.field input:focus, .field select:focus, .field textarea:focus { border-color: #1a1a1a; }

/* ASSESSMENT */
.assess-back {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; color: #888;
  margin-bottom: 16px;
  cursor: pointer;
  transition: color 0.15s;
}
.assess-back:hover { color: #1a1a1a; }

.mode-toggle { display: flex; gap: 6px; }
.mode-btn {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid #e0e0dc;
  background: #fff;
  color: #888;
  transition: all 0.15s;
}
.mode-btn.active { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }

/* AREA CARDS */
.area-card {
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  margin-bottom: 10px;
  overflow: hidden;
  transition: border-color 0.15s;
}
.area-card:hover { border-color: #d0d0cc; }
.area-header {
  display: flex; align-items: center; gap: 10px;
  padding: 13px 16px;
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}
.area-header:hover { background: #fafaf8; }
.area-icon { font-size: 16px; flex-shrink: 0; }
.area-name { font-size: 13px; font-weight: 600; flex: 1; }
.area-chevron { font-size: 12px; color: #aaa; transition: transform 0.2s; flex-shrink: 0; }
.area-chevron.open { transform: rotate(180deg); }
.area-body { padding: 0 16px 16px; border-top: 1px solid #f0f0ee; }

/* SCORE ROW */
.score-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 0;
  flex-wrap: wrap;
}
.score-label { font-size: 12px; color: #888; min-width: 40px; }
.score-dots { display: flex; gap: 6px; }
.dot-btn {
  width: 32px; height: 32px;
  border-radius: 50%;
  border: 1px solid #e0e0dc;
  background: #f8f8f6;
  font-size: 12px;
  font-weight: 500;
  color: #888;
  transition: all 0.15s;
}
.dot-btn:hover { border-color: #999; color: #1a1a1a; }
.dot-btn.s1, .dot-btn.s2 { background: #fef2f2; border-color: #f09595; color: #991f1f; }
.dot-btn.s3 { background: #fffbeb; border-color: #fbbf24; color: #854d0e; }
.dot-btn.s4, .dot-btn.s5 { background: #f0fdf4; border-color: #86efac; color: #166534; }
.score-hint { font-size: 11px; color: #bbb; }

/* QUESTIONS */
.qs-label {
  font-size: 10px; font-weight: 600; color: #bbb;
  text-transform: uppercase; letter-spacing: 0.06em;
  padding: 10px 0 8px;
  border-bottom: 1px solid #f0f0ee;
  margin-bottom: 8px;
}
.q-item { display: flex; gap: 8px; padding: 6px 0; }
.q-num { font-size: 11px; color: #bbb; min-width: 18px; font-weight: 600; padding-top: 1px; flex-shrink: 0; }
.q-body { flex: 1; }
.q-text { font-size: 13px; color: #1a1a1a; line-height: 1.55; }
.q-probe { font-size: 12px; color: #888; margin-top: 3px; line-height: 1.5; display: none; padding-left: 0; }
.q-probe.show { display: block; }
.probe-btn {
  font-size: 11px; color: #aaa;
  background: none; border: none;
  text-decoration: underline;
  margin-top: 3px;
  padding: 0;
  transition: color 0.15s;
}
.probe-btn:hover { color: #555; }

/* FLAGS */
.flags-label { font-size: 11px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.05em; margin: 12px 0 6px; }
.flags-row { display: flex; gap: 6px; flex-wrap: wrap; }
.flag-chip {
  font-size: 11px;
  padding: 3px 10px;
  border-radius: 99px;
  border: 1px solid #e0e0dc;
  background: #f8f8f6;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}
.flag-chip:hover { border-color: #ccc; color: #555; }
.flag-chip.active-red { background: #fef2f2; border-color: #f09595; color: #991f1f; }
.flag-chip.active-amber { background: #fffbeb; border-color: #fbbf24; color: #854d0e; }
.flag-chip.active-green { background: #f0fdf4; border-color: #86efac; color: #166534; }

/* NOTES */
.notes-label { font-size: 11px; font-weight: 600; color: #bbb; text-transform: uppercase; letter-spacing: 0.05em; margin: 12px 0 6px; }
.notes-ta {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e0e0dc;
  border-radius: 8px;
  font-size: 13px;
  color: #1a1a1a;
  resize: vertical;
  min-height: 72px;
  background: #fafaf8;
  outline: none;
  line-height: 1.55;
  transition: border-color 0.15s;
}
.notes-ta:focus { border-color: #1a1a1a; background: #fff; }

/* SESSION LIST */
.session-row {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 14px;
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  margin-bottom: 6px;
}
.session-date { font-size: 12px; color: #888; min-width: 100px; }
.session-type {
  font-size: 11px; font-weight: 500;
  padding: 2px 8px; border-radius: 99px;
  background: #f5f5f3; color: #666;
}
.session-desc { flex: 1; font-size: 12px; color: #888; padding-left: 8px; }
.session-actions { display: flex; gap: 6px; }

/* SAVE INDICATOR */
.save-indicator {
  display: flex; align-items: center; gap: 5px;
  font-size: 11px; color: #aaa;
  margin: 10px 0;
}
.save-dot { width: 6px; height: 6px; border-radius: 50%; background: #86efac; }

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #bbb;
  border: 1px dashed #e0e0dc;
  border-radius: 10px;
  font-size: 14px;
}
.empty-icon { font-size: 32px; display: block; margin-bottom: 12px; }

/* ACTION ROW */
.action-row { display: flex; gap: 10px; margin-top: 20px; flex-wrap: wrap; }

/* HEADER ROW */
.header-row {
  display: flex; align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
  gap: 16px;
  flex-wrap: wrap;
}
.page-title { font-size: 22px; font-weight: 600; color: #1a1a1a; }
.page-sub { font-size: 13px; color: #888; margin-top: 3px; }

/* SCORE SUMMARY */
.score-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;
}
.sc-card {
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 10px;
  padding: 14px 16px;
  text-align: center;
}
.sc-label { font-size: 10px; font-weight: 600; color: #aaa; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
.sc-value { font-size: 24px; font-weight: 600; color: #1a1a1a; }
.sc-sub { font-size: 11px; color: #aaa; margin-top: 2px; }

@media (max-width: 640px) {
  .main { padding: 1rem; }
  .stats-grid { grid-template-columns: repeat(2, 1fr); }
  .score-summary { grid-template-columns: repeat(3, 1fr); }
  .form-row { grid-template-columns: 1fr; }
}

/* PIPELINE */
.pipeline-card {
  background: #fff;
  border: 1px solid #ebebeb;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: all 0.15s;
}
.pipeline-card:hover { border-color: #ccc; box-shadow: 0 2px 8px rgba(0,0,0,0.06); transform: translateY(-1px); }
.pipeline-action-btn {
  display: block;
  width: 100%;
  margin-top: 8px;
  padding: 5px;
  border-radius: 6px;
  border: 1px solid #e0e0dc;
  background: #f8f8f6;
  font-size: 11px;
  font-weight: 500;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
  text-align: center;
}
.pipeline-action-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
