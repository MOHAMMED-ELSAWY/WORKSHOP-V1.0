import { isAdmin, useStore } from '../data/api';

const LABEL: Record<string, string> = { created: 'إنشاء', updated: 'تعديل', deleted: 'حذف', restored: 'استرجاع', approved: 'موافقة', rejected: 'رفض', purged: 'حذف نهائي' };

export default function ActivityLog() {
  const s = useStore();
  if (!isAdmin(s)) return <><h1>السجل</h1><p className="empty">السجل متاح للمدير فقط.</p></>;
  return (
    <>
      <h1>السجل</h1><p className="sub">كل العمليات بترتيب الأحدث</p>
      <div className="card scroll">
        {s.log.length === 0 ? <div className="empty">لسه مفيش عمليات مسجلة.</div> : (
          <table>
            <thead><tr><th>الوقت</th><th>المستخدم</th><th>العملية</th><th>التفاصيل</th></tr></thead>
            <tbody>{s.log.map((l) => <tr key={l.id}>
              <td>{new Date(l.at).toLocaleString('ar-EG')}</td><td>{l.by}</td><td><span className="tag">{LABEL[l.action] ?? l.action}</span></td><td>{l.summary}</td></tr>)}</tbody>
          </table>)}
      </div>
    </>
  );
}
