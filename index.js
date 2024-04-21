const mysql2 = require('mysql2')
const mysql = require('mysql')
const fs = require('fs');
const path = require('path');
const mysqlP = require('mysql2/promise');

// gera o arquivo de configuração com os campos e botões para cada tabela do banco de dados indicado no objeto de configuração 
const MakeaFormsDB = async(srcRoot, dataConection, opc = 0) => {

    var dataBd = dataConection != null && dataConection != '' && dataConection != undefined ? dataConection : false;

    if (!dataBd) {
        return false
    } else {

        const connection = await mysqlP.createConnection(dataBd);

        let sqlM = `show tables`

        console.log(`Connected to MySQL database Padrão.`);

        const [tabelas] = await connection.execute(sqlM);

        for (let i = 0; i < tabelas.length; i++) {

            let nomeDB = `Tables_in_${dataBd.database}`


            // // Caminho da pasta onde o arquivo será criado
            const urlSRC = srcRoot;

            // Nome do arquivo
            var tabela = tabelas[i][nomeDB]
            const fileName = `${tabela}.json`;
            // Caminho completo do arquivo
            const filePath = path.join(urlSRC, fileName);

            var sqlN = `show columns from ${tabela}`

            var [campos] = await connection.execute(sqlN);
            var data = {
                InputsConfig: [],
                Buttons: []
            };
            var ButtonsData = {
                id: ``,
                operation: '',
                class: '',
                name: ``,
                type: ``,
                icon: ``,
                props: []
            }
            for (let J = 0; J < campos.length; J++) {
                let elementType = campos[J].Type
                var FildData = {
                    id: '',
                    element: '',
                    class: '',
                    name: '',
                    props: [],
                    pk: null

                }

                let key = campos[J].Key.length > 0 ? true : false

                switch (elementType) {
                    case 'int':
                        FildData = {
                            id: `${campos[J].Field}`,
                            element: 'input',
                            element_type: 'number',
                            class: 'form-control input-int',
                            name: `${campos[J].Field}`,
                            props: [],
                            pk: key
                        }
                        break;
                    case 'date':
                        FildData = {
                            id: `${campos[J].Field}`,
                            element: 'input',
                            element_type: 'date',
                            class: 'form-control input-date',
                            name: `${campos[J].Field}`,
                            props: [],
                            pk: key
                        }
                        break;
                    case 'LONGTEXT':
                        FildData = {
                            id: `${campos[J].Field}`,
                            element: 'textarea',
                            element_type: 'null',
                            class: 'form-control textarea',
                            name: `${campos[J].Field}`,
                            props: [],
                            pk: key
                        }
                        break;
                    default:
                        FildData = {
                            id: `${campos[J].Field}`,
                            element: 'input',
                            element_type: 'text',
                            class: 'form-control input-text',
                            name: `${campos[J].Field}`,
                            props: [],
                            pk: key
                        }
                        break;
                }

                data.InputsConfig.push(FildData)

            }
            // cria os botões
            // botão salvar
            ButtonsData = {
                id: `btn-New-${tabela}`,
                operation: 'insert',
                class: 'btn btn-primary',
                name: `btn-${tabela}`,
                type: `submit`,
                icon: `fa-solid fa-floppy-disk`,
                props: []
            }
            data.Buttons.push(ButtonsData)

            // botão Editar
            ButtonsData = {
                id: `btn-Edit-${tabela}`,
                operation: 'Edit',
                class: 'btn btn-warning',
                name: `btn-Edit-${tabela}`,
                type: `submit`,
                icon: `fa-solid fa-pen-to-square`,
                props: []
            }
            data.Buttons.push(ButtonsData)


            // botão cancelar
            ButtonsData = {
                id: `btn-Cancel-${tabela}`,
                operation: 'Cancel',
                class: 'btn btn-dark',
                name: `btn-Cancel-${tabela}`,
                type: `submit`,
                icon: `fa-solid fa-ban`,
                props: []
            }
            data.Buttons.push(ButtonsData)
                // // Dados a serem escritos no arquivo JSON

            // Convertendo os dados para JSON
            const jsonData = JSON.stringify(data);
            // limpa os dados do objeto data
            data.InputsConfig = []
            data.Buttons = []
                // // Verificando se o arquivo já existe
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // O arquivo não existe, então vamos criá-lo
                    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
                        if (err) {

                            console.error('Erro ao escrever no arquivo:', err);
                            return;
                        }
                        console.log(`Arquivo JSON tabela ${tabela} foi criado com sucesso.`);
                    });
                } else {
                    // O arquivo já existe
                    console.log(`O arquivo JSON tabela ${tabela} já existe.`);
                }
            })
        }
        connection.end();
    }
};

