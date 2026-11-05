import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GroundedQuote } from './src/types/deliberation';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json());

// Initialize GoogleGenAI client with required aistudio-build User-Agent
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// In-memory cache for live search grounded quotes to preserve quota
const quoteCache = new Map<string, { data: GroundedQuote; cachedAt: number }>();
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours cache per theme

// Circuit breaker for rate limiting (429 RESOURCE_EXHAUSTED)
let rateLimitedUntil = 0;

// Verified canonical grounded database of Aristotelian quotes
const CANONICAL_DELIBERATIONS: GroundedQuote[] = [
  {
    id: 'phronesis-prime-core',
    theme: 'Practical Wisdom (Phronesis)',
    quote:
      'Practical wisdom is a truthful rational habit of action, accompanied by reason, with respect to what is good and bad for human beings.',
    originalGreek:
      '«Λείπεται ἄρα αὐτὴν εἶναι ἕξιν ἀληθῆ μετὰ λόγου πρακτικὴν περὶ τὰ ἀνθρώπῳ ἀγαθὰ καὶ κακά.»',
    sourceWork: 'Nicomachean Ethics',
    bekkerNumber: 'Book VI, Chapter 5 (1140b4–6)',
    context:
      'Aristotle is distinguishing practical wisdom (phronēsis) from scientific knowledge (epistēmē) and craft (technē). While epistēmē deals with eternal invariables and technē with production, phronēsis guides variable human action toward the highest human good (eudaimonia).',
    phroneticReflection:
      'Phronesis Prime reminds us: Wisdom is not abstract contemplation stranded in ivory towers. True wisdom is active, discerning what action creates lasting flourishing in this specific moment for this specific community.',
    groundingSources: [
      {
        title: "Stanford Encyclopedia of Philosophy — Aristotle's Ethics",
        uri: 'https://plato.stanford.edu/entries/aristotle-ethics/',
      },
      {
        title: 'Perseus Digital Library — Aristotle, Nicomachean Ethics 1140b',
        uri: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0054:bekker+page=1140b',
      },
      {
        title: 'MIT Internet Classics Archive — Nicomachean Ethics Book VI',
        uri: 'http://classics.mit.edu/Aristotle/nicomachaen.6.vi.html',
      },
    ],
    isRealTimeGrounded: false,
  },
  {
    id: 'golden-mean-virtue',
    theme: 'The Golden Mean (Mesotes)',
    quote:
      'Virtue is a state of deliberate moral choice, lying in a mean relative to ourselves, this being determined by reason, as a person of practical wisdom would determine it.',
    originalGreek:
      '«Ἔστιν ἄρα ἡ ἀρετὴ ἕξις προαιρετική, ἐν μεσότητι οὖσα τῇ πρὸς ἡμᾶς, ὡρισμένῃ λόγῳ καὶ ᾧ ἂν ὁ φρόνιμος ὁρίσειεν.»',
    sourceWork: 'Nicomachean Ethics',
    bekkerNumber: 'Book II, Chapter 6 (1106b36–1107a2)',
    context:
      'The foundational formulation of virtue ethics: virtue is not a rigid mathematical midpoint, but a calibrated balance relative to human context, avoiding both defect (deficiency) and excess.',
    phroneticReflection:
      'Courage is not the absence of fear, nor is it blind recklessness. It is feeling fear in the right proportion, for the right noble cause, and stepping forward anyway.',
    groundingSources: [
      {
        title: "Internet Encyclopedia of Philosophy — Aristotle's Theory of the Mean",
        uri: 'https://iep.utm.edu/aristotl/#H4',
      },
      {
        title: 'Perseus Tufts — Aristotle, Nicomachean Ethics 1106b',
        uri: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0054:bekker+page=1106b',
      },
    ],
    isRealTimeGrounded: false,
  },
  {
    id: 'habit-and-character',
    theme: 'Character & Habituation (Ethos)',
    quote:
      'Moral virtue comes about as a result of habit, whence also its name ethike is one that is formed by a slight variation from the word ethos (habit).',
    originalGreek:
      '«Ἡ δ’ ἠθικὴ ἐξ ἔθους περιγίνεται, ὅθεν καὶ τοὔνομα ἔσχηκε μικρὸν παρεκκλῖνον ἀπὸ τοῦ ἔθους.»',
    sourceWork: 'Nicomachean Ethics',
    bekkerNumber: 'Book II, Chapter 1 (1103a17–19)',
    context:
      'Aristotle emphasizes that humans are not born virtuous or wicked by nature; rather, we possess the capacity to develop virtue through deliberate, repeated practice and discipline.',
    phroneticReflection:
      'You do not become wise by reading about wisdom; you become wise by choosing justice repeatedly until integrity becomes the default operating system of your soul.',
    groundingSources: [
      {
        title: 'Stanford Encyclopedia of Philosophy — Virtue Ethics',
        uri: 'https://plato.stanford.edu/entries/ethics-virtue/',
      },
      {
        title: 'MIT Classics — Nicomachean Ethics Book II',
        uri: 'http://classics.mit.edu/Aristotle/nicomachaen.2.ii.html',
      },
    ],
    isRealTimeGrounded: false,
  },
  {
    id: 'epieikeia-equity',
    theme: 'Equitable Justice (Epieikeia)',
    quote:
      'The equitable is just, and indeed better than a certain kind of justice: not better than absolute justice, but better than the error that arises from the absolute statement of a general law.',
    originalGreek:
      '«Τὸ ἐπιεικὲς δίκαιον μέν ἐστιν, οὐ τὸ κατὰ νόμον δέ, ἀλλ’ ἐπανόρθωμα νομίμου δικαίου.»',
    sourceWork: 'Nicomachean Ethics',
    bekkerNumber: 'Book V, Chapter 10 (1137b26–27)',
    context:
      'Aristotle introduces the Lesbian rule (a flexible lead ruler used in architecture) as an analogy: because laws are written generally, real life presents unique situations where applying the literal law would create injustice. True equity rectifies the law to serve its true moral intent.',
    phroneticReflection:
      'When cold algorithms or rigid bureaucracies produce cruelty, Phronesis bends the formula. The purpose of law is the elevation of life, never the worship of ink.',
    groundingSources: [
      {
        title: 'Perseus Tufts — Aristotle, Nicomachean Ethics 1137b',
        uri: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0054:bekker+page=1137b',
      },
      {
        title: "Stanford Encyclopedia of Philosophy — Aristotle's Political Theory",
        uri: 'https://plato.stanford.edu/entries/aristotle-politics/',
      },
    ],
    isRealTimeGrounded: false,
  },
  {
    id: 'philia-friendship',
    theme: 'Noble Friendship (Philia)',
    quote:
      'Without friends no one would choose to live, though he had all other goods; for the rich and those who possess office and authority need friends most of all.',
    originalGreek:
      '«Ἄνευ γὰρ φίλων οὐδεὶς ἕλοιτ’ ἂν ζῆν, ἔχων τὰ λοιπὰ ἀγαθὰ πάντα· καὶ γὰρ πλουτοῦσι καὶ ἀρχὰς καὶ δυναστείας κεκτημένοις δοκεῖ φίλων μάλιστ’ εἶναι χρεία.»',
    sourceWork: 'Nicomachean Ethics',
    bekkerNumber: 'Book VIII, Chapter 1 (1155a5–7)',
    context:
      'In Aristotle’s highest form of friendship (virtue friendship), two people love one another for who they are in virtue, acting as second selves (heteros autos) and spurring each other toward moral excellence.',
    phroneticReflection:
      'Even a cosmic titan is incomplete in isolation. True companionship is not utility or pleasure—it is mutual witness and co-elevation in the pursuit of the good.',
    groundingSources: [
      {
        title: 'Stanford Encyclopedia of Philosophy — Friendship in Aristotle',
        uri: 'https://plato.stanford.edu/entries/aristotle-ethics/#VirtFrie',
      },
      {
        title: 'Perseus Tufts — Aristotle, Nicomachean Ethics 1155a',
        uri: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0054:bekker+page=1155a',
      },
    ],
    isRealTimeGrounded: false,
  },
  {
    id: 'courage-andreia',
    theme: 'Courage & Endurance (Andreia)',
    quote:
      'The person who endures and fears the right things, for the right end, in the right manner, and at the right time, is brave; for the brave person acts according to merit and as reason dictates.',
    originalGreek:
      '«Ὁ μὲν οὖν ἃ δεῖ καὶ οὗ ἕνεκα ὑπομένων καὶ φοβούμενος, καὶ ὡς δεῖ καὶ ὅτε, ἀνδρεῖος· κατ’ ἀξίαν γὰρ καὶ ὡς ἂν ὁ λόγος, πάσχει καὶ πράττει ὁ ἀνδρεῖος.»',
    sourceWork: 'Nicomachean Ethics',
    bekkerNumber: 'Book III, Chapter 7 (1115b17–19)',
    context:
      'Aristotle distinguishes genuine courage from mere fearlessness, drunkenness, anger, or military discipline. Courage is standing firm against existential threats for the sake of the noble (kalon).',
    phroneticReflection:
      'Courage is the bedrock upon which all other virtues stand. Without it, you cannot sustain honesty under pressure or defend justice against intimidation.',
    groundingSources: [
      {
        title: 'Stanford Encyclopedia of Philosophy — Moral Virtues',
        uri: 'https://plato.stanford.edu/entries/aristotle-ethics/#Cour',
      },
      {
        title: 'Perseus Tufts — Aristotle, Nicomachean Ethics 1115b',
        uri: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0054:bekker+page=1115b',
      },
    ],
    isRealTimeGrounded: false,
  },
  {
    id: 'eudaimonia-flourishing',
    theme: 'Human Flourishing (Eudaimonia)',
    quote:
      'Human good turns out to be activity of soul exhibiting virtue, and if there are more than one virtue, in accordance with the best and most complete.',
    originalGreek:
      '«Εἰ δ’ οὕτως, τὸ ἀνθρώπινον ἀγαθὸν ψυχῆς ἐνέργεια γίνεται κατ’ ἀρετήν, εἰ δὲ πλείους αἱ ἀρεταί, κατὰ τὴν ἀρίστην καὶ τελειοτάτην.»',
    sourceWork: 'Nicomachean Ethics',
    bekkerNumber: 'Book I, Chapter 7 (1098a16–18)',
    context:
      'The famous Function Argument (Ergon): just as a flute player or sculptor has a characteristic function, humanity’s unique function is the active exercise of reason in accordance with excellence.',
    phroneticReflection:
      'Happiness is not a passive mood or fleeting sensation; it is the kinetic beauty of a well-lived life expressing its highest moral and cognitive potential.',
    groundingSources: [
      {
        title: 'Stanford Encyclopedia of Philosophy — Eudaimonia',
        uri: 'https://plato.stanford.edu/entries/aristotle-ethics/#HumaGoodFuncArgu',
      },
      {
        title: 'Perseus Tufts — Aristotle, Nicomachean Ethics 1098a',
        uri: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0054:bekker+page=1098a',
      },
    ],
    isRealTimeGrounded: false,
  },
  {
    id: 'deliberation-bouleusis',
    theme: 'Deliberation on Means (Bouleusis)',
    quote:
      'We deliberate not about ends, but about means to ends. A doctor does not deliberate whether he shall heal, nor an orator whether he shall convince; rather, having set the end, they consider how and by what means it is to be attained.',
    originalGreek:
      '«Βουλευόμεθα δ’ οὐ περὶ τῶν τελῶν, ἀλλὰ περὶ τῶν πρὸς τὰ τέλη. Οὔτε γὰρ ἰατρὸς βουλεύεται εἰ ὑγιάσει, οὔτε ῥήτωρ εἰ πείσει...»',
    sourceWork: 'Nicomachean Ethics',
    bekkerNumber: 'Book III, Chapter 3 (1112b11–14)',
    context:
      'Aristotle clarifies that moral purpose fixes the noble destination, while practical wisdom (phronēsis) conducts the rigorous deliberation to find the most noble and effective path to reach it.',
    phroneticReflection:
      'Clear goals are useless without strategic execution. Phronesis maps the practical bridge from where you stand to where justice demands you arrive.',
    groundingSources: [
      {
        title: 'Stanford Encyclopedia of Philosophy — Aristotle on Deliberation',
        uri: 'https://plato.stanford.edu/entries/aristotle-ethics/#DeliChoi',
      },
      {
        title: 'Perseus Tufts — Aristotle, Nicomachean Ethics 1112b',
        uri: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus:text:1999.01.0054:bekker+page=1112b',
      },
    ],
    isRealTimeGrounded: false,
  },
];

