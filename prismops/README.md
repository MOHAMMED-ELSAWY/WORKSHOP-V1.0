# PRISMOPS (Phase 1 UI)
`npm install && npm run dev` — runs on demo data (browser localStorage). Switch user/role from the sidebar.
All data access lives in `src/data/api.ts`; replace its functions with Supabase calls / RPCs from
`prismops_phase1_schema.sql` (advance_order_stage, set_quote_status, delete_order, ...). Pages don't change.
