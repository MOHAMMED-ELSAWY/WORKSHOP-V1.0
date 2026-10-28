import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewOrder from './pages/NewOrder';
import Orders from './pages/Orders';
import Clients from './pages/Clients';
import ActivityLog from './pages/ActivityLog';
import Attendance from './pages/Attendance';
import RecycleBin from './pages/RecycleBin';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders/new" element={<NewOrder />} />
        <Route path="orders" element={<Orders />} />
        <Route path="clients" element={<Clients />} />
        <Route path="log" element={<ActivityLog />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="bin" element={<RecycleBin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
