import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'jsr:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// ========== ROTAS DE AUTENTICAÇÃO ==========

app.post('/make-server-e49cbdd6/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Confirmação automática pois o servidor de email não está configurado
    });

    if (error) {
      console.log(`Error creating user during signup: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.log(`Unexpected error during signup: ${error}`);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// ========== ROTAS DE CRIPTOMÉDAS ==========

app.get('/make-server-e49cbdd6/coins', async (c) => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false'
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Error fetching coins from CoinGecko: ${error}`);
    return c.json({ error: 'Failed to fetch cryptocurrency data' }, 500);
  }
});

app.get('/make-server-e49cbdd6/coins/:id', async (c) => {
  try {
    const coinId = c.req.param('id');
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&community_data=false&developer_data=false`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Error fetching coin details from CoinGecko: ${error}`);
    return c.json({ error: 'Failed to fetch cryptocurrency details' }, 500);
  }
});

// ========== ROTAS DE ALERTAS ==========

app.get('/make-server-e49cbdd6/alerts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log(`Authorization error while fetching alerts: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const prefix = `alert:${user.id}:`;
    const alerts = await kv.getByPrefix(prefix);

    return c.json(alerts || []);
  } catch (error) {
    console.log(`Error fetching alerts: ${error}`);
    return c.json({ error: 'Failed to fetch alerts' }, 500);
  }
});

app.post('/make-server-e49cbdd6/alerts', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log(`Authorization error while creating alert: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { coinId, coinName, targetPrice, condition } = await c.req.json();
    const alertId = crypto.randomUUID();
    const alert = {
      id: alertId,
      userId: user.id,
      coinId,
      coinName,
      targetPrice: parseFloat(targetPrice),
      condition,
      active: true,
      createdAt: new Date().toISOString(),
    };

    await kv.set(`alert:${user.id}:${alertId}`, alert);

    return c.json(alert);
  } catch (error) {
    console.log(`Error creating alert: ${error}`);
    return c.json({ error: 'Failed to create alert' }, 500);
  }
});

app.delete('/make-server-e49cbdd6/alerts/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log(`Authorization error while deleting alert: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const alertId = c.req.param('id');
    await kv.del(`alert:${user.id}:${alertId}`);

    return c.json({ success: true });
  } catch (error) {
    console.log(`Error deleting alert: ${error}`);
    return c.json({ error: 'Failed to delete alert' }, 500);
  }
});

app.patch('/make-server-e49cbdd6/alerts/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      console.log(`Authorization error while updating alert: ${authError?.message}`);
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const alertId = c.req.param('id');
    const updates = await c.req.json();
    
    const key = `alert:${user.id}:${alertId}`;
    const existingAlert = await kv.get(key);
    
    if (!existingAlert) {
      return c.json({ error: 'Alert not found' }, 404);
    }

    const updatedAlert = { ...existingAlert, ...updates };
    await kv.set(key, updatedAlert);

    return c.json(updatedAlert);
  } catch (error) {
    console.log(`Error updating alert: ${error}`);
    return c.json({ error: 'Failed to update alert' }, 500);
  }
});

// ========== ROTAS DE NOTÍCIAS ==========

app.get('/make-server-e49cbdd6/news', async (c) => {
  try {
    // Verificar cache primeiro
    const cached = await kv.get('news:cache');
    const cacheAge = cached?.lastUpdate ? Date.now() - new Date(cached.lastUpdate).getTime() : Infinity;
    
    // Se o cache tem menos de 30 minutos, retornar
    if (cached && cacheAge < 30 * 60 * 1000) {
      return c.json(cached.articles);
    }

    // Buscar notícias frescas do feed RSS do CoinDesk
    const response = await fetch('https://www.coindesk.com/arc/outboundfeeds/rss/');
    const rssText = await response.text();
    
    // Analisar RSS (análise simples para demonstração)
    const articles = parseRSS(rssText);
    
    // Armazenar os resultados em cache
    await kv.set('news:cache', {
      articles: articles.slice(0, 20),
      lastUpdate: new Date().toISOString(),
    });

    return c.json(articles.slice(0, 20));
  } catch (error) {
    console.log(`Error fetching news: ${error}`);
    // Retornar dados em cache se disponível, mesmo se antigos
    const cached = await kv.get('news:cache');
    if (cached?.articles) {
      return c.json(cached.articles);
    }
    return c.json({ error: 'Failed to fetch news' }, 500);
  }
});

// ========== ROTAS DE TENDÊNCIAS ==========

app.get('/make-server-e49cbdd6/trends', async (c) => {
  try {
    const response = await fetch(
      'https://api.coingecko.com/api/v3/search/trending'
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.statusText}`);
    }

    const data = await response.json();
    return c.json(data);
  } catch (error) {
    console.log(`Error fetching trends from CoinGecko: ${error}`);
    return c.json({ error: 'Failed to fetch trends' }, 500);
  }
});

// Função auxiliar para analisar feed RSS
function parseRSS(rssText: string): any[] {
  const articles: any[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const titleRegex = /<title><!\[CDATA\[(.*?)\]\]><\/title>/;
  const linkRegex = /<link>(.*?)<\/link>/;
  const descRegex = /<description><!\[CDATA\[(.*?)\]\]><\/description>/;
  const pubDateRegex = /<pubDate>(.*?)<\/pubDate>/;

  let match;
  while ((match = itemRegex.exec(rssText)) !== null) {
    const itemContent = match[1];
    const title = titleRegex.exec(itemContent)?.[1] || '';
    const link = linkRegex.exec(itemContent)?.[1] || '';
    const description = descRegex.exec(itemContent)?.[1] || '';
    const pubDate = pubDateRegex.exec(itemContent)?.[1] || '';

    if (title && link) {
      articles.push({
        id: link,
        title,
        link,
        description: description.replace(/<[^>]*>/g, '').substring(0, 200),
        pubDate,
      });
    }
  }

  return articles;
}

Deno.serve(app.fetch);
