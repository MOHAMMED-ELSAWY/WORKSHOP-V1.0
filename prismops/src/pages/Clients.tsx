import { useState } from 'react';
import type { FormEvent } from 'react';
import { api, useStore } from '../data/api';

export default function Clients() {
  const s = useStore();
  const [q, setQ] = useState(''); const [name, setName] = useState(''); const [phone, setPhone] = useState('');
  const rows = s.clients.filter((c) => !c.deletedAt && `${c.name} ${c.phone}`.includes(q.trim()));
  function add(e: FormEvent) { e.preventDefault(); if (!name.trim()) return; api.addClient(name.trim(), phone.trim()); setName(''); setPhone(''); }
  return (
    <>
      <h1>العملاء</h1><p className="sub">{rows.length} عميل</p>
      <form className="row card" onSubmit={add}>
        <input className="grow" placeholder="اسم العميل" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="التليفون" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <button className="primary" type="submit">إضافة عميل</button>
      </form>
      <div className="row"><input className="grow" placeholder="ابحث بالاسم أو التليفون" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="card scroll">
        {rows.length === 0 ? <div className="empty">مفيش عملاء مطابقين.</div> : (
          <table>
            <thead><tr><th>العميل</th><th>التليفون</th><th>عدد الأوردرات</th><th>إجمالي المبيعات</th></tr></thead>
            <tbody>{rows.map((c) => {
              const os = s.orders.filter((o) => o.clientId === c.id && !o.deletedAt && o.status !== 'rejected');
              return <tr key={c.id}><td>{c.name}</td><td dir="ltr" style={{ textAlign: 'start' }}>{c.phone || '—'}</td><td>{os.length}</td>
                <td>{os.reduce((a, o) => a + o.sellPrice, 0).toLocaleString('ar-EG')} ج.م</td></tr>;
            })}</tbody>
          </table>)}
      </div>
    </>
  );
}
