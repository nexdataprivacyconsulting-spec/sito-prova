# sito-prova

Sito statico di prova. Contiene due siti dimostrativi, entrambi di fantasia, senza cookie né tracciamenti:

- `/` – **Moretti & Associati**, studio legale fittizio (Proposta 4 «Classico contemporaneo»). Pagine generate da `tools/genera.mjs`.
- `/caffe-prova/` – **Caffè Prova**, il primo sito di prova (solo HTML e CSS).

## Come è fatto lo studio legale

- `static/` – CSS, JavaScript e caratteri (Newsreader e Figtree, licenza SIL OFL, ospitati qui: nessuna richiesta a servizi esterni).
- `tools/genera.mjs` – contiene testi e illustrazioni (SVG disegnati in codice) e scrive tutte le pagine in `public/`.
- `public/` – il sito pronto, quello che Cloudflare pubblica.

Per modificare un testo: cambiare `tools/genera.mjs`, poi eseguire `node tools/genera.mjs` e salvare tutto su GitHub.

I nomi, i recapiti e i testi giuridici sono segnaposto dimostrativi: non sono pareri legali e vanno sostituiti prima di una pubblicazione reale.

`wrangler.jsonc` configura la pubblicazione su Cloudflare Workers come sito statico (progetto `sito-prova`).
