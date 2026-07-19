const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const number = new Intl.NumberFormat('en-US');

// Mobile navigation
$('.menu-button').addEventListener('click', (event) => {
  const header = $('.topbar');
  const open = header.classList.toggle('open');
  event.currentTarget.setAttribute('aria-expanded', String(open));
  event.currentTarget.textContent = open ? '×' : '☰';
});
$$('.topbar nav a').forEach((link) => link.addEventListener('click', () => $('.topbar').classList.remove('open')));

// Revenue calculator — the user controls the RPM assumption.
const viewsInput = $('#views');
const rpmInput = $('#rpm');
const usInput = $('#usShare');
function updateRevenue() {
  const views = Number(viewsInput.value);
  const rpm = Number(rpmInput.value);
  const revenue = (views / 1000) * rpm;
  $('#viewsOutput').textContent = number.format(views);
  $('#rpmOutput').textContent = `$${rpm.toFixed(2)}`;
  $('#usOutput').textContent = `${usInput.value}%`;
  $('#revenueOutput').textContent = money.format(revenue);
  $('#perThousand').textContent = `$${rpm.toFixed(2)}`;
  $('#perMillion').textContent = money.format(rpm * 1000);
  $('#revenueRange').textContent = `Planning range: ${money.format((views / 1000) * 2)}–${money.format((views / 1000) * 7)}`;
  $$('.preset-row button').forEach((button) => button.classList.toggle('active', Number(button.dataset.rpm) === rpm));
}
[viewsInput, rpmInput, usInput].forEach((input) => input.addEventListener('input', updateRevenue));
$$('[data-rpm]').forEach((button) => button.addEventListener('click', () => { rpmInput.value = button.dataset.rpm; updateRevenue(); }));
updateRevenue();

// Toolkit filters
let activeFilter = 'all';
function filterTools() {
  const query = $('#toolSearch').value.trim().toLowerCase();
  let count = 0;
  $$('.tool-card').forEach((card) => {
    const matchesCategory = activeFilter === 'all' || card.dataset.category === activeFilter;
    const matchesQuery = card.dataset.name.includes(query) || card.textContent.toLowerCase().includes(query);
    card.hidden = !(matchesCategory && matchesQuery);
    if (!card.hidden) count += 1;
  });
  $('#emptyTools').hidden = count !== 0;
}
$('#toolSearch').addEventListener('input', filterTools);
$$('.filter').forEach((button) => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  $$('.filter').forEach((item) => item.classList.toggle('active', item === button));
  filterTools();
}));

// Original idea seeds. These are starting points, never a substitute for research.
const ideas = {
  history: [
    ['The American Town That Vanished From Every Map', 'In 1974, the road into Bellwether was closed overnight. The strange part? Official maps insist the town never existed.', '12–15 MIN', 'ARCHIVAL + MAPS'],
    ['Why This Appalachian Tunnel Has Been Sealed for 83 Years', 'Rail workers reported the same impossible sound for six nights. On the seventh, the company poured concrete over both entrances.', '14–18 MIN', 'DOCUMENTS + B-ROLL'],
    ['The Forgotten Hotel Beneath a Modern US City', 'Thousands walk above its ballroom every day, unaware that the last guest never officially checked out.', '10–14 MIN', 'PHOTOS + 3D MAP']
  ],
  fiction: [
    ['Every Night, My Radio Broadcasts Tomorrow’s Missing Persons', 'The first two names were strangers. Tonight, the voice read mine.', '10–13 MIN', 'AI ART + RADIO FX'],
    ['I Inspect Empty Houses. One of Them Keeps Growing New Rooms.', 'The floor plan says nine rooms. I counted eleven—and something was breathing behind the newest door.', '12–16 MIN', 'POV + ORIGINAL ART'],
    ['The Rules at America’s Last Overnight Toll Booth', 'Rule four says never accept a coin dated next year. At 2:13 a.m., someone handed me one.', '11–14 MIN', 'NIGHT B-ROLL + FX']
  ],
  mystery: [
    ['The Voicemail That Arrived From a Disconnected Desert Phone', 'The number had been inactive for twelve years, but the message contained coordinates and today’s weather.', '13–17 MIN', 'MAPS + RECREATION'],
    ['A Camera Appeared in the Woods. Every Photo Was Taken Tomorrow.', 'Hikers found 24 undeveloped frames. The final image showed the search party looking back.', '12–15 MIN', 'PHOTOS + TIMELINE'],
    ['Why Dozens of US Towns Share This Unmarked Door?', 'It has no handle, no listed owner and the same three numbers scratched into the frame.', '14–18 MIN', 'FIELD PHOTOS + MAP']
  ],
  analog: [
    ['PUBLIC ACCESS 88: Do Not Follow the Weather Voice', 'A recovered 1986 broadcast interrupts the forecast with instructions no resident remembers hearing.', '8–12 MIN', 'VHS + BROADCAST'],
    ['The National Sleep Test — Orientation Tape 04', 'Participants were told the fourth night was optional. The tape insists nobody has ever reached it.', '9–13 MIN', 'TRAINING TAPE'],
    ['Emergency Alert: Your Reflection Is Delayed', 'The message gives viewers three tests. If you fail the second, it says the broadcast is already too late.', '8–11 MIN', 'EAS + ORIGINAL FX']
  ]
};
let lastIdea = -1;
function generateIdea() {
  const format = $('#ideaFormat').value;
  const tone = $('#ideaTone').value;
  const options = ideas[format];
  let index;
  do { index = Math.floor(Math.random() * options.length); } while (index === lastIdea && options.length > 1);
  lastIdea = index;
  const [title, hook, length, visual] = options[index];
  const toneLead = tone === 'documentary' ? 'Evidence-led angle: ' : tone === 'intimate' ? 'First-person angle: ' : '';
  $('#ideaTitle').textContent = title;
  $('#ideaHook').textContent = toneLead + hook;
  $('#ideaLength').textContent = length;
  $('#ideaVisual').textContent = visual;
}
$('#generateIdea').addEventListener('click', generateIdea);

