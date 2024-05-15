document.addEventListener("DOMContentLoaded", function () {
    const modoEscuroToggle = document.querySelector(".cabecalho__switch-input");
    const body = document.body;

    modoEscuroToggle.addEventListener("change", toggleModoEscuro);

    function toggleModoEscuro() {
        body.classList.toggle("dark");
    }
});
