// Genera il sito statico in ./public a partire dai contenuti qui sotto.
// Uso: node tools/genera.mjs   (poi si pubblica la cartella public/)
import { mkdirSync, writeFileSync, cpSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const RADICE = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(RADICE, "public");
const STUDIO = "Moretti & Associati";

/* ---------------------------------------------------------------- *
 *  Illustrazioni originali (SVG disegnati in codice, nessuna foto)
 * ---------------------------------------------------------------- */
const TONI = ["#f1e6d2", "#e6d7be", "#d8c3a0", "#c4a97f", "#a98b60"]; // dal più chiaro al più scuro

function spirale(cx, cy, r, verso) {
  const pts = [];
  for (let t = 0; t <= 2.7; t += 0.04) {
    const a = verso * (t * 2 * Math.PI) + Math.PI * 0.6;
    const rr = r * (1 - t / 3.1);
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)} ${(cy + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M${pts.join(" L")}`;
}

function colonna({ sfondo, viewBox, allinea = "xMidYMin slice", extra = "" }) {
  const N = 9;
  const [xs0, xs1, xb0, xb1] = [160, 320, 152, 328];
  let fusti = "";
  for (let i = 0; i < N; i++) {
    const u0 = i / N, u1 = (i + 1) / N, uc = (u0 + u1) / 2;
    const idx = Math.min(4, Math.max(0, Math.round(Math.abs(uc - 0.34) * 6.4)));
    const tl = xs0 + (xs1 - xs0) * u0, tr = xs0 + (xs1 - xs0) * u1;
    const bl = xb0 + (xb1 - xb0) * u0, br = xb0 + (xb1 - xb0) * u1;
    fusti += `<polygon points="${tl.toFixed(1)},152 ${tr.toFixed(1)},152 ${br.toFixed(1)},500 ${bl.toFixed(1)},500" fill="${TONI[idx]}" stroke="${TONI[4]}" stroke-width="1.2"/>`;
  }
  const volute = (cx, verso) => `
    <circle cx="${cx}" cy="112" r="34" fill="${TONI[0]}" stroke="${TONI[3]}" stroke-width="2"/>
    <path d="${spirale(cx, 112, 28, verso)}" fill="none" stroke="${TONI[4]}" stroke-width="2.6" stroke-linecap="round"/>
    <circle cx="${cx}" cy="112" r="4" fill="${TONI[4]}"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" preserveAspectRatio="${allinea}" role="img" aria-label="Colonna ionica in pietra chiara">
  <rect x="-200" y="-200" width="900" height="1200" fill="${sfondo}"/>
  ${extra}
  <rect x="96" y="66" width="288" height="22" fill="${TONI[2]}"/>
  <rect x="96" y="66" width="288" height="6" fill="${TONI[0]}"/>
  <rect x="104" y="88" width="272" height="44" fill="${TONI[1]}" stroke="${TONI[3]}" stroke-width="1.2"/>
  ${volute(128, 1)}${volute(352, -1)}
  <rect x="164" y="124" width="152" height="16" rx="8" fill="${TONI[0]}" stroke="${TONI[3]}" stroke-width="1.2"/>
  <rect x="156" y="140" width="168" height="12" fill="${TONI[2]}"/>
  ${fusti}
  <rect x="146" y="500" width="188" height="18" rx="9" fill="${TONI[1]}" stroke="${TONI[3]}" stroke-width="1.2"/>
  <rect x="130" y="518" width="220" height="16" fill="${TONI[2]}"/>
  <rect x="104" y="534" width="272" height="34" fill="${TONI[1]}" stroke="${TONI[3]}" stroke-width="1.2"/>
  <rect x="104" y="534" width="272" height="8" fill="${TONI[0]}"/>
</svg>`;
}

function arco() {
  const C = { blu: "#15203a", blu2: "#1e2d4f", s0: "#f1e6d2", s1: "#e6d7be", s2: "#d8c3a0", s3: "#c4a97f" };
  const finestra = (x, w, tono) => {
    const r = w / 2, base = 400, top = 150;
    return `<path d="M${x} ${base} V${top + r} A${r} ${r} 0 0 1 ${x + w} ${top + r} V${base} Z" fill="${tono}"/>
      <path d="M${x + r} ${top} V${base}" stroke="${C.blu}" stroke-width="5"/>
      <path d="M${x} ${top + r + 60} H${x + w}" stroke="${C.blu}" stroke-width="5"/>`;
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 480" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Sala con grandi finestre ad arco e un lungo tavolo">
  <rect width="600" height="480" fill="${C.blu}"/>
  <rect x="0" y="400" width="600" height="80" fill="${C.blu2}"/>
  ${finestra(70, 130, C.s1)}${finestra(235, 130, C.s0)}${finestra(400, 130, C.s1)}
  <polygon points="235,400 365,400 440,480 160,480" fill="${C.s0}" opacity="0.16"/>
  <rect x="60" y="402" width="480" height="14" fill="${C.s2}"/>
  <rect x="86" y="416" width="10" height="64" fill="${C.s3}"/><rect x="504" y="416" width="10" height="64" fill="${C.s3}"/>
  <rect x="200" y="380" width="70" height="22" fill="${C.s3}"/><rect x="278" y="372" width="54" height="30" fill="${C.s1}"/><rect x="340" y="384" width="62" height="18" fill="${C.s2}"/>
</svg>`;
}

function bilancia(sfondo = "#e6d7be") {
  const N = "#15203a", O = "#84643a", L = "#f1e6d2", S = "#c4a97f";
  const piatto = (cx, y) => `
    <path d="M${cx - 66} ${y} A66 30 0 0 0 ${cx + 66} ${y} Z" fill="${O}"/>
    <path d="M${cx} 150 L${cx - 62} ${y - 2} M${cx} 150 L${cx + 62} ${y - 2} M${cx} 150 L${cx} ${y - 2}" stroke="${N}" stroke-width="2.5"/>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Bilancia della giustizia">
  <rect width="640" height="480" fill="${sfondo}"/>
  <rect x="0" y="420" width="640" height="60" fill="${S}"/>
  <circle cx="470" cy="150" r="130" fill="${L}" opacity="0.55"/>
  <rect x="300" y="86" width="40" height="334" fill="${N}"/>
  <rect x="250" y="404" width="140" height="22" fill="${N}"/><rect x="226" y="424" width="188" height="16" fill="#0f182c"/>
  <circle cx="320" cy="82" r="22" fill="${O}"/>
  <rect x="120" y="116" width="400" height="14" rx="7" fill="${N}" transform="rotate(-4 320 123)"/>
  ${piatto(150, 300)}${piatto(490, 262)}
</svg>`;
}

function tempio() {
  const C = { s0: "#f1e6d2", s1: "#e6d7be", s2: "#d8c3a0", s3: "#c4a97f", blu: "#15203a" };
  let colonne = "";
  for (let i = 0; i < 6; i++) {
    const x = 120 + i * 80;
    colonne += `<rect x="${x}" y="204" width="34" height="196" fill="${C.s0}"/><rect x="${x + 20}" y="204" width="14" height="196" fill="${C.s2}"/><rect x="${x - 6}" y="196" width="46" height="10" fill="${C.s2}"/><rect x="${x - 6}" y="398" width="46" height="10" fill="${C.s2}"/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 480" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Facciata di un tempio con colonne">
  <rect width="640" height="480" fill="${C.s1}"/>
  <rect x="0" y="430" width="640" height="50" fill="${C.s3}"/>
  <polygon points="80,170 560,170 320,60" fill="${C.s0}" stroke="${C.s3}" stroke-width="3"/>
  <polygon points="150,160 490,160 320,86" fill="${C.s2}"/>
  <rect x="88" y="170" width="464" height="26" fill="${C.s2}"/>
  ${colonne}
  <rect x="84" y="408" width="472" height="14" fill="${C.s2}"/><rect x="64" y="422" width="512" height="16" fill="${C.s0}"/>
</svg>`;
}

const ICONE = {
  bilancia: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v17M6 20h12M4 7h16M7 7l-3 7a3 3 0 0 0 6 0L7 7zM17 7l-3 7a3 3 0 0 0 6 0l-3-7z"/></svg>`,
  documento: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"/></svg>`,
  scudo: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6zM9 12l2 2 4-4"/></svg>`,
  tempio: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-5 9 5zM5 20h14M6 9v8M10 9v8M14 9v8M18 9v8"/></svg>`,
};

/* ---------------------------------------------------------------- *
 *  Contenuti (testi dimostrativi: da sostituire con quelli dello Studio)
 * ---------------------------------------------------------------- */
const AREE = [
  {
    slug: "penale-impresa", nome: "Penale d'impresa", icona: "bilancia", arte: "bilancia",
    breve: "Reati societari e fallimentari, sicurezza sul lavoro, difesa di amministratori.",
    t1: "Penale", t2: "d'impresa",
    lead: "Difesa di società, amministratori e dirigenti nei procedimenti penali che nascono dall'attività d'impresa.",
    intro: "Le decisioni prese in azienda possono avere conseguenze penali per chi le ha prese. Lo Studio assiste gli amministratori e i responsabili di funzione prima, durante e dopo un procedimento, coordinando la difesa con le altre posizioni dell'impresa.",
    elenco: ["Reati societari", "Bancarotta e reati fallimentari", "Sicurezza sul lavoro", "Reati ambientali", "Difesa degli amministratori", "Rapporti con la procura"],
    faq: [
      ["Un amministratore risponde personalmente dei reati dell'impresa?", "La responsabilità penale è sempre personale: dipende dal ruolo, dai poteri e dalle condotte accertate. Per questo conviene ricostruire presto chi ha deciso cosa e con quali deleghe."],
      ["Quando conviene rivolgersi a un legale?", "Appena si riceve un atto dell'autorità giudiziaria o di vigilanza, o prima di una scelta che può avere conseguenze penali. Intervenire presto lascia più strade aperte."],
      ["Si può prevenire il rischio penale in azienda?", "Sì: con deleghe chiare, procedure e controlli interni adeguati alle dimensioni dell'impresa."],
    ],
    ref: ["AB", "Avv. [Nome Cognome]", "Penale d'impresa"],
  },
  {
    slug: "penale-tributario", nome: "Penale tributario", icona: "documento", arte: "bilancia",
    breve: "Reati del D.Lgs. 74/2000, indagini e processo.",
    t1: "Penale", t2: "tributario",
    lead: "Difesa di imprese, amministratori e professionisti nei procedimenti per reati tributari, dalla verifica fiscale al processo.",
    intro: "Quando una verifica o un accertamento fanno emergere ipotesi di reato previste dal D.Lgs. 74/2000, lo Studio coordina la difesa penale con la posizione tributaria, così che le scelte fatte in un procedimento non pesino sull'altro.",
    elenco: ["Dichiarazione fraudolenta e infedele", "Omessa dichiarazione", "Omesso versamento di ritenute e IVA", "Indebita compensazione", "Fatture per operazioni inesistenti", "Sequestri preventivi e confisca"],
    faq: [
      ["Una verifica fiscale può diventare un procedimento penale?", "Può accadere quando dalla verifica emergono ipotesi di reato previste dalla normativa penale tributaria: in quel caso gli atti possono essere trasmessi all'autorità giudiziaria. Per questo la fase della verifica va seguita con attenzione anche sul piano penale."],
      ["Il pagamento del debito incide sul procedimento?", "In alcuni casi la legge dà rilievo al pagamento del debito tributario, con effetti che dipendono dal reato e dalla fase del procedimento. Va valutato caso per caso."],
      ["Chi risponde: l'amministratore o la società?", "Sono posizioni distinte: la responsabilità penale riguarda le persone fisiche; la società può avere responsabilità separate, tributarie e, in certi casi, quella prevista dalla disciplina sulla responsabilità degli enti."],
    ],
    ref: ["GR", "Avv. [Nome Cognome]", "Penale d'impresa e tributario"],
  },
  {
    slug: "responsabilita-enti", nome: "Responsabilità degli enti", icona: "scudo", arte: "tempio",
    breve: "Modelli 231, Organismo di Vigilanza, difesa dell'ente.",
    t1: "Responsabilità", t2: "degli enti",
    lead: "Prevenzione e difesa della società quando i reati commessi nel suo interesse possono coinvolgerla.",
    intro: "Il D.Lgs. 231/2001 prevede che anche l'ente possa rispondere per alcuni reati commessi da chi vi lavora. Lo Studio costruisce modelli organizzativi su misura, assiste l'Organismo di Vigilanza e difende l'ente nel procedimento.",
    elenco: ["Modelli di organizzazione e gestione", "Organismo di Vigilanza", "Mappatura dei rischi", "Procedure e formazione interna", "Difesa dell'ente nel procedimento", "Sequestri e misure cautelari"],
    faq: [
      ["Il modello 231 è obbligatorio?", "No: la sua adozione non è imposta dalla legge, ma un modello adeguato e davvero applicato può incidere sulla responsabilità dell'ente."],
      ["Che cos'è l'Organismo di Vigilanza?", "È l'organo che vigila sul funzionamento e sull'osservanza del modello e ne cura l'aggiornamento."],
      ["Una piccola impresa deve adottare il modello?", "Non esiste un obbligo generale. La scelta dipende dai rischi dell'attività e dai rapporti con la pubblica amministrazione e con i grandi committenti, e si valuta con un'analisi dei rischi."],
    ],
    ref: ["MC", "Avv. [Nome Cognome]", "Responsabilità degli enti"],
  },
  {
    slug: "tributario-civile", nome: "Tributario e civile", icona: "tempio", arte: "arco",
    breve: "Accertamenti e contenzioso tributario; contratti e società.",
    t1: "Tributario", t2: "e civile",
    lead: "Assistenza alle imprese negli accertamenti, nel contenzioso tributario e nelle controversie contrattuali e societarie.",
    intro: "Una contestazione fiscale, un contratto che non regge, una lite tra soci: lo Studio affronta questi temi con lo stesso gruppo di lavoro che segue i profili penali, perché le scelte in un ambito toccano gli altri.",
    elenco: ["Avvisi di accertamento", "Contenzioso tributario", "Contratti commerciali", "Diritto societario", "Recupero crediti", "Controversie tra soci"],
    faq: [
      ["Come si contesta un avviso di accertamento?", "Con un ricorso nei termini previsti dalla legge: per questo conviene rivolgersi a un legale appena si riceve l'atto, senza attendere."],
      ["Si può evitare una lite tra soci?", "Spesso sì, con patti chiari fin dall'inizio e con una trattativa guidata prima che il conflitto si irrigidisca."],
      ["Come si tutela un credito commerciale non pagato?", "Dipende dal contratto e dalle prove disponibili: l'esame dei documenti permette di scegliere tra diffida, trattativa e azione giudiziale."],
    ],
    ref: ["LT", "Avv. [Nome Cognome]", "Tributario e civile"],
  },
];

const ARTICOLI = [
  {
    slug: "verifica-fiscale-azienda", cat: "Tributario", catSlug: "tributario",
    titolo: "Verifica fiscale in azienda: cosa fare nei primi giorni",
    sommario: "Una guida pratica ai primi passi quando i verificatori si presentano in azienda.",
    corpo: [
      ["p", "Quando i verificatori si presentano in azienda, i primi giorni contano più di quanto sembri. Le scelte fatte in quella fase — cosa si consegna, chi parla, come si documenta — pesano su tutto ciò che segue."],
      ["h2", "Subito"],
      ["ul", ["Farsi consegnare l'atto che dispone la verifica e leggere con calma cosa prevede.", "Individuare un referente interno che segua i verificatori e raccolga le richieste.", "Avvisare il consulente fiscale e il legale prima di rilasciare dichiarazioni articolate.", "Collaborare in modo ordinato, senza mai cancellare o modificare documenti.", "Chiedere copia dei verbali e dell'elenco dei documenti acquisiti."]],
      ["h2", "Nei giorni successivi"],
      ["p", "Conviene ricostruire la cronologia dei fatti contestati e riordinare i documenti, in modo che ogni risposta sia coerente con le altre. Le dichiarazioni a braccio, in questa fase, sono il rischio più comune."],
      ["h2", "Perché guardare anche al profilo penale"],
      ["p", "Se dalla verifica emergono ipotesi che la legge considera reato, la posizione dell'azienda e quella dei suoi amministratori cambiano. Valutare questo profilo fin dall'inizio evita di scoprirlo quando le scelte sono già state fatte."],
    ],
  },
  {
    slug: "modello-231-pmi", cat: "231", catSlug: "231",
    titolo: "Il modello 231 nelle PMI: quando conviene adottarlo",
    sommario: "Cos'è il modello organizzativo e come si decide se serve a una piccola impresa.",
    corpo: [
      ["p", "Il D.Lgs. 231/2001 prevede che un ente possa rispondere per alcuni reati commessi da chi lavora per esso. Il modello di organizzazione e gestione è lo strumento con cui l'ente dimostra di aver fatto il possibile per prevenirli."],
      ["h2", "È obbligatorio?"],
      ["p", "No. La legge non impone di adottarlo, ma un modello adeguato e realmente applicato può incidere sulla responsabilità dell'ente. Per questo la domanda utile non è «devo averlo?», ma «quanto rischio corro senza?»."],
      ["h2", "Quando conviene valutarlo"],
      ["ul", ["Se l'impresa lavora con la pubblica amministrazione.", "Se i grandi committenti chiedono garanzie sull'organizzazione.", "Se l'attività comporta rischi rilevanti, per esempio sulla sicurezza o sull'ambiente.", "Se la struttura è cresciuta e le responsabilità non sono più chiare."]],
      ["h2", "Da dove si parte"],
      ["p", "Da una mappatura dei rischi proporzionata alle dimensioni dell'impresa: un modello troppo pesante non viene applicato, e un modello non applicato non protegge."],
    ],
  },
  {
    slug: "reati-tributari-soglie", cat: "Penale tributario", catSlug: "penale-tributario",
    titolo: "Reati tributari e soglie di punibilità",
    sommario: "Perché per alcuni reati conta il superamento di soglie, e cosa controllare.",
    corpo: [
      ["p", "Nel diritto penale tributario non ogni irregolarità è un reato. Per alcune fattispecie la legge richiede il superamento di soglie, collegate all'importo dell'imposta evasa o dell'elemento contestato."],
      ["h2", "Perché le soglie contano"],
      ["p", "Stabiliscono il confine tra una violazione che resta sul piano tributario e una che apre un procedimento penale. Conoscerle aiuta a capire, fin dall'inizio, quanto è seria una contestazione."],
      ["h2", "Cosa controllare"],
      ["ul", ["Quale reato viene ipotizzato e per quale periodo d'imposta.", "Se la soglia prevista per quel reato è davvero superata, e secondo quale calcolo.", "Quale versione della norma si applica: le soglie e le regole sono state modificate nel tempo."]],
      ["h2", "Una precisazione"],
      ["p", "Le soglie non sono l'unico elemento: esistono reati che non le prevedono. Per questo ogni contestazione va letta con un legale, atto per atto."],
    ],
  },
];

const PROFESSIONISTI = [
  { sigla: "AB", nome: "Avv. [Nome Cognome]", ruolo: "Socio fondatore", aree: "Penale d'impresa", form: "[Formazione e titoli]", ordine: "Iscritto all'Ordine degli Avvocati di Napoli dal [anno]" },
  { sigla: "GR", nome: "Avv. [Nome Cognome]", ruolo: "Socio", aree: "Penale tributario", form: "[Formazione e titoli]", ordine: "Iscritto all'Ordine degli Avvocati di Napoli dal [anno]" },
  { sigla: "LT", nome: "Avv. [Nome Cognome]", ruolo: "Associato", aree: "Tributario e civile", form: "[Formazione e titoli]", ordine: "Iscritto all'Ordine degli Avvocati di Napoli dal [anno]" },
];

const SITUAZIONI = [
  { id: "verifica", tab: "Una verifica fiscale", testo: "Una verifica fiscale può aprire un fronte penale: se emergono ipotesi di reato, le scelte fatte nella verifica pesano anche sul procedimento.", fronti: [["Tributario e civile", "tributario-civile"], ["Penale tributario", "penale-tributario"], ["Responsabilità degli enti", "responsabilita-enti"]] },
  { id: "soci", tab: "Una lite tra soci", testo: "Una lite tra soci tocca la responsabilità degli amministratori e le decisioni della società: conviene guardarla insieme, non a pezzi.", fronti: [["Tributario e civile", "tributario-civile"], ["Penale d'impresa", "penale-impresa"]] },
  { id: "indagine", tab: "Un'indagine sull'azienda", testo: "Quando un'indagine riguarda l'azienda, la posizione delle persone e quella della società vanno difese in modo coordinato.", fronti: [["Penale d'impresa", "penale-impresa"], ["Responsabilità degli enti", "responsabilita-enti"], ["Penale tributario", "penale-tributario"]] },
];

/* ---------------------------------------------------------------- *
 *  Struttura comune delle pagine
 * ---------------------------------------------------------------- */
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const minuti = (corpo) => {
  const parole = corpo.map(([t, v]) => (t === "ul" ? v.join(" ") : v)).join(" ").split(/\s+/).length;
  return Math.max(2, Math.round(parole / 200));
};

const NAV = [
  ["Lo Studio", "/lo-studio/", "lo-studio"],
  ["Aree di attività", "/aree-di-attivita/", "aree"],
  ["Professionisti", "/professionisti/", "professionisti"],
  ["Approfondimenti", "/approfondimenti/", "approfondimenti"],
];

function pagina({ percorso, titolo, descrizione, sezione = "", corpo, classeBody = "", extraTop = "" }) {
  const nav = NAV.map(([t, h, s]) => `<li><a href="${h}"${sezione === s ? ' aria-current="page"' : ""}>${t}</a></li>`).join("");
  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titolo)}${titolo.includes(STUDIO) ? "" : " – " + STUDIO}</title>
<meta name="description" content="${esc(descrizione)}">
<meta name="robots" content="noindex, nofollow">
<meta name="theme-color" content="#15203a">
<link rel="preload" href="/assets/fonts/newsreader-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/figtree-latin-wght-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 32 32%27%3E%3Crect width=%2732%27 height=%2732%27 fill=%27%2315203a%27/%3E%3Cpath d=%27M8 9h16M10 12h12M12 12v11M16 12v11M20 12v11M9 24h14%27 stroke=%27%23e6d7be%27 stroke-width=%271.8%27 fill=%27none%27/%3E%3C/svg%3E">
<link rel="stylesheet" href="/assets/css/stile.css">
<script>document.documentElement.className+=" js";</script>
</head>
<body class="${classeBody}">
<a class="salta" href="#contenuto">Vai al contenuto</a>
${extraTop}
<header class="testata">
  <div class="contenitore testata-in">
    <a class="marchio" href="/" aria-label="${STUDIO} – home"><span class="marchio-nome">${STUDIO.replace("&amp;", "&")}</span><span class="marchio-sotto">Studio legale · Napoli</span></a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="nav-principale"><span class="barre" aria-hidden="true"></span><span class="etichetta">Menu</span></button>
    <nav class="nav" id="nav-principale" aria-label="Principale">
      <ul>${nav}</ul>
      <a class="bottone" href="/contatti/"${sezione === "contatti" ? ' aria-current="page"' : ""}>Contatti</a>
    </nav>
  </div>
</header>
<main id="contenuto">
${corpo}
</main>
<footer class="piede">
  <div class="contenitore piede-in">
    <p>${STUDIO} · [Indirizzo], 80121 Napoli · Ordine degli Avvocati di Napoli · Tel. [081 000 0000]</p>
    <nav aria-label="Pagine legali"><ul><li><a href="/privacy/">Privacy</a></li><li><a href="/cookie-policy/">Cookie policy</a></li><li><a href="/cookie-policy/#preferenze">Preferenze cookie</a></li></ul></nav>
  </div>
  <p class="contenitore piede-demo">Sito dimostrativo: studio, professionisti e testi sono di fantasia. Nessun cookie, nessun tracciamento. Illustrazioni originali; caratteri Newsreader e Figtree (licenza SIL OFL), ospitati su questo sito.</p>
</footer>
<script src="/assets/js/sito.js" defer></script>
</body>
</html>
`;
}

const scrivi = (rel, contenuto) => {
  const p = join(OUT, rel);
  mkdirSync(dirname(p), { recursive: true });
  writeFileSync(p, contenuto);
};

const schedaArea = (a) => `<a class="scheda-area" href="/aree-di-attivita/${a.slug}/" data-r>
  <span class="icona">${ICONE[a.icona]}</span>
  <h3>${a.nome}</h3>
  <p>${a.breve}</p>
</a>`;
const schedaArt = (a, conFiltro = false) => `<a class="scheda-art" href="/approfondimenti/${a.slug}/" data-r${conFiltro ? ` data-cat="${a.catSlug}"` : ""}>
  <span class="meta">${a.cat} · ${minuti(a.corpo)} min</span>
  <h3>${a.titolo}</h3>
  <span class="leggi">Leggi</span>
</a>`;

const cartolina = () => `<aside class="lato" aria-label="Contatti dello Studio">
  <div class="cartolina blu">
    <h2>Parliamone in Studio</h2>
    <p>Per un primo incontro telefona o scrivi alla PEC dello Studio.</p>
    <dl class="dati"><dt>Tel.</dt><dd>[081 000 0000]</dd><dt>PEC</dt><dd>[studio@pec.it]</dd><dt>Orari</dt><dd>Lun–ven, 9:30–19:00</dd></dl>
    <div class="azioni"><a class="bottone sabbia" href="/contatti/#telefono">Chiama lo Studio</a></div>
  </div>
</aside>`;

/* ---------------------------------------------------------------- *
 *  Pagine
 * ---------------------------------------------------------------- */
function home() {
  const aree = AREE.map(schedaArea).join("\n");
  const art = ARTICOLI.map((a) => schedaArt(a)).join("\n");
  const tabs = SITUAZIONI.map((s, i) => `<button role="tab" type="button" id="tab-${s.id}" aria-controls="pan-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}">${s.tab}</button>`).join("");
  const pannelli = SITUAZIONI.map((s, i) => `<div role="tabpanel" id="pan-${s.id}" aria-labelledby="tab-${s.id}"${i ? "" : ""}>
        <p class="titolo-nojs">${s.tab}</p>
        <p>${s.testo}</p>
        <div class="fronti">${s.fronti.map(([n, sl]) => `<a href="/aree-di-attivita/${sl}/">${n}</a>`).join("")}</div>
      </div>`).join("\n");
  const corpo = `
<section class="hero">
  <div class="contenitore hero-in">
    <div>
      <p class="sopra entra" style="--d:.1s">Penale · Tributario · Civile</p>
      <h1 aria-label="Non solo diritto. Persone, imprese, progetti.">
        <span class="riga" aria-hidden="true"><span style="--d:.15s">Non solo diritto.</span></span>
        <span class="riga" aria-hidden="true"><span style="--d:.3s">Persone, <em class="corsivo">imprese</em>,</span></span>
        <span class="riga" aria-hidden="true"><span style="--d:.45s">progetti.</span></span>
      </h1>
      <p class="lead entra" style="--d:.75s">Assistenza legale a società, amministratori e professionisti: prevenzione, consulenza e difesa, con un unico gruppo di lavoro.</p>
      <div class="azioni entra" style="--d:.9s">
        <a class="bottone" href="/contatti/">Fissa un appuntamento</a>
        <a class="bottone chiaro" href="/lo-studio/">Scopri lo Studio</a>
      </div>
    </div>
    <div class="hero-arte" aria-hidden="false">
      <div class="par-w" data-par="-0.07"><span class="blocco a" style="--d:.6s"></span><span class="blocco b" style="--d:.8s"></span><span class="blocco c" style="--d:.5s"></span></div>
      <div class="par-w" data-par="0.04"><div class="pannello"><img src="/assets/img/colonna-chiara.svg" width="480" height="600" alt="Colonna ionica in pietra chiara"></div></div>
    </div>
  </div>
</section>

<section class="sezione" aria-labelledby="t-aree">
  <div class="contenitore">
    <div class="testata-sezione">
      <div><span class="sopra">Competenze</span><h2 id="t-aree">Aree di attività</h2></div>
      <a class="link-tutte" href="/aree-di-attivita/">Tutte le aree</a>
    </div>
    <div class="aree">
${aree}
    </div>
  </div>
</section>

<section class="blu sul-blu" aria-labelledby="t-metodo">
  <div class="metodo">
    <div class="metodo-testo">
      <span class="sopra">Il metodo</span>
      <h2 id="t-metodo">Una visione <em class="corsivo">multidisciplinare.</em></h2>
      <p class="intro">Una verifica fiscale può aprire un fronte penale; una lite tra soci tocca la responsabilità degli amministratori. Lo Studio segue questi profili insieme, nello stesso fascicolo.</p>
      <ul class="pilastri">
        <li data-r><strong>Prevenzione</strong><span>Modelli, contratti, procedure</span></li>
        <li data-r><strong>Assistenza</strong><span>Verifiche, ispezioni, trattative</span></li>
        <li data-r><strong>Difesa</strong><span>Contenzioso in ogni grado</span></li>
      </ul>
      <div class="scelta" data-scelta>
        <h3>Da dove parte il problema?</h3>
        <div role="tablist" aria-label="Situazioni frequenti">${tabs}</div>
        ${pannelli}
      </div>
      <div class="azioni"><a class="bottone sabbia" href="/lo-studio/">Il metodo dello Studio</a></div>
    </div>
    <div class="metodo-arte"><img data-par="0.1" src="/assets/img/colonna-scura.svg" width="480" height="600" alt="Capitello di una colonna ionica su fondo blu notte"></div>
  </div>
</section>

<section class="sezione">
  <div class="contenitore duo">
    <div class="arte" data-r><img src="/assets/img/studio.svg" width="600" height="480" alt="Sala dello Studio con grandi finestre ad arco e un lungo tavolo"></div>
    <div data-r>
      <span class="sopra">Lo Studio</span>
      <h2>Esperienza, competenza, metodo.</h2>
      <p class="corpo">Un gruppo di avvocati con competenze complementari, a Napoli, per accompagnare le imprese nelle scelte e nei momenti più delicati.</p>
      <div class="azioni"><a class="bottone chiaro" href="/professionisti/">Conosci i professionisti</a></div>
    </div>
  </div>
</section>

<section class="sezione" style="padding-top:0" aria-labelledby="t-appr">
  <div class="contenitore">
    <div class="testata-sezione">
      <h2 id="t-appr">Approfondimenti</h2>
      <a class="link-tutte" href="/approfondimenti/">Tutti gli articoli</a>
    </div>
    <div class="articoli">
${art}
    </div>
  </div>
</section>`;
  return pagina({ titolo: `${STUDIO} – Studio legale a Napoli`, descrizione: "Sito dimostrativo di uno studio legale fittizio a Napoli: penale, tributario e civile per le imprese.", corpo });
}

function intestazione({ sopra, h1, lead, briciole = "" }) {
  return `<section class="intestazione-pagina">
  <div class="contenitore in">
    ${briciole}
    <p class="sopra" style="margin-top:${briciole ? "1.4rem" : "0"}">${sopra}</p>
    <h1>${h1}</h1>
    ${lead ? `<p class="lead">${lead}</p>` : ""}
  </div>
</section>`;
}

function loStudio() {
  const passi = [["Ascolto", "Capire la situazione dell'impresa e cosa è davvero in gioco."], ["Analisi integrata", "Guardare insieme i profili penale, tributario e civile."], ["Strategia", "Scegliere con il cliente la via più sostenibile."], ["Assistenza", "Seguire ogni passaggio fino alla conclusione."]]
    .map(([t, d]) => `<li data-r><strong>${t}</strong><span>${d}</span></li>`).join("");
  const principi = [["Chiarezza", "Spiegare le questioni in modo comprensibile, senza formule inutili."], ["Riservatezza", "Trattare con la massima cura ogni informazione ricevuta."], ["Responsabilità", "Dire con franchezza rischi e alternative, anche quando sono scomode."]]
    .map(([t, d]) => `<div class="principio" data-r><h3>${t}</h3><p>${d}</p></div>`).join("");
  const corpo = `${intestazione({ sopra: "Lo Studio", h1: `Un gruppo, <em class="corsivo">un fascicolo.</em>`, lead: "Penalisti e tributaristi lavorano insieme sullo stesso caso, perché per un'impresa i problemi non arrivano mai uno alla volta." })}
<section class="sezione">
  <div class="contenitore duo">
    <div data-r>
      <h2 style="font-size:clamp(1.9rem,3.4vw,2.7rem);line-height:1.12">Chi siamo</h2>
      <p class="corpo">[Storia dello Studio: anno di fondazione, nascita del gruppo, evoluzione delle competenze.] Testo dimostrativo da sostituire con quello fornito dallo Studio.</p>
      <p class="corpo">Lo Studio assiste società, amministratori e professionisti nelle questioni penali, tributarie e civili legate all'attività d'impresa.</p>
    </div>
    <div class="arte" data-r><img src="/assets/img/studio.svg" width="600" height="480" alt="Sala dello Studio con grandi finestre ad arco"></div>
  </div>
</section>
<section class="sezione" style="padding-top:0">
  <div class="contenitore">
    <h2 style="font-size:clamp(1.9rem,3.4vw,2.7rem)">Come lavoriamo</h2>
    <ol class="passaggi">${passi}</ol>
  </div>
</section>
<section class="sezione" style="padding-top:0">
  <div class="contenitore">
    <h2 style="font-size:clamp(1.9rem,3.4vw,2.7rem)">I nostri principi</h2>
    <div class="principi">${principi}</div>
  </div>
</section>
<section class="blu sul-blu sezione">
  <div class="contenitore sede" style="background:none;margin:0;display:block">
    <h2 style="font-size:clamp(1.9rem,3.4vw,2.7rem)">Sede</h2>
    <p style="color:#c9cfdd;margin-top:1rem">Napoli, Chiaia – [Indirizzo], 80121 Napoli. Si riceve su appuntamento.</p>
    <div class="azioni"><a class="bottone sabbia" href="/contatti/">Come raggiungerci</a></div>
  </div>
</section>`;
  return pagina({ titolo: "Lo Studio", descrizione: "Il metodo di lavoro e i principi dello Studio: un unico gruppo per i profili penale, tributario e civile.", sezione: "lo-studio", corpo });
}

function areeIndice() {
  const corpo = `${intestazione({ sopra: "Competenze", h1: `Aree di <em class="corsivo">attività</em>`, lead: "Quattro aree che si parlano tra loro: un problema d'impresa raramente è soltanto penale, soltanto tributario o soltanto civile." })}
<section class="sezione">
  <div class="contenitore"><div class="aree">
${AREE.map(schedaArea).join("\n")}
  </div></div>
</section>`;
  return pagina({ titolo: "Aree di attività", descrizione: "Penale d'impresa, penale tributario, responsabilità degli enti, tributario e civile.", sezione: "aree", corpo });
}

function areaPagina(a) {
  const arte = { bilancia: bilancia(), tempio: tempio(), arco: null }[a.arte];
  const imgSrc = a.arte === "arco" ? "/assets/img/studio.svg" : `/assets/img/${a.arte}.svg`;
  const faq = a.faq.map(([d, r], i) => `<div class="faq-voce" data-r>
      <h3><button type="button" aria-expanded="false" aria-controls="r-${a.slug}-${i}" id="d-${a.slug}-${i}">${d}<span class="piu" aria-hidden="true"></span></button></h3>
      <div class="faq-risposta" id="r-${a.slug}-${i}" role="region" aria-labelledby="d-${a.slug}-${i}"><div><p>${r}</p></div></div>
    </div>`).join("");
  const corpo = `<section class="intestazione-pagina">
  <div class="contenitore in area-hero">
    <div>
      <p class="briciole"><a href="/aree-di-attivita/">Aree di attività</a> / ${a.nome}</p>
      <p class="sopra" style="margin-top:1.4rem">Area di attività</p>
      <h1>${a.t1} <em class="corsivo">${a.t2}</em></h1>
      <p class="lead">${a.lead}</p>
    </div>
    <div class="arte"><img src="${imgSrc}" width="640" height="480" alt="${a.arte === "bilancia" ? "Bilancia della giustizia" : a.arte === "tempio" ? "Facciata di un tempio con colonne" : "Sala con finestre ad arco"}"></div>
  </div>
</section>
<section class="sezione">
  <div class="contenitore area-corpo">
    <div class="testo">
      <h2>Di cosa ci occupiamo</h2>
      <p>${a.intro}</p>
      <ul class="elenco">${a.elenco.map((e) => `<li data-r>${e}</li>`).join("")}</ul>
      <div class="faq">
        <h2>Domande frequenti</h2>
        ${faq}
        <p class="avviso-demo" style="margin-top:1rem;font-size:.85rem;color:var(--muted)">Risposte di carattere generale e informativo, scritte per questo sito dimostrativo: non costituiscono un parere legale.</p>
      </div>
    </div>
    <div>
      ${cartolina()}
      <div class="referente" style="margin-top:1rem"><span class="monogramma">${a.ref[0]}</span><div><span class="sopra">Referente</span><strong>${a.ref[1]}</strong><span class="sub">${a.ref[2]}</span></div></div>
    </div>
  </div>
</section>`;
  return pagina({ titolo: a.nome, descrizione: a.lead, sezione: "aree", corpo });
}

function professionisti() {
  const schede = PROFESSIONISTI.map((p) => `<article class="professionista" data-r>
    <span class="monogramma">${p.sigla}</span>
    <h3>${p.nome}</h3>
    <span class="ruolo">${p.ruolo}</span>
    <p>Aree: ${p.aree}</p>
    <ul><li>${p.form}</li><li>${p.ordine}</li></ul>
  </article>`).join("");
  const corpo = `${intestazione({ sopra: "Professionisti", h1: `Chi <em class="corsivo">vi assiste</em>`, lead: "Un gruppo di avvocati con competenze complementari. Nomi e dati sono segnaposto da sostituire con quelli reali." })}
<section class="sezione"><div class="contenitore"><div class="professionisti">${schede}</div></div></section>`;
  return pagina({ titolo: "Professionisti", descrizione: "I professionisti dello Studio: ruolo, aree, formazione, iscrizione all'Ordine.", sezione: "professionisti", corpo });
}

function approfondimenti() {
  const cats = [["tutti", "Tutti"], ["tributario", "Tributario"], ["231", "231"], ["penale-tributario", "Penale tributario"]];
  const corpo = `${intestazione({ sopra: "Approfondimenti", h1: `Novità e <em class="corsivo">approfondimenti</em>`, lead: "Articoli scelti dallo Studio su temi che toccano da vicino le imprese." })}
<section class="sezione">
  <div class="contenitore">
    <div class="filtri" data-filtri role="group" aria-label="Filtra per categoria">${cats.map(([v, t], i) => `<button type="button" data-filtro="${v}" aria-pressed="${i === 0}">${t}</button>`).join("")}</div>
    <div class="articoli">
${ARTICOLI.map((a) => schedaArt(a, true)).join("\n")}
    </div>
  </div>
</section>`;
  return pagina({ titolo: "Approfondimenti", descrizione: "Articoli e novità dello Studio, con filtri per categoria.", sezione: "approfondimenti", corpo });
}

function articolo(a) {
  const blocchi = a.corpo.map(([t, v]) => (t === "p" ? `<p>${v}</p>` : t === "h2" ? `<h2>${v}</h2>` : `<ul>${v.map((x) => `<li>${x}</li>`).join("")}</ul>`)).join("\n");
  const corpo = `${intestazione({
    sopra: `${a.cat} · ${minuti(a.corpo)} min di lettura`,
    h1: a.titolo,
    lead: a.sommario,
    briciole: `<p class="briciole"><a href="/approfondimenti/">Approfondimenti</a> / ${a.cat}</p>`,
  })}
<section class="sezione">
  <div class="contenitore articolo-corpo">
${blocchi}
<p class="avviso-demo">Testo dimostrativo di carattere generale, scritto per questo sito di prova: non costituisce un parere legale e andrà sostituito con gli articoli scelti dallo Studio.</p>
<div class="azioni"><a class="bottone chiaro" href="/approfondimenti/">Tutti gli approfondimenti</a><a class="bottone" href="/contatti/">Parlane con lo Studio</a></div>
  </div>
</section>`;
  return pagina({ titolo: a.titolo, descrizione: a.sommario, sezione: "approfondimenti", corpo, extraTop: '<div class="progresso" aria-hidden="true"></div>' });
}

function contatti() {
  const tel = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h3l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v3a3 3 0 0 1-3 3A15 15 0 0 1 3 6a3 3 0 0 1 3-3z"/></svg>`;
  const mail = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v12H3zM3 7l9 7 9-7"/></svg>`;
  const corpo = `${intestazione({ sopra: "Contatti", h1: `Parliamone<span class="corsivo">.</span>`, lead: "Per un primo incontro, in Studio o in videochiamata, telefona o scrivi allo Studio." })}
<section class="sezione" style="padding-top:clamp(2.5rem,5vw,4rem)">
  <div class="contenitore">
    <div class="contatti-griglia">
      <div class="contatto" id="telefono" data-r><span class="icona">${tel}</span><div><span class="sopra">Telefono</span><h2>[081 000 0000]</h2><p class="det">Lunedì–venerdì, 9:30–13:30 e 15:30–19:00</p><a class="bottone" href="/contatti/#telefono">Chiama lo Studio</a></div></div>
      <div class="contatto" data-r><span class="icona">${mail}</span><div><span class="sopra">Email e PEC</span><h2>[info@studio.it]</h2><p class="det">PEC: [studio@pec.it]</p><a class="bottone chiaro" href="/contatti/">Scrivi una email</a></div></div>
    </div>
    <div class="sede blu sul-blu">
      <div class="sede-testo"><span class="sopra">Sede</span><h2>Napoli, Chiaia</h2><p>[Indirizzo], 80121 Napoli<br>Si riceve su appuntamento.</p><div class="azioni"><a class="bottone sabbia" href="/contatti/">Indicazioni stradali</a></div></div>
      <div class="arte"><img src="/assets/img/colonna-scura.svg" width="480" height="600" alt="Capitello di una colonna ionica su fondo blu notte"></div>
    </div>
    <p class="nota"><strong>Nota privacy.</strong> Il sito non raccoglie dati personali tramite moduli: per contattare lo Studio si usano telefono, email o PEC. Vedi l'<a href="/privacy/">informativa privacy</a>.</p>
  </div>
</section>`;
  return pagina({ titolo: "Contatti", descrizione: "Recapiti, PEC, orari e sede dello Studio. Nessun modulo di contatto: si telefona o si scrive.", sezione: "contatti", corpo });
}

function privacy() {
  const corpo = `${intestazione({ sopra: "Pagine legali", h1: "Informativa privacy" })}
<section class="sezione"><div class="contenitore legale">
<p class="avviso-demo" style="padding:.9rem 1.1rem">Testo dimostrativo. Nella versione reale l'informativa verrà predisposta sulla base dell'analisi dei trattamenti del sito.</p>
<h2>Che dati tratta questo sito</h2>
<p>Questo sito dimostrativo non ha moduli di contatto, non usa cookie e non usa strumenti di statistica o di pubblicità. Non raccoglie quindi dati personali forniti dai visitatori.</p>
<p>Come per ogni sito, i server che erogano le pagine trattano dati tecnici di connessione necessari al funzionamento. I dettagli e i fornitori coinvolti andranno indicati nell'informativa definitiva.</p>
<h2>Contatti con lo Studio</h2>
<p>Se scrivi o telefoni allo Studio, i dati che comunichi saranno trattati per rispondere alla tua richiesta. [Titolare, finalità, base giuridica, tempi di conservazione e diritti: da completare nella versione reale.]</p>
</div></section>`;
  return pagina({ titolo: "Informativa privacy", descrizione: "Informativa privacy del sito dimostrativo.", corpo });
}

function cookie() {
  const corpo = `${intestazione({ sopra: "Pagine legali", h1: "Cookie policy" })}
<section class="sezione"><div class="contenitore legale">
<p class="avviso-demo" style="padding:.9rem 1.1rem">Testo dimostrativo. Nella versione reale la cookie policy verrà generata dopo la scansione del sito e collegata al sistema di gestione dei consensi.</p>
<h2>Cookie utilizzati</h2>
<p>Questo sito dimostrativo non utilizza cookie né altri strumenti di tracciamento. Per questo non mostra alcun banner di consenso.</p>
<h2 id="preferenze">Preferenze cookie</h2>
<p>Non c'è nulla da scegliere: nessun cookie, tecnico o di altro tipo, viene memorizzato dal sito. Nella versione reale, questa sezione conterrà il pannello per modificare o revocare il consenso.</p>
</div></section>`;
  return pagina({ titolo: "Cookie policy", descrizione: "Cookie policy del sito dimostrativo.", corpo });
}

function nonTrovata() {
  const corpo = `${intestazione({ sopra: "Errore 404", h1: `Pagina <em class="corsivo">non trovata</em>`, lead: "L'indirizzo che hai aperto non esiste o è stato spostato. Torna alla home o scegli una sezione dal menu." })}
<section class="sezione" style="padding-top:2rem"><div class="contenitore"><div class="azioni"><a class="bottone" href="/">Vai alla home</a><a class="bottone chiaro" href="/aree-di-attivita/">Aree di attività</a></div></div></section>`;
  return pagina({ titolo: "Pagina non trovata", descrizione: "Pagina non trovata.", corpo });
}

/* ---------------------------------------------------------------- *
 *  Scrittura
 * ---------------------------------------------------------------- */
const caffe = join(OUT, "caffe-prova");
const salvaCaffe = existsSync(caffe);
if (existsSync(join(OUT, "assets"))) rmSync(join(OUT, "assets"), { recursive: true });
cpSync(join(RADICE, "static"), OUT, { recursive: true });

scrivi("assets/img/colonna-chiara.svg", colonna({ sfondo: "#e6d7be", viewBox: "0 0 480 600", allinea: "xMidYMid slice" }));
scrivi("assets/img/colonna-scura.svg", colonna({ sfondo: "#1e2d4f", viewBox: "40 40 400 330", allinea: "xMidYMin slice" }));
scrivi("assets/img/studio.svg", arco());
scrivi("assets/img/bilancia.svg", bilancia());
scrivi("assets/img/tempio.svg", tempio());

scrivi("index.html", home());
scrivi("lo-studio/index.html", loStudio());
scrivi("aree-di-attivita/index.html", areeIndice());
AREE.forEach((a) => scrivi(`aree-di-attivita/${a.slug}/index.html`, areaPagina(a)));
scrivi("professionisti/index.html", professionisti());
scrivi("approfondimenti/index.html", approfondimenti());
ARTICOLI.forEach((a) => scrivi(`approfondimenti/${a.slug}/index.html`, articolo(a)));
scrivi("contatti/index.html", contatti());
scrivi("privacy/index.html", privacy());
scrivi("cookie-policy/index.html", cookie());
scrivi("404.html", nonTrovata());
scrivi("robots.txt", "User-agent: *\nDisallow: /\n");
console.log("Sito generato in", OUT, salvaCaffe ? "(caffe-prova mantenuto)" : "");
