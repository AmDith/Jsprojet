import DemandeRepository from "../model/DemandeRepository.js";
export default class DemandeController {
  load() {
    const mainContainer = document.getElementById("moi");
    if (mainContainer) {
      fetch("./HTML/DemandeIndex.html")
        .then((response) => response.text())
        .then((html) => {
          mainContainer.innerHTML = html;
          const tbody = document.getElementById("trut");
          console.log(tbody);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du demandeIndex :", error);
        });
    } else {
      console.error('Élément avec l\'ID "main" introuvable dans le DOM.');
    }
  }
}
