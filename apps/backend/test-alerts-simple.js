/**
 * Simplified test script for new Alerts CRUD endpoints
 * Tests with a specific test user
 */

const API_URL = 'http://localhost:3000';

let authToken = null;
let userId = null;

async function request(method, path, body = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
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

async function testWithUser(email, password) {
  console.log(`\n🔐 Testando com usuário: ${email}`);
  
  // Login
  console.log('Fazendo login...');
  const loginRes = await request('POST', '/auth/login', {
    email,
    password,
  });

  if (!loginRes.ok) {
    console.log('❌ Login falhou:', loginRes.data);
    return false;
  }

  authToken = loginRes.data.data?.token;
  userId = loginRes.data.data?.user?.id;
  
  if (!authToken) {
    console.log('❌ Sem token após login');
    return false;
  }

  console.log('✅ Login bem-sucedido');
  console.log(`   Token: ${authToken.substring(0, 30)}...`);
  console.log(`   User ID: ${userId}\n`);

  // Test CRUD operations
  const tests = [
    {
      name: 'Criar alerta - Preço Alvo',
      method: 'POST',
      path: '/alerts/criar',
      body: {
        crypto: 'bitcoin',
        tipo: 'precoAlvo',
        precoAlvo: 50000,
        direction: 'above',
      },
      storageKey: 'alertId1',
    },
    {
      name: 'Criar alerta - Alta Percentual',
      method: 'POST',
      path: '/alerts/criar',
      body: {
        crypto: 'ethereum',
        tipo: 'altaPercentual',
        percentualAlta: 5.5,
        direction: 'above',
      },
      storageKey: 'alertId2',
    },
    {
      name: 'Criar alerta - Queda Percentual',
      method: 'POST',
      path: '/alerts/criar',
      body: {
        crypto: 'cardano',
        tipo: 'quedaPercentual',
        percentualQueda: 3.2,
        direction: 'below',
      },
      storageKey: 'alertId3',
    },
    {
      name: 'Criar alerta - Volume',
      method: 'POST',
      path: '/alerts/criar',
      body: {
        crypto: 'ripple',
        tipo: 'volume',
        volumeMinimo: 1000000,
      },
      storageKey: 'alertId4',
    },
    {
      name: 'Listar alertas',
      method: 'GET',
      path: '/alerts/listar?page=1&limit=10',
    },
  ];

  const storage = {};
  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    console.log(`📝 ${test.name}...`);
    const res = await request(test.method, test.path, test.body);

    if (res.ok) {
      console.log('✅ Sucesso');
      if (test.storageKey && res.data.data?.id) {
        storage[test.storageKey] = res.data.data.id;
        console.log(`   ID: ${res.data.data.id}`);
        if (test.body) {
          const tipoCampo = test.body.precoAlvo
            ? `Preço: ${res.data.data.precoAlvo}`
            : test.body.percentualAlta
            ? `Percentual Alta: ${res.data.data.percentualAlta}%`
            : test.body.percentualQueda
            ? `Percentual Queda: ${res.data.data.percentualQueda}%`
            : test.body.volumeMinimo
            ? `Volume: ${res.data.data.volumeMinimo}`
            : '';
          if (tipoCampo) console.log(`   ${tipoCampo}`);
        }
      } else if (res.data.data?.paginacao) {
        console.log(`   Total de alertas: ${res.data.data.paginacao.total}`);
        console.log(`   Alertas carregados: ${res.data.data.resultados.length}`);
      }
      passedTests++;
    } else {
      console.log('❌ Falha');
      console.log(`   Status: ${res.status}`);
      console.log(`   Erro: ${JSON.stringify(res.data)}`);
    }
    console.log();
  }

  // Test update and delete if we have an ID
  if (storage.alertId1) {
    console.log(`📝 Atualizar alerta...`);
    const updateRes = await request('PUT', `/alerts/atualizar/${storage.alertId1}`, {
      precoAlvo: 55000,
      direction: 'below',
    });

    if (updateRes.ok) {
      console.log('✅ Sucesso');
      console.log(`   Novo Preço: ${updateRes.data.data.precoAlvo}`);
      console.log(`   Nova Direção: ${updateRes.data.data.direction}`);
      passedTests++;
    } else {
      console.log('❌ Falha');
      console.log(`   Erro: ${JSON.stringify(updateRes.data)}`);
    }
    console.log();

    console.log(`📝 Alternar ativo/inativo...`);
    const toggleRes = await request('PATCH', `/alerts/${storage.alertId1}/ativar-desativar`, {
      ativo: false,
    });

    if (toggleRes.ok) {
      console.log('✅ Sucesso');
      console.log(`   Ativo: ${toggleRes.data.data.isActive}`);
      passedTests++;
    } else {
      console.log('❌ Falha');
      console.log(`   Erro: ${JSON.stringify(toggleRes.data)}`);
    }
    console.log();

    console.log(`📝 Deletar alerta...`);
    const deleteRes = await request('DELETE', `/alerts/remover/${storage.alertId1}`);

    if (deleteRes.ok) {
      console.log('✅ Sucesso');
      passedTests++;
    } else {
      console.log('❌ Falha');
      console.log(`   Erro: ${JSON.stringify(deleteRes.data)}`);
    }
    console.log();
  }

  totalTests += 3; // Update, Toggle, Delete
  console.log(`\n📊 Resultados: ${passedTests}/${totalTests} testes passaram`);
  return passedTests === totalTests;
}

async function runTests() {
  console.log('🧪 Iniciando testes do sistema de alertas CriptoAlert\n');

  // Try common test credentials
  const credentials = [
    { email: 'admin@test.com', password: 'password123' },
    { email: 'test@example.com', password: 'password123' },
    { email: 'user@test.com', password: 'password123' },
  ];

  let testsPassed = false;
  for (const cred of credentials) {
    testsPassed = await testWithUser(cred.email, cred.password);
    if (testsPassed) break;
  }

  if (!testsPassed) {
    console.log('\n❌ Não foi possível conectar com nenhum usuário de teste.');
    console.log('Por favor, crie um usuário de teste manualmente e execute novamente.');
    console.log('\n📝 Para registrar um novo usuário, use:');
    console.log(`   curl -X POST http://localhost:3000/auth/register \\`);
    console.log(`     -H "Content-Type: application/json" \\`);
    console.log(`     -d '{"email":"test@example.com","password":"password123","confirmPassword":"password123"}'`);
  }
}

runTests().catch(console.error);
