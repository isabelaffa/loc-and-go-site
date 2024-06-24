const urlParams = new URLSearchParams(location.search);
let idReserva = urlParams.get("id");

async function buscarReserva(reservaId) {
    let htmlInfoReserva = '';
    
    try {
        let response = await fetch(`https://localhost:7265/api/Reservas/${reservaId}`);
        
        if (response.ok) {
            let reserva = await response.json();

            const dicionarioStatus = {
                "EA": {cor: "#00ADCC", texto: "ANDAMENTO"},
                "RS": {cor: "#FFBF00", texto: "CONFIRMADA"},
                "CA": {cor: "#CC2200", texto: "CANCELADA"},
                "CC": {cor: "#2ED560", texto: "CONCLUÍDA"}
            };

            const veiculo = await buscarVeiculo(reserva.veiculoId);
            const cliente = await buscarCliente(reserva.clienteId);
            const atendente = await buscarUsuario(reserva.usuarioId);

            const dataReserva = new Date(reserva.dataReserva);
            const dataRetirada = new Date(reserva.dataRetirada);
            const dataDevolucao = new Date(reserva.dataPrevistaDevolucao);

            const status = dicionarioStatus[reserva.status];

            htmlInfoReserva += `
            <h2 class="text-center pb-5">Reserva #${reservaId}</h2> <div class="row">
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="dataReserva" value="${dataReserva.toLocaleString()}"> <label for="dataReserva">Data da Reserva</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="atendente" value="${atendente}"> <label for="atendente">Atendente</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="statusReserva" value="${status.texto}"> <label for="statusReserva">Status da Reserva</label>
                </div>
            </div>
            <div class="col-12">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="nomeCliente" value="${cliente.nome.toUpperCase()}"> <label for="nomeCliente">Nome do Cliente</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="telefoneCliente" value="${cliente.telefone}"> <label for="telefoneCliente">Telefone</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="email" value="${cliente.email}"> <label for="email">E-mail</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="dataRetirada" value="${dataRetirada.toLocaleString()}"> <label for="dataRetirada">Data da Retirada</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="dataDevolucao" value="${dataDevolucao.toLocaleString()}"> <label for="dataDevolucao">Data da Devolução</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="qtdDiarias" value="${reserva.quantidadeDiarias}"> <label for="qtdDiarias">Quantidade de Diárias</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="veiculo" value="${veiculo.marca} ${veiculo.modelo}"> <label for="veiculo">Veículo</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="placa" value="${veiculo.placa}"> <label for="placa">Placa</label>
                </div>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="quilometragem" value="${veiculo.quilometragem}"> <label for="quilometragem">Quilometragem</label>
                </div>
            </div>
            <div class="col-12">
                <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="grupo" value="-"> <label for="grupo">Grupo</label>
                </div>
            </div>`
            
            const pagamentos = await buscarPagamentos(reservaId);

            if (pagamentos.length) {
                htmlInfoReserva += '<h5 class="p-2 text-center">Pagamento</h5>'
                
                const dicionarioPagamento = {
                    "CCR": "CARTÃO DE CRÉDITO",
                    "CDE": "CARTÃO DE DÉBITO",
                    "DIN": "DINHEIRO",
                    "PIX": "PIX",
                    null: "-"
                }
                
                pagamentos.forEach((pagamento, index) => {
                    const dataDePagamento = new Date(pagamento.dataPagamento)
                    const valor = formatarValorPago(pagamento.valor.toString());
                    
                    htmlInfoReserva += `
                    <div class="col-sm-12 col-md-4 col-lg-4">
                    <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="dataPagamento" value="${dataDePagamento.toLocaleString()}"> <label for="dataPagamento">Data de Pagamento</label>
                    </div>
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-4">
                    <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="valor" value="${valor}"> <label for="valor">Valor Pago</label>
                    </div>
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-4">
                    <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="metodoPagamento" value="${dicionarioPagamento[pagamento.metodoPagamento]}"> <label for="metodoPagamento">Método de Pagamento</label>
                    </div>
                    </div>`
                    
                    if (index !== (pagamentos.length-1)) htmlInfoReserva += '<div class="py-1"><hr class="divisor"></div>';
                });
            }

            const devolucoes = await buscarDevolucoes(reservaId);

            if (devolucoes.length) {
                htmlInfoReserva += '<h5 class="p-2 text-center">Devolução</h5>'
                
                devolucoes.forEach((devolucao, index) => {
                    const dataDeDevolucao = new Date(devolucao.dataDevolucao);
                    let valorAdicional = observacoes = '-';

                    if (devolucao.valorAdicional > 0) valorAdicional = formatarValorPago(devolucao.valorAdicional.toString());
                    if (devolucao.observacoes) observacoes = devolucao.observacoes;

                    htmlInfoReserva += `
                    <div class="col-sm-12 col-md-4 col-lg-4">
                    <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="dataDevolucao" value="${dataDeDevolucao.toLocaleString()}"> <label for="dataDevolucao">Data de Devolução</label>
                    </div>
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-4">
                    <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="valorAdicional" value="${valorAdicional}"> <label for="valorAdicional">Valor Adicional</label>
                    </div>
                    </div>
                    <div class="col-sm-12 col-md-4 col-lg-4">
                    <div class="form-floating mb-3">
                    <input type="text" readonly class="form-control-plaintext" id="observacao" value="${observacoes}"> <label for="observacao">Observacoes</label>
                    </div>
                    </div>`
                    
                    if (index !== (pagamentos.length-1)) htmlInfoReserva += '<div class="py-1"><hr class="divisor"></div>';
                })
            }

            htmlInfoReserva += '</div>';
        } else {
            htmlInfoReserva = '<p class="text-center">Não foi possível encontrar os detalhes dessa reserva :(</p>'
        }
    } catch (e) {
        htmlInfoReserva = '<p class="text-center">Não foi possível encontrar os detalhes dessa reserva :(</p>'
        console.error("Não foi possível executar a requisição\n\n" + e);
    }

    document.getElementById("info").innerHTML = htmlInfoReserva;
}