const toast = (message) => {
  const element = $('#toast');
  element.textContent = message;
  element.classList.add('show');
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => element.classList.remove('show'), 1800);
};
$('#copyIdea').addEventListener('click', async () => {
  const brief = `TITLE: ${$('#ideaTitle').textContent}\nHOOK: ${$('#ideaHook').textContent}\nLENGTH: ${$('#ideaLength').textContent}\nVISUAL DIRECTION: ${$('#ideaVisual').textContent}\n\nReminder: Research, fact-check, and rewrite in your own voice.`;
  try { await navigator.clipboard.writeText(brief); toast('Brief copied'); }
  catch { toast('Copy failed — select the text manually'); }
});

// Lightweight title packaging checker (heuristics, not a prediction of views).
function analyzeTitle() {
  const title = $('#titleInput').value.trim();
  const length = title.length;
  const words = title.split(/\s+/).filter(Boolean);
  const curiosityWords = /\b(secret|vanished|never|why|what|hidden|forgotten|last|impossible|sealed|mystery|disappeared|unknown|inside|beneath)\b/i;
  const specificWords = /\b(19|20)\d{2}\b|\b\d+\b|\b(american|america|us|appalachian|desert|town|hotel|tunnel|forest|highway)\b/i;
  const allCaps = words.filter((word) => word.length > 3 && word === word.toUpperCase()).length;
  const checks = [];
  let score = 26;
  if (length >= 35 && length <= 65) { score += 22; checks.push(['pass', `✓ Clear length: ${length} characters`]); }
  else if (length < 35) { score += 8; checks.push(['warn', `! ${length} characters—আরও specific হতে পারে`]); }
  else { score += 5; checks.push(['warn', `! ${length} characters—mobile-এ truncate হতে পারে`]); }
  if (curiosityWords.test(title)) { score += 20; checks.push(['pass', '✓ Creates a curiosity gap']); }
  else checks.push(['warn', '! একটি natural curiosity element পরীক্ষা করুন']);
  if (specificWords.test(title)) { score += 14; checks.push(['pass', '✓ Contains a specific subject or detail']); }
  else checks.push(['warn', '! Place, year, number বা concrete subject যোগ করুন']);
  if (allCaps === 0 && !/[!?]{2,}/.test(title)) { score += 4; checks.push(['pass', '✓ Easy to scan—no clutter']); }
  else checks.push(['warn', '! ALL CAPS বা repeated punctuation বাদ দিন']);
  score = title ? Math.min(100, score) : 0;
  $('#titleScore').textContent = score;
  $('#titleVerdict').textContent = score >= 82 ? 'STRONG' : score >= 65 ? 'REFINE' : 'REWORK';
  $('#titleChecks').innerHTML = checks.map(([type, text]) => `<li class="${type}">${text}</li>`).join('');
}
$('#analyzeTitle').addEventListener('click', analyzeTitle);
$('#titleInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') analyzeTitle(); });
analyzeTitle();