// makeFormView(urlSRC, conectionX)

// gera o html da tabela informada seja para inclusão ou edição 

const makeFormView = (url = null, view = null, operation = 'new') => {
    var urlSRC = url
    var viewX = view
    var operacao = operation
    if (urlSRC === null) { return 'Falha ao capturar localização dos arquivos de view.' }
    if (viewX === null) { return 'View não informada.' }

    var dataurl = `${urlSRC}/${view}.json`;

    let dataJson;
    try {
        const jsonData = fs.readFileSync(dataurl, 'utf8');
        dataJson = JSON.parse(jsonData);
    } catch (error) {
        console.error('Erro ao ler ou analisar o arquivo JSON:', error);
        return 'Erro ao ler ou analisar o arquivo JSON.';
    }

    var botoes = dataJson.Buttons
    var inputs = dataJson.InputsConfig
    var propsBTN = ``
    var propsInput = ``

    var html = '<div class="container">'

    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].pk === true && operation === 'new') {
            console.log('input de ID não inserido')
        } else {
            let propriedades_Inputs = inputs[i].props
            if (propriedades_Inputs.length > 0) {
                propriedades_Inputs.forEach(objeto => {
                    Object.entries(objeto).forEach(([chave, valor]) => {
                        propsInput = `${chave}="${valor}"`
                    });
                })
            } else {
                propsInput = ''
            }
            switch (inputs[i].element_type) {
                case 'LONGTEXT':
                    html += `
                    <div class="form-group row">
                    <label for="${inputs[i].id}" class="col-4 col-form-label">${inputs[i].id.replace('_',' ')}</label> 
                    <div class="col-8">
                    <textarea id="${inputs[i].id}" name="${inputs[i].id}" ${propsInput} cols="40" rows="5" class="form-control"></textarea>
                    </div>
                    </div>
                    </p> `
                    break;

                default:
                    html += `
                    <div class="form-group row">
                        <label for="${inputs[i].id}" class="col-4 col-form-label">${inputs[i].id.replace('_',' ')}</label> 
                        <div class="col-8">
                        <input id="${inputs[i].id}" name="${inputs[i].id}"  ${propsInput}  type="${inputs[i].element_type}" class="${inputs[i].class}">
                        </div>
                        </div>
                        </p>`
                    break;
            }
        }
    }

    let StartButtonsProps0 = botoes[0].props
    let StartButtonsProps1 = botoes[1].props
    let StartButtonsProps2 = botoes[2].props
    var ButtonsProps0 = ''
    var ButtonsProps1 = ''
    var ButtonsProps2 = ''

    if (StartButtonsProps0.length > 0) {
        StartButtonsProps0.forEach(objeto => {
            Object.entries(objeto).forEach(([chave, valor]) => {
                ButtonsProps0 += `${chave}="${valor}"`
            });
        })
    }

    if (StartButtonsProps1.length > 0) {
        StartButtonsProps1.forEach(objeto => {
            Object.entries(objeto).forEach(([chave, valor]) => {
                ButtonsProps1 += `${chave}="${valor}"`
            });
        })
    }

    if (StartButtonsProps2.length > 0) {
        StartButtonsProps2.forEach(objeto => {
            Object.entries(objeto).forEach(([chave, valor]) => {
                ButtonsProps2 += `${chave}="${valor}"`
            });
        })
    }

    switch (operacao) {
        case 'new':
            html += `<button class="btn ${botoes[0].class}" ${ButtonsProps0} id="${botoes[0].id}">Salvar <i class="${botoes[0].icon}"></i></button>
                     <button class="btn ${botoes[2].class}" ${ButtonsProps2} id="${botoes[2].id}">Cancelar <i class="${botoes[2].icon}"></i></button>`
            break;

        default:
            html += `<button class="btn ${botoes[1].class}" ${ButtonsProps1} id="${botoes[1].id}">Salvar <i class="${botoes[1].icon}"></i></button>
            <button class="btn ${botoes[2].class}" ${ButtonsProps2} id="${botoes[2].id}">Cancelar <i class="${botoes[2].icon}"></i></button>`
            break;
    }

    html += '</div><p/> ';

    return html;
}

