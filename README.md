# containers-storefront

The public storefront of **Prime Containers** (`containers.amer360.com`). It renders exclusively
from the configuration Aamer publishes for the slug — every section, figure, colour, number and
knowledge-base entry is edited in Aamer's store builder (*المتجر الإلكتروني*) and appears here on
the next publish. Architecture: Aamer ADR 0038; this repository is batch SF-2.

## How it works

| Aamer endpoint | Used for |
| --- | --- |
| `GET /api/v1/public/storefront/<slug>/config` | the whole site — read server-side, cached for 60 s |
| `POST /api/v1/public/storefront/<slug>/requests` | the quote / sample / enquiry form (`/api/requests` on this site forwards to it) |
| `POST /api/v1/public/storefront/<slug>/unanswered` | questions the assistant could not answer (`/api/unanswered` forwards) |

The sixteen section kinds (hero, clients, story, shop, import, containers, calc, journey,
shipping, certs, tracking, gov, compliance, faq, blog, rfq) draw only when enabled and in the
published order. Arabic is the default (`/`), English at `/en`. The import-cost calculator reads
every rate from `calculator`; the assistant answers from `assistant.kb` and the FAQ only and
logs what it cannot answer. No cart, checkout, order, payment or invoice (SF-3); no model (SF-4).

## Run it

```
cp .env.example .env        # AAMER_API_URL, STOREFRONT_SLUG, SITE_ORIGIN
npm ci
npm run dev                 # http://127.0.0.1:3100
```

Aamer must be reachable at `AAMER_API_URL` with the site **live** for the slug; otherwise the site
shows its "not available" page. In production run Aamer with `TRUST_PROXY=true` so its per-client
limiter sees the visitor behind this site, and list this site's origin in
`STOREFRONT_PUBLIC_ORIGINS`.

```
npm run verify              # typecheck + unit tests + production build
```

`tests/fixtures/prime-containers.v1.json` is the document Aamer imported as version 1 — the
approved prototype's content — and what the unit tests pin the calculator and assistant against.
