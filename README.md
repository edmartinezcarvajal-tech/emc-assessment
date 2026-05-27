# EMC Operational Systems — Assessment Platform

## Setup

1. Install dependencies: `npm install`
2. Add your `.env` file with Supabase credentials
3. Run locally: `npm start`
4. Build for production: `npm run build`

## Deploy to Vercel

1. Push this folder to a GitHub repository
2. Go to vercel.com → New Project → Import from GitHub
3. Add environment variables in Vercel:
   - REACT_APP_SUPABASE_URL
   - REACT_APP_SUPABASE_ANON_KEY
4. Deploy
