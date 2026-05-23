const stages = [
  {
    id: 'stage1', title: 'المرحلة الأولى', pages: '5 - 27',
    subjects: [
      ['جغرافية المناخ وتطبيقاته',2,1,5,10,12],
      ['علم الخرائط وتطبيقاته',2,1,5,13,14],
      ['الجيومورفولوجيا وتطبيقاته',2,1,5,15,16],
      ['جغرافية أفريقيا وأستراليا',2,0,4,17,18],
      ['أصول التربية والتعليم',2,0,4,21,22],
      ['علم النفس التربوي والنمو',2,0,4,null,null],
      ['اللغة الإنجليزية',1,0,2,null,null],
      ['تاريخ العراق القديم',1,0,2,null,null],
      ['الحاسوب',0,2,3,23,25],
      ['اللغة العربية',1,0,2,26,27],
      ['الديمقراطية وحقوق الإنسان',1,0,2,19,20],
    ]
  },
  {
    id: 'stage2', title: 'المرحلة الثانية', pages: '29 - 46',
    subjects: [
      ['نظم المعلومات الجغرافية',2,1,5,30,30],
      ['جغرافية الموارد المائية',2,1,5,31,31],
      ['جغرافية أوراسيا',2,0,4,32,32],
      ['جغرافية السكان',2,0,4,33,33],
      ['الصناعة والطاقة المتجددة',2,0,4,34,34],
      ['جغرافية العراق',2,0,4,35,35],
      ['المنهج والكتاب المدرسي',2,0,4,36,37],
      ['الإدارة والتخطيط التربوي',2,0,4,null,null],
      ['أخلاقيات مهنة التعليم',1,0,2,38,39],
      ['التاريخ الإسلامي',1,0,2,null,null],
      ['اللغة العربية',1,0,2,41,42],
      ['الحاسوب',0,2,2,null,null],
      ['اللغة الإنجليزية',1,0,2,null,null],
      ['جرائم نظام البعث في العراق',1,0,2,40,40],
    ]
  },
  {
    id: 'stage3', title: 'المرحلة الثالثة', pages: '47 - 72',
    subjects: [
      ['جغرافية الأمريكيتين',2,0,4,48,49],
      ['جغرافية المدن والخدمات',2,0,4,50,51],
      ['الجغرافية الاجتماعية',2,0,4,52,53],
      ['الزراعة والتكنولوجيا الخضراء',2,0,4,54,55],
      ['جغرافية البيئة والتلوث',2,1,5,56,58],
      ['الإحصاء الجغرافي وتطبيقاته',1,1,3,59,60],
      ['تكنولوجيا التعليم وتطبيقاتها',2,0,4,61,62],
      ['طرائق تدريس الجغرافية',2,0,4,63,64],
      ['الإرشاد النفسي وتعليم ذوي الاحتياجات الخاصة',2,0,4,65,67],
      ['التاريخ الحديث والمعاصر',1,0,2,68,69],
      ['منهج البحث العلمي والإجرائي',1,1,3,70,71],
    ]
  },
  {
    id: 'stage4', title: 'المرحلة الرابعة', pages: '73 - 94',
    subjects: [
      ['الجغرافية السياسية',2,0,4,74,74],
      ['جغرافية الوطن العربي',2,0,4,75,76],
      ['جغرافية النقل والتجارة',2,0,4,77,78],
      ['الفكر الجغرافي',2,0,4,79,80],
      ['جغرافية التنمية المستدامة',2,0,4,81,82],
      ['القياس والتقويم',1,1,3,null,null],
      ['تعليم التفكير',1,0,2,null,null],
      ['التربية العملية',1,2,4,null,null],
      ['بحث التخرج',1,1,3,null,null],
    ]
  }
].map(stage => ({
  ...stage,
  subjects: stage.subjects.map((s, idx) => ({
    id: `${stage.id}-${idx}`,
    name: s[0], theoretical: s[1], practical: s[2], units: s[3], pageStart: s[4], pageEnd: s[5], stageId: stage.id, stageTitle: stage.title
  }))
}));

let pages = [];
let activeStage = 'all';
const $ = (sel) => document.querySelector(sel);
const stagesEl = $('#stages');
const filtersEl = $('#stageFilters');
const resultsEl = $('#searchResults');
const searchInput = $('#searchInput');

