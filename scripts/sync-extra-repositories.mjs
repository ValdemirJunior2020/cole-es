import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '../src/main.jsx');

const extras = [
  `  { repo:'Open-Dev-Society/OpenStock', category:'Trading', api:'required', free:'mixed', accent:'#f59e0b', en:{name:'OpenStock', purpose:'A self-hostable open-source stock market dashboard with TradingView charts and heatmaps, watchlists, company insights, market news, personalized alerts, and optional sentiment data across Reddit, X, news, and Polymarket.', why:'OpenStock is AGPL-3.0 licensed and can be self-hosted. A Finnhub API key and MongoDB are required; Finnhub has a free tier, but real-time market data or optional connected services can have limits or costs. Gmail, Gemini, and extra sentiment integrations are optional.', idea:'Run your own market research dashboard with watchlists, advanced charts, heatmaps, company data, news, alerts, and daily summaries instead of relying only on a paid closed platform.'}, pt:{name:'OpenStock', purpose:'Um painel open source e auto-hospedável para mercado de ações com gráficos e heatmaps do TradingView, watchlists, dados de empresas, notícias, alertas personalizados e sentimento opcional cruzando Reddit, X, notícias e Polymarket.', why:'O OpenStock usa licença AGPL-3.0 e pode ser hospedado por você. Ele precisa de uma chave da Finnhub e MongoDB; a Finnhub tem plano grátis, mas dados em tempo real ou serviços opcionais podem ter limites ou custos. Gmail, Gemini e integrações extras de sentimento são opcionais.', idea:'Rodar seu próprio painel de pesquisa de mercado com watchlist, gráficos avançados, heatmap, dados de empresas, notícias, alertas e resumos diários sem depender somente de uma plataforma fechada paga.'}},\n`,
  `  { repo:'agentsmill/age-of-agents', category:'AI Agents', api:'no', free:'free', accent:'#8b5cf6', en:{name:'Age of Agents', purpose:'A local pixel-art command center that turns Claude Code, Codex, OpenCode, Koda, and supported local-LLM sessions into a live Age-of-Empires-style realm. Sessions become settlers, tools become workshops, subagents become workers, and token usage becomes harvest.', why:'Age of Agents is MIT licensed, runs locally, and does not require its own paid API. It reads supported agent transcripts locally and can also visualize Ollama and other OpenAI-compatible local backends through its local logging proxy. Any cost comes from the coding agent or model you already choose to run.', idea:'Use it as a second-screen visual monitor for your local AI agents so you can see active sessions, tools, subagents, projects, token activity, and agent state as a live game world.'}, pt:{name:'Age of Agents', purpose:'Um painel local em pixel art que transforma sessões do Claude Code, Codex, OpenCode, Koda e modelos locais compatíveis em um reino ao estilo Age of Empires. As sessões viram habitantes, as ferramentas viram oficinas, os subagentes viram trabalhadores e o uso de tokens vira colheita.', why:'O Age of Agents usa licença MIT, roda localmente e não exige uma API paga própria. Ele lê localmente os históricos dos agentes compatíveis e também pode visualizar Ollama e outros backends locais compatíveis com OpenAI usando um proxy local. Qualquer custo vem apenas do agente ou modelo que você já decidir usar.', idea:'Usar como uma segunda tela para acompanhar seus agentes de IA locais e ver sessões ativas, ferramentas, subagentes, projetos, uso de tokens e o estado de cada agente como um mundo de jogo em tempo real.'}},\n`
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
