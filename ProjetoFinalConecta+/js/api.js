const botaoSalvar = document.getElementById('salvar');

//Pega os dados do Formulario e os preprara para manipulação
const getDadosForm = function () {
    let contatoJSON = {};
    let status = true;
    
    let nomeContato = document.getElementById('nome');
    let telefoneContato = document.getElementById('telefone');
    let emailContato = document.getElementById('email');
    let imagemContato = document.getElementById('imagem');
    
    const nomeValido = /^[a-zA-ZÀ-ÿ\s]+$/;
    
    const telefoneValido = /^[0-9]+$/;
    
    if (nomeContato.value === '' || 
        telefoneContato.value === '' || 
        emailContato.value === '' || 
        imagemContato.value === ''
    ) {
        alert('Todos os campos devem ser preenchidos.');
        status = false;
    } else if (!nomeValido.test(nomeContato.value)) {
        alert('O campo de nome deve conter apenas letras.');
        status = false;
    } else if (!telefoneValido.test(telefoneContato.value)) {
        alert('O campo de telefone deve conter apenas números.');
        status = false;
    
    } else {
        contatoJSON.nome = nomeContato.value;
        contatoJSON.telefone = telefoneContato.value;
        contatoJSON.email = emailContato.value;
        contatoJSON.image = imagemContato.value;
    }

    return status && contatoJSON; 
};

//Bloqueia a entrada de caracteres que nao sejam letras
document.getElementById('nome').addEventListener('input', function (event) {
    const nomeValido = /^[a-zA-ZÀ-ÿ\s]*$/;
    if (!nomeValido.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
    }
});

//Bloqueia a entrada de caracteres que nao sejam numeros
document.getElementById('telefone').addEventListener('input', function (event) {
    const apenasNumeros = /^[0-9]*$/;
    if (!apenasNumeros.test(event.target.value)) {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
    }
});

//Limita a caixa em 11 numeros
document.getElementById('telefone').addEventListener('input', function (event) {
    if (event.target.value.length > 11) {
        event.target.value = event.target.value.slice(0, 11);
    }
});

//Função que adiociona um novo contato
const postContato = async function (dadosContato) {
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/novo/contato`;
    
    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosContato),
    });

    if (response.status === 201) {
        alert('Contato inserido com sucesso.');
        limparFormulario();
        getContatos();
    } else {
        alert('Não foi possível inserir o contato. Verifique os dados enviados.');
    }
};

//Função que puxa os dados para edição
const putContato = async function (dadosContato) {
    let id = sessionStorage.getItem('idContato');
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/atualizar/contato/${id}`;

    let response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dadosContato),
    });

    if (response.status === 200) {
        alert('Contato atualizado com sucesso.');
        limparFormulario();
        getContatos();
    } else {
        alert('Não foi possível atualizar o contato. Verifique os dados enviados.');
    }
};

//Função que deleta um contato da API
const deleteContato = async function (id) {
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/excluir/contato/${id}`;

    let response = await fetch(url, {
        method: 'DELETE',
    });

    if (response.status === 200) {
        alert('Contato excluído com sucesso!');
        getContatos();
    } else {
        alert('Não foi possível excluir o contato.');
    }
};

//Função que puxa os contatos da API
const getContatos = async function () {
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/listar/contatos';

    let response = await fetch(url);
    let dados = await response.json();

    if (response.status === 200) {
        setCardItens(dados.contatos);
    } else {
        console.error('Erro ao carregar contatos:', dados);
    }
};

//Função que cria os cards com base nos dados da API
const setCardItens = function (contatos) {
    let divListDados = document.getElementById('listDados');
    divListDados.innerHTML = '';

    contatos.forEach(function (contato) {
        let divDados = document.createElement('div');
        let divNome = document.createElement('div');
        let divTelefone = document.createElement('div');
        let divEmail = document.createElement('div');
        let divImagem = document.createElement('div');
        let divOpcoes = document.createElement('div');
        let imgEditar = document.createElement('img');
        let imgExcluir = document.createElement('img');

        divNome.textContent = contato.nome;
        divTelefone.textContent = contato.telefone;
        divEmail.textContent = contato.email;

        let img = document.createElement('img');
        img.src = contato.image;
        img.alt = contato.nome;
        img.style.maxWidth = '50px';
        divImagem.appendChild(img);

        divDados.className = 'linha dados';
        imgEditar.src = 'icones/editar.png';
        imgExcluir.src = 'icones/excluir.png';

        imgEditar.setAttribute('idContato', contato.id);
        imgExcluir.setAttribute('idContato', contato.id);

        divDados.appendChild(divNome);
        divDados.appendChild(divTelefone);
        divDados.appendChild(divEmail);
        divDados.appendChild(divImagem);
        divDados.appendChild(divOpcoes);
        divOpcoes.appendChild(imgEditar);
        divOpcoes.appendChild(imgExcluir);

        divListDados.appendChild(divDados);

        //Botao que exclui um dado da API
        imgExcluir.addEventListener('click', function () {
            let id = imgExcluir.getAttribute('idContato');
            if (confirm('Deseja realmente excluir este contato?')) {
                deleteContato(id);
            }
        });

        //Botao que leva para a função de edição 
        imgEditar.addEventListener('click', function () {
            let id = imgEditar.getAttribute('idContato');
            console.log('ID do contato para editar:', id);
            getBuscarContato(id);
        
            const formulario = document.getElementById('adm');
            formulario.scrollIntoView({ behavior: 'smooth' });
        });
        

        
        
    });
};

//Função que busca o dado pelo ID na API
const getBuscarContato = async function (id) {
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto2/fecaf/buscar/contato/${id}`;
    
    try {
        let response = await fetch(url);

        if (!response.ok) {
            console.error(`Erro ao buscar contato: ${response.status} - ${response.statusText}`);
            return;
        }

        
        let dados = await response.json();
        console.log('Resposta completa da API:', dados);


        if (dados.contato && dados.contato.length > 0) {
            let contato = dados.contato[0];
            
            document.getElementById('nome').value = contato.nome || '';
            document.getElementById('telefone').value = contato.telefone || '';
            document.getElementById('imagem').value = contato.image || '';
            document.getElementById('email').value = contato.email || '';

            document.getElementById('salvar').innerText = 'Atualizar';
            sessionStorage.setItem('idContato', id);
        } else {
            console.error('Contato não encontrado na resposta da API.');
        }
    } catch (error) {
        console.error('Erro ao buscar contato:', error);
    }
};

//Função que limpa as caixas do formulario depois que um dado é inserido ou modificado
const limparFormulario = function () {
    document.getElementById('nome').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('imagem').value = '';

    document.getElementById('salvar').innerText = 'Salvar';
};

//Botão que salva ou atualiza os dados da API
botaoSalvar.addEventListener('click', function () {
    let dados = getDadosForm();

    if (dados) {
        if (botaoSalvar.innerText === 'Salvar') {
            postContato(dados);
        } else if (botaoSalvar.innerText === 'Atualizar') {
            putContato(dados);
        }
    }
});

window.addEventListener('load', function () {
    getContatos();
});
