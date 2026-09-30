// Portfolio content shared by the home page and the case-study pages.
import { imageVariants } from './image-variants';

// Image and logo paths are relative to the site base; components prefix them with import.meta.env.BASE_URL.

export interface Point {
  label?: string;
  text: string;
}

export interface CaseImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  position?: string;
  fit?: 'cover' | 'contain';
}

export interface Org {
  name: string;
  href?: string;
  logo?: string;
  icon?: string;
  /** The logo or icon is a wide wordmark, so it sits on a wide plate. */
  wordmark?: boolean;
}

export interface CaseStudy {
  slug: string;
  kind: 'project' | 'competition';
  title: string;
  type: string;
  year: string;
  dates: string;
  context: string;
  summary: string;
  status?: string;
  current?: boolean;
  result?: string;
  /** When the result was announced, if later than the event itself. */
  announced?: string;
  role?: string;
  domains: string[];
  image?: CaseImage;
  visual?: { code: string; codeLabel?: string; points: Point[] };
  facts?: { value: string; label: string }[];
  highlights: Point[];
  stack: string[];
  links?: { label: string; href: string }[];
  scopeNote?: string;
  organisers?: Org[];
  evidence?: { image: CaseImage; href?: string; title: string; caption: string }[];
  wide?: boolean;
}

export const person = {
  name: 'Wisit Suwannao',
  nickname: 'Pluem',
  nicknameThai: 'ปลื้ม',
  email: 'wisit.p.2005@gmail.com',
  /** Public CV on Google Drive, behind a short link the owner maintains. */
  cv: 'https://kmutt.me/WisitSuwannao-CV',
  siteUrl: 'https://palapluem.github.io/Wisit-s-Portfolio/',
};

export const socialLinks = [
  { label: 'GitHub', href: 'https://github.com/Palapluem', icon: 'github-logo', handle: 'Palapluem' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/wisit-suwannao', icon: 'linkedin-logo', handle: 'Wisit Suwannao' },
  { label: 'Facebook', href: 'https://www.facebook.com/pluem.wisit.suwannao', icon: 'facebook-logo', handle: 'Wisit Suwannao' },
  { label: 'Instagram', href: 'https://instagram.com/ppalapluem', icon: 'instagram-logo', handle: '@ppalapluem' },
];

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Work' },
  { id: 'achievements', label: 'Competitions' },
  { id: 'services', label: 'Capabilities' },
  { id: 'contact', label: 'Contact' },
];

const constitutionsPresentation = 'https://github.com/Palapluem/cpe232-datamodel-2025/blob/main/project/CPE232%20Presentation_Twenty%20Constitutions%20Digitalization.pdf';

const aiat: Org = { name: 'Artificial Intelligence Association of Thailand', href: 'https://aiat.or.th/', logo: 'logos/aiat.webp' };