async function buscarVeiculo(veiculoId) {
    try {
        let responseVeiculo = await fetch(`https://localhost:7265/api/Veiculos/${veiculoId}`);
        let veiculo = await responseVeiculo.json();
        
        let responseModeloCarro = await fetch(`https://localhost:7265/api/ModeloCarros/${veiculo.modeloId}`);
        let modeloCarro = await responseModeloCarro.json();
        
        veiculo.marca = modeloCarro.marca.toUpperCase();
        veiculo.modelo = modeloCarro.modelo.toUpperCase();
        
        return veiculo;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return '-';
    }
}

async function buscarCliente(clienteId) {
    try {
        let responseCliente = await fetch(`https://localhost:7265/api/Clientes/${clienteId}`);
        let cliente = await responseCliente.json();
        return cliente;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return '-';
    }
}

async function buscarUsuario(usuarioId) {
    try {
        let responseUsuario = await fetch(`https://localhost:7265/api/UsuarioFuncionarios/${usuarioId}`);
        let usuario = await responseUsuario.json();
        return usuario.nome.toUpperCase();
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return '-';
    }
}

async function buscarPagamentos(reservaId) {
    try {
        let responsePagamentos = await fetch(`https://localhost:7265/api/Pagamentos/Reserva/${reservaId}`);
        let pagamentos = await responsePagamentos.json();
        return pagamentos;
    } catch (error) {
        console.error('Erro ao buscar os dados de pagamento:', error);
        return [];
    }
}

async function buscarDevolucoes(clienteId) {
    try {
        let responseDevolucoes = await fetch(`https://localhost:7265/api/Devolucoes/Reserva/${clienteId}`);
        let devolucoes = await responseDevolucoes.json();
        return devolucoes;
    } catch (error) {
        console.error('Erro ao buscar os dados de devolução:', error);
        return [];
    }
}

buscarReserva(idReserva);

function formatarValorPago(valor) {
    if (valor.indexOf(".") > -1) return `R$ ${ valor.replace('.', ',')}`;

    return `R$ ${valor},00`;
}