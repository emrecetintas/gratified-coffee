# View.Gratified.com Deployment Guide

## Quick Setup Options

### Option 1: Separate Repository (Recommended)
1. Create a new repository for `view.gratified.com`
2. Copy `view.html` as `index.html` 
3. Copy `CNAME_view` as `CNAME`
4. Enable GitHub Pages on the new repository
5. Point your DNS to GitHub Pages

### Option 2: Subdirectory in Current Repository
1. Rename `view.html` to `index.html` in a `view/` subdirectory
2. Configure your web server to serve `view/` at `view.gratified.com`

### Option 3: Quick Test (Current Setup)
You can test the view immediately by:
1. Accessing `http://localhost:8002/view.html` on your current server
2. The table will show all orders from your Supabase database

## Features
- ✅ Same Supabase anon key baked in
- ✅ Read-only access (RLS prevents writes)
- ✅ Sortable table (click column headers)
- ✅ Real-time data from your coffee orders
- ✅ Mobile responsive
- ✅ Brand colors matching gratified.coffee

## DNS Configuration
For `view.gratified.com` to work:
1. Add a CNAME record: `view` → `your-github-username.github.io`
2. Or point to your hosting provider's domain

## Security
- Uses the same anon key as your main app
- RLS policies prevent writes through this interface
- Only shows order data (no sensitive information) 