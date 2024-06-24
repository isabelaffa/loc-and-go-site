document.addEventListener('DOMContentLoaded', async () => {
    // preencher lista de clientes
    let clientes = await buscarClientes();

    let htmlListaClientes = '<div class="col-12"> <div class="form-floating mb-3"> <select class="form-select" id="selectCliente"><option value="0">Selecione...</option>';

    clientes.forEach(cliente => {
        htmlListaClientes += `<option value="${cliente.id}">${cliente.cpf} / ${cliente.nome}</option>`
    });
        
    htmlListaClientes += '</select> <label for="selectCliente">Cliente</label> </div> </div>';

    document.getElementById('lista-clientes').innerHTML = htmlListaClientes;
    
    // preencher lista de grupos de veículo
    let grupos = await buscarGrupoCarros();
    
    let htmlListaGrupos = '<div class="col-12"> <div class="form-floating mb-3"> <select class="form-select" id="selectGrupo"><option value="0">Selecione...</option>';
    
    grupos.forEach(grupo => {
        htmlListaGrupos += `<option value="${grupo.id}">${grupo.nome}</option>`
    });
    
    htmlListaGrupos += '</select> <label for="selectGrupo">Grupo do Veículo</label> </div> </div>';
    
    document.getElementById('lista-grupos').innerHTML = htmlListaGrupos;
    
    // preencher lista de veículos de acordo com o grupo
    const selectGrupo = document.getElementById('selectGrupo');
    const listaVeiculos = document.getElementById('lista-veiculos');
    
    selectGrupo.addEventListener('change', async function() {
        listaVeiculos.innerHTML = '';

        if (selectGrupo.value !== "0") {
            listaVeiculos.style.display = 'block';
            let htmlListaVeiculos = '<div class="col-12"> <div class="form-floating mb-3"> <select class="form-select" id="selectVeiculos"><option value="0">Selecione...</option>';
            
            let veiculos = await buscarVeiculos(selectGrupo.value);
            veiculos.forEach(veiculo => {
                htmlListaVeiculos += `<option value="${veiculo.id}">${veiculo.modelo}</option>`
            });

            htmlListaVeiculos += '</select> <label for="selectVeiculos">Veículo</label> </div> </div>';
            
            listaVeiculos.innerHTML = htmlListaVeiculos;
        } else {
            listaVeiculos.style.display = 'none';
            
            let selectVeiculos = document.getElementById('selectVeiculos');
            if (selectVeiculos) selectVeiculos.value = 0;
        }
    });

    // preencher lista de usuarios/atendentes
    let usuarios = await buscarUsuarios();

    let htmlListaUsuarios = '<div class="col-12"> <div class="form-floating mb-3"> <select class="form-select" id="selectUsuario"><option value="0">Selecione...</option>';

    usuarios.forEach(usuario => {
        htmlListaUsuarios += `<option value="${usuario.id}">${usuario.nome}</option>`
    });
        
    htmlListaUsuarios += '</select> <label for="selectUsuario">Atendente</label> </div> </div>';

    document.getElementById('lista-usuarios').innerHTML = htmlListaUsuarios;

    // buscar id na URL para verificar se é edição
    const urlParams = new URLSearchParams(location.search);
    let idReserva = urlParams.get("id");

    if (idReserva) {
        document.getElementById('label-operacao').innerText = "Editar reserva";
        preencherInfos(idReserva);
    }

    // salvar reserva
    const botaoSalvar = document.getElementById('salvar-btn');
    
    if (botaoSalvar) {
        botaoSalvar.addEventListener('click', async function() {
            const atendente = document.getElementById('selectUsuario').value;
            const cliente = document.getElementById('selectCliente').value;
            const veiculo = document.getElementById('selectVeiculos').value;
            const diarias = document.getElementById('qtdDiarias').value;
            const status = document.getElementById('status').value;

            const diaReserva = document.getElementById('dataReserva').value;
            const horaReserva = document.getElementById('horaReserva').value;
            const dataReserva = obterData(diaReserva, horaReserva);
            
            const diaRetirada = document.getElementById('dataRetirada').value;
            const horaRetirada = document.getElementById('horaRetirada').value;
            const dataRetirada = obterData(diaRetirada, horaRetirada);
            
            const diaDevolucao = document.getElementById('dataDevolucao').value;
            const horaDevolucao = document.getElementById('horaDevolucao').value;
            const dataDevolucao = obterData(diaDevolucao, horaDevolucao);

            const data = {
                usuarioId: atendente,
                clienteId: cliente,
                veiculoId: veiculo,
                quantidadeDiarias: diarias,
                dataPrevistaDevolucao: dataDevolucao,
                dataReserva,
                status,
                dataRetirada
            };

            if (idReserva) {
                data.id = idReserva;

                try {
                    const response = await fetch(`https://localhost:7265/api/Reservas/${idReserva}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    if (response.ok) {
                        window.location.href = '/reservas/index.html'
                    } else {
                        alert('Erro ao salvar dados.');
                    }
                } catch (error) {
                    console.error('Erro ao salvar os dados:', error);
                    alert('Erro ao salvar dados.');
                }
            } else {
                try {
                    const response = await fetch('https://localhost:7265/api/Reservas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });
                
                    if (response.ok) {
                        window.location.href = '/reservas/index.html'
                    } else {
                        alert('Erro ao salvar dados.');
                    }
                } catch (error) {
                    console.error('Erro ao salvar os dados:', error);
                    alert('Erro ao salvar dados.');
                }
            }
        })
    }
})

async function preencherInfos(reservaId) {
    try {
        let response = await fetch(`https://localhost:7265/api/Reservas/${reservaId}`);
        
        if (response.ok) {
            let reserva = await response.json();

            let inputAtendente = document.getElementById('selectUsuario');
            if (inputAtendente) inputAtendente.value = reserva.usuarioId;

            let inputDataReserva = document.getElementById('dataReserva');
            if (inputDataReserva) inputDataReserva.value = new Date(reserva.dataReserva).toLocaleDateString();
            
            let inputHoraReserva = document.getElementById('horaReserva');
            const horaReserva = new Date(reserva.dataReserva).toLocaleTimeString();
            if (inputHoraReserva) inputHoraReserva.value = horaReserva.slice(0, -3);
            
            let inputCliente = document.getElementById('selectCliente');
            if (inputCliente) inputCliente.value = reserva.clienteId;
            
            let inputDataRetirada = document.getElementById('dataRetirada');
            if (inputDataRetirada) inputDataRetirada.value = new Date(reserva.dataRetirada).toLocaleDateString();
            
            let inputHoraRetirada = document.getElementById('horaRetirada');
            const horaRetirada = new Date(reserva.dataRetirada).toLocaleTimeString();
            if (inputHoraRetirada) inputHoraRetirada.value = horaRetirada.slice(0, -3);
            
            let inputDataDevolucao = document.getElementById('dataDevolucao');
            if (inputDataDevolucao) inputDataDevolucao.value = new Date(reserva.dataPrevistaDevolucao).toLocaleDateString();
            
            let inputHoraDevolucao = document.getElementById('horaDevolucao');
            const horaDevolucao = new Date(reserva.dataPrevistaDevolucao).toLocaleTimeString();
            if (inputHoraDevolucao) inputHoraDevolucao.value = horaDevolucao.slice(0, -3);

            let inputDiarias = document.getElementById('qtdDiarias');
            if (inputDiarias) inputDiarias.value = reserva.quantidadeDiarias;
            
            let inputStatus = document.getElementById('status');
            if (inputStatus) inputStatus.value = reserva.status;

            let veiculo = await buscarVeiculo(reserva.veiculoId);

            if (veiculo) {
                let inputGrupo = document.getElementById('selectGrupo');
                if (inputGrupo) inputGrupo.value = veiculo.grupoId;
                inputGrupo.dispatchEvent(new Event('change'));

                observeVeiculosLoading(() => {
                    let inputVeiculo = document.getElementById('selectVeiculos');
                    if (inputVeiculo) {
                        inputVeiculo.value = reserva.veiculoId;
                    }
                });
            }
        } else {
            document.getElementById('info').innerHTML = '<p class="text-center">Não foi possível encontrar os detalhes dessa reserva :(</p>'
        }
    } catch (e) {
        htmlInfoReserva = '<p class="text-center">Não foi possível encontrar os detalhes dessa reserva :(</p>'
        console.error("Não foi possível executar a requisição\n\n" + e);
    }
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

async function buscarClientes() {
    try {
        let responseClientes = await fetch(`https://localhost:7265/api/Clientes`);
        let clientes = await responseClientes.json();
    
        return clientes.sort((a, b) => {
            if (a.nome < b.nome) return -1;
            if (a.nome > b.nome) return 1;
            return 0;
        });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return [];
    }
    
}

async function buscarGrupoCarros() {
    try {
        let responseGrupos = await fetch(`https://localhost:7265/api/GrupoCarros`);
        let grupos = await responseGrupos.json();
        return grupos.sort((a, b) => {
            if (a.nome < b.nome) return -1;
            if (a.nome > b.nome) return 1;
            return 0;
        });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return [];
    }
}

async function buscarVeiculos(grupoId) {
    try {
        let responseVeiculo = await fetch(`https://localhost:7265/api/Veiculos/Grupo/${grupoId}`);
        let veiculos = await responseVeiculo.json();
        
        let listaVeiculos = [];
    
        for (const veiculo of veiculos) {
            let responseModeloCarro = await fetch(`https://localhost:7265/api/ModeloCarros/${veiculo.modeloId}`);
            let modeloCarro = await responseModeloCarro.json();
    
            listaVeiculos.push({
                id: veiculo.id,
                modelo: `${modeloCarro.marca.toUpperCase()} ${modeloCarro.modelo.toUpperCase()} - ${veiculo.placa}`
            });
        }
        
        return listaVeiculos.sort((a, b) => {
            if (a.modelo < b.modelo) return -1;
            if (a.modelo > b.modelo) return 1;
            return 0;
        });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return [];
    }
    
}

async function buscarUsuarios() {
    try {
        let responseUsuarios = await fetch(`https://localhost:7265/api/UsuarioFuncionarios`);
        let usuarios = await responseUsuarios.json();
    
        return usuarios.sort((a, b) => {
            if (a.nome < b.nome) return -1;
            if (a.nome > b.nome) return 1;
            return 0;
        });
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        return [];
    }
}

function observeVeiculosLoading(callback) {
    const targetNode = document.getElementById('lista-veiculos');
    const observerOptions = {
        childList: true,
        subtree: true
    };

    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' && document.getElementById('selectVeiculos')) {
                observer.disconnect();
                callback();
                break;
            }
        }
    });

    observer.observe(targetNode, observerOptions);
}

function obterData(dataStr, horaStr) {
    const [dia, mes, ano] = dataStr.split('/').map(Number);
    
    const [hora, minuto] = horaStr.split(':').map(Number);

    const data = new Date(ano, mes - 1, dia, hora - 3, minuto);

    return data.toJSON();
}