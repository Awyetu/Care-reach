# CareReach Nigeria 🇳🇬

> **Find free healthcare near you.**  
> A centralized, community-driven platform for discovering and sharing verified free medical outreaches and healthcare services across Nigeria.

---

## 1. Product Purpose

Across Nigeria, free medical outreaches are frequently organized by NGOs, churches, mosques, medical associations, and diaspora doctor groups. However, information is usually scattered across WhatsApp groups, Facebook fliers, and word-of-mouth. People who desperately need free cataract surgeries, dental treatments, hypertension drugs, or childhood vaccines often find out too late.

**CareReach Nigeria solves this problem by providing a verified, searchable discovery platform before events happen.**

### Core Product Principles:
- **Verification States:** `PENDING`, `VERIFIED`, `REJECTED`, `EXPIRED`, `CANCELLED`
- **Zero Unverified Visibility:** Public users only see `VERIFIED` outreaches. Community submissions enter `PENDING` and must be audited by moderators.
- **Audited Discrepancy Checks:** Submitted details are checked side-by-side with official flyers before verification.
- **Information Platform Only:** CareReach verifies event authenticity, not individual clinical quality. Prominent disclaimers remind users to verify crucial details prior to traveling.

---

## 2. Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Vite
- **Icons & Motion:** Lucide React, Motion
- **Database & Storage:** PostgreSQL / Supabase (with full Row Level Security & schema migrations in `/supabase`)
- **Deployment:** Vercel / Cloud Run compatible

---

## 3. Environment Variables

Create a `.env` file in the project root:

```env
# Optional Supabase credentials for remote persistent PostgreSQL
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Application Base URL
APP_URL=http://localhost:3000
```

---

## 4. Local Installation & Development

### Step 1: Clone and install dependencies
```bash
git clone https://github.com/your-username/carereach-nigeria.git
cd carereach-nigeria
npm install
```

### Step 2: Start the local dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 5. Supabase Setup & Database Migrations

### Step 1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com).
2. Create a new project called `carereach-nigeria`.

### Step 2: Run the SQL Schema Migration
1. Go to the **SQL Editor** in the Supabase Dashboard.
2. Open `supabase/migrations/20261008000000_carereach_schema.sql` from this repository.
3. Paste and run the entire SQL query.
   - This sets up the `users`, `outreaches`, `outreach_evidence`, `moderation_actions`, `reports`, and `notification_preferences` tables.
   - It also activates Row Level Security (RLS) policies and performance indexes.

### Step 3: Seed the Database
1. In the Supabase SQL Editor, run `supabase/seed.sql`.
2. This creates sample verified outreaches across Lagos, Abuja, Rivers, and other Nigerian states.

### Step 4: Create the First Moderator/Admin
In the SQL Editor, assign an admin role to your authenticated email:
```sql
INSERT INTO users (name, email, role)
VALUES ('Lead Moderator', 'admin@carereach.ng', 'ADMIN')
ON CONFLICT (email) DO UPDATE SET role = 'ADMIN';
```

---

## 6. End-to-End Workflow Testing

CareReach Nigeria supports the complete lifecycle:

1. **Find an Outreach:**
   - Search by state (e.g. Lagos), LGA (e.g. Ikeja), or service (e.g. Eye Care, Dental Care).
   - View event details, Google Maps directions, and share via WhatsApp or link copy.

2. **Submit an Outreach:**
   - Go to `/submit`.
   - Live duplicate detection alerts the user if a similar event already exists for that date and state.
   - Attach flyer image and contributor contact.
   - Submitting generates a unique reference ID and sets status to `PENDING`.

3. **Moderator Review:**
   - Navigate to `/admin`.
   - Inspect the submitted flyer image side-by-side with structured event details.
   - Click `Verify & Publish` to transition to `VERIFIED`, or `Reject` with a required justification.
   - All actions are permanently saved to the immutable `moderation_actions` audit log.

4. **Report Incorrect Information:**
   - If an event is cancelled or changed, click `Report incorrect information` on any outreach card.
   - The moderation team investigates and updates the status to `CANCELLED` or edits the details.

5. **Auto-Expiration:**
   - Past events are automatically transitioned from `VERIFIED` to `EXPIRED`.

---

## 7. Deploy to Vercel

```bash
# Using Vercel CLI
npm install -g vercel
vercel

# Or push to GitHub and connect repository to Vercel dashboard.
# Build command: npm run build
# Output directory: dist
```

---

## 8. License & Disclaimers

CareReach Nigeria is an open community public service.  
**Disclaimer:** CareReach Nigeria provides information regarding upcoming healthcare outreaches. It does not provide medical diagnosis, treatment, or clinical guarantees.
