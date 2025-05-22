# Billor Solutions Engineering Test Implementation

Este repositório contém a implementação da solução para o desafio técnico da Billor para a vaga de Solutions Engineer. O sistema é composto por uma arquitetura de microsserviços em Docker com integração a modelos de linguagem (GPT), automação web e banco de dados PostgreSQL.

## Arquitetura

O projeto é composto por três serviços principais em Docker:

1. **automation-service**: Serviço NestJS responsável pela extração automatizada de dados através de Puppeteer e envio para processamento do GPT.
2. **gpt-service**: Serviço NestJS que disponibiliza endpoints para sumarização de cargas usando GPT Compute Preview.
3. **postgres**: Banco de dados PostgreSQL para armazenamento dos dados e relatórios.

## Pré-requisitos

- Docker e Docker Compose
- Node.js (para desenvolvimento local)
- Chave de API OpenAI (para o serviço GPT)

## Instruções de Execução

### Configuração de Variáveis de Ambiente

1. Crie um arquivo `.env` na pasta raiz do projeto com o seguinte conteúdo:
   ```
   OPENAI_API_KEY=sua_chave_api_aqui
   ```

### Construção e Inicialização

```bash
# Construir as imagens
docker compose build

# Iniciar os serviços
docker compose up -d

# Verificar status
docker compose ps
```

### Verificação de Saúde

```bash
# Verificar logs
docker compose logs

# Verificar saúde do automation-service
curl http://localhost:3000/metrics

# Verificar saúde do gpt-service
curl http://localhost:3001/health
```

### Parar os Serviços

```bash
# Parar os serviços
docker compose down

# Para remover volumes (limpar banco de dados)
docker compose down -v
```

## Estrutura do Banco de Dados

O banco de dados PostgreSQL contém as seguintes tabelas:

- **drivers**: Armazena informações sobre os motoristas
- **loads**: Armazena dados sobre as cargas (origem, destino, preço, ETA)
- **summaries**: Armazena sumarizações geradas pelo GPT a partir dos dados das cargas

Também há uma view materializada **load_summary_view** que combina os dados de `loads` e `summaries` para consultas rápidas.

## API Endpoints

### GPT Service

**POST /summarize-loads**

Recebe um array de objetos de carga e retorna uma sumarização gerada pelo GPT.

Exemplo de requisição:

```json
[
  {
    "origin": "New York NY",
    "destination": "Los Angeles CA",
    "price": 5000,
    "eta": "2023-12-31"
  }
]
```

Exemplo de resposta:

```json
{
  "summary": "Esta carga vai de New York NY para Los Angeles CA com um valor de $5.000 e previsão de chegada em 31/12/2023.",
  "insights": [
    "Rota transcontinental com preço acima da média",
    "Considerar consolidação com outras cargas na mesma rota"
  ]
}
```

### Automation Service

**GET /metrics**

Endpoint que expõe métricas Prometheus para monitoramento.

**GET /load-insights**

Retorna as 5 principais cargas com seus insights, consultando a view materializada do banco de dados.

## Testes

```bash
# Executar testes para o automation-service
cd automation-service
npm test

# Executar testes para o gpt-service
cd gpt-service
npm test
```

## Desenvolvimento e Desafios

Este projeto implementou todos os requisitos do desafio técnico da Billor, incluindo:

1. Arquitetura de microsserviços com Docker Compose
2. Automação de extração de dados via Puppeteer
3. Integração com a API GPT Compute Preview
4. Modelagem de dados e orquestração com PostgreSQL
5. Documentação completa

### Post-mortem (300 palavras)

Durante o desenvolvimento deste projeto, enfrentamos vários desafios técnicos e tomamos decisões arquiteturais importantes para garantir uma solução robusta e escalável.

**Desafios:**

1. **Sincronização de Serviços**: A configuração correta das dependências entre serviços usando `depends_on` e `healthcheck` foi crucial para garantir que o `automation-service` só iniciasse após o banco de dados e o `gpt-service` estarem totalmente funcionais.

2. **Inicialização do Banco de Dados**: Garantir que o esquema SQL fosse aplicado corretamente durante a inicialização do container PostgreSQL exigiu uma configuração precisa dos volumes e scripts de inicialização.

3. **Automação Resiliente**: A extração de dados de portais de carga usando Puppeteer exigiu a implementação de mecanismos sofisticados de retry e backoff para lidar com falhas transitórias.

4. **Integração com OpenAI**: A implementação de fallbacks e gerenciamento de cotas foi necessária para garantir a robustez do serviço de sumarização.

**Decisões Arquiteturais:**

1. **View Materializada**: Optamos por criar uma view materializada (`load_summary_view`) para otimizar consultas frequentes que combinam dados de cargas e sumarizações, melhorando significativamente o desempenho do endpoint `/load-insights`.

2. **Logs Compartilhados**: Utilizamos volumes compartilhados para logs, facilitando o diagnóstico de problemas entre serviços.

3. **Isolamento de Responsabilidades**: A separação clara entre o serviço de automação e o serviço de processamento GPT permite escalabilidade independente e manutenção mais simples.

**Próximos Passos:**

1. Implementar CI/CD com GitHub Actions para automação de testes e deployment
2. Expandir a observabilidade com integração Prometheus/Grafana completa
3. Adicionar suporte a multitenancy para servir diferentes clientes
4. Implementar um serviço de cache para reduzir chamadas à API OpenAI

Esta implementação demonstra a capacidade de criar sistemas distribuídos resilientes que combinam automação, processamento de linguagem natural e orquestração de dados em uma arquitetura moderna de microsserviços.

---

2023 Billor Test Implementation
