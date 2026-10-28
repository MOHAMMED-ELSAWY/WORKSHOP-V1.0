import type { AttStatus, OrderStatus, Role } from './types';
// In production these come from the company_stages table (per company).
export const STAGES = ['استلام', 'تجهيز خامة', 'قص وتشكيل', 'لحام', 'دهان', 'تسليم'];
export const BIN_DAYS = 30;
export const STATUS_LABEL: Record<OrderStatus, string> = { new: 'جديد', in_progress: 'قيد التنفيذ', delivered: 'تم التسليم', rejected: 'مرفوض' };
export const ROLE_LABEL: Record<Role, string> = { admin: 'مدير', engineer: 'مهندس', accountant: 'محاسب' };
export const ATT_LABEL: Record<AttStatus, string> = {
  present: 'حضور', night_shift: 'سهرة', absent: 'غياب', leave_regular: 'إجازة اعتيادية',
  leave_casual: 'إجازة عارضة', sick: 'مرضي', early_leave: 'انصراف مبكر', business_trip: 'مأمورية',
};
