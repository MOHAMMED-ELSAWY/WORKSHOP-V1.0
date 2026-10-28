export type Role = 'admin' | 'engineer' | 'accountant';
export type OrderStatus = 'new' | 'in_progress' | 'delivered' | 'rejected';
export type QuoteStatus = 'pending' | 'approved' | 'rejected';
export type AttStatus = 'present' | 'night_shift' | 'absent' | 'leave_regular' | 'leave_casual' | 'sick' | 'early_leave' | 'business_trip';
export interface User { id: string; name: string; role: Role }
export interface Client { id: string; name: string; phone: string; deletedAt?: string }
export interface Order {
  id: string; code: string; clientId: string; jobName: string; productType: string;
  deliveryDate: string; status: OrderStatus; quoteStatus: QuoteStatus; urgent: boolean;
  stageIndex: number; // index in STAGES; STAGES.length = delivered
  sellPrice: number; totalCost: number; createdBy: string; createdAt: string; deletedAt?: string;
}
export interface Worker { id: string; name: string; position: string }
export interface AttEntry { status: AttStatus; checkIn: string; checkOut: string }
export interface LogEntry { id: string; at: string; by: string; action: string; summary: string }
export interface State {
  meId: string; users: User[]; clients: Client[]; orders: Order[];
  workers: Worker[]; attendance: Record<string, AttEntry>; log: LogEntry[];
}
