### Documentação da Rich-Forms-BR

Esta biblioteca é um conjunto de funções em JavaScript que interagem com um banco de dados MySQL para gerar arquivos de configuração e arquivos HTML com base nas tabelas presentes no banco de dados.
Vou descrever brevemente as principais funcionalidades e partes do código:

**Funções Principais:**
* MakeaFormsDB: Esta função cria arquivos de configuração com campos e botões para cada tabela do banco de dados fornecido.
* makeFormView: Gera HTML para uma visualização de formulário com base nos dados de entrada.
* saveHTMLView: Salva o HTML gerado em um arquivo no sistema de arquivos.
* MakeaTableDB: Cria arquivos de configuração para visualizações de tabela.
* makeTableView: Gera HTML para uma visualização de tabela.
* saveHTMLTableView: Salva o HTML gerado para a visualização de tabela em um arquivo no sistema de arquivos.

**Fluxo Principal:**

* A função MakeaFormsDB é chamada para criar arquivos de configuração com campos e botões para cada tabela do banco de dados.

* A função makeFormView é chamada para gerar a visualização do formulário.

* A função saveHTMLView é chamada para salvar o HTML gerado em um arquivo.

Similarmente, funções semelhantes são usadas para tabelas.

**Processamento de Dados:**

O código faz uso extensivo de consultas SQL para obter informações sobre as tabelas e campos do banco de dados.
Com base nessas informações, ele gera configurações de campos e botões para as visualizações de formulário e tabela.

**Manipulação de Arquivos:**

A biblioteca utiliza o módulo fs para manipulação de arquivos, incluindo verificação de existência, escrita e leitura de arquivos.

Em resumo, esta biblioteca é útil para automatizar a geração de formulários e visualizações de tabela para um banco de dados MySQL, simplificando o processo de desenvolvimento web para aplicativos que interagem com bancos de dados.

### Instalação
Para usar esta library, primeiro você precisa instalá-la em seu projeto. Você pode fazer isso usando npm:

```bash
npm install Rich-Forms-br
```

### Funções Disponíveis
```JavaScript
MakeaFormsDB(srcRoot, dataConection, opc)
```
Esta função gera um arquivo de configuração com os campos e botões para cada tabela do banco de dados indicado no objeto de configuração.

**srcRoot**: O caminho raiz onde os arquivos serão criados.
dataConection: Os detalhes da conexão com o banco de dados.
**opc**: Uma opção opcional.
### MakeaTableDB
```JavaScript
MakeaTableDB(srcRoot, dataConection, opc)
```
Esta função gera um arquivo de configuração com os campos para a view de tabela no objeto de configuração.

**srcRoot**: O caminho raiz onde os arquivos serão criados.
**dataConection**: Os detalhes da conexão com o banco de dados.
Abaixo segue o exemplo de dados de conexão:
```JSON
var conection = {
    host: 'ip_servidor',
    user: 'usuário',
    password: 'senha',
    database: 'Nome DB'
}
```
**opc**: Uma opção opcional.
### makeFormView
```JavaScript
makeFormView(url, view, operation)
```
Esta função gera o HTML da tabela informada para inclusão ou edição.

**url**: O caminho para a pasta onde o arquivo JSON de configuração está localizado.
**view**: A view da tabela para a qual o HTML será gerado.
**operation**: A operação a ser realizada ('new' ou 'edit').
### makeTableView
```JavaScript
makeTableView(url, view, operation)
```
Esta função gera o HTML da tabela informada para visualização.

**url**: O caminho para a pasta onde o arquivo JSON de configuração está localizado.
**view**: A view da tabela para a qual o HTML será gerado.
**Operation**: A operação a ser realizada ('new' ou 'edit').

### saveHTMLView
```JavaScript
saveHTMLView(outputSRC, URLInput, view, operation)
```
Esta função gera e salva um arquivo HTML na pasta indicada.

**outputSRC**: O caminho onde o arquivo HTML será salvo.
**URLInput**: O caminho para a pasta onde o arquivo JSON de configuração está localizado.
**view**: A view da tabela para a qual o HTML será gerado.
**operation**: A operação a ser realizada ('new' ou 'edit').

### saveHTMLTableView
```JavaScript
saveHTMLTableView(outputSRC, URLInput, view)
```
Esta função gera e salva um arquivo HTML da tabela na pasta indicada.

**outputSRC**: O caminho onde o arquivo HTML será salvo.
**URLInput**: O caminho para a pasta onde o arquivo JSON de configuração está localizado.

**view**: A view da tabela para a qual o HTML será gerado.
### Exemplo de Uso
```javascript
const { MakeaFormsDB, saveHTMLView } = require('nomedalib');

const srcRoot = './caminho/para/os/arquivos';
const dataConection = {
  host: 'localhost',
  user: 'root',
  password: 'senha',
  database: 'meubanco'
};

MakeaFormsDB(srcRoot, dataConection);
saveHTMLView(srcRoot, './caminho/para/o/arquivo.json', 'minhaView', 'new');
```
### Contribuindo
Contribuições são bem-vindas! Sinta-se à vontade para abrir uma issue ou enviar um pull request