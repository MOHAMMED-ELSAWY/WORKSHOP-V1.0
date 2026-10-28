import { Link } from 'react-router-dom';
import { api, clientName, isAdmin, isLate, useStore } from '../data/api';
import StageStrip from '../components/StageStrip';

export default function Dashboard() {
  const s = useStore();
  const live = s.orders.filter((o) => !o.deletedAt);
  const pending = live.filter((o) => o.quoteStatus === 'pending' && o.status !== 'rejected');
  const late = live.filter(isLate);
  const active = live.filter((o) => o.status === 'new' || o.status === 'in_progress');
  return (
    <>
      <h1>لوحة التحكم</h1><p className="sub">ملخص الشغل الحالي</p>
      <div className="stats">
        <div className="stat"><b>{active.length}</b><span>أوردرات شغالة</span></div>
        <div className={'stat' + (late.length ? ' bad' : '')}><b>{late.length}</b><span>متأخرة عن التسليم</span></div>
        <div className={'stat' + (pending.length ? ' warn' : '')}><b>{pending.length}</b><span>بانتظار موافقة السعر</span></div>
        <div className="stat"><b>{live.filter((o) => o.status === 'delivered').length}</b><span>تم تسليمها</span></div>
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0, fontSize: 17 }}>بانتظار الموافقة</h2>
        {pending.length === 0 ? <div className="empty">مفيش أوردرات محتاجة موافقة.</div> : (
          <table><tbody>{pending.map((o) => (
            <tr key={o.id}>
              <td>{o.code}</td><td>{o.jobName}<br /><small>{clientName(s, o.clientId)}</small></td>
              <td>{o.sellPrice.toLocaleString('ar-EG')} ج.م</td>
              <td>{isAdmin(s)
                ? <><button className="primary" onClick={() => api.decide(o.id, true)}>موافقة</button> <button className="danger" onClick={() => api.decide(o.id, false)}>رفض</button></>
                : <span className="tag warn">في انتظار المدير</span>}</td>
            </tr>))}</tbody></table>
        )}
      </div>
      <div className="card">
        <h2 style={{ marginTop: 0, fontSize: 17 }}>الأوردرات الشغالة</h2>
        {active.length === 0 ? <div className="empty">مفيش أوردرات شغالة. <Link to="/orders/new">أضف أوردر جديد</Link></div> : (
          <div className="scroll"><table><tbody>{active.map((o) => (
            <tr key={o.id}><td>{o.code}</td><td>{o.jobName}</td><td><StageStrip index={o.stageIndex} /></td>
              <td>{isLate(o) ? <span className="tag bad">متأخر</span> : o.urgent ? <span className="tag warn">مستعجل</span> : null}</td></tr>))}</tbody></table></div>
        )}
      </div>
    </>
  );
}