function normalize(text = '') {
  return text.toString().toLowerCase()
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ىي]/g, 'ي')
    .replace(/ة/g, 'ه')
    .replace(/[\u064B-\u065F]/g, '')
    .trim();
}

function pageText(pageNo) {
  return pages.find(p => p.page === pageNo)?.text || '';
}

function pagesRange(start, end) {
  if (!start || !end) return [];
  return pages.filter(p => p.page >= start && p.page <= end);
}

function snippet(text, q, size = 160) {
  if (!text) return 'لا يوجد نص مستخرج لهذه الصفحة.';
  const nText = normalize(text);
  const nq = normalize(q);
  let idx = nq ? nText.indexOf(nq) : -1;
  if (idx < 0) idx = 0;
  const start = Math.max(0, idx - 60);
  const raw = text.slice(start, start + size);
  return (start > 0 ? '...' : '') + raw + (start + size < text.length ? '...' : '');
}

function renderFilters() {
  const chips = [{id:'all', title:'الكل'}, ...stages.map(s => ({id:s.id, title:s.title}))];
  filtersEl.innerHTML = chips.map(c => `<button class="chip ${activeStage === c.id ? 'active' : ''}" data-stage="${c.id}" type="button">${c.title}</button>`).join('');
  filtersEl.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => {
      activeStage = btn.dataset.stage;
      renderFilters(); renderStages(); runSearch();
    });
  });
}

function renderStages() {
  const visible = activeStage === 'all' ? stages : stages.filter(s => s.id === activeStage);
  stagesEl.innerHTML = visible.map(stage => `
    <article class="stage-card card" id="${stage.id}">
      <div class="stage-head">
        <div><h2>${stage.title}</h2><p>صفحات الدليل: ${stage.pages}</p></div>
        <span class="count-badge">${stage.subjects.length} مواد</span>
      </div>
      <div class="subject-grid">
        ${stage.subjects.map(subject => subjectCard(subject)).join('')}
      </div>
    </article>
  `).join('');
  stagesEl.querySelectorAll('.subject-card').forEach(card => {
    card.addEventListener('click', () => openSubject(card.dataset.subject));
  });
}

function subjectCard(s) {
  const pageInfo = s.pageStart ? `المفردات: ص ${s.pageStart}${s.pageEnd !== s.pageStart ? ' - ' + s.pageEnd : ''}` : 'المفردات ضمن الدليل الكامل';
  return `
    <button class="subject-card" data-subject="${s.id}" type="button">
      <div>
        <h3>${s.name}</h3>
        <div class="small">${pageInfo}</div>
      </div>
      <div class="meta">
        <span>نظري: ${s.theoretical}</span>
        <span>عملي: ${s.practical}</span>
        <span>وحدات: ${s.units}</span>
      </div>
    </button>
  `;
}

const arabicWeekNames = [
  'الأول','الثاني','الثالث','الرابع','الخامس','السادس','السابع','الثامن','التاسع','العاشر',
  'الحادي عشر','الثاني عشر','الثالث عشر','الرابع عشر','الخامس عشر','السادس عشر','السابع عشر','الثامن عشر','التاسع عشر','العشرون',
  'الحادي والعشرون','الثاني والعشرون','الثالث والعشرون','الرابع والعشرون','الخامس والعشرون','السادس والعشرون','السابع والعشرون','الثامن والعشرون','التاسع والعشرون','الثلاثون'
];

function weekLabel(index) {
  return `الأسبوع ${arabicWeekNames[index] || index + 1}`;
}

function cleanExtractedText(text = '') {
  return text
    .replace(/\s+/g, ' ')
    .replace(/^[\d\s]+/, '')
    .replace(/مفخدات|مفردات|الس شيج|السشيج/g, '')
    .trim();
}

