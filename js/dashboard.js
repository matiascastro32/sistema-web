document.addEventListener("DOMContentLoaded", () => {

    const lista = document.getElementById("listaPublicaciones");
    const totalElem = document.getElementById("totalPublicaciones");
    const tiempoTotalElem = document.getElementById("tiempoTotal");

    let publicadas = JSON.parse(localStorage.getItem("publicaciones")) || [];
    let programadas = JSON.parse(localStorage.getItem("programadas")) || [];

    renderLista();

    function renderLista() {
        lista.innerHTML = "";

        let todas = [];

        // Publicadas
        publicadas.forEach(pub => {
            todas.push({
                ...pub,
                tipo: "publicada",
                fechaMostrar: formatFechaHora(pub.fecha) // fecha y hora de publicación
            });
        });

        // Programadas
        programadas.forEach(pub => {
            todas.push({
                ...pub,
                tipo: "programada",
                fechaMostrar: formatFecha(pub.fechaProgramada) // fecha programada
            });
        });

        totalElem.textContent = todas.length;

        if (todas.length === 0) {
            lista.innerHTML = "<li>No hay publicaciones registradas.</li>";
        }

        todas.forEach(pub => {
            let imagenesHTML = "";
            pub.imagenes.forEach(img => {
                imagenesHTML += `<img src="${img}" class="mini-img">`;
            });

            lista.innerHTML += `
                <li>
                    <strong>${pub.titulo}</strong> 
                    <small>${pub.red} | ${pub.fechaMostrar}</small>
                    <div class="img-preview">
                        ${imagenesHTML}
                    </div>
                    <div class="tiempo-ahorrado">
                        Tiempo ahorrado: ${pub.duracionApp || 60} min
                    </div>
                    ${pub.tipo === "programada" 
                        ? `<div class="programada-label">Programada</div>` 
                        : `<div class="publicada-label">Publicado</div>`}
                </li>
            `;
        });

        mostrarTiempoTotal();
    }

    function mostrarTiempoTotal() {
        let totalHoras = 0;

        publicadas.forEach(pub => {
            totalHoras += (pub.duracionApp || 60) / 60;
        });
        programadas.forEach(pub => {
            totalHoras += (pub.duracionApp || 60) / 60;
        });

        totalHoras = Math.round(totalHoras);
        tiempoTotalElem.textContent = `${totalHoras} h`;
    }

    /* =============================
       FUNCIONES FORMATEO FECHA CORREGIDAS
    ============================== */
    function formatFecha(fechaStr) {
        let date = fechaStr ? new Date(fechaStr) : new Date();
        if (isNaN(date.getTime())) date = new Date(); // fecha inválida → usar actual
        const dia = date.getDate().toString().padStart(2, "0");
        const mes = (date.getMonth() + 1).toString().padStart(2, "0");
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    }

    function formatFechaHora(fechaStr) {
        let date = fechaStr ? new Date(fechaStr) : new Date();
        if (isNaN(date.getTime())) date = new Date();
        const dia = date.getDate().toString().padStart(2, "0");
        const mes = (date.getMonth() + 1).toString().padStart(2, "0");
        const año = date.getFullYear();
        const horas = date.getHours().toString().padStart(2, "0");
        const minutos = date.getMinutes().toString().padStart(2, "0");
        return `${dia}/${mes}/${año} ${horas}:${minutos}`;
    }

});
