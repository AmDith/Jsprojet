import Controller from "../Core/Controller.js";
export default class UserController {
  controller = new Controller();
  load() {
    const mainContainer = document.getElementById("moi");
    if (mainContainer) {
      fetch("./HTML/UserIndex.html")
        .then((response) => response.text())
        .then((html) => {
          mainContainer.innerHTML = html;
          this.controller.initializeModal("compte", "compteModal");
          this.controller.initializeModal("nouveauUserButton", "userModal");
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du user :", error);
        });
    } else {
      console.error('Élément avec l\'ID "main" introuvable dans le DOM.');
    }
  }
}
