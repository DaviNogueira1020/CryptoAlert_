/**
 * Test script for new Alerts CRUD endpoints
 * Usage: node test-alerts-crud.js
 */

const API_URL = 'http://localhost:3000';

// Test user credentials (you need to have a user registered)
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'password123';

let authToken = null;
let userId = null;
let testAlertId = null;

async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
    },
  };

  if (body) options.body = JSON.stringify(body);

  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json();

  return { status: response.status, ok: response.ok, data };
}

async function runTests() {
  console.log('🧪 Iniciando testes do sistema de alertas...\n');

  try {
    // 1. Registrar usuário
    console.log('1️⃣ Registrando usuário...');
    const registerRes = await request('POST', '/auth/register', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      confirmPassword: TEST_PASSWORD,
    });
    
    if (!registerRes.ok && registerRes.status !== 409) {
      console.log('❌ Erro ao registrar:', registerRes.data);
      return;
    }
    console.log('✅ Usuário registrado/existente\n');

    // 2. Login
    console.log('2️⃣ Fazendo login...');
    const loginRes = await request('POST', '/auth/login', {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (!loginRes.ok) {
      console.log('❌ Erro ao fazer login:', loginRes.data);
      return;
    }

    authToken = loginRes.data.data.token;
    userId = loginRes.data.data.user.id;
    console.log('✅ Login realizado com sucesso');
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
    console.log(`   User ID: ${userId}\n`);

    // 3. Criar alerta - Preço Alvo
    console.log('3️⃣ Criando alerta de Preço Alvo...');
    const createPrecoRes = await request('POST', '/alerts/criar', {
      crypto: 'bitcoin',
      tipo: 'precoAlvo',
      precoAlvo: 50000,
      direction: 'above',
    });

    if (!createPrecoRes.ok) {
      console.log('❌ Erro ao criar alerta:', createPrecoRes.data);
      return;
    }

    testAlertId = createPrecoRes.data.data.id;
    console.log('✅ Alerta de Preço Alvo criado');
    console.log(`   ID: ${testAlertId}`);
    console.log(`   Preço Alvo: ${createPrecoRes.data.data.precoAlvo}\n`);

    // 4. Criar alerta - Alta Percentual
    console.log('4️⃣ Criando alerta de Alta Percentual...');
    const createAltaRes = await request('POST', '/alerts/criar', {
      crypto: 'ethereum',
      tipo: 'altaPercentual',
      percentualAlta: 5.5,
      direction: 'above',
    });

    if (!createAltaRes.ok) {
      console.log('❌ Erro ao criar alerta:', createAltaRes.data);
      return;
    }

    console.log('✅ Alerta de Alta Percentual criado');
    console.log(`   ID: ${createAltaRes.data.data.id}`);
    console.log(`   Percentual: ${createAltaRes.data.data.percentualAlta}%\n`);

    // 5. Criar alerta - Queda Percentual
    console.log('5️⃣ Criando alerta de Queda Percentual...');
    const createQuedaRes = await request('POST', '/alerts/criar', {
      crypto: 'cardano',
      tipo: 'quedaPercentual',
      percentualQueda: 3.2,
      direction: 'below',
    });

    if (!createQuedaRes.ok) {
      console.log('❌ Erro ao criar alerta:', createQuedaRes.data);
      return;
    }

    console.log('✅ Alerta de Queda Percentual criado');
    console.log(`   ID: ${createQuedaRes.data.data.id}`);
    console.log(`   Percentual: ${createQuedaRes.data.data.percentualQueda}%\n`);

    // 6. Criar alerta - Volume
    console.log('6️⃣ Criando alerta de Volume...');
    const createVolRes = await request('POST', '/alerts/criar', {
      crypto: 'ripple',
      tipo: 'volume',
      volumeMinimo: 1000000,
    });

    if (!createVolRes.ok) {
      console.log('❌ Erro ao criar alerta:', createVolRes.data);
      return;
    }

    console.log('✅ Alerta de Volume criado');
    console.log(`   ID: ${createVolRes.data.data.id}`);
    console.log(`   Volume Mínimo: ${createVolRes.data.data.volumeMinimo}\n`);

    // 7. Listar alertas
    console.log('7️⃣ Listando alertas...');
    const listRes = await request('GET', '/alerts/listar?page=1&limit=10');

    if (!listRes.ok) {
      console.log('❌ Erro ao listar alertas:', listRes.data);
      return;
    }

    console.log('✅ Alertas listados');
    console.log(`   Total: ${listRes.data.data.paginacao.total}`);
    console.log(`   Resultados: ${listRes.data.data.resultados.length}`);
    listRes.data.data.resultados.forEach((alert, i) => {
      console.log(`   ${i + 1}. ${alert.crypto.toUpperCase()} - Tipo: ${alert.tipo}`);
    });
    console.log();

    // 8. Obter alerta específico
    console.log('8️⃣ Obtendo alerta específico...');
    const getRes = await request('GET', `/alerts/${testAlertId}`);

    if (!getRes.ok) {
      console.log('❌ Erro ao obter alerta:', getRes.data);
      return;
    }

    console.log('✅ Alerta obtido');
    console.log(`   ID: ${getRes.data.data.id}`);
    console.log(`   Crypto: ${getRes.data.data.crypto}`);
    console.log(`   Tipo: ${getRes.data.data.tipo}\n`);

    // 9. Atualizar alerta
    console.log('9️⃣ Atualizando alerta...');
    const updateRes = await request('PUT', `/alerts/atualizar/${testAlertId}`, {
      precoAlvo: 55000,
      direction: 'below',
    });

    if (!updateRes.ok) {
      console.log('❌ Erro ao atualizar alerta:', updateRes.data);
      return;
    }

    console.log('✅ Alerta atualizado');
    console.log(`   Novo Preço Alvo: ${updateRes.data.data.precoAlvo}`);
    console.log(`   Nova Direção: ${updateRes.data.data.direction}\n`);

    // 10. Alternar ativo/inativo
    console.log('🔟 Alternando status do alerta...');
    const toggleRes = await request('PATCH', `/alerts/${testAlertId}/ativar-desativar`, {
      ativo: false,
    });

    if (!toggleRes.ok) {
      console.log('❌ Erro ao alternar status:', toggleRes.data);
      return;
    }

    console.log('✅ Status alterado');
    console.log(`   Ativo: ${toggleRes.data.data.isActive}\n`);

    // 11. Deletar alerta
    console.log('1️⃣1️⃣ Deletando alerta...');
    const deleteRes = await request('DELETE', `/alerts/remover/${testAlertId}`);

    if (!deleteRes.ok) {
      console.log('❌ Erro ao deletar alerta:', deleteRes.data);
      return;
    }

    console.log('✅ Alerta deletado\n');

    // 12. Testar aliases legados
    console.log('1️⃣2️⃣ Testando alias legado (POST /alerts/create)...');
    const legacyRes = await request('POST', '/alerts/create', {
      crypto: 'solana',
      tipo: 'precoAlvo',
      precoAlvo: 150,
      direction: 'above',
    });

    if (!legacyRes.ok) {
      console.log('❌ Erro no alias legado:', legacyRes.data);
      return;
    }

    console.log('✅ Alias legado funcionando\n');

    console.log('✅ 🎉 Todos os testes passaram com sucesso!');
  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
  }
}

runTests();