// Projects first, then competitions from the newest result to the oldest.
export const caseStudies: CaseStudy[] = [
  {
    slug: 'thai-public-data-platform',
    kind: 'project',
    title: 'Thai Public Data Platform',
    type: 'Project',
    year: '2026',
    dates: 'Sep 2026 - Present',
    context: 'Local-first data platform',
    summary: 'Turns two heterogeneous government Excel sources into reproducible, quality-gated analytical data.',
    status: 'In progress',
    current: true,
    domains: ['Data engineering', 'Data quality'],
    image: {
      src: 'images/thai-public-data-dashboard.png',
      alt: 'Local dashboard preview with public-finance KPIs, a monthly expenditure trend, and regional labour-force bars',
      width: 1280,
      height: 720,
      position: 'left top',
    },
    facts: [
      { value: '2', label: 'government Excel sources' },
      { value: '4', label: 'PostgreSQL layers' },
      { value: '8', label: 'Airflow DAG tasks' },
    ],
    highlights: [
      { label: 'Parsing', text: 'Source-specific parsers handle merged cells, multi-row headers, totals, and subtotals.' },
      { label: 'Modeling', text: 'PostgreSQL raw, staging, core, and ops layers with constraints, natural-grain uniqueness, and cell-level source lineage.' },
      { label: 'Quality gates', text: 'Fail-closed checks for keys, numeric bounds, duplicate grain, source identity, row collapse, and detail-to-total reconciliation.' },
      { label: 'Releases', text: 'SHA-256 release identity, retry-safe publishing, and explicit replay and backfill behavior.' },
      { label: 'Orchestration', text: 'An eight-task Airflow DAG, with ClickHouse for analytical serving.' },
      { label: 'Engineering', text: 'Docker Compose, CI, tests, migrations, runbooks, and architecture decision records.' },
    ],
    stack: ['Python', 'Pandas', 'OpenPyXL', 'PostgreSQL', 'Apache Airflow', 'ClickHouse', 'Docker Compose', 'GitHub Actions'],
    links: [{ label: 'GitHub repository', href: 'https://github.com/Palapluem/thai-public-data-platform' }],
    scopeNote: 'A local-first project using public data. It does not claim cloud deployment or production-scale operation.',
  },
  {
    slug: 'twenty-constitutions-digitalization',
    kind: 'project',
    title: 'Twenty Constitutions Digitalization',
    type: 'Project',
    year: '2026',
    dates: 'Apr - May 2026',
    context: 'CPE232 Data Models',
    summary: 'A document-engineering workflow that turns Thai constitutional archives into structured, reusable data.',
    status: 'Course project',
    domains: ['Document AI', 'Data engineering'],
    image: {
      src: 'images/twenty-constitutions-cover.png',
      alt: 'Presentation cover for the Twenty Constitutions Digitalization project',
      width: 1400,
      height: 788,
      position: 'left center',
    },
    facts: [
      { value: '20', label: 'Thai constitutions' },
      { value: '38', label: 'source PDFs' },
      { value: '~61K', label: 'words processed' },
    ],
    highlights: [
      { label: 'Extraction', text: 'OCR for scanned pages and direct text extraction for digital PDFs.' },
      { label: 'Normalization', text: 'Thai Unicode and Buddhist Era dates normalized, with document noise removed.' },
      { label: 'Structure', text: 'Chapter, article, and section metadata for every document.' },
      { label: 'Outputs', text: 'Validated JSON and CSV for exploratory analysis and downstream NLP.' },
    ],
    stack: ['Python', 'Jupyter', 'Typhoon OCR', 'PyMuPDF', 'pdfplumber', 'Pandas', 'PyThaiNLP', 'scikit-learn'],
    links: [{ label: 'Project presentation', href: constitutionsPresentation }],
    evidence: [
      {
        image: { src: 'images/twenty-constitutions-final-datasets.webp', alt: "Presentation slide summarizing the project's structured JSON and CSV outputs", width: 2200, height: 1238 },
        href: constitutionsPresentation,
        title: 'Structured outputs',
        caption: 'Slide 18, JSON hierarchy and section-level CSV',
      },
      {
        image: { src: 'images/twenty-constitutions-topic-modeling.webp', alt: 'Presentation slide showing a hybrid topic-modelling workflow', width: 2200, height: 1238 },
        href: constitutionsPresentation,
        title: 'Exploratory topic analysis',
        caption: 'Slide 28, keyword and embedding-based analysis',
      },
      {
        image: { src: 'images/twenty-constitutions-pipeline.webp', alt: 'Data-processing pipeline from 38 source PDFs through extraction, cleaning, and structure parsing to JSON and CSV', width: 2200, height: 1238 },
        title: 'Processing pipeline',
        caption: 'From 38 source PDFs to JSON and CSV',
      },
    ],
  },
  {
    slug: 'gemmaclip',
    kind: 'competition',
    title: 'GemmaClip',
    type: 'Hackathon',
    year: '2026',
    dates: '6 - 11 Jul 2026',
    context: 'AMD Developer Hackathon: ACT II, team KMUTT Ma Laew',
    summary: 'Evidence-first video captioning from team KMUTT Ma Laew, where I worked as AI Engineer.',
    result: 'Google DeepMind Gemma Prize, Track 2',
    announced: '14 Sep 2026',
    role: 'AI Engineer',
    domains: ['Multimodal AI'],
    image: {
      src: 'images/gemmaclip-cover.png',
      alt: 'GemmaClip presentation cover for evidence-first video captioning',
      width: 1400,
      height: 788,
      position: 'right center',
    },
    facts: [
      { value: '6', label: 'representative frames' },
      { value: '4', label: 'temporal anchors' },
      { value: '2', label: 'high-change moments' },
    ],
    highlights: [
      { label: 'Role', text: 'AI Engineer on team KMUTT Ma Laew.' },
      { label: 'Frames', text: 'Six representative frames: four temporal anchors and two high-change moments.' },
      { label: 'Audio', text: 'Bounded audio context alongside the visual evidence.' },
      { label: 'Traceability', text: 'An inspectable flow from selected evidence to each generated caption.' },
      { label: 'Result', text: 'Won the Google DeepMind Gemma Prize, Track 2: “Best Use of Gemma in Video Captioning.”' },
    ],
    stack: ['Video captioning', 'Multimodal AI', 'Evidence-grounded generation'],
    links: [
      { label: 'Project page', href: 'https://lablab.ai/ai-hackathons/amd-developer-hackathon-act-ii/kmutt-ma-laew/gemmaclip' },
      { label: 'GitHub', href: 'https://github.com/ArmmyC/GemmaClip' },
      { label: 'Slides', href: 'https://storage.googleapis.com/lablab-static-eu/presentations/submissions/zmj1fpsmys7v3yx8dkiz16hd/zmj1fpsmys7v3yx8dkiz16hd-1783892405857_piid3sdb66w00ktwvbdq2nce.pdf' },
      { label: 'Announcement', href: 'https://www.facebook.com/share/p/1Du6rGh7Aa/' },
    ],
    organisers: [
      { name: 'lablab.ai', href: 'https://lablab.ai/', logo: 'logos/lablab.svg' },
      { name: 'AMD', href: 'https://www.amd.com/', logo: 'logos/amd.svg', wordmark: true },
    ],
  },
  {
    slug: 'super-ai-engineer-season-6',
    kind: 'competition',
    title: 'Super AI Engineer Season 6',
    type: 'Programme',
    year: '2026',
    dates: '13 Mar - 3 Sep 2026',
    context: 'AI Engineer Track',
    summary: 'Three levels, from baseline AI challenges to an internship-linked product submission.',
    result: 'AI Engineer Award',
    domains: ['Applied AI', 'Forecasting', 'Product'],
    image: {
      src: 'images/cruit-poster.png',
      alt: 'Technical poster for CRUiT, the Level 3 product submission',
      width: 991,
      height: 1400,
      position: 'center top',
      fit: 'contain',
    },
    highlights: [
      { label: 'Level 1 (13 Mar - 4 Apr)', text: 'Passed the Baseline Hackathon, including Thai election OCR, FahMai RAG, and applied AI challenges.' },
      { label: 'Level 2 (8 May - 8 Jun)', text: 'Won the Coffee Chain Demand Forecasting Hackathon, held 12 - 15 May.' },
      { label: 'Level 3 (15 Jun - 3 Sep 2026)', text: 'NTi internship and CRUiT product submission; received the AI Engineer Award.' },
    ],
    stack: ['Applied AI', 'Thai NLP', 'Forecasting', 'Product development'],
    organisers: [aiat],
  },
  {
    slug: 'coffee-chain-demand-forecasting',
    kind: 'competition',
    title: 'Coffee Chain Demand Forecasting',
    type: 'Hackathon',
    year: '2026',
    dates: '12 - 15 May 2026',
    context: 'Super AI Engineer Season 6, Level 2',
    summary: 'A winning forecast built from multi-store transaction history and operational signals.',
    result: 'Winner',
    domains: ['Forecasting', 'Data science'],
    image: {
      src: 'images/coffee-chain-winning-team.jpg',
      alt: 'Super AI Engineer Season 6 team holding the Coffee Chain Hackathon winner board',
      width: 2048,
      height: 1365,
      position: 'center 40%',
    },
    facts: [
      { value: '2,858,050', label: 'transactions' },
      { value: '1,376,133', label: 'orders' },
      { value: '20', label: 'stores' },
      { value: '7', label: 'categories' },
      { value: '670', label: 'days' },
    ],
    highlights: [
      { label: 'Evaluation', text: '1-day, 7-day, and monthly forecast horizons, scored with MAE.' },
      { label: 'Signals', text: 'Seasonality, promotions, holidays and paydays, rainfall, stockouts, local events, and store capacity.' },
      { label: 'Features', text: 'Leakage-aware lag, rolling, calendar, and interaction features.' },
    ],
    stack: ['Time-series analysis', 'Feature engineering', 'MAE evaluation', 'Leakage-aware features'],
    organisers: [aiat],
    wide: true,
  },
  {
    slug: 'promoautomate',
    kind: 'competition',
    title: 'PromoAutomate',
    type: 'Camp',
    year: '2025',
    dates: '1 Aug - 26 Oct 2025',
    context: 'CAI Camp 2025',
    summary: 'A promotion-workflow prototype combining verification checks with AI-assisted creative production.',
    result: 'Top 10 Finalist',
    domains: ['Computer vision', 'Generative AI'],
    visual: {
      code: 'Top 10',
      points: [
        { text: 'Barcode verification' },
        { text: 'Computer vision' },
        { text: 'Generative creative support' },
        { text: 'Centralized dashboard' },
      ],
    },
    highlights: [
      { label: 'Verification', text: 'Barcode verification and computer-vision checks inside the promotion workflow.' },
      { label: 'Creative', text: 'Generative creative support for promotional assets, using Stable Diffusion and LoRA.' },
      { label: 'Operations', text: 'A centralized dashboard for the workflow.' },
      { label: 'Estimated impact', text: 'An estimated 2,192 hours/month reduction in coupon-setup effort. This is an estimate, not a measured production result.' },
    ],
    stack: ['Computer vision', 'Generative AI', 'Workflow automation'],
    organisers: [{ name: 'CAI Camp by CP ALL', href: 'https://www.facebook.com/caicamp', logo: 'logos/cai-camp.png', wordmark: true }],
  },
  {
    slug: 'super-ai-engineer-season-5',
    kind: 'competition',
    title: 'Super AI Engineer Season 5',
    type: 'Programme',
    year: '2025',
    dates: '24 Jan - 28 Jun 2025',
    context: 'AI Engineer Track',
    summary: 'Baseline model challenges, followed by applied AI solution rounds.',
    result: 'Passed Baseline Hackathon',
    domains: ['Thai NLP', 'Computer vision', 'Data science'],
    visual: {
      code: '05',
      codeLabel: 'Season',
      points: [
        { label: 'Level 1', text: 'Passed baseline' },
        { label: 'Level 2', text: 'Applied AI rounds' },
      ],
    },
    highlights: [
      { label: 'Level 1 (24 Jan - 1 Mar 2025)', text: 'Passed the Baseline Hackathon across Thai NER, image captioning, tabular and clinical prediction, house recognition, and sleep-stage classification.' },
      { label: 'Level 2 (2 - 28 Jun 2025)', text: 'Financial analysis, liver-fibrosis prediction, cognitive profiling, and GSMaP satellite-rainfall bias correction.' },
    ],
    stack: ['Thai NLP', 'Computer vision', 'Tabular ML', 'Applied prediction'],
    organisers: [aiat],
  },
];

