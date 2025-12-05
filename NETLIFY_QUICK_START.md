# 🚀 Netlify Deploy - Quick Start

## 3 Passos para Deploy

### 1️⃣ Conectar GitHub ao Netlify

1. Vá para https://app.netlify.com
2. Clique **"Connect to Git"** → **GitHub**
3. Selecione o repositório: **DaviNogueira1020/CryptoAlert_**
4. Configure:
   - **Build command**: `npm run build --workspace=apps/frontend`
   - **Publish directory**: `apps/frontend/build`
5. Clique **"Deploy site"**

✅ **Pronto!** O frontend será deployado automaticamente.

---

### 2️⃣ Configurar Variável de Ambiente

Após o primeiro deploy:

1. Vá para **Site settings** → **Build & deploy** → **Environment**
2. Adicionar variável:
   ```
   VITE_API_URL = https://cripto-alert-daohuah9i-davis-projects-74145666.vercel.app
   ```
3. Clique **"Save"**
4. Redeploy automático vai acontecer

---

### 3️⃣ Atualizar Backend CORS

No Vercel dashboard:

1. Vá para **Settings** → **Environment Variables**
2. Update `CORS_ORIGIN`:
   ```
   https://YOUR_NETLIFY_SITE.netlify.app
   ```
3. Redeployment automático

---

## ✅ Verificação

```bash
# Testar frontend
https://YOUR_SITE.netlify.app

# Testar API
curl https://YOUR_SITE.netlify.app/
# Deve carregar a página React

# Verificar logs
https://app.netlify.com/sites/YOUR_SITE/deploys
```

---

## 📚 Documentação Completa

Veja `NETLIFY_DEPLOYMENT.md` para guia detalhado.
