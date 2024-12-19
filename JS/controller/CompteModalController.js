import Controller from "../Core/Controller.js";
export default class CompteModalController {
  controller = new Controller();
  load() {
    const mainContainer = document.getElementById("compteModal");
    if (mainContainer) {
      fetch("./HTML/CompteModal.html")
        .then((response) => response.text())
        .then((html) => {
          mainContainer.innerHTML = html;
          const form = document.getElementById("formCompte");
          console.log(form);
          if (form) {
            console.log("fcgvhn,");
            form.addEventListener("submit", (event) => {
              event.preventDefault(); // Empêche le rechargement de la page
              this.controller.submitForm(
                form,
                "http://127.0.0.1:8000/api/compteuserspost"
              ); // Envoie les données au back-end
            });
          }
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du compteModal :", error);
        });
    } else {
      console.error('Élément avec l\'ID "main" introuvable dans le DOM.');
    }
  }
}