export const projects = caseStudies.filter((item) => item.kind === 'project');
export const competitions = caseStudies.filter((item) => item.kind === 'competition');

/** Newest result first. The Gemma Prize was announced on 14 Sep 2026, after the July hackathon. */
export const highlightResults = [
  { slug: 'gemmaclip', title: 'Gemma Prize, Track 2', context: 'AMD Developer Hackathon: ACT II', date: 'Sep 2026' },
  { slug: 'super-ai-engineer-season-6', title: 'AI Engineer Award', context: 'Super AI Engineer Season 6, Level 3', date: 'Sep 2026' },
  { slug: 'coffee-chain-demand-forecasting', title: 'Winner, Coffee Chain Hackathon', context: 'Super AI Engineer Season 6, Level 2', date: 'May 2026' },
];

export const workNumbers = [
  { value: 171, display: '171', label: 'official OVEC programmes connected', source: 'CRUiT, NTi internship', href: '#experience' },
  { value: 2858050, display: '2,858,050', label: 'transactions analysed', source: 'Coffee Chain Hackathon', slug: 'coffee-chain-demand-forecasting' },
  { value: 61, display: '~61K', prefix: '~', suffix: 'K', label: 'words digitized from 38 PDFs', source: 'Twenty Constitutions', slug: 'twenty-constitutions-digitalization' },
  { value: 8, display: '8', label: 'Airflow DAG tasks', source: 'Thai Public Data Platform', slug: 'thai-public-data-platform' },
];

