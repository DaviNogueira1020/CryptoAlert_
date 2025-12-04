# 🧪 Guia de Testes - Sincronização Frontend CRUD

## 📱 Como Testar a Sincronização

### Pré-requisitos
- Backend rodando em `http://localhost:3000`
- Frontend rodando em `http://localhost:5173` (ou porta configurada)
- Token de autenticação válido
- Usuário logado

---

## ✅ Testes de Funcionalidade

### 1️⃣ **Criar Alerta (Básico)**

**Passo a passo:**
1. Clique em "Novo Alerta"
2. Preencha campos obrigatórios:
   - Criptomoeda: `BTC`
   - Preço Alvo: `50000`
   - Condição: `Acima`
3. Clique em "Criar Alerta"

**Resultado Esperado:**
- ✅ Modal fecha
- ✅ Toast verde: "Alerta criado para BTC"
- ✅ Novo alerta aparece no topo da lista

**Response do Backend:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-aqui",
    "userId": 1,
    "crypto": "BTC",
    "targetPrice": 50000,
    "direction": "above",
    "tipo": "precoAlvo",
    "priority": "normal",
    "notificationType": "system",
    "repetition": "once",
    "isActive": true,
    "createdAt": "2025-12-04T...",
    "updatedAt": "2025-12-04T..."
  }
}
```

---

### 2️⃣ **Criar Alerta (Avançado)**

**Passo a passo:**
1. Clique em "Novo Alerta"
2. Preencha seção básica:
   - Criptomoeda: `ETH`
   - Tipo: `precoAlvo`
   - Preço: `3000`
   - Condição: `Abaixo`
3. Clique em "Configurações Avançadas" (▶)
4. Preencha campos avançados:
   - Título: "ETH Dip Alert"
   - Prioridade: `Alta 🟠`
   - Notificação: `Email 📧`
   - Repetição: `Diariamente 📅`
   - Descrição: "Alerta quando ETH cair abaixo de 3k"
   - Data: `2025-12-10`
   - Hora: `14:30`
5. Clique em "Criar Alerta"

**Resultado Esperado:**
- ✅ Todos os campos aparecem no card
- ✅ Tags mostram tipo e prioridade
- ✅ Card exibe título, descrição, etc.

---

### 3️⃣ **Listar Alertas**

**Passo a passo:**
1. Acesse página de Alertas
2. Aguarde carregamento (spinner)
3. Verifique lista de alertas

**Resultado Esperado:**
- ✅ Página carrega com paginação
- ✅ Mostra até 10 alertas por página
- ✅ Cada card mostra informações corretas
- ✅ Sem erros no console

**Request:**
```
GET http://localhost:3000/alerts/listar?page=1&limit=10
```

---

### 4️⃣ **Ativar/Desativar Alerta**

**Passo a passo:**
1. Clique no botão de status de qualquer alerta
2. Observe a mudança visual

**Resultado Esperado:**
- ✅ Botão muda de "Ativo" para "Inativo" (ou vice-versa)
- ✅ Toast: "Alerta ativado" ou "Alerta desativado"
- ✅ Backend retorna alerta atualizado

**Request:**
```
PATCH http://localhost:3000/alerts/{id}/ativar-desativar
Body: { "ativo": true/false }
```

---

### 5️⃣ **Duplicar Alerta**

**Passo a passo:**
1. Localize um alerta existente
2. Clique no ícone de cópia (⊙)
3. Aguarde a duplicação

**Resultado Esperado:**
- ✅ Toast: "Alerta duplicado com sucesso"
- ✅ Novo alerta aparece no topo
- ✅ Novo alerta tem sufixo "(Cópia)" no título
- ✅ Todos os campos são iguais ao original

**Request:**
```
POST http://localhost:3000/alerts/{id}/duplicar
```

---

### 6️⃣ **Deletar Alerta**

**Passo a passo:**
1. Localize um alerta
2. Clique no ícone de lixeira (✕)
3. Confirme a ação

**Resultado Esperado:**
- ✅ Toast: "Alerta removido"
- ✅ Alerta desaparece da lista
- ✅ Contador de alertas diminui

**Request:**
```
DELETE http://localhost:3000/alerts/{id}/remover
```

---

### 7️⃣ **Exportar JSON**

**Passo a passo:**
1. Clique no botão "JSON"
2. Arquivo `alertas.json` é baixado

**Resultado Esperado:**
- ✅ Download é iniciado
- ✅ Arquivo contém array de alertas
- ✅ Toast: "Alertas exportados em JSON"

**Conteúdo do arquivo:**
```json
{
  "alerts": [
    {
      "id": "...",
      "crypto": "BTC",
      "targetPrice": 50000,
      ...
    }
  ],
  "total": 5
}
```

---

### 8️⃣ **Exportar CSV**

**Passo a passo:**
1. Clique no botão "CSV"
2. Arquivo `alertas.csv` é baixado

**Resultado Esperado:**
- ✅ Download é iniciado
- ✅ Arquivo está em formato CSV com headers
- ✅ Toast: "Alertas exportados em CSV"

**Conteúdo do arquivo:**
```csv
id,crypto,tipo,targetPrice,direction,priority,notificationType,isActive,createdAt
uuid-1,BTC,precoAlvo,50000,above,normal,system,true,2025-12-04T...
uuid-2,ETH,precoAlvo,3000,below,alta,email,true,2025-12-04T...
```

---

## 🔍 Validações

### ❌ Erro: Campo Obrigatório Vazio

**Passo a passo:**
1. Clique em "Novo Alerta"
2. NÃO preencha "Criptomoeda"
3. Clique em "Criar Alerta"

**Resultado Esperado:**
- ✅ Toast vermelho: "Selecione uma criptomoeda"
- ✅ Modal permanece aberto
- ✅ Nenhuma requisição é feita

---

### ❌ Erro: Preço Alvo Vazio (tipo precoAlvo)

**Passo a passo:**
1. Clique em "Novo Alerta"
2. Preencha apenas "Criptomoeda": `BTC`
3. Clique em "Criar Alerta"

**Resultado Esperado:**
- ✅ Toast vermelho: "Defina um preço alvo"
- ✅ Modal permanece aberto

---

### ❌ Erro: API Indisponível

**Passo a passo:**
1. Desligue o backend
2. Tente criar um alerta

**Resultado Esperado:**
- ✅ Toast vermelho com mensagem de erro
- ✅ Modal não fecha
- ✅ Console mostra erro da requisição

---

## 🎨 Verificações Visuais

### Cards de Alertas

- [ ] Criptomoeda em negrito no topo
- [ ] Título (se fornecido) em cinza abaixo
- [ ] Tags de tipo e prioridade com cores corretas
- [ ] Ícone de cópia e lixeira visíveis no canto superior
- [ ] Preço alvo formatado em USD
- [ ] Seta verde para "Acima" e vermelha para "Abaixo"
- [ ] Botão de status com cor verde/cinza
- [ ] Data de criação no rodapé

### Modal de Criação

- [ ] Seção básica sempre visível
- [ ] Botão "Configurações Avançadas" funciona
- [ ] Seção avançada se expande com animação
- [ ] Todos os inputs aceitam entrada de dados
- [ ] Botões "Acima/Abaixo" mostram seleção visual
- [ ] Selects funcionam corretamente
- [ ] Textarea permite múltiplas linhas
- [ ] Date e Time inputs funcionam

---

## 📊 Performance

### Testes de Carga

**1. Listar 100+ alertas:**
```javascript
// No console do browser
console.time('loadAlerts');
await alertsService.getAll(1, 100);
console.timeEnd('loadAlerts');
// Resultado esperado: < 1000ms
```

**2. Criar alerta:**
- Tempo esperado: 200-500ms

**3. Duplicar alerta:**
- Tempo esperado: 300-600ms

---

## 🐛 Debug

### Verificar Requisições

**Abrir DevTools (F12) → Network:**

1. **Criar alerta:**
   - Tipo: POST
   - URL: `/alerts/criar`
   - Status: 201
   - Body: `{ crypto: "BTC", precoAlvo: 50000, ... }`

2. **Listar alertas:**
   - Tipo: GET
   - URL: `/alerts/listar?page=1&limit=10`
   - Status: 200
   - Response: `{ alerts: [...], total: X }`

3. **Deletar alerta:**
   - Tipo: DELETE
   - URL: `/alerts/remover/{id}`
   - Status: 200

### Verificar Estado React

```javascript
// Console do Browser
// (Usando React DevTools)
import { alertsService } from './services/alertsService';

// Testar serviço
alertsService.getAll().then(console.log);
```

---

## ✅ Checklist Final

- [ ] Criar alerta básico funciona
- [ ] Criar alerta avançado funciona
- [ ] Listar alertas funciona
- [ ] Ativar/desativar funciona
- [ ] Duplicar funciona
- [ ] Deletar funciona
- [ ] Exportar JSON funciona
- [ ] Exportar CSV funciona
- [ ] Validações funcionam
- [ ] Toast notifications funcionam
- [ ] Sem erros no console
- [ ] Sem erros TypeScript
- [ ] Performance aceitável
- [ ] UI responsiva
- [ ] Cores e ícones corretos

---

**Data de Testes**: Dezembro 4, 2025  
**Status**: ✅ PRONTO PARA TESTE
