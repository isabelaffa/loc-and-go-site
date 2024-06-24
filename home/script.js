let hoje = new Date();
hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());


async function buscarVeiculo(veiculoId) {
    try {
        let responseVeiculo = await fetch(`https://localhost:7265/api/Veiculos/${veiculoId}`);
        let veiculo = await responseVeiculo.json();
        
        let responseModeloCarro = await fetch(`https://localhost:7265/api/ModeloCarros/${veiculo.modeloId}`);
        let modeloCarro = await responseModeloCarro.json();
        
        veiculo.marca = modeloCarro.marca.toUpperCase();
        veiculo.modelo = modeloCarro.modelo.toUpperCase();
        
        return `${veiculo.marca} ${veiculo.modelo} - ${veiculo.placa}`;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return 'Veículo não encontrado';
    }
}

async function buscarCliente(clienteId) {
    try {
        let responseCliente = await fetch(`https://localhost:7265/api/Clientes/${clienteId}`);
        let cliente = await responseCliente.json();
        return cliente.nome;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return 'Cliente não encontrado';
    }
}

async function buscarReservas() {
    let htmlReservasHoje = '';
    
    let response = await fetch(`https://localhost:7265/api/Reservas/reservasPendentesPorDataRetirada?data=${hoje.toJSON()}`);
    
    if (response.ok) {
        let data = await response.json();
        for (let reserva of data) {
            const dataRetirada = new Date(reserva.dataRetirada);
            
            let veiculoInfo = await buscarVeiculo(reserva.veiculoId);
            let clienteNome = await buscarCliente(reserva.clienteId);
            
            htmlReservasHoje += `
            <div class="card my-2">
            <div class="card-body row">
            <div class="col-12 col-sm-12 col-md-6 col-lg-2">
            <p class="label">Horário</p>${dataRetirada.toLocaleTimeString()}
            </div>
            <div class="col-12 col-sm-12 col-md-6 col-lg-2">
            <p class="label">Qtd. de Diárias</p>${reserva.quantidadeDiarias}
            </div>
            <div class="col-12 col-sm-12 col-md-6 col-lg-3">
            <p class="label">Veículo</p>${veiculoInfo}
            </div>
            <div class="col-12 col-sm-12 col-md-6 col-lg-3">
            <p class="label">Cliente</p>${clienteNome}
            </div>
            <div class="col-6 col-sm-10 col-md-6 col-lg-1 botoes-acao">
            <a href="/reservas/detalhes.html?id=${reserva.id}" title="Ver detalhes"><i class="fa fa-eye ver-mais"></i></a>
            </div>
            <div class="col-6 col-sm-2 col-md-6 col-lg-1 botoes-acao">
            <button type="button" class="btn" data-bs-toggle="modal" data-reserva-id="${reserva.id}" data-bs-target="#modalCancelamento">
            <i class="fa fa-ban cancelar"></i>
            </button>
            </div>
            </div>
            </div>`;
        }
    } else {
        htmlReservasHoje = '<p class="text-center">Nenhuma reserva encontrada para hoje :)</p>';
    }
    
    document.getElementById("retiradas").innerHTML = htmlReservasHoje;
    
}

async function buscarDevolucoes() {
    let htmlDevolucoesHoje = '';
    
    let response = await fetch(`https://localhost:7265/api/Reservas/reservasAtivasPorDataDevolucao?data=${hoje.toJSON()}`);
    
    if (response.ok) {
        let data = await response.json();
        for (let devolucao of data) {
            const dataDevolucao = new Date(devolucao.dataPrevistaDevolucao);
            
            let veiculoInfo = await buscarVeiculo(devolucao.veiculoId);
            let clienteNome = await buscarCliente(devolucao.clienteId);
            
            htmlDevolucoesHoje += `
            <div class="card my-2">
            <div class="card-body row">
            <div class="col-12 col-sm-12 col-md-6 col-lg-3">
            <p class="label">Horário previsto</p>${dataDevolucao.toLocaleTimeString()}
            </div>
            <div class="col-12 col-sm-12 col-md-6 col-lg-4">
            <p class="label">Veículo</p>${veiculoInfo}
            </div>
            <div class="col-12 col-sm-12 col-md-6 col-lg-4">
            <p class="label">Cliente</p>${clienteNome}
            </div>
            <div class="col-12 col-sm-12 col-md-6 col-lg-1 botoes-acao">
            <a href="#" title="Fazer devolução"><i class="fa fa-arrow-right ver-mais"></i></a>
            </div>
            </div>
            </div>`;
        }
    } else {
        htmlDevolucoesHoje = '<p class="text-center">Nenhuma devolução encontrada para hoje :)</p>';
    }
    
    document.getElementById("devolucoes").innerHTML = htmlDevolucoesHoje;
}

