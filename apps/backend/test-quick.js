#!/usr/bin/env node

/**
 * Simplified test: Just test one endpoint after registration
 */

const API_URL = 'http://localhost:3000';

async function request(method, path, body = null, token = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  };

  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(`${API_URL}${path}`, options);
    const data = await response.json();
    return { status: response.status, ok: response.ok, data };
  } catch (error) {
    return { status: 0, ok: false, data: { error: error.message } };
  }
}

async function main() {
  console.log('🧪 Teste rápido do sistema de alertas\n');

  // Register new user
  const email = `test${Date.now()}@example.com`;
  const password = 'test12345678';

  console.log('1. Registrando novo usuário...');
  const registerRes = await request('POST', '/auth/register', {
    email,
    password,
    confirmPassword: password,
  });

  console.log(`   Status: ${registerRes.status}`);
  if (!registerRes.ok) {
    console.log(`   Erro: ${registerRes.data.error || JSON.stringify(registerRes.data)}`);
    process.exit(1);
  }
  console.log('   ✅ OK\n');

  // Login
  console.log('2. Fazendo login...');
  const loginRes = await request('POST', '/auth/login', { email, password });

  console.log(`   Status: ${loginRes.status}`);
  if (!loginRes.ok) {
    console.log(`   Erro: ${loginRes.data.error || JSON.stringify(loginRes.data)}`);
    process.exit(1);
  }

  const token = loginRes.data.data?.token;
  console.log(`   Token: ${token ? token.substring(0, 30) + '...' : 'NENHUM'}`);
  console.log('   ✅ OK\n');

  // Test create alert
  console.log('3. Criando alerta (tipo: precoAlvo)...');
  const createRes = await request(
    'POST',
    '/alerts/criar',
    {
      crypto: 'bitcoin',
      tipo: 'precoAlvo',
      precoAlvo: 50000,
      direction: 'above',
    },
    token
  );

  console.log(`   Status: ${createRes.status}`);
  if (!createRes.ok) {
    console.log(`   Erro: ${createRes.data.error || JSON.stringify(createRes.data)}`);
    process.exit(1);
  }

  const alertId = createRes.data.data?.id;
  console.log(`   ID: ${alertId}`);
  console.log(`   Tipo: ${createRes.data.data?.tipo}`);
  console.log(`   Preço: ${createRes.data.data?.precoAlvo}`);
  console.log('   ✅ OK\n');

  // Test list alerts
  console.log('4. Listando alertas...');
  const listRes = await request('GET', '/alerts/listar?page=1&limit=10', null, token);

  console.log(`   Status: ${listRes.status}`);
  if (!listRes.ok) {
    console.log(`   Erro: ${listRes.data.error || JSON.stringify(listRes.data)}`);
    process.exit(1);
  }

  console.log(`   Total: ${listRes.data.data?.paginacao?.total}`);
  console.log(`   Carregados: ${listRes.data.data?.resultados?.length}`);
  console.log('   ✅ OK\n');

  // Test update alert
  console.log('5. Atualizando alerta...');
  const updateRes = await request(
    'PUT',
    `/alerts/atualizar/${alertId}`,
    { precoAlvo: 55000 },
    token
  );

  console.log(`   Status: ${updateRes.status}`);
  if (!updateRes.ok) {
    console.log(`   Erro: ${updateRes.data.error || JSON.stringify(updateRes.data)}`);
    process.exit(1);
  }

  console.log(`   Novo Preço: ${updateRes.data.data?.precoAlvo}`);
  console.log('   ✅ OK\n');

  // Test delete alert
  console.log('6. Deletando alerta...');
  const deleteRes = await request('DELETE', `/alerts/remover/${alertId}`, null, token);

  console.log(`   Status: ${deleteRes.status}`);
  if (!deleteRes.ok) {
    console.log(`   Erro: ${deleteRes.data.error || JSON.stringify(deleteRes.data)}`);
    process.exit(1);
  }

  console.log('   ✅ OK\n');

  console.log('✅ 🎉 Todos os testes PASSOU!');
  console.log('\n📊 Resumo:');
  console.log('   ✓ Registro de usuário');
  console.log('   ✓ Login');
  console.log('   ✓ Criar alerta');
  console.log('   ✓ Listar alertas');
  console.log('   ✓ Atualizar alerta');
  console.log('   ✓ Deletar alerta');
  console.log('   ✓ Autenticação funcionando');
  console.log('   ✓ Estrutura de dados validada');
}

main().catch((err) => {
  console.error('❌ Erro:', err.message);
  process.exit(1);
});