export const capabilities = [
  {
    id: 'applied-ai',
    title: 'Applied AI engineering',
    description: 'From source data and retrieval logic to evaluated model-assisted features, guarded APIs, and user-facing products.',
    tools: ['Python', 'PyTorch', 'FastAPI', 'Pydantic'],
    evidence: [
      { label: 'CRUiT evidence engine', note: 'NTi internship', href: '#experience' },
      { label: 'Multimodal RAG for ESG reports', note: 'Oneput internship', href: '#experience' },
      { label: 'GemmaClip', note: 'Gemma Prize, Track 2', slug: 'gemmaclip' },
    ],
  },
  {
    id: 'data-science',
    title: 'Data science and forecasting',
    description: 'Exploratory analysis, leakage-aware feature design, model comparison, and evaluation across meaningful time horizons.',
    tools: ['PyTorch', 'Pandas', 'scikit-learn', 'PyCaret', 'AutoGluon'],
    evidence: [
      { label: 'Coffee Chain Demand Forecasting', note: 'Hackathon winner', slug: 'coffee-chain-demand-forecasting' },
      { label: 'Super AI Engineer Season 5', note: 'Tabular, clinical, and rainfall challenges', slug: 'super-ai-engineer-season-5' },
    ],
  },
  {
    id: 'multimodal',
    title: 'Generative and multimodal AI',
    description: 'Building grounded workflows across Thai language, complex documents, images, and video, with evidence people can inspect.',
    tools: ['Thai NLP', 'Document AI', 'Vision', 'Audio'],
    evidence: [
      { label: 'GemmaClip', note: 'Frames, audio, and captions', slug: 'gemmaclip' },
      { label: 'Twenty Constitutions Digitalization', note: 'OCR and Thai text normalization', slug: 'twenty-constitutions-digitalization' },
      { label: 'PromoAutomate', note: 'Stable Diffusion and LoRA', slug: 'promoautomate' },
    ],
  },
  {
    id: 'workflows',
    title: 'Software and data workflows',
    description: 'Connecting AI workflows to dependable services and interfaces through validation, testing, and maintainable system design.',
    tools: ['Next.js', 'TypeScript', 'Go / Chi', 'PostgreSQL', 'Docker Compose'],
    evidence: [
      { label: 'Thai Public Data Platform', note: 'Quality gates and Airflow', slug: 'thai-public-data-platform' },
      { label: 'CRUiT', note: 'FastAPI, Next.js, and automated test suites', href: '#experience' },
      { label: 'ESG document pipeline', note: 'Go/Chi verification service', href: '#experience' },
    ],
  },
];