// Content pipeline with local persistence and portable CSV export.
const pipelineKey = 'horrorforge-pipeline-v1';
const stageLabels = { idea: 'IDEA', research: 'RESEARCH', script: 'SCRIPT', edit: 'EDITING', ready: 'READY', published: 'PUBLISHED' };
let videos = [];
try { videos = JSON.parse(localStorage.getItem(pipelineKey) || '[]'); } catch { videos = []; }
if (!Array.isArray(videos)) videos = [];
function saveVideos() { localStorage.setItem(pipelineKey, JSON.stringify(videos)); }
function safeText(value) { const node = document.createElement('span'); node.textContent = value; return node.innerHTML; }
function renderPipeline() {
  $('#videoCount').textContent = videos.length;
  $('#pipelineEmpty').hidden = videos.length > 0;
  $('#pipelineList').innerHTML = videos.map((video, index) => `
    <article class="pipeline-item">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <h3>${safeText(video.title)}</h3>
      <span class="stage-pill stage-${video.stage}">${stageLabels[video.stage] || 'IDEA'}</span>
      <small>${video.date ? safeText(video.date) : 'DATE TBD'}</small>
      <button class="delete-video" data-delete="${safeText(video.id)}" aria-label="Delete ${safeText(video.title)}">×</button>
    </article>`).join('');
  $$('[data-delete]').forEach((button) => button.addEventListener('click', () => {
    videos = videos.filter((video) => video.id !== button.dataset.delete);
    saveVideos(); renderPipeline();
  }));
}
$('#videoForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const title = $('#videoTitle').value.trim();
  if (!title) return;
  videos.push({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, title, stage: $('#videoStage').value, date: $('#publishDate').value });
  saveVideos(); renderPipeline(); event.currentTarget.reset(); toast('Video added to pipeline');
});
$('#loadSamples').addEventListener('click', () => {
  if (videos.length && !window.confirm('Existing pipeline-এর সঙ্গে sample videos যোগ করবেন?')) return;
  const day = 86400000; const now = Date.now();
  const date = (offset) => new Date(now + offset * day).toISOString().slice(0, 10);
  videos.push(
    { id: `${now}-a`, title: 'The Appalachian Tunnel Sealed for 83 Years', stage: 'research', date: date(3) },
    { id: `${now}-b`, title: 'Every Night, My Radio Broadcasts Tomorrow’s Missing Persons', stage: 'script', date: date(10) },
    { id: `${now}-c`, title: 'The Forgotten Hotel Beneath an American City', stage: 'idea', date: date(17) }
  );
  saveVideos(); renderPipeline(); toast('Sample launch plan loaded');
});
$('#clearPipeline').addEventListener('click', () => {
  if (!videos.length || !window.confirm('Pipeline-এর সব video মুছে ফেলবেন?')) return;
  videos = []; saveVideos(); renderPipeline();
});
$('#exportCsv').addEventListener('click', () => {
  if (!videos.length) { toast('Export করার মতো video নেই'); return; }
  const quote = (value) => `"${String(value).replaceAll('"', '""')}"`;
  const csv = ['Title,Stage,Publish Date', ...videos.map((video) => [quote(video.title), quote(stageLabels[video.stage]), quote(video.date)].join(','))].join('\n');
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  link.download = `horrorforge-pipeline-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click(); URL.revokeObjectURL(link.href); toast('CSV exported');
});
renderPipeline();

// Local, privacy-friendly sprint persistence.
const taskBoxes = $$('[data-task]');
function loadTasks() {
  let saved = {};
  try { saved = JSON.parse(localStorage.getItem('horrorforge-tasks') || '{}'); } catch { saved = {}; }
  taskBoxes.forEach((box) => { box.checked = Boolean(saved[box.dataset.task]); });
  updateProgress();
}
function updateProgress() {
  const complete = taskBoxes.filter((box) => box.checked).length;
  const percent = Math.round((complete / taskBoxes.length) * 100);
  $('#progressBar').style.width = `${percent}%`;
  $('#progressText').textContent = `${percent}%`;
}
taskBoxes.forEach((box) => box.addEventListener('change', () => {
  const saved = Object.fromEntries(taskBoxes.map((item) => [item.dataset.task, item.checked]));
  localStorage.setItem('horrorforge-tasks', JSON.stringify(saved));
  updateProgress();
}));
loadTasks();

// Lightweight entrance animation.
const reveals = $$('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.08 });
  reveals.forEach((element) => observer.observe(element));
} else reveals.forEach((element) => element.classList.add('visible'));
