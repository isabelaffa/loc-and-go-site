async function buscarReservas() {
    let htmlReservas = '';
    
    try {
        let response = await fetch('https://localhost:7265/api/Reservas/reservasOrdenadasPorDataReserva');
        
        if (response.ok) {
            let data = await response.json();

            const dicionarioStatus = {
                "EA": {cor: "#00ADCC", texto: "EM ANDAMENTO", permiteEditar: "display:none"},
                "RS": {cor: "#FFBF00", texto: "CONFIRMADA", permiteEditar: ""},
                "CA": {cor: "#CC2200", texto: "CANCELADA", permiteEditar: "display:none"},
                "CC": {cor: "#2ED560", texto: "CONCLUÍDA", permiteEditar: "display:none"}
            };

            for (let reserva of data) {
                const veiculo = await buscarVeiculo(reserva.veiculoId);
                const cliente = await buscarCliente(reserva.clienteId);
                const atendente = await buscarUsuario(reserva.usuarioId);

                const dataReserva = new Date(reserva.dataReserva);
                const dataRetirada = new Date(reserva.dataRetirada);
                const dataDevolucao = new Date(reserva.dataPrevistaDevolucao);

                const status = dicionarioStatus[reserva.status];

                htmlReservas += `
                    <div class="card my-2">
                        <div class="card-body row">
                            <div class="col-8 col-md-10 col-lg-11">
                                <div class="row">
                                    <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                                        <p class="label">Data da Reserva</p>${dataReserva.toLocaleString()}
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-6 col-lg-5">
                                        <p class="label">Cliente</p>${cliente}
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-5">
                                        <p class="label">Atendente</p>${atendente}
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                                        <p class="label">Data da Retirada</p>${dataRetirada.toLocaleString()}
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                                        <p class="label">Data de Devolução</p>${dataDevolucao.toLocaleString()}
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-6 col-lg-3">
                                        <p class="label">Qtd. de Diárias</p>${reserva.quantidadeDiarias}
                                    </div>
                                    <div class="col-12 col-sm-12 col-md-12 col-lg-5">
                                        <p class="label">Veículo</p>${veiculo}
                                    </div>
                                </div>
                            </div>
                            <div class="col-4 col-md-2 col-lg-1">
                                <div class="text-center pb-3 fw-semibold" style="color:${status.cor}">${status.texto}</div>
                                <div class="row">
                                    <div class="col-sm-12 col-md-12 col-lg-4 botoes-acao">
                                        <a href="/reservas/detalhes.html?id=${reserva.id}" title="Ver detalhes"><i class="fa fa-eye ver-mais"></i></a>
                                    </div>
                                    <div class="col-sm-12 col-md-12 col-lg-4 botoes-acao" style="${status.permiteEditar}">
                                        <a href="/reservas/nova.html?id=${reserva.id}" title="Editar"><i class="fa fa-pen ver-mais"></i></a>
                                    </div>
                                    <div class="col-sm-12 col-md-12 col-lg-4 botoes-acao" style="${status.permiteEditar}">
                                        <button type="button" class="btn" data-bs-toggle="modal" data-reserva-id="${reserva.id}" data-bs-target="#modalCancelamento">
                                            <i class="fa fa-ban cancelar"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`
            }
        } else {
            htmlReservas = '<p class="text-center">Não foi possível encontrar as reservas :(</p>'
        }
    } catch (e) {
        htmlReservas = '<p class="text-center">Não foi possível encontrar as reservas :(</p>'
        console.error("Não foi possível executar a requisição\n\n" + e);
    }

    document.getElementById("reservas").innerHTML = htmlReservas;
}

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
        return '-';
    }
}

async function buscarCliente(clienteId) {
    try {
        let responseCliente = await fetch(`https://localhost:7265/api/Clientes/${clienteId}`);
        let cliente = await responseCliente.json();
        return cliente.nome.toUpperCase();
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

buscarReservas();

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