export const languages = [
  { name: 'Thai', level: 'Native' },
  { name: 'English', level: 'Intermediate' },
  { name: 'Spanish', level: 'Studying' },
];

export const programmingLanguages = ['Python', 'Java', 'C', 'C++', 'SQL', 'Go', 'TypeScript', 'JavaScript'];

/** Tools with a mark that appear in the work above; shown as the second row of the Capabilities marquee. */
export const toolMarquee = ['PyTorch', 'scikit-learn', 'Pandas', 'Jupyter', 'FastAPI', 'Pydantic', 'PostgreSQL', 'ClickHouse', 'Apache Airflow', 'MinIO', 'Docker Compose', 'GitHub Actions', 'Next.js'];

/** Internship hosts, university, programme organisers, and credential issuers, for the logo marquee. */
export const organisations: Org[] = [
  { name: 'NTi', logo: 'logos/nti.png' },
  { name: 'Oneput', logo: 'logos/oneput.png' },
  { name: 'KMUTT', logo: 'logos/kmutt.webp' },
  { name: 'AIAT', logo: 'logos/aiat.webp' },
  { name: 'CAI Camp by CP ALL', logo: 'logos/cai-camp.png', wordmark: true },
  { name: 'lablab.ai', logo: 'logos/lablab.svg' },
  { name: 'AMD', logo: 'logos/amd.svg', wordmark: true },
  { name: 'Huawei Cloud', logo: 'logos/huawei.svg' },
  { name: 'TPQI', logo: 'logos/tpqi.png' },
  { name: 'ASEAN Foundation', logo: 'logos/asean-foundation.png' },
  { name: 'Code.org', logo: 'logos/code-org-wordmark.svg', wordmark: true },
  { name: 'Google Skills', logo: 'logos/google.svg' },
];

