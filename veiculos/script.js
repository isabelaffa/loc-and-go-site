async function buscarVeiculos() {
    let htmlReservas = '';
    
    try {
        let response = await fetch('https://localhost:7265/api/Veiculos');
        
        if (response.ok) {
            let data = await response.json();

            const dicionarioStatus = {
                "D": {cor: "#2ED560", texto: "DISPONÍVEL"},
                "A": {cor: "#CC2200", texto: "ALUGADO"},
                "I": {cor: "#FFBF00", texto: "INDISPONÍVEL"},
            };

            for (let veiculo of data) {
                const modelo = await buscarModelo(veiculo.modeloId);
                const grupo = await buscarGrupo(veiculo.grupoId);


                const status = dicionarioStatus[veiculo.status];

                htmlReservas += `
                <div class="card my-2">
                    <div class="card-body row">
                            <div class="col-12 col-sm-12 col-md-12 col-lg-1">
                                <p class="label">Placa</p>${veiculo.placa}
                            </div>
                            <div class="col-12 col-sm-12 col-md-6 col-lg-3">
                                <p class="label">Marca</p>${modelo.marca}
                            </div>
                            <div class="col-12 col-sm-12 col-md-6 col-lg-4">
                                <p class="label">Modelo</p>${modelo.modelo}
                            </div>
                            <div class="col-12 col-sm-12 col-md-6 col-lg-2">
                                <p class="label">Grupo</p>${grupo.nome}
                            </div>
                            <div class="col-12 col-sm-12 col-md-6 col-lg-1">
                                <p class="label">Quilometragem</p>${veiculo.quilometragem}
                            </div>
                            <div class="col-12 col-sm-12 col-md-6 col-lg-1 text-center pb-3 fw-semibold" style="color:${status.cor}">
                                <p>${status.texto}</p>
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

buscarVeiculos();
