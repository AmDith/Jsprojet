import Controller from "../Core/Controller.js";
export default class ArticleModalController {
  controller = new Controller();
  load() {
    const mainContainer = document.getElementById("articleModal");
    if (mainContainer) {
      fetch("./HTML/ArticleModal.html")
        .then((response) => response.text())
        .then((html) => {
          mainContainer.innerHTML = html;
          // if (btnSubmit) {
          const form = document.getElementById("formArticle");
          console.log(form);
          if (form) {
            console.log("fcgvhn,");
            form.addEventListener("submit", (event) => {
              event.preventDefault(); // Empêche le rechargement de la page
              this.controller.submitForm(
                form,
                "http://127.0.0.1:8000/api/articlespost"
              ); // Envoie les données au back-end
            });
          }
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du articleModal :", error);
        });
    } else {
      console.error('Élément avec l\'ID "main" introuvable dans le DOM.');
    }
  }
}
