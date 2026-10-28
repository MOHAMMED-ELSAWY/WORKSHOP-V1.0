import { NavLink, Outlet } from 'react-router-dom';
import { api, canAttendance, isAdmin, me, useStore } from '../data/api';
import { ROLE_LABEL } from '../data/constants';

export default function Layout() {
  const s = useStore();
  const items: [string, string, boolean][] = [
    ['/', 'لوحة التحكم', true], ['/orders/new', 'أوردر جديد', true], ['/orders', 'الأوردرات', true],
    ['/clients', 'العملاء', true], ['/log', 'السجل', isAdmin(s)],
    ['/attendance', 'حضور وانصراف', canAttendance(s)], ['/bin', 'محذوفات', true],
  ];
  return (
    <div className="app">
      <nav className="side">
        <div className="brand">PRISMOPS</div>
        {items.filter((i) => i[2]).map(([to, label]) => (
          <NavLink key={to} to={to} end={to === '/' || to === '/orders'}>{label}</NavLink>
        ))}
        <div className="who">
          {me(s).name} ({ROLE_LABEL[me(s).role]})
          <select aria-label="تبديل المستخدم (للتجربة فقط)" value={s.meId} onChange={(e) => api.switchUser(e.target.value)}>
            {s.users.map((u) => <option key={u.id} value={u.id}>{u.name} - {ROLE_LABEL[u.role]}</option>)}
          </select>
        </div>
      </nav>
      <main className="main"><Outlet /></main>
    </div>
  );
}
