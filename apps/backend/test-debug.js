#!/usr/bin/env node

/**
 * Debug test: Show exactly what's being sent
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
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    return { status: response.status, ok: response.ok, data, text };
  } catch (error) {
    return { status: 0, ok: false, data: { error: error.message }, text: error.message };
  }
}

async function main() {
  console.log('🔍 Debug Test\n');

  // Register
  const email = `test${Date.now()}@example.com`;
  const password = 'test12345678';

  const registerRes = await request('POST', '/auth/register', {
    email,
    password,
    confirmPassword: password,
  });

  console.log('Register Response:', { status: registerRes.status, ok: registerRes.ok });

  // Login
  const loginRes = await request('POST', '/auth/login', { email, password });
  const token = loginRes.data.data?.token;

  console.log('Login Response:', { status: loginRes.status, ok: loginRes.ok, hasToken: !!token });
  console.log('Token:', token?.substring(0, 30) + '...\n');

  // Create alert
  const payload = {
    crypto: 'bitcoin',
    tipo: 'precoAlvo',
    precoAlvo: 50000,
    direction: 'above',
  };

  console.log('Payload being sent:');
  console.log(JSON.stringify(payload, null, 2));
  console.log();

  const createRes = await request('POST', '/alerts/criar', payload, token);

  console.log('Create Alert Response:');
  console.log('Status:', createRes.status);
  console.log('OK:', createRes.ok);
  console.log('Raw data:', createRes.data);
  console.log('Raw text:', createRes.text.substring(0, 200));
}

main().catch(console.error);