async function buscarClientes() {
    let htmlClientes = '';
    
    let response = await fetch(`https://localhost:7265/api/Clientes`);
    
    if (response.ok) {
        let data = await response.json();
        let clientesRecentes = data.sort((a, b) => b.id - a.id);

        for (let i = 0; i < 3; i++) { // exibir somente os 3 cliente mais recentes
            let cliente = clientesRecentes[i];
            htmlClientes += `
            <div class="card my-2">
                <div class="card-body row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-4">
                            <p class="label">Nome</p>${cliente.nome}
                        </div>
                        <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                            <p class="label">CPF</p>${cliente.cpf}
                        </div>
                        <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                            <p class="label">Telefone</p>${cliente.telefone}
                        </div>
                        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
                            <p class="label">E-mail</p>${cliente.email}
                        </div>
                    </div>
                </div>
            </div>`
        }
    } else {
        htmlClientes = '<p class="text-center">Não encontramos nenhum cliente :)</p>';
    }
    
    document.getElementById("clientes").innerHTML = htmlClientes;
}

async function buscarVeiculos() {
    let htmlVeiculos = '';
    
    let response = await fetch(`https://localhost:7265/api/Veiculos`);
    
    if (response.ok) {
        let data = await response.json();
        let veiculosDisponiveis = data.sort((a, b) => b.id - a.id).filter(veiculo => veiculo.status === "D");
        
        const dicionarioStatus = {
            "D": {cor: "#2ED560", texto: "DISPONÍVEL"},
            "A": {cor: "#CC2200", texto: "ALUGADO"},
            "I": {cor: "#FFBF00", texto: "INDISPONÍVEL"},
        };

        for (let i = 0; i < 3; i++) { // exibir somente os 3 veiculos mais recentes
            let veiculo = veiculosDisponiveis[i];

            const modelo = await buscarModelo(veiculo.modeloId);
            const grupo = await buscarGrupo(veiculo.grupoId);

            const status = dicionarioStatus[veiculo.status];

            htmlVeiculos += `
            <div class="card my-2">
                <div class="card-body row">
                        <div class="col-12 col-sm-12 col-md-12 col-lg-2">
                            <p class="label">Placa</p>${veiculo.placa}
                        </div>
                        <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                            <p class="label">Marca</p>${modelo.marca}
                        </div>
                        <div class="col-12 col-sm-12 col-md-6 col-lg-4">
                            <p class="label">Modelo</p>${modelo.modelo}
                        </div>
                        <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                            <p class="label">Grupo</p>${grupo.nome}
                        </div>
                        <div class="col-12 col-sm-12 col-md-6 col-lg-2 text-center pb-3 fw-semibold" style="color:${status.cor}">
                            <p>${status.texto}</p>
                        </div>
                    </div>
                </div>
            </div>`
        }
    } else {
        htmlVeiculos = '<p class="text-center">Não encontramos nenhum Veículo :)</p>';
    }
    
    document.getElementById("veiculos").innerHTML = htmlVeiculos;
}

async function buscarModelo(modeloId) {
    try {
        let responseModeloCarro = await fetch(`https://localhost:7265/api/ModeloCarros/${modeloId}`);
        let modeloCarro = await responseModeloCarro.json();
        
        return modeloCarro;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return '-';
    }
}

async function buscarGrupo(grupoId) {
    try {
        let responseGrupo = await fetch(`https://localhost:7265/api/GrupoCarros/${grupoId}`);
        let grupo = await responseGrupo.json();
        return grupo;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return '-';
    }
}

buscarReservas();
buscarDevolucoes();
buscarClientes();
buscarVeiculos();

document.addEventListener('DOMContentLoaded', function () {
    const botaoCancelarReserva = document.getElementById('cancelar-reserva');
    const modal = document.getElementById('modalCancelamento');
    modal.addEventListener('show.bs.modal', event => {
        const botaoGatilho = event.relatedTarget;
        const id = botaoGatilho.getAttribute('data-reserva-id');
        botaoCancelarReserva.setAttribute('data-reserva-id', id);
    });
    
    botaoCancelarReserva.addEventListener('click', function () {
        
        const reservaId = this.getAttribute('data-reserva-id');
        
        if (reservaId) {
            atualizarStatusCancelado(reservaId);
        }
    });
});

async function atualizarStatusCancelado(reservaId) {
    try {
        let response = await fetch(`https://localhost:7265/api/Reservas/${reservaId}`);
        let reserva = await response.json();
        
        reserva.status = "CA";
        console.info(reserva);
        
        fetch(`https://localhost:7265/api/Reservas/${reservaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reserva)
        });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return '-';
    }
}