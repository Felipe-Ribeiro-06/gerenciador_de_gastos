// Pegando elementos da página
var BTN_botao = document.getElementById('botao');
var BTN_salario = document.getElementById('salario_enviado');

var INP_valor = document.getElementById('valor');
var INP_salario = document.getElementById('salario');
var INP_extras = document.getElementById('extras');
var SELECT_tipo = document.getElementById('gastos_tipo');

var ERRO_msg = document.getElementById('msg_erro');
var ERRO_msg_salario = document.getElementById('msg_erro_salario');

var linhas = document.getElementById('linhas');
var gastos_total = document.getElementById('total_em_gastos');
var balanco_mes = document.getElementById('balanco_mes')
var valor_por_dia = document.getElementById('valor_por_dia');
var total_em_gastos = document.getElementById('total_em_gastos');
var totalPorTipo = JSON.parse(localStorage.getItem('gastos')) || [];
var Gastos = [];


atualizar_tabela()

// funçoes 
function Validar_gastos(gastos) {
    ERRO_msg.innerHTML = '';
    let valor_gasto = parseFloat(gastos.value);
    if (isNaN(valor_gasto) || valor_gasto <= 0) {
        ERRO_msg.innerHTML += `<p>O valor inserido deve ser maior que R$0,00</p>`;
    }
}

function Validar_tipo(tipo) {
    if (tipo.value === '') {
        ERRO_msg.innerHTML += `<p>O tipo de gasto não foi selecionado</p>`;
    }
}


function Validar_salario(salario) {
    let salario_valor = parseFloat(salario.value);

    if (isNaN(salario_valor) || salario_valor <= 0) {
        ERRO_msg_salario.innerHTML += `<p>Salário não inserido ou valor abaixo de R$0,00</p>`;
    } else {
        ERRO_msg_salario.innerHTML = '';
        localStorage.setItem('salario', JSON.stringify(salario_valor));
        
    }
}

function somarEXTRAS(extrasInput) {
    let salario_atualizado = parseFloat(localStorage.getItem('salario'));
    let extras_valor = parseFloat(extrasInput.value) ||0;

    if (!isNaN(extras_valor) && extras_valor >= 0) {
        let salario_novo = salario_atualizado + extras_valor;
        localStorage.setItem('salario', JSON.stringify(salario_novo));
        salario_atualizado = salario_novo;
        
    } else {
        salario_atualizado = salario_atualizado;
    }

    localStorage.setItem('salario', JSON.stringify(salario_atualizado));
}

function atualizar_tabela() {
    
    var Gastos_tabela = JSON.parse(localStorage.getItem('gastos')) || [];
    let html = '';
    Gastos_tabela.forEach(function (item) {
        html += `<tr>`;
        html += `<td>${item.tipo}</td>`;
        html += `<td>R$ ${item.valor.toFixed(2)}</td>`;
        html += `</tr>`;
    });
    linhas.innerHTML = html;
}



function valor_gasto_mes() {
    const gastos_mes = JSON.parse(localStorage.getItem('gastos')) || [];
  

    const total = gastos_mes.reduce((soma, item) => {
        return soma + item.valor;
    }, 0);
    localStorage.setItem('gasto_mes', JSON.stringify(total))
    const gasto_total = JSON.parse(localStorage.getItem('gasto_mes')) || [];
    
        total_em_gastos.innerHTML = `R$${gasto_total}</p>`

}

function somarPorTipo(gastos) {
    var gastos_totais_tipo = JSON.parse(localStorage.getItem('gastos')) || [];
    return gastos_totais_tipo.reduce((acumulador, item) => {
        if (!acumulador[item.tipo]) {
            acumulador[item.tipo] = 0;
        }
        acumulador[item.tipo] += item.valor;
        return acumulador;
    }, {});
}

function mostrarTotaisPorTipo() {
    var gastos_totais_tipo_amostra = JSON.parse(localStorage.getItem('gastos')) || [];
    const totais = somarPorTipo(gastos_totais_tipo_amostra);
    const divResultado = document.getElementById('totais_por_tipo');

    let html = '<h3>Total por tipo de gasto</h3><ul>';
    for (let tipo in totais) {
        html += `<li><strong>${tipo}:</strong> R$ ${totais[tipo].toFixed(2)}</li>`;
    }
    html += '</ul>';

    divResultado.innerHTML = html;
}

function balancoMensal() {
    let salario = JSON.parse(localStorage.getItem('salario'));
    let gasto = JSON.parse(localStorage.getItem('gasto_mes'));

    if (!isNaN(salario) && !isNaN(gasto)) {
    let balanco_mensal = salario - gasto;
    balanco_mes.innerHTML =`<p> o valor do seu balanço desse mês é de R$${balanco_mensal}</p>`
    localStorage.setItem('balanco', balanco_mensal);
}
}

// event listnner

// Botão para adicionar gasto
BTN_botao.addEventListener('click', function () {
    Validar_gastos(INP_valor);
    Validar_tipo(SELECT_tipo);

    if (ERRO_msg.innerHTML != '') {
        console.log('OS CAMPOS NÃO FORAM PREENCHIDOS CORRETAMENTE');
        return;
    }

    Gastos.push({
        valor: parseFloat(INP_valor.value),
        tipo: SELECT_tipo.value
    });
    localStorage.setItem('gastos', JSON.stringify(Gastos));

    INP_valor.value = '';
    SELECT_tipo.value = '';

    atualizar_tabela();
    mostrarTotaisPorTipo();
    valor_gasto_mes();
    balancoMensal()
    

});

// Botão para enviar salário
BTN_salario.addEventListener('click', function () {

    Validar_salario(INP_salario);
    somarEXTRAS (INP_extras);
   
    
    INP_salario.innerHTML= localStorage.getItem('salario');
    INP_extras.innerHTML= INP_extras.value
    let Salario_atualizado = JSON.parse(localStorage.getItem('salario')) || 0;
    let extras = parseFloat(INP_extras.value) || 0;

    salario_total_mes.innerHTML = `<p> O seu saldo total desse mês é R$${Salario_atualizado}</p>`;
    balancoMensal()

});

