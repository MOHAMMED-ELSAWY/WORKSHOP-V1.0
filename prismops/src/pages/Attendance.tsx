import { useState } from 'react';
import type { FormEvent } from 'react';
import { api, canAttendance, todayStr, useStore } from '../data/api';
import { ATT_LABEL } from '../data/constants';
import type { AttStatus } from '../data/types';

export default function Attendance() {
  const s = useStore();
  const [date, setDate] = useState(todayStr()); const [name, setName] = useState(''); const [pos, setPos] = useState('');
  if (!canAttendance(s)) return <><h1>حضور وانصراف</h1><p className="empty">الصفحة دي للمدير والمحاسب فقط.</p></>;
  function add(e: FormEvent) { e.preventDefault(); if (!name.trim()) return; api.addWorker(name.trim(), pos.trim()); setName(''); setPos(''); }
  return (
    <>
      <h1>حضور وانصراف</h1><p className="sub">سجّل حالة كل عامل في اليوم</p>
      <div className="row"><label>التاريخ <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /></label></div>
      <div className="card scroll">
        <table>
          <thead><tr><th>العامل</th><th>الحالة</th><th>حضور</th><th>انصراف</th></tr></thead>
          <tbody>{s.workers.map((w) => {
            const e = s.attendance[`${date}|${w.id}`];
            return <tr key={w.id}>
              <td>{w.name}<br /><small>{w.position}</small></td>
              <td><select value={e?.status ?? ''} onChange={(ev) => api.setAttendance(date, w.id, { status: ev.target.value as AttStatus })}>
                <option value="" disabled>غير مسجل</option>
                {Object.entries(ATT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></td>
              <td><input type="time" value={e?.checkIn ?? ''} onChange={(ev) => api.setAttendance(date, w.id, { checkIn: ev.target.value })} /></td>
              <td><input type="time" value={e?.checkOut ?? ''} onChange={(ev) => api.setAttendance(date, w.id, { checkOut: ev.target.value })} /></td>
            </tr>;
          })}</tbody>
        </table>
      </div>
      <form className="row card" onSubmit={add}>
        <input className="grow" placeholder="اسم عامل جديد" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="الوظيفة" value={pos} onChange={(e) => setPos(e.target.value)} />
        <button className="primary" type="submit">إضافة عامل</button>
      </form>
    </>
  );
}
