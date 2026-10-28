import { useState } from 'react';
import { api, canEdit, clientName, isLate, useStore } from '../data/api';
import { STATUS_LABEL } from '../data/constants';
import StageStrip from '../components/StageStrip';

export default function Orders() {
  const s = useStore();
  const [q, setQ] = useState(''); const [st, setSt] = useState('all');
  const rows = s.orders.filter((o) => !o.deletedAt && (st === 'all' || o.status === st)
    && `${o.code} ${o.jobName} ${clientName(s, o.clientId)}`.includes(q.trim()));
  return (
    <>
      <h1>الأوردرات</h1><p className="sub">{rows.length} أوردر</p>
      <div className="row">
        <input className="grow" placeholder="ابحث بالكود أو الشغلانة أو العميل" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={st} onChange={(e) => setSt(e.target.value)} aria-label="الحالة">
          <option value="all">كل الحالات</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>
      <div className="card scroll">
        {rows.length === 0 ? <div className="empty">مفيش أوردرات مطابقة.</div> : (
          <table>
            <thead><tr><th>الكود</th><th>الشغلانة / العميل</th><th>المرحلة</th><th>التسليم</th><th>الحالة</th><th></th></tr></thead>
            <tbody>{rows.map((o) => (
              <tr key={o.id}>
                <td>{o.code}</td>
                <td>{o.jobName}<br /><small>{clientName(s, o.clientId)}</small></td>
                <td><StageStrip index={o.stageIndex} /></td>
                <td>{o.deliveryDate}{isLate(o) && <> <span className="tag bad">متأخر</span></>}</td>
                <td><span className={'tag ' + (o.status === 'rejected' ? 'bad' : o.status === 'delivered' ? 'ok' : '')}>{STATUS_LABEL[o.status]}</span>
                  {o.quoteStatus === 'pending' && o.status !== 'rejected' && <> <span className="tag warn">بانتظار الموافقة</span></>}</td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button disabled={o.status === 'rejected' || o.stageIndex === 0} onClick={() => api.moveStage(o.id, -1)} aria-label="رجوع مرحلة">›</button>{' '}
                  <button disabled={o.status === 'rejected' || o.status === 'delivered'} onClick={() => api.moveStage(o.id, 1)} aria-label="المرحلة التالية">‹</button>{' '}
                  <button className="danger" disabled={!canEdit(s, o)} onClick={() => api.deleteOrder(o.id)}>حذف</button>
                </td>
              </tr>))}</tbody>
          </table>)}
      </div>
    </>
  );
}