function splitByMarkers(text) {
  const clean = cleanExtractedText(text);
  const markerRegex = /(ا?لا?سبوع\s+[\u0600-\u06FF]+(?:\s+[\u0600-\u06FF]+){0,3}\s*:?\s*\d{0,2}\s*:?)|\(\s*\d{1,2}\s*\)|(?:^|\s)(\d{1,2})(?=\s+[\u0600-\u06FFA-Za-z])/g;
  const matches = [...clean.matchAll(markerRegex)].map(m => ({ index: m.index, text: m[0].trim() }));

  if (matches.length < 3) {
    return clean ? [{ label: 'مفردات المادة', text: clean }] : [];
  }

  return matches.map((match, idx) => {
    const next = matches[idx + 1]?.index ?? clean.length;
    let chunk = clean.slice(match.index, next).trim();
    chunk = chunk.replace(match.text, '').trim();
    chunk = chunk.replace(/^[:\-–\)\(\s]+/, '').trim();
    return {
      label: weekLabel(idx),
      text: chunk || match.text,
    };
  }).filter(item => item.text && item.text.length > 1).slice(0, 30);
}


function cleanWeeksForSubject(subject) {
  const key = `${subject.stageId}|${subject.name}`;
  const weeks = window.cleanCurriculumWeeks?.[key];
  if (!Array.isArray(weeks)) return null;
  return weeks.map((text, idx) => ({ label: weekLabel(idx), text }));
}

function subjectWeeks(subject) {
  const manual = cleanWeeksForSubject(subject);
  if (manual) return manual;
  const subjectPages = pagesRange(subject.pageStart, subject.pageEnd);
  if (!subjectPages.length) {
    return [{
      label: 'ملاحظة',
      text: 'لم يتم تحديد صفحة مفردات مستقلة لهذه المادة في الدليل. يمكنك استخدام البحث داخل الدليل أو فتح ملف PDF الكامل.',
    }];
  }
  const raw = subjectPages.map(p => p.text || '').join(' ');
  return splitByMarkers(raw);
}

