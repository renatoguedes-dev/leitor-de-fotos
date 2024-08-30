# Leitor de fotos utilizando IA

Serviço para gerenciar a leitura individualizada de consumo de água e gás 
utilizando a IA Gemini.

### Rotas

#### **POST /upload**
- **Descrição**: Faz o upload de uma imagem para processamento e armazena os dados de medição.
- **Middleware**:
  - `upload.single("image")`: Manipula uploads de arquivos.
- **Corpo da Requisição**:
  - `customer_code` (string): Identificador do cliente.
  - `measure_datetime` (string): Data e hora da medição.
  - `measure_type` (string): Tipo de medição ("WATER" ou "GAS").
- **Resposta**:
  - `image_url` (string): URL da imagem enviada.
  - `measure_value` (número): Valor extraído da imagem.
  - `measure_uuid` (string): Identificador único da medição.
- **Erros**:
  - `400`: Dados inválidos.
  - `409`: Medição do mês já existe.

#### **PATCH /confirm**
- **Descrição**: Confirma ou atualiza a leitura de uma medição.
- **Corpo da Requisição**:
  - `measure_uuid` (string): Identificador único da medição.
  - `confirmed_value` (número): Valor atualizado da medição.
- **Resposta**:
  - `success` (booleano): Indica confirmação bem-sucedida.
- **Erros**:
  - `404`: Medição não encontrada.
  - `409`: Medição já confirmada.
  - `400`: Dados inválidos.

#### **GET /:customer_code/list**
- **Descrição**: Recupera todas as medições para um cliente especificado. Opcionalmente, filtre por `measure_type`.
- **Parâmetros de Query**:
  - `measure_type` (string, opcional): Filtra medições por tipo ("WATER" ou "GAS").
- **Resposta**:
  - `customer_code` (string): Identificador do cliente.
  - `measures` (array): Lista de medições com `measure_uuid`, `measure_datetime`, `measure_type`, `has_confirmed` e `image_url`.
- **Erros**:
  - `404`: Nenhuma medição encontrada.
  - `400`: Tipo inválido.

### Códigos de Erro
- `INVALID_DATA`: Os dados fornecidos estão incorretos.
- `DOUBLE_REPORT`: Medição do mês já existe.
- `MEASURE_NOT_FOUND`: O UUID da medição especificada não foi encontrado.
- `CONFIRMATION_DUPLICATE`: Medição já confirmada.
- `MEASURES_NOT_FOUND`: Nenhuma medição encontrada para o cliente especificado.
- `INVALID_TYPE`: Tipo de medição especificado é inválido.