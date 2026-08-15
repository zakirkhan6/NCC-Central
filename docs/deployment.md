# Production Deployment Guide - NCC Central

## Frontend Deployment (Vercel / Netlify)
1. Set root directory to `frontend`.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Set Environment Variable: `VITE_API_BASE_URL=https://your-backend-domain.com/api`

## Backend Deployment (Render / Railway / AWS / VPS)
1. Set root directory to `backend`.
2. Environment Variables:
   - `PORT=5000`
   - `NODE_ENV=production`
   - `JWT_SECRET=your_production_secret_key`
   - `CLIENT_ORIGIN=https://your-frontend-domain.com`
   - `SUPABASE_URL=https://your-project.supabase.co`
   - `SUPABASE_ANON_KEY=your_anon_key`
3. Start command: `npm start`
