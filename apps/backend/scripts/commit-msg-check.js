#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const file = process.argv[2];
if (!file) {
  console.error('Arquivo de mensagem de commit não fornecido.');
  process.exit(1);
}

const msg = fs.readFileSync(path.resolve(file), 'utf8').trim();
if (!msg) {
  console.error('Mensagem de commit vazia. Escreva uma mensagem em Português.');
  process.exit(1);
}

// Lista simples de substrings que indicam que a mensagem está em Português (heurística)
const ptIndicators = [
  'adicion', 'corrig', 'remove', 'atualiz', 'melhor', 'ajust', 'cria', 'inicia', 'inicial', 'implem', 'refator', 'document', 'docs', 'teste', 'corrigido', 'adicionado', 'atualizado'
];

const lower = msg.toLowerCase();
const hasPt = ptIndicators.some((s) => lower.includes(s));

if (!hasPt) {
  console.error('\n[Aviso] Mensagem de commit deveria estar em Português.\nExemplo: "adiciona endpoint de notificações" ou "corrige bug na validação"\n');
  console.error('Mensagem atual:');
  console.error('---');
  console.error(msg);
  console.error('---');
  process.exit(1);
}

process.exit(0);
