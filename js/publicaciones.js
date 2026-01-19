document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal");
    const btnNueva = document.getElementById("btnNueva");
    const cerrarModal = document.getElementById("cerrarModal");
    const form = document.getElementById("formPublicacion");
    const tabla = document.getElementById("tablaPublicaciones");

    const tituloInput = document.getElementById("titulo");
    const redInput = document.getElementById("red");
    const imagenesInput = document.getElementById("imagenes");

    let publicaciones = JSON.parse(localStorage.getItem("publicaciones")) || [];
    let editIndex = null;
    let imagenesGuardadas = [];

    renderTabla();

    // NUEVA PUBLICACIÓN
    btnNueva.addEventListener("click", () => {
        editIndex = null;
        imagenesGuardadas = [];
        form.reset();
        imagenesInput.value = null;
        modal.style.display = "flex";
    });

    cerrarModal.addEventListener("click", () => {
        modal.style.display = "none";
        form.reset();
        imagenesInput.value = null;
    });

    // GUARDAR
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const files = Array.from(imagenesInput.files);
        let imagenesFinales = [];

        if (editIndex === null && files.length === 0) {
            alert("Debe agregar al menos una imagen");
            return;
        }

        if (files.length > 10) {
            alert("Máximo 10 imágenes");
            return;
        }

        // SI HAY IMÁGENES NUEVAS
        if (files.length > 0) {
            imagenesFinales = await convertirBase64(files);
        } else {
            imagenesFinales = imagenesGuardadas;
        }

        const fechaHora = new Date(); // fecha y hora actual
        const fechaHoraStr = fechaHora.toLocaleString();

        const publicacion = {
            titulo: tituloInput.value.trim(),
            red: redInput.value,
            fechaHora: fechaHoraStr, // fecha y hora de publicación
            imagenes: imagenesFinales,
            duracionApp: 60 // 1 hora ahorrada
        };

        if (editIndex === null) {
            publicaciones.push(publicacion);
        } else {
            publicaciones[editIndex] = publicacion;
        }

        localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
        renderTabla();

        modal.style.display = "none";
        form.reset();
        imagenesInput.value = null;
    });

    // CONVERTIR IMÁGENES A BASE64
    function convertirBase64(files) {
        return Promise.all(
            files.map(file => new Promise(resolve => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.readAsDataURL(file);
            }))
        );
    }

    // RENDER TABLA
    function renderTabla() {
        tabla.innerHTML = "";

        publicaciones.forEach((pub, index) => {
            const imgs = pub.imagenes
                .slice(0, 5)
                .map(img => `<img src="${img}" class="img-post">`)
                .join("");

            tabla.innerHTML += `
                <tr>
                    <td>${pub.titulo}</td>
                    <td>${pub.red}</td>
                    <td>${pub.fechaHora}</td>
                    <td><div class="img-group">${imgs}</div></td>
                    <td>${pub.duracionApp} min</td>
                    <td>
                        <button class="action-btn edit" onclick="editar(${index})">Editar</button>
                        <button class="action-btn delete" onclick="eliminar(${index})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    // EDITAR / ELIMINAR
    window.editar = (index) => {
        const pub = publicaciones[index];
        tituloInput.value = pub.titulo;
        redInput.value = pub.red;
        imagenesGuardadas = pub.imagenes;
        editIndex = index;
        imagenesInput.value = null;
        modal.style.display = "flex";
    };

    window.eliminar = (index) => {
        if (!confirm("¿Eliminar publicación?")) return;
        publicaciones.splice(index, 1);
        localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
        renderTabla();
    };
});
