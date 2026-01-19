document.addEventListener("DOMContentLoaded", () => {

    const modal = document.getElementById("modal");
    const btnNueva = document.getElementById("btnNueva");
    const cerrarModal = document.getElementById("cerrarModal");
    const form = document.getElementById("formProgramacion");
    const tabla = document.getElementById("tablaProgramadas");

    const tituloInput = document.getElementById("titulo");
    const redInput = document.getElementById("red");
    const fechaInput = document.getElementById("fechaProgramada");
    const imagenesInput = document.getElementById("imagenes");

    let programadas = JSON.parse(localStorage.getItem("programadas")) || [];
    let editIndex = null;
    let imagenesGuardadas = [];

    renderTabla();

    // NUEVA PROGRAMACIÓN
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

        if (files.length > 0) {
            imagenesFinales = await convertirBase64(files);
        } else {
            imagenesFinales = imagenesGuardadas;
        }

        const publicacion = {
            titulo: tituloInput.value.trim(),
            red: redInput.value,
            fechaProgramada: fechaInput.value,
            imagenes: imagenesFinales,
            duracionApp: 60 // 1 hora ahorrada
        };

        if (editIndex === null) {
            programadas.push(publicacion);
        } else {
            programadas[editIndex] = publicacion;
        }

        localStorage.setItem("programadas", JSON.stringify(programadas));
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

        programadas.forEach((pub, index) => {
            const imgs = pub.imagenes
                .slice(0, 5)
                .map(img => `<img src="${img}" class="img-post">`)
                .join("");

            tabla.innerHTML += `
                <tr>
                    <td>${pub.titulo}</td>
                    <td>${pub.red}</td>
                    <td>${pub.fechaProgramada}</td>
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
        const pub = programadas[index];
        tituloInput.value = pub.titulo;
        redInput.value = pub.red;
        fechaInput.value = pub.fechaProgramada;
        imagenesGuardadas = pub.imagenes;
        editIndex = index;
        imagenesInput.value = null;
        modal.style.display = "flex";
    };

    window.eliminar = (index) => {
        if (!confirm("¿Eliminar publicación programada?")) return;
        programadas.splice(index, 1);
        localStorage.setItem("programadas", JSON.stringify(programadas));
        renderTabla();
    };
});