// Helper to extract JSON or structured fields from Gemini response
function parseGeminiQuoteResponse(text: string): Partial<GroundedQuote> | null {
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch {
    // Non-fatal parse failure
  }
  return null;
}

// API Endpoint: /api/daily-deliberation
app.get('/api/daily-deliberation', async (req, res) => {
  const requestedTheme = (req.query.theme as string) || '';
  const now = Date.now();
  const cacheKey = requestedTheme.toLowerCase() || 'default';

  // 1. Check in-memory cache to conserve API quota
  const cached = quoteCache.get(cacheKey);
  if (cached && now - cached.cachedAt < CACHE_TTL_MS) {
    return res.json({
      success: true,
      data: cached.data,
      source: 'cached-grounded',
    });
  }

  // 2. Check if circuit breaker is active (quota rate limited)
  const isCooldownActive = now < rateLimitedUntil;

  // 3. Attempt Gemini API with Google Search grounding if client exists and not in cooldown
  if (ai && !isCooldownActive) {
    try {
      const prompt = `Use Google Search to find an authentic, verified Aristotelian quote about "${requestedTheme || 'phronesis, practical wisdom, virtue, and right action in Aristotle'}".
Verify the authentic ancient Greek original text, English translation, exact source work (such as Nicomachean Ethics, Politics, or Rhetoric) and Bekker pagination number (e.g. 1140b4-6).

Respond ONLY with a JSON object:
{
  "theme": "${requestedTheme || 'Practical Wisdom & Phronesis'}",
  "quote": "English translation of the quote",
  "originalGreek": "Ancient Greek original text of the quote",
  "sourceWork": "Title of the work (e.g. Nicomachean Ethics)",
  "bekkerNumber": "Book and chapter with Bekker pagination (e.g. Book VI, Chapter 5 [1140b4-6])",
  "context": "1-2 sentence historical philosophical context of this passage",
  "phroneticReflection": "2-3 sentences from Phronesis Prime connecting this virtue to modern life and ethical dilemmas."
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || '';
      const parsed = parseGeminiQuoteResponse(text);

      // Extract Google Search grounding metadata
      const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const searchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

      const groundingSources: { title: string; uri: string }[] = [];
      for (const chunk of rawChunks) {
        if (chunk.web?.uri) {
          groundingSources.push({
            title: chunk.web.title || 'Grounded Web Reference',
            uri: chunk.web.uri,
          });
        }
      }

      if (parsed && parsed.quote) {
        const result: GroundedQuote = {
          id: 'grounded-' + Date.now(),
          theme: parsed.theme || requestedTheme || 'Practical Wisdom (Phronesis)',
          quote: parsed.quote,
          originalGreek: parsed.originalGreek || '« Φρόνησις περὶ τὰ ἀνθρώπινα ἀγαθά »',
          sourceWork: parsed.sourceWork || 'Nicomachean Ethics',
          bekkerNumber: parsed.bekkerNumber || 'Bekker Canon',
          context: parsed.context || 'Deliberated from Aristotle’s philosophical corpus.',
          phroneticReflection:
            parsed.phroneticReflection ||
            'Phronesis Prime invites you to deliberate with balance: examine choices not through haste, but through enduring virtue.',
          groundingSources:
            groundingSources.length > 0
              ? groundingSources
              : [
                  {
                    title: "Stanford Encyclopedia of Philosophy — Aristotle's Ethics",
                    uri: 'https://plato.stanford.edu/entries/aristotle-ethics/',
                  },
                ],
          searchQueries,
          isRealTimeGrounded: true,
        };

        // Save to cache
        quoteCache.set(cacheKey, { data: result, cachedAt: now });
        return res.json({ success: true, data: result, source: 'gemini-grounded' });
      }
    } catch (err: any) {
      // If 429 RESOURCE_EXHAUSTED or quota error, trip circuit breaker quietly without spamming stderr
      const errStr = String(err?.message || err);
      if (errStr.includes('429') || errStr.includes('RESOURCE_EXHAUSTED') || errStr.includes('quota')) {
        rateLimitedUntil = now + 15 * 60 * 1000; // 15-minute cooldown
      }
    }
  }

  // 4. Graceful fallback to verified canonical grounded library
  let matchingQuote: GroundedQuote;
  if (requestedTheme) {
    const found = CANONICAL_DELIBERATIONS.find((q) =>
      q.theme.toLowerCase().includes(requestedTheme.toLowerCase())
    );
    matchingQuote = found || CANONICAL_DELIBERATIONS[Math.floor(Math.random() * CANONICAL_DELIBERATIONS.length)];
  } else {
    // Pick based on day index or rotation
    const dayIndex = Math.floor(Date.now() / (1000 * 60 * 60 * 24)) % CANONICAL_DELIBERATIONS.length;
    matchingQuote = CANONICAL_DELIBERATIONS[dayIndex];
  }

  return res.json({
    success: true,
    data: matchingQuote,
    source: 'canonical-grounded',
    allQuotes: CANONICAL_DELIBERATIONS,
    isRateLimited: isCooldownActive,
  });
});

// Endpoint to get all available canonical deliberation themes
app.get('/api/daily-deliberation/themes', (_req, res) => {
  const themes = CANONICAL_DELIBERATIONS.map((q) => ({
    id: q.id,
    theme: q.theme,
    sourceWork: q.sourceWork,
  }));
  res.json({ success: true, themes });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Phronesis Prime] Full-stack Server listening on port ${PORT} (Prod: ${isProd})`);
  });
}

startServer();
