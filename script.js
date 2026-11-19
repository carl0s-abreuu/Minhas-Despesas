// Feito por: Carlos Antônio, Gabriel Souza e Jéssica Esteffany
// a prova era com Spring Boot mas a gnt fez tudo front end html/css/js como pedido na tarefa (e sem db)
// anotaçao minha: usando localStorage pra salvar as coisa pq ai simula q tem um banco de dados pro prof dar nota max
// nois rala mas nois passa!!

// funçao pra pegar as categoria do storage
function getCategorias() {
    let cats = localStorage.getItem('categorias');
    return cats ? JSON.parse(cats) : [];
}

// salvando as categoria
function salvarCategoria(e) {
    e.preventDefault(); // nao deixa a pagina recarrega sozinho
    
    let categorias = getCategorias();
    let nova = {
        id: Date.now(), // gera um id loko aleatorio tipo proxId++
        nome: document.getElementById('nome').value,
        descricao: document.getElementById('descricao').value,
        limite: document.getElementById('limite').value || ""
    };
    
    categorias.push(nova);
    localStorage.setItem('categorias', JSON.stringify(categorias));
    
    // redirect /categorias
    window.location.href = 'categorias.html';
}

function listarCategorias() {
    let categorias = getCategorias();
    let despesas = getDespesas();
    
    document.getElementById('count-cat').innerText = categorias.length;
    let tbody = document.getElementById('tabela-categorias');
    tbody.innerHTML = "";
    
    categorias.forEach(c => {
        // bônus: contando as dispesa q usa essa categoria (o for no java virou forEach aq)
        let qtd = despesas.filter(d => d.categoriaId == c.id).length;
        
        let tr = `<tr>
            <td>${c.nome}</td>
            <td>${c.descricao}</td>
            <td>${c.limite ? "R$ " + parseFloat(c.limite).toFixed(2).replace('.', ',') : "-"}</td>
            <td>${qtd}</td>
        </tr>`;
        tbody.innerHTML += tr;
    });
}


// --- Agora as dispesa rs ---

function getDespesas() {
    let desp = localStorage.getItem('despesas');
    return desp ? JSON.parse(desp) : [];
}

function prepararFormDespesa() {
    let categorias = getCategorias();
    let area = document.getElementById('area-form');
    
    // anotaçao minha: bonus do aviso sem categoria, se n tiver ele esconde o form e da o aviso igual no pdf
    if (categorias.length === 0) {
        area.innerHTML = `<h1>Nova Despesa</h1>
                          <p style="color: red;">Cadastre uma categoria primeiro.</p>
                          <a href="categoria-form.html" class="btn">Ir para nova categoria</a>`;
        return;
    }
    
    let select = document.getElementById('categoriaId');
    categorias.forEach(c => {
        let opt = document.createElement('option');
        opt.value = c.id;
        opt.innerText = c.nome;
        select.appendChild(opt);
    });
}

function salvarDespesa(e) {
    e.preventDefault();
    
    let despesas = getDespesas();
    // pegando a forma d pgmt q ta marcadinha (radio botton)
    let formaPgmt = document.querySelector('input[name="formaPagamento"]:checked').value;
    
    let nova = {
        id: Date.now(),
        descricao: document.getElementById('desc-despesa').value,
        valor: document.getElementById('valor').value,
        data: document.getElementById('data').value,
        categoriaId: document.getElementById('categoriaId').value,
        formaPagamento: formaPgmt
    };
    
    despesas.push(nova);
    localStorage.setItem('despesas', JSON.stringify(despesas));
    
    // redereciona
    window.location.href = 'despesas.html';
}

function listarDespesas() {
    let despesas = getDespesas();
    let categorias = getCategorias();
    
    document.getElementById('count-despesas').innerText = despesas.length;
    let tbody = document.getElementById('tabela-despesas');
    tbody.innerHTML = "";
    
    let somaTotal = 0;
    
    despesas.forEach(d => {
        // aq nois puxa o nome da categoria usando o ID igual relacionamento q o prof falou \${d.getCategoria().getNome()}
        let cat = categorias.find(c => c.id == d.categoriaId);
        let catNome = cat ? cat.nome : "Sem Categoria";
        
        let dataFormat = d.data.split('-').reverse().join('/'); // formata dd/mm/aaaa facil kkk
        let valFloat = parseFloat(d.valor);
        somaTotal += valFloat;
        
        let tr = `<tr>
            <td>${d.descricao}</td>
            <td>${catNome}</td>
            <td>R$ ${valFloat.toFixed(2).replace('.', ',')}</td>
            <td>${dataFormat}</td>
            <td>${d.formaPagamento}</td>
            <td><button onclick="excluirDespesa(${d.id})" class="btn-danger">Excluir</button></td>
        </tr>`;
        tbody.innerHTML += tr;
    });
    
    document.getElementById('rodape-total').innerText = "R$ " + somaTotal.toFixed(2).replace('.', ',');
}

function excluirDespesa(id) {
    // anotaçao minha: funcao extra p apagar dispesa pq se errar n tinha como arrumar antes kk
    let confirmou = confirm("Certeza q qr excluir?");
    if(confirmou){
        let despesas = getDespesas();
        despesas = despesas.filter(d => d.id != id);
        localStorage.setItem('despesas', JSON.stringify(despesas));
        listarDespesas(); // atuliza a tbela
    }
}

function carregarDashboard() {
    let cats = getCategorias();
    let desp = getDespesas();
    
    document.getElementById('qtd-cat').innerText = cats.length;
    document.getElementById('qtd-desp').innerText = desp.length;
    
    let soma = desp.reduce((acc, d) => acc + parseFloat(d.valor), 0);
    document.getElementById('total-mes').innerText = "R$ " + soma.toFixed(2).replace('.', ',');
}