// gera o html da tabela informada seja para inclusão ou edição 
const makeTableView = (url = null, view = null, operation = 'new') => {
    var urlSRC = url;
    var viewX = view;
    var operacao = operation;
    if (urlSRC === null) { return 'Falha ao capturar localização dos arquivos de view.'; }
    if (viewX === null) { return 'View não informada.'; }

    var dataurl = `${urlSRC}/${view}.json`;
    let dataJson;
    try {
        // Lendo o arquivo JSON de forma síncrona
        const jsonData = fs.readFileSync(dataurl, 'utf8');
        // Convertendo o JSON para objeto JavaScript
        dataJson = JSON.parse(jsonData);
    } catch (error) {
        console.error('Erro ao ler ou analisar o arquivo JSON:', error);
        return 'Erro ao ler ou analisar o arquivo JSON.';
    }

    var HeadersConfig = dataJson.HeadersConfig;
    console.log(dataJson.HeadersConfig)
    var html = `<div class="container">
        <div class="table-responsive">
        <table class="table table-primary table-striped" id="${viewX}">
        <thead>
        <tr>`;
    for (let i = 0; i < HeadersConfig.length; i++) {
        html += `<th scope="col">${HeadersConfig[i]}</th>`;
    }
    html += `</tr></thead><tbody id="body_${viewX}"></tbody></table></div></div></p>`;

    return html;
}




// gera o arquivo de configuração com os campos para view de tabela no objeto de configuração 
const MakeaTableDB = async(srcRoot, dataConection, opc = 0) => {

    var dataBd = dataConection != null && dataConection != '' && dataConection != undefined ? dataConection : false;

    if (!dataBd) {
        return false
    } else {

        const connection = await mysqlP.createConnection(dataBd);

        let sqlM = `show tables`

        console.log(`Connected to MySQL database Padrão.`);

        const [tabelas] = await connection.execute(sqlM);

        for (let i = 0; i < tabelas.length; i++) {

            let nomeDB = `Tables_in_${dataBd.database}`


            // // Caminho da pasta onde o arquivo será criado
            const urlSRC = srcRoot;
            // Nome do arquivo
            var tabela = tabelas[i][nomeDB]
            const fileName = `Table_${tabela}.json`;
            // Caminho completo do arquivo
            const filePath = path.join(urlSRC, fileName);

            var sqlN = `show columns from ${tabela}`

            var [campos] = await connection.execute(sqlN);
            var data = {
                HeadersConfig: []

            };
            var ButtonsData = {
                id: ``,
                operation: '',
                class: '',
                name: ``,
                type: ``,
                icon: ``,
                props: []
            }
            for (let J = 0; J < campos.length; J++) {

                data.HeadersConfig.push(campos[J].Field)

            }
            data.HeadersConfig.push('Control')

            // // Dados a serem escritos no arquivo JSON

            // Convertendo os dados para JSON
            const jsonData = JSON.stringify(data);
            // limpa os dados do objeto data
            data.HeadersConfig = []

            // // Verificando se o arquivo já existe
            fs.access(filePath, fs.constants.F_OK, (err) => {
                if (err) {
                    // O arquivo não existe, então vamos criá-lo
                    fs.writeFile(filePath, jsonData, 'utf8', (err) => {
                        if (err) {

                            console.error('Erro ao escrever no arquivo:', err);
                            return;
                        }
                        console.log(`Arquivo JSON tabela ${tabela} foi criado com sucesso.`);
                    });
                } else {
                    // O arquivo já existe
                    console.log(`O arquivo JSON tabela ${tabela} já existe.`);
                }
            })
        }
        connection.end();
    }
};