export const credentials = [
  { name: 'HCCDA-AI Developer Certification', issuer: 'Huawei Cloud', date: 'Issued 22 Apr 2026, valid until 22 Apr 2029', datetime: '2026-04-22', org: { name: 'Huawei Cloud', logo: 'logos/huawei.svg' } as Org },
  { name: 'HCCDA-Tech Essentials Developer Certification', issuer: 'Huawei Cloud', date: 'Issued 29 Apr 2026, valid until 29 Apr 2029', datetime: '2026-04-29', org: { name: 'Huawei Cloud', logo: 'logos/huawei.svg' } as Org },
  { name: 'TPQI / Huawei AI Literacy', issuer: 'Thailand Professional Qualification Institute', note: 'Certificate of competency for AI Literacy for Power Users.', date: '2026', org: { name: 'TPQI', logo: 'logos/tpqi.png' } as Org },
  { name: 'TPQI / Huawei Cloud Developer Level 5', issuer: 'Thailand Professional Qualification Institute', note: 'Certificate of competency and professional qualification.', date: '2026', org: { name: 'TPQI', logo: 'logos/tpqi.png' } as Org },
  { name: 'Super AI Engineer Season 6', issuer: 'Artificial Intelligence Association of Thailand', note: 'AI Practitioner, Foundation AI Theory, and practice certificates for Data to Insight, Thai Election OCR, and FahMai RAG.', date: '2026', org: aiat },
  { name: 'AMD Developer Hackathon: ACT II Completion', issuer: 'lablab.ai / NativelyAI', date: '2026', org: { name: 'lablab.ai', logo: 'logos/lablab.svg' } as Org },
  { name: 'AI Ready ASEAN Completion', issuer: 'ASEAN Foundation, AI Ready ASEAN', date: '2026', org: { name: 'ASEAN Foundation', logo: 'logos/asean-foundation.png' } as Org },
  { name: 'Hour of Code Certificate of Completion', issuer: 'Code.org', date: '2026', org: { name: 'Code.org', logo: 'logos/code-org-wordmark.svg', wordmark: true } as Org },
];

// Simple Icons slugs for technologies that have an official mark.
export const techIcons: Record<string, string> = {
  Python: 'python',
  Pandas: 'pandas',
  PostgreSQL: 'postgresql',
  'Apache Airflow': 'apacheairflow',
  ClickHouse: 'clickhouse',
  'Docker Compose': 'docker',
  'GitHub Actions': 'githubactions',
  FastAPI: 'fastapi',
  Pydantic: 'pydantic',
  'Next.js': 'nextdotjs',
  TypeScript: 'typescript',
  PyTorch: 'pytorch',
  'scikit-learn': 'scikitlearn',
  Jupyter: 'jupyter',
  'Go / Chi': 'go',
  Go: 'go',
  MinIO: 'minio',
};

export const caseHref = (base: string, slug: string) => base + 'work/' + slug + '/';
export const withBase = (base: string, path: string) => base + path;

/** srcset for the right-sized WebP copies of a content image, or undefined when it has none. */
export const srcsetFor = (base: string, src: string) => {
  const widths = imageVariants[src];
  if (!widths) return undefined;
  const stem = src.replace(/^images\//, '').replace(/\.[a-z0-9]+$/i, '');
  return widths.map((width) => base + 'images/r/' + stem + '-' + width + '.webp ' + width + 'w').join(', ');
};

/** The smallest copy of an image, for blurred backdrops behind posters. */
export const smallestImage = (base: string, src: string) => {
  const width = imageVariants[src]?.[0];
  if (!width) return base + src;
  return base + 'images/r/' + src.replace(/^images\//, '').replace(/\.[a-z0-9]+$/i, '') + '-' + width + '.webp';
};
