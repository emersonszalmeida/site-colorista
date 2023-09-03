// Aguarda até que o documento HTML esteja completamente carregado
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOMContentLoaded event fired.");
    
    // Obtém o formulário de adição de tinta pelo ID
    const addTintaForm = document.getElementById("add-tinta-form");

    // Adiciona um ouvinte de evento ao formulário quando ele for submetido
    addTintaForm.addEventListener("submit", function(event) {
        event.preventDefault(); // Impede que o formulário seja enviado
        
        // Obtém os valores dos campos do formulário
        const nomeTinta = document.getElementById("nome-tinta").value;
        const quantidade = document.getElementById("quantidade").value;
        const dataAquisicao = document.getElementById("data-aquisicao").value;
        const localizacao = document.getElementById("localizacao").value;

        // Adiciona a nova tinta ao localStorage
        adicionarTintaAoLocalStorage(nomeTinta, quantidade, dataAquisicao, localizacao);

        // Limpa os campos do formulário
        addTintaForm.reset();
    });

    // Obtém a checkbox "marcar-desmarcar-todas" pelo ID
    const marcarDesmarcarTodas = document.getElementById("marcar-desmarcar-todas");
    
    // Adiciona um ouvinte de evento para a checkbox "marcar-desmarcar-todas"
    marcarDesmarcarTodas.addEventListener("change", function() {
        // Obtém todas as checkboxes com a classe "selecionar-tinta"
        const selecionarTintas = document.querySelectorAll(".selecionar-tinta");
        
        // Define o estado das checkboxes com base na checkbox "marcar-desmarcar-todas"
        selecionarTintas.forEach(function(tinta) {
            tinta.checked = marcarDesmarcarTodas.checked;
        });
    });

    // Obtém o botão "Excluir Selecionadas" pelo ID
    const botaoExcluirSelecionadas = document.getElementById("excluir-selecionadas");

    // Obtém o campo de pesquisa pelo ID
    const inputPesquisar = document.getElementById("pesquisar-tinta");

    // Adiciona um ouvinte de evento "input" para chamar a função de filtro
    inputPesquisar.addEventListener("input", filtrarTintas);

    // Obtém o campo de filtro de localização pelo ID
    const inputFiltrar = document.getElementById("filtrar-tinta");

    // Adiciona um ouvinte de evento "input" para chamar a função de filtro de localização
    inputFiltrar.addEventListener("input", filtrarLocalizacao);

    

    // Adiciona um ouvinte de evento para o botão "Excluir Selecionadas"
    botaoExcluirSelecionadas.addEventListener("click", function() {
        // Obtém todas as checkboxes com a classe "selecionar-tinta"
        const checkboxesSelecionadas = document.querySelectorAll(".selecionar-tinta:checked");

        // Cria um array para armazenar os índices das tintas selecionadas
        const indicesSelecionados = [];

        // Obtém os índices das tintas selecionadas
        checkboxesSelecionadas.forEach(function(checkbox) {
            const rowIndex = checkbox.closest("tr").rowIndex;
            indicesSelecionados.push(rowIndex - 1); // Subtrai 1 para compensar o cabeçalho da tabela
        });

        // Obtém a lista atual de tintas do localStorage
        let tintas = JSON.parse(localStorage.getItem("tintas")) || [];

        // Remove as tintas selecionadas da lista
        indicesSelecionados.sort().reverse().forEach(function(indice) {
            tintas.splice(indice, 1);
        });

        // Atualiza o localStorage com a lista de tintas atualizada
        localStorage.setItem("tintas", JSON.stringify(tintas));

        // Atualiza a tabela após a exclusão das tintas
        preencherTabelaTintas();

        // Oculta novamente as opções de ação em massa
        atualizarEstiloOpcoesAcao();
    });

    function filtrarTintas() {
        const inputPesquisar = document.getElementById("pesquisar-tinta");
        const filtro = inputPesquisar.value.toLowerCase(); // Converter a pesquisa para minúsculas
    
        const tabela = document.getElementById("tinta-table");
        const linhas = tabela.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i];
            const colunaNome = linha.getElementsByTagName("td")[1]; // A segunda coluna contém o nome
    
            if (colunaNome) {
                const nomeTinta = colunaNome.textContent.toLowerCase();
                if (nomeTinta.includes(filtro)) {
                    linha.style.display = "";
                } else {
                    linha.style.display = "none";
                }
            }
        }
    }
    
    function filtrarLocalizacao() {
        const inputFiltrar = document.getElementById("filtrar-tinta");
        const filtro = inputFiltrar.value.toLowerCase(); // Converter o filtro para minúsculas
    
        const tabela = document.getElementById("tinta-table");
        const linhas = tabela.getElementsByTagName("tbody")[0].getElementsByTagName("tr");
    
        for (let i = 0; i < linhas.length; i++) {
            const linha = linhas[i];
            const colunaLocalizacao = linha.getElementsByTagName("td")[3]; // A quarta coluna contém a localização
    
            if (colunaLocalizacao) {
                const localizacaoTinta = colunaLocalizacao.textContent.toLowerCase();
                if (localizacaoTinta.includes(filtro)) {
                    linha.style.display = "";
                } else {
                    linha.style.display = "none";
                }
            }
        }
    }
    

});

// Função para adicionar uma tinta ao localStorage
function adicionarTintaAoLocalStorage(nome, quantidade, dataAquisicao, localizacao) {
    // Verifica se já existe uma lista de tintas no localStorage
    let tintas = JSON.parse(localStorage.getItem("tintas")) || [];

    // Formata a data no formato "dd/mm/aaaa"
    const dataFormatada = new Date(dataAquisicao).toLocaleDateString("pt-BR");

    // Adiciona a nova tinta à lista
    tintas.push({
        nome: nome,
        quantidade: quantidade,
        dataAquisicao: dataFormatada,
        localizacao: localizacao
    });

    // Armazena a lista atualizada de tintas de volta no localStorage
    localStorage.setItem("tintas", JSON.stringify(tintas));

    // Atualiza a tabela após adicionar a nova tinta
    preencherTabelaTintas();
}

// Função para preencher a tabela de tintas
function preencherTabelaTintas() {
    const tintas = JSON.parse(localStorage.getItem("tintas")) || [];
    const tabela = document.getElementById("tinta-table").getElementsByTagName('tbody')[0];

    // Limpa o conteúdo atual da tabela
    tabela.innerHTML = "";

    // Preenche a tabela com as tintas do localStorage
    tintas.forEach(function(tinta) {
        const row = tabela.insertRow();
        row.innerHTML = `
            <td><input type="checkbox" class="selecionar-tinta"></td>
            <td>${tinta.nome}</td>
            <td>${tinta.quantidade} kg</td>
            <td>${tinta.localizacao}</td>
            <td>${tinta.dataAquisicao}</td>
        `;
    });
}

// Chama a função para preencher a tabela quando a página é carregada
document.addEventListener("DOMContentLoaded", function() {
    preencherTabelaTintas();
});
