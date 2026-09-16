import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '../src/main.jsx');

const extras = [
  `  { repo:'Open-Dev-Society/OpenStock', category:'Trading', api:'required', free:'mixed', accent:'#f59e0b', en:{name:'OpenStock', purpose:'A self-hostable open-source stock market dashboard with TradingView charts and heatmaps, watchlists, company insights, market news, personalized alerts, and optional sentiment data across Reddit, X, news, and Polymarket.', why:'OpenStock is AGPL-3.0 licensed and can be self-hosted. A Finnhub API key and MongoDB are required; Finnhub has a free tier, but real-time market data or optional connected services can have limits or costs. Gmail, Gemini, and extra sentiment integrations are optional.', idea:'Run your own market research dashboard with watchlists, advanced charts, heatmaps, company data, news, alerts, and daily summaries instead of relying only on a paid closed platform.'}, pt:{name:'OpenStock', purpose:'Um painel open source e auto-hospedável para mercado de ações com gráficos e heatmaps do TradingView, watchlists, dados de empresas, notícias, alertas personalizados e sentimento opcional cruzando Reddit, X, notícias e Polymarket.', why:'O OpenStock usa licença AGPL-3.0 e pode ser hospedado por você. Ele precisa de uma chave da Finnhub e MongoDB; a Finnhub tem plano grátis, mas dados em tempo real ou serviços opcionais podem ter limites ou custos. Gmail, Gemini e integrações extras de sentimento são opcionais.', idea:'Rodar seu próprio painel de pesquisa de mercado com watchlist, gráficos avançados, heatmap, dados de empresas, notícias, alertas e resumos diários sem depender somente de uma plataforma fechada paga.'}},\n`
];

let source = readFileSync(target, 'utf8');
const marker = 'const repositories = [\n';

if (!source.includes(marker)) {
  throw new Error('Could not find the repositories array in src/main.jsx');
}

let changed = false;
for (const entry of extras) {
  const repoMatch = entry.match(/repo:'([^']+)'/);
  if (!repoMatch) continue;
  const repo = repoMatch[1];
  if (source.includes(`repo:'${repo}'`)) continue;
  source = source.replace(marker, marker + entry);
  changed = true;
}

if (changed) {
  writeFileSync(target, source, 'utf8');
  console.log('Added extra repositories to src/main.jsx');
} else {
  console.log('Extra repositories are already present');
}
