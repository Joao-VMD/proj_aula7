# 💰 API de Controle Financeiro Pessoal

API feita com **NestJS** e **MongoDB** para registrar receitas e despesas e mostrar quanto do dinheiro foi gasto por impulso.

Projeto extensionista da disciplina Web Mobile, ligado ao **ODS 1** (erradicação da pobreza) e ao **ODS 12** (consumo responsável). Pode apoiar oficinas comunitárias de educação financeira.

## O que a API faz

- Cadastra receitas e despesas
- Lista o histórico de transações
- Calcula métricas: saldo total, total de despesas e total de gastos por impulso

## Rotas

### POST /transacoes

Cadastra uma transação.

```json
{
  "descricao": "Compra de Roupas",
  "valor": 300,
  "tipo": "despesa",
  "categoria": "Lazer",
  "consumoConsciente": false
}
```

- `tipo` aceita apenas `"receita"` ou `"despesa"`.
- `consumoConsciente`: `true` para gasto essencial, `false` para gasto por impulso.

### GET /transacoes

Retorna o histórico e as métricas.

```json
{
  "historico": [ ... ],
  "metricas": {
    "saldoTotal": 1700,
    "totalDespesas": 300,
    "totalGastoImpulso": 300
  }
}
```

## Como rodar

1. Instale o [Node.js](https://nodejs.org/).
2. Baixe o projeto e instale as dependências:

```bash
git clone https://github.com/Joao-VMD/proj_aula7.git
cd proj_aula7
npm install
```

3. Crie um arquivo `.env` na raiz com a conexão do seu MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/controle_financeiro
```

4. Inicie a API:

```bash
npm run start
```

Acesse http://localhost:3000.

## Testes

```bash
npm run test
npm run test:e2e
```
