document.addEventListener("DOMContentLoaded", function () {
    const containerVideos = document.querySelector(".videos__container");
    const barraDePesquisa = document.querySelector(".pesquisar__input");
    const botaoPesquisa = document.querySelector(".pesquisar__btn");
    const botaoAudio = document.querySelector(".cabecalho__audio");
    const botaoCategoria = document.querySelectorAll(".superior__item");
    const avatar = document.querySelector(".cabecalho__avatar");
    

    // Função para buscar e mostrar os vídeos
    async function buscarEMostrarVideos() {
        try {
            const busca = await fetch("http://localhost:3000/videos");
            const videos = await busca.json();

            videos.forEach((video) => {
                if (video.categoria === "") {
                    throw new Error('Vídeo não tem categoria');
                }
                containerVideos.innerHTML += `
                    <li class="videos__item">
                        <iframe src="${video.url}" title="${video.titulo}" frameborder="0" allowfullscreen></iframe>
                        <div class="descricao-video">
                            <img class="img-canal" src="${video.imagem}" alt="Logo do Canal">
                            <h3 class="titulo-video">${video.titulo}</h3>
                            <p class="titulo-canal">${video.descricao}</p>
                            <p class="categoria" hidden>${video.categoria}</p>
                        </div>
                    </li>
                `;
            });
        } catch (error) {
            containerVideos.innerHTML = `<p> Houve um erro ao carregar os vídeos: ${error}</p>`;
        }
    }

    buscarEMostrarVideos();

    // Adicionando evento de clique ao botão de áudio
    botaoAudio.addEventListener("click", iniciarReconhecimentoDeVoz);

    // Função para iniciar o reconhecimento de voz
    function iniciarReconhecimentoDeVoz(event) {
        // Evita o comportamento padrão de recarregar a página
        event.preventDefault();

        // Criação do objeto de reconhecimento de fala
        const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
        recognition.lang = "pt-BR";
        recognition.start();

        // Evento que é chamado quando o resultado do reconhecimento está disponível
        recognition.onresult = function (event) {
            const resultado = event.results[0][0].transcript;
            barraDePesquisa.value = resultado;
            filtrarPesquisa();
        };

        // Evento que é chamado quando ocorre um erro no reconhecimento de fala
        recognition.onerror = function (event) {
            console.error("Erro no reconhecimento de voz: ", event.error);
        };
    }

    botaoPesquisa.addEventListener("click", filtrarPesquisa);
    barraDePesquisa.addEventListener("input", filtrarPesquisaDigitada);

    function filtrarPesquisaDigitada() {
        const termoPesquisa = barraDePesquisa.value.toLowerCase();
        const videos = document.querySelectorAll(".videos__item");

        videos.forEach((video) => {
            const titulo = video.querySelector(".titulo-video").textContent.toLowerCase();
            video.style.display = titulo.includes(termoPesquisa) ? "block" : "none";
        });
    }

    function filtrarPesquisa() {
        const termoPesquisa = barraDePesquisa.value.toLowerCase();
        const videos = document.querySelectorAll(".videos__item");

        if (termoPesquisa !== "") {
            videos.forEach((video) => {
                const titulo = video.querySelector(".titulo-video").textContent.toLowerCase();
                video.style.display = titulo.includes(termoPesquisa) ? "block" : "none";
            });
        } else {
            videos.forEach((video) => video.style.display = "block");
        }
    }

    botaoCategoria.forEach((botao) => {
        let nomeCategoria = botao.getAttribute("name");
        botao.addEventListener("click", () => filtrarPorCategoria(nomeCategoria));
    });

    function filtrarPorCategoria(filtro) {
        const videos = document.querySelectorAll(".videos__item");
        const valorFiltro = filtro.toLowerCase();

        videos.forEach((video) => {
            let categoria = video.querySelector(".categoria").textContent.toLowerCase();
            video.style.display = (categoria.includes(valorFiltro) || valorFiltro === 'tudo') ? "block" : "none";
        });
    }

    // Adicionando evento de clique ao avatar
    avatar.addEventListener("click", abrirPaginaLogin);

    // Função para abrir a página de login
    function abrirPaginaLogin() {
        // Redireciona para a página de login
        window.location.href = "erro.html";
    }
});
