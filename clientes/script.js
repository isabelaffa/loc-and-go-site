async function buscarClientes() {
    let htmlReservas = '';
    
    try {
        let response = await fetch('https://localhost:7265/api/Clientes');
        
        if (response.ok) {
            let data = await response.json();

            for (let cliente of data) {
                htmlReservas += `
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
            htmlReservas = '<p class="text-center">Não foi possível encontrar as reservas :(</p>'
        }
    } catch (e) {
        htmlReservas = '<p class="text-center">Não foi possível encontrar as reservas :(</p>'
        console.error("Não foi possível executar a requisição\n\n" + e);
    }

    document.getElementById("reservas").innerHTML = htmlReservas;
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

buscarClientes();
