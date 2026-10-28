import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, todayStr, useStore } from '../data/api';

export default function NewOrder() {
  const s = useStore(); const nav = useNavigate();
  const clients = s.clients.filter((c) => !c.deletedAt);
  const [clientId, setClientId] = useState(clients[0]?.id ?? '');
  const [newName, setNewName] = useState(''); const [newPhone, setNewPhone] = useState('');
  const [jobName, setJobName] = useState(''); const [productType, setProductType] = useState('');
  const [deliveryDate, setDeliveryDate] = useState(todayStr()); const [urgent, setUrgent] = useState(false);
  const [sellPrice, setSellPrice] = useState(0); const [totalCost, setTotalCost] = useState(0);
  const [err, setErr] = useState('');

  function submit(e: FormEvent) {
    e.preventDefault();
    if (!jobName.trim()) return setErr('اكتب اسم الشغلانة.');
    let cid = clientId;
    if (cid === '__new') {
      if (!newName.trim()) return setErr('اكتب اسم العميل الجديد.');
      cid = api.addClient(newName.trim(), newPhone.trim());
    }
    if (!cid) return setErr('اختار عميل.');
    api.addOrder({ clientId: cid, jobName: jobName.trim(), productType: productType.trim(), deliveryDate, urgent, sellPrice, totalCost });
    nav('/orders');
  }
  return (
    <>
      <h1>أوردر جديد</h1><p className="sub">{s.users.find((u) => u.id === s.meId)?.role === 'admin' ? 'هيتوافق عليه تلقائيًا.' : 'هيتبعت للمدير للموافقة على السعر.'}</p>
      <form className="card form" onSubmit={submit}>
        <label>العميل
          <select value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {clients.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}<option value="__new">+ عميل جديد</option>
          </select></label>
        {clientId === '__new' && <>
          <label>اسم العميل<input value={newName} onChange={(e) => setNewName(e.target.value)} /></label>
          <label>التليفون<input value={newPhone} onChange={(e) => setNewPhone(e.target.value)} inputMode="tel" /></label></>}
        <label>اسم الشغلانة<input value={jobName} onChange={(e) => setJobName(e.target.value)} /></label>
        <label>نوع المنتج<input value={productType} onChange={(e) => setProductType(e.target.value)} /></label>
        <label>تاريخ التسليم<input type="date" value={deliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} /></label>
        <label>سعر البيع (ج.م)<input type="number" min={0} value={sellPrice} onChange={(e) => setSellPrice(Number(e.target.value))} /></label>
        <label>التكلفة (ج.م)<input type="number" min={0} value={totalCost} onChange={(e) => setTotalCost(Number(e.target.value))} /></label>
        <label style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}><input type="checkbox" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} /> أوردر مستعجل</label>
        <div style={{ gridColumn: '1 / -1' }}>
          {err && <p role="alert" style={{ color: 'var(--bad)' }}>{err}</p>}
          <button className="primary" type="submit">حفظ الأوردر</button>
        </div>
      </form>
    </>
  );
}
