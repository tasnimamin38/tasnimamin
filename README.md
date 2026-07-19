# HorrorForge — YouTube Creator OS

Tasnim-এর US-audience horror YouTube channel-এর জন্য একটি responsive, zero-build static dashboard। এটি আগের placeholder e-commerce HTML-এর বদলে একটি কাজের creator portfolio/control center দেয়।

## কী আছে

- Interactive RPM ও monthly revenue calculator
- Horror niche scorecards ও 6-step production workflow
- Category/search-সহ curated free creator tools
- Format/tone ভিত্তিক original video idea generator
- US English title-এর heuristic packaging score ও actionable checks
- Local-first content pipeline: stage/date tracking, sample plan, delete ও CSV export
- Browser `localStorage`-এ save হওয়া pipeline এবং 30-day sprint checklist
- Official YouTube monetization, advertiser-friendly ও AI disclosure links
- Responsive design, accessibility labels ও reduced-motion support
- GitHub Pages-compatible zero-build structure

## চালানো

কোনো build বা dependency দরকার নেই। `index.html` browser-এ খুলুন, অথবা local server চালান:

```bash
python3 -m http.server 8000
```

তারপর `http://localhost:8000` খুলুন।

## Deploy

কোনো build step নেই। GitHub Pages-এ publish করতে repository **Settings → Pages** থেকে branch-based deployment বেছে নিন এবং publish branch-এর root (`/`) নির্বাচন করুন। এই Arena GitHub connection-এর workflow permission না থাকায় workflow file যোগ করা হয়নি।

## গুরুত্বপূর্ণ

RPM calculator একটি planning tool—আয়ের নিশ্চয়তা নয়। Horror content-এ graphic violence, shock-first thumbnails, copied stories এবং mass-produced/reused content এড়িয়ে YouTube-এর সর্বশেষ official policy যাচাই করুন। Free/freemium tool limits ও commercial-use terms সময়ের সাথে বদলাতে পারে।

## Repository audit (19 July 2026)

শুরুতে repository-তে কেবল `README.md` এবং `tasnim.txt` নামে একটি generic static e-commerce mockup ছিল। কোনো YouTube skill, API integration, automation, package manifest বা test suite ছিল না। পুরনো `tasnim.txt` reference হিসেবে রাখা হয়েছে; নতুন site root `index.html` থেকে চলে।