function topicList(text = '') {
  const clean = cleanExtractedText(text).replace(//g, '،');
  const parts = clean
    .split(/(?:\s*،\s*|\s*؛\s*|\s*\.\s*|\s+-\s+)/)
    .map(x => x.trim())
    .filter(x => x.length > 2);
  return parts.length > 1 ? parts : [clean];
}

function openSubject(id) {
  const subject = stages.flatMap(s => s.subjects).find(s => s.id === id);
  if (!subject) return;
  $('#dialogStage').textContent = subject.stageTitle;
  $('#dialogTitle').textContent = subject.name;
  $('#dialogMeta').innerHTML = `
    <span>الساعات النظرية: ${subject.theoretical}</span>
    <span>الساعات العملية: ${subject.practical}</span>
    <span>الوحدات: ${subject.units}</span>
  `;

  const weeks = subjectWeeks(subject);
  const pdfHref = `assets/geography-curriculum-2025-2026.pdf#page=${subject.pageStart || 1}`;

  $('#dialogContent').innerHTML = `
    <section class="week-picker-card">
      <label for="weekSelect">اختر الأسبوع</label>
      <div class="select-wrap">
        <select id="weekSelect">
          ${weeks.map((w, i) => `<option value="${i}">${escapeHtml(w.label || weekLabel(i))}</option>`).join('')}
        </select>
      </div>
      ${weeks.length > 1 ? `
        <div class="week-nav">
          <button id="prevWeek" type="button">الأسبوع السابق</button>
          <button id="nextWeek" type="button">الأسبوع التالي</button>
        </div>
      ` : ''}
    </section>
    <section id="weekView" class="week-view"></section>
    <a class="page-link" href="${pdfHref}" target="_blank" rel="noopener">فتح الصفحة في PDF</a>
  `;

  const weekSelect = $('#weekSelect');
  const weekView = $('#weekView');
  const prevBtn = $('#prevWeek');
  const nextBtn = $('#nextWeek');

  function renderWeek(index) {
    const item = weeks[index] || weeks[0];
    const topics = topicList(item.text);
    weekView.innerHTML = `
      <div class="week-view-head">
        <h3>${escapeHtml(item.label || weekLabel(index))}</h3>
        ${weeks.length > 1 ? `<span>${index + 1} / ${weeks.length}</span>` : ''}
      </div>
      ${topics.length > 1 ? `
        <ul class="topic-list">
          ${topics.map(t => `<li>${escapeHtml(t)}</li>`).join('')}
        </ul>
      ` : `<p>${escapeHtml(topics[0] || '')}</p>`}
    `;
    if (prevBtn) prevBtn.disabled = index <= 0;
    if (nextBtn) nextBtn.disabled = index >= weeks.length - 1;
  }

  weekSelect.addEventListener('change', () => renderWeek(Number(weekSelect.value)));
  prevBtn?.addEventListener('click', () => {
    weekSelect.value = Math.max(0, Number(weekSelect.value) - 1);
    renderWeek(Number(weekSelect.value));
  });
  nextBtn?.addEventListener('click', () => {
    weekSelect.value = Math.min(weeks.length - 1, Number(weekSelect.value) + 1);
    renderWeek(Number(weekSelect.value));
  });

  renderWeek(0);
  $('#subjectDialog').showModal();
}

function escapeHtml(str='') {
  return str.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

function highlight(text, q) {
  if (!q) return escapeHtml(text);
  const safe = escapeHtml(text);
  const terms = q.trim().split(/\s+/).filter(Boolean).slice(0, 4).map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!terms.length) return safe;
  return safe.replace(new RegExp(`(${terms.join('|')})`, 'gi'), '<mark>$1</mark>');
}

function runSearch() {
  const q = searchInput.value.trim();
  if (!q) { resultsEl.classList.add('hidden'); resultsEl.innerHTML = ''; return; }
  const nq = normalize(q);
  const selectedStages = activeStage === 'all' ? stages : stages.filter(s => s.id === activeStage);
  const subjects = selectedStages.flatMap(s => s.subjects).filter(s => {
    const clean = (window.cleanCurriculumWeeks?.[`${s.stageId}|${s.name}`] || []).join(' ');
    return normalize(`${s.name} ${s.stageTitle} ${clean}`).includes(nq);
  });
  const pageMinMax = selectedStages.map(s => s.pages.split(' - ').map(Number));
  const pageHits = pages.filter(p => {
    const inStage = activeStage === 'all' || pageMinMax.some(([min,max]) => p.page >= min && p.page <= max);
    return inStage && normalize(p.text).includes(nq);
  }).slice(0, 12);

  const subjectHtml = subjects.slice(0, 8).map(s => `
    <button class="result-item card subject-card" data-subject="${s.id}" type="button">
      <h3>${highlight(s.name, q)}</h3>
      <p>${s.stageTitle} - نظري ${s.theoretical} / عملي ${s.practical} / وحدات ${s.units}</p>
    </button>
  `).join('');
  const pagesHtml = pageHits.map(p => `
    <a class="result-item card" href="assets/geography-curriculum-2025-2026.pdf#page=${p.page}" target="_blank" rel="noopener">
      <h3>نتيجة في صفحة ${p.page}</h3>
      <p>${highlight(snippet(p.text, q), q)}</p>
    </a>
  `).join('');
  const total = subjects.length + pageHits.length;
  resultsEl.innerHTML = total ? `
    <div class="stage-head"><div><h2>نتائج البحث</h2><p>${total} نتيجة تقريبية</p></div></div>
    ${subjectHtml}${pagesHtml}
  ` : `<div class="result-item card"><h3>لا توجد نتائج واضحة</h3><p>جرب كلمة أبسط أو افتح ملف PDF الكامل.</p></div>`;
  resultsEl.classList.remove('hidden');
  resultsEl.querySelectorAll('[data-subject]').forEach(el => el.addEventListener('click', () => openSubject(el.dataset.subject)));
}

$('#clearSearch').addEventListener('click', () => { searchInput.value = ''; runSearch(); searchInput.focus(); });
searchInput.addEventListener('input', runSearch);
$('#closeDialog').addEventListener('click', () => $('#subjectDialog').close());
$('#subjectDialog').addEventListener('click', (event) => {
  const rect = event.currentTarget.getBoundingClientRect();
  const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
  if (!inside) event.currentTarget.close();
});

async function init() {
  renderFilters();
  renderStages();
  try {
    const res = await fetch('data-pages.json');
    pages = await res.json();
  } catch (err) {
    console.warn('Could not load page data', err);
    pages = [];
  }
  if ('serviceWorker' in navigator && location.protocol !== 'file:') {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}
init();
