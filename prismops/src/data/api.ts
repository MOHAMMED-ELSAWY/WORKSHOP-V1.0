// Mock data layer. Every function here maps 1:1 to a Supabase call / RPC from
// prismops_phase1_schema.sql, so swapping the backend only touches THIS file.
// Permission checks below mirror the RLS rules; the database stays the real authority.
import { useSyncExternalStore } from 'react';
import type { AttEntry, AttStatus, Order, State } from './types';
import { STAGES } from './constants';

const KEY = 'prismops-demo-v1';
const uid = () => Math.random().toString(36).slice(2, 10);
const today = () => new Date().toISOString().slice(0, 10);
const days = (n: number) => new Date(Date.now() + n * 864e5).toISOString().slice(0, 10);

function seed(): State {
  const mk = (i: number, clientId: string, jobName: string, productType: string, d: number, stage: number, q: 'pending' | 'approved', urgent = false, price = 0): Order => ({
    id: 'o' + i, code: `PO-${new Date().getFullYear()}-000${i}`, clientId, jobName, productType, deliveryDate: days(d),
    status: stage >= STAGES.length ? 'delivered' : stage > 0 ? 'in_progress' : 'new', quoteStatus: q, urgent,
    stageIndex: stage, sellPrice: price, totalCost: Math.round(price * 0.7), createdBy: i % 2 ? 'u2' : 'u1', createdAt: new Date().toISOString(),
  });
  return {
    meId: 'u1',
    users: [{ id: 'u1', name: 'أحمد المدير', role: 'admin' }, { id: 'u2', name: 'منى المهندسة', role: 'engineer' }, { id: 'u3', name: 'خالد المحاسب', role: 'accountant' }],
    clients: [{ id: 'c1', name: 'شركة النيل للإنشاءات', phone: '01001234567' }, { id: 'c2', name: 'مصنع الدلتا', phone: '01112345678' }, { id: 'c3', name: 'م. سامي حسن', phone: '01223456789' }],
    orders: [
      mk(1, 'c1', 'سلالم حديد - مبنى B', 'سلالم', 12, 3, 'approved', true, 48000),
      mk(2, 'c2', 'حاويات صاج استانلس', 'حاويات', -2, 2, 'approved', false, 91000),
      mk(3, 'c3', 'بوابة ورشة', 'بوابات', 20, 0, 'pending', false, 15500),
      mk(4, 'c1', 'هيكل مظلة', 'هياكل', -10, STAGES.length, 'approved', false, 67000),
    ],
    workers: [{ id: 'w1', name: 'محمود عبد الله', position: 'لحام' }, { id: 'w2', name: 'إبراهيم سعيد', position: 'فني دهان' }, { id: 'w3', name: 'يوسف علي', position: 'عامل قص' }],
    attendance: {}, log: [],
  };
}

function load(): State { try { const r = localStorage.getItem(KEY); if (r) return JSON.parse(r) as State; } catch { /* ignore */ } return seed(); }
let state: State = load();
const subs = new Set<() => void>();
function commit(next: State) { state = next; try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* ignore */ } subs.forEach((f) => f()); }
export const useStore = (): State => useSyncExternalStore((f) => { subs.add(f); return () => { subs.delete(f); }; }, () => state);

export const me = (s: State) => s.users.find((u) => u.id === s.meId)!;
export const isAdmin = (s: State) => me(s).role === 'admin';
export const canEdit = (s: State, o: Order) => isAdmin(s) || o.createdBy === s.meId;
export const canAttendance = (s: State) => me(s).role !== 'engineer';
export const clientName = (s: State, id: string) => s.clients.find((c) => c.id === id)?.name ?? '—';
export const isLate = (o: Order) => !o.deletedAt && (o.status === 'new' || o.status === 'in_progress') && o.deliveryDate < today();
export const todayStr = today;

function log(s: State, action: string, summary: string): State {
  return { ...s, log: [{ id: uid(), at: new Date().toISOString(), by: me(s).name, action, summary }, ...s.log] };
}
function patchOrder(id: string, f: (o: Order) => Order, action: string): void {
  const o = state.orders.find((x) => x.id === id); if (!o) return;
  const n = f(o);
  commit(log({ ...state, orders: state.orders.map((x) => (x.id === id ? n : x)) }, action, `${o.code} - ${o.jobName}`));
}

export const api = {
  switchUser: (id: string) => commit({ ...state, meId: id }),
  addClient(name: string, phone: string): string {
    const id = 'c' + uid(); commit(log({ ...state, clients: [...state.clients, { id, name, phone }] }, 'created', `عميل: ${name}`)); return id;
  },
  addOrder(d: { clientId: string; jobName: string; productType: string; deliveryDate: string; urgent: boolean; sellPrice: number; totalCost: number }): void {
    const n = state.orders.length + 1;
    const o: Order = { ...d, id: 'o' + uid(), code: `PO-${new Date().getFullYear()}-${String(n).padStart(4, '0')}`, status: 'new',
      quoteStatus: isAdmin(state) ? 'approved' : 'pending', stageIndex: 0, createdBy: state.meId, createdAt: new Date().toISOString() };
    commit(log({ ...state, orders: [o, ...state.orders] }, 'created', `${o.code} - ${o.jobName}`));
  },
  moveStage(id: string, dir: 1 | -1): void {
    patchOrder(id, (o) => {
      if (o.status === 'rejected') return o;
      const i = Math.min(STAGES.length, Math.max(0, o.stageIndex + dir));
      return { ...o, stageIndex: i, status: i >= STAGES.length ? 'delivered' : i > 0 ? 'in_progress' : 'new' };
    }, 'updated');
  },
  decide(id: string, ok: boolean): void {
    if (!isAdmin(state)) return;
    patchOrder(id, (o) => ({ ...o, quoteStatus: ok ? 'approved' : 'rejected', status: ok ? o.status : 'rejected' }), ok ? 'approved' : 'rejected');
  },
  deleteOrder(id: string): void { const o = state.orders.find((x) => x.id === id); if (o && canEdit(state, o)) patchOrder(id, (x) => ({ ...x, deletedAt: new Date().toISOString() }), 'deleted'); },
  restoreOrder(id: string): void { const o = state.orders.find((x) => x.id === id); if (o && canEdit(state, o)) patchOrder(id, (x) => ({ ...x, deletedAt: undefined }), 'restored'); },
  purgeOrder(id: string): void {
    const o = state.orders.find((x) => x.id === id); if (!o || !isAdmin(state)) return;
    commit(log({ ...state, orders: state.orders.filter((x) => x.id !== id) }, 'purged', `${o.code} - ${o.jobName}`));
  },
  addWorker(name: string, position: string): void { commit(log({ ...state, workers: [...state.workers, { id: 'w' + uid(), name, position }] }, 'created', `عامل: ${name}`)); },
  setAttendance(date: string, workerId: string, patch: Partial<AttEntry>): void {
    const k = `${date}|${workerId}`;
    const cur: AttEntry = state.attendance[k] ?? { status: 'present' as AttStatus, checkIn: '', checkOut: '' };
    commit({ ...state, attendance: { ...state.attendance, [k]: { ...cur, ...patch } } });
  },
  resetDemo(): void { commit(seed()); },
};
