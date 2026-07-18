# নিশ্চিত — বাস্তব COD loss-control SaaS

`নিশ্চিত` হলো বাংলাদেশি Facebook/WhatsApp সেলারদের জন্য একটি multi-user SaaS: COD অর্ডার সংরক্ষণ, কাস্টমার history, ঝুঁকি flag, verification audit log এবং order status control। এটি static demo নয়—Supabase database, authentication এবং Row Level Security দিয়ে ব্যবহারকারীর ডেটা আলাদা রাখার কাঠামো তৈরি করা আছে।

## এখন যা কাজ করে

- ইমেইল/password account registration ও login
- প্রত্যেক seller-এর জন্য আলাদা business profile
- অর্ডার ও কাস্টমার database-এ সংরক্ষণ
- একই ফোন নম্বরের customer history
- অর্ডার দামের ভিত্তিতে প্রাথমিক low/medium/high risk flag; customer return history থাকলেও high risk
- manual/call/WhatsApp verification audit event
- pending → confirmed → packed → shipped → delivered/returned/cancelled order workflow
- Supabase Row Level Security: একজন seller অন্য seller-এর data পড়তে/বদলাতে পারবেন না
- GitHub Pages deployment workflow

## চালু করার প্রয়োজনীয়তা

এটি বাস্তবে চালাতে একবার **Supabase project** দরকার। এটি ফ্রি tier দিয়েও শুরু করা যায়। এই project-এর data, auth এবং security policy GitHub-এর বদলে Supabase-এ থাকবে।

### ১. Supabase project তৈরি

1. [Supabase](https://supabase.com/dashboard) এ নতুন project তৈরি করুন।
2. Dashboard → **SQL Editor** → New query খুলুন।
3. `supabase/schema.sql` ফাইলের সম্পূর্ণ লেখা paste করে **Run** করুন।
4. Authentication → Providers → Email চালু আছে নিশ্চিত করুন। Production-এ email confirmation চালু রাখুন।
5. Project Settings → API থেকে **Project URL** এবং **anon/public key** কপি করুন। কখনো `service_role` key frontend-এ দেবেন না।

### ২. App configuration

`config.js`-এ নিচের দুইটি value বসান:

```js
window.NISHCHIT_CONFIG = {
  supabaseUrl: "https://YOUR-PROJECT.supabase.co",
  supabaseAnonKey: "YOUR-ANON-OR-PUBLISHABLE-KEY",
  appName: "নিশ্চিত"
};
```

তারপর পরিবর্তন GitHub-এ push করুন। Anon/public key browser-এ রাখা স্বাভাবিক; নিরাপত্তা নিশ্চিত করে `schema.sql`-এর RLS policy। `service_role`, database password বা API secret কখনো commit করবেন না।

### ৩. GitHub Pages live করা

এই repository-তে `.github/workflows/deploy-pages.yml` যোগ করা আছে। প্রথমবার repository Settings → Pages → Source-এ **GitHub Actions** নির্বাচন করুন। workflow সফল হলে Actions-এর deployment link-এ live URL পাওয়া যাবে।

> GitHub Pages শুধু frontend host করে। Database/auth Supabase handle করে।

## WhatsApp, SMS ও Courier integration

এই app-এর verification log এখন production-safe manual workflow। Automated message অথবা courier sync চালু করার আগে নিচের জিনিস প্রয়োজন:

- আপনার নিজের Meta WhatsApp Business account ও approved message templates;
- একটি অনুমোদিত SMS provider account;
- সংশ্লিষ্ট courier-এর অনুমোদিত merchant API access;
- কাস্টমারের স্পষ্ট সম্মতি ও opt-out ব্যবস্থা।

এই credentials ছাড়া কারও পক্ষ থেকে message পাঠানো বা courier data access করা যাবে না। পরের development phase-এ secret server-side environment variables-এ রেখে integration করা উচিত—কখনো `config.js`-এ নয়।

## ব্যবসায়িক launch plan

1. প্রথমে ২০ জন seller: Dhaka/Chattogram fashion, cosmetics, gadget page; কমপক্ষে ১০ COD order/day।
2. ১৪ দিনের free onboarding; প্রথম ২০ জনকে ৳৪৯৯/month founding plan।
3. এরপর Growth plan ৳৯৯৯/month, ১,০০০ verification/month।
4. প্রতিটি seller-এর জন্য আগে/পরে: return rate, avoided shipment এবং saved courier cost মাপুন।

## Development

কোনো npm build লাগে না। `index.html` একটি browser app; CDN থেকে Tailwind, Lucide এবং Supabase JS আসে। `config.js` পূরণ না করলে app setup screen দেখাবে—কোনো fake data দেখাবে না।