// gera o arquivo HTML da view especificada na pasta passada por parametro
const saveHTMLView = async(outputSRC, URLInput = null, view = null, operation = 'new') => {
    // Verifica se o caminho de saída é fornecido
    if (!outputSRC) {
        console.error('Caminho de saída não especificado.');
        return;
    }
    if (!URLInput) {
        console.error('Caminho de entrada não especificado.');
        return;
    }
    if (!view) {
        console.error('View  não especificado.');
        return;
    }
    if (!operation) {
        console.error('Operation não especificado.');
        return;
    }
    var viewName = view
    var textHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${viewName}</title>
    </head>
    <body>`
    textHTML += await makeFormView(URLInput, viewName, operation)
    textHTML += `</body></html>`
        // Concatena o nome do arquivo ao caminho do diretório
    const caminhoCompleto = `${outputSRC}/${viewName}.html`;
    // Tenta criar e salvar o arquivo HTML
    fs.writeFile(caminhoCompleto, textHTML, (err) => {
        if (err) {
            console.error('Erro ao salvar o arquivo HTML:', err);
            return;
        }
        console.log('Arquivo HTML salvo com sucesso em:', caminhoCompleto);
    });
}


// gera o arquivo HTML da tabela especificada na pasta passada por parametro
const saveHTMLTableView = async(outputSRC, URLInput = null, view = null) => {
    // Verifica se o caminho de saída é fornecido
    if (!outputSRC) {
        console.error('Caminho de saída não especificado.');
        return;
    }
    if (!URLInput) {
        console.error('Caminho de entrada não especificado.');
        return;
    }
    if (!view) {
        console.error('View  não especificado.');
        return;
    }

    var viewName = view
    var textHTML = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${viewName}</title>
    </head>
    <body>`
    textHTML += await makeTableView(URLInput, viewName)
    textHTML += `</body></html>`
        // Concatena o nome do arquivo ao caminho do diretório
    const caminhoCompleto = `${outputSRC}/${viewName}.html`;
    console.log(caminhoCompleto)
        // process.exit()
        // Tenta criar e salvar o arquivo HTML
    try {

        fs.writeFile(caminhoCompleto, textHTML, (err) => {
            if (err) {
                console.error('Erro ao salvar o arquivo HTML:', err);
                return;
            }
            console.log('Arquivo HTML salvo com sucesso em:', caminhoCompleto);
        });
    } catch (error) {
        console.log('Url não encontrada');

        return 'Url não encontrada'
    }
}

// MakeaFormsDB(urlSRC, conectionX)
// makeFormView(URLInput, viewName, operation)
// saveHTMLView('./public/views', urlSRC, 'combos', 'new')
// saveHTMLTableView('./public/views/tables', './public/src/TablesViews', 'Table_combos')
// MakeaTableView(urlSRC, conectionX)

module.exports = {
    MakeaFormsDB,
    makeFormView,
    saveHTMLView,
    MakeaTableDB,
    makeTableView,
    saveHTMLTableView
}