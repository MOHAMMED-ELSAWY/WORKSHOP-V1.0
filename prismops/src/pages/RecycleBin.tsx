import { api, canEdit, clientName, isAdmin, useStore } from '../data/api';
import { BIN_DAYS } from '../data/constants';

export default function RecycleBin() {
  const s = useStore();
  const rows = s.orders.filter((o) => o.deletedAt && canEdit(s, o));
  const left = (d: string) => Math.max(0, Math.ceil(BIN_DAYS - (Date.now() - new Date(d).getTime()) / 864e5));
  return (
    <>
      <h1>محذوفات</h1><p className="sub">الأوردرات المحذوفة بتتشال نهائيًا بعد {BIN_DAYS} يوم</p>
      <div className="card scroll">
        {rows.length === 0 ? <div className="empty">سلة المحذوفات فاضية.</div> : (
          <table>
            <thead><tr><th>الكود</th><th>الشغلانة / العميل</th><th>المتبقي</th><th></th></tr></thead>
            <tbody>{rows.map((o) => <tr key={o.id}>
              <td>{o.code}</td><td>{o.jobName}<br /><small>{clientName(s, o.clientId)}</small></td>
              <td>{left(o.deletedAt!)} يوم</td>
              <td><button onClick={() => api.restoreOrder(o.id)}>استرجاع</button>{' '}
                {isAdmin(s) && <button className="danger" onClick={() => { if (confirm('حذف نهائي؟ مش هتقدر ترجّعه.')) api.purgeOrder(o.id); }}>حذف نهائي</button>}</td>
            </tr>)}</tbody>
          </table>)}
      </div>
    </>
  );
}
