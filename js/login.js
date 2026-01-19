document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (email === "" || password === "") {
            alert("Debe completar todos los campos");
            return;
        }

        // Perfil Administrador
        if (email === "admin@email.com" && password === "1234") {
            localStorage.setItem("rol", "admin"); 
            window.location.href = "dashboard.html";
        } 
        // Perfil Usuario normal
        else if (email === "usuario@email.com" && password === "user123") {
            localStorage.setItem("rol", "usuario"); 
            window.location.href = "dashboard.html";
        } 
        else {
            alert("Credenciales incorrectas");
        }
    });
});
