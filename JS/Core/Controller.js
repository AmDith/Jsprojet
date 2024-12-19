export default class Controller {
  constructor(containerId, htmlPath) {
    this.containerId = containerId; // ID du conteneur HTML (e.g., "sidebar" ou "main")
    this.htmlPath = htmlPath; // Chemin vers le fichier HTML à charger
  }

  initializeModal(openButtonId, modalId) {
    const openModalButton = document.getElementById(openButtonId);
    const modal = document.getElementById(modalId);

    console.log(modal);

    if (openModalButton && modal) {
      console.log(modal.innerHTML);
      const closeModalButtons = modal.querySelectorAll(
        `[data-modal-hide="${modalId}"]`
      );
      console.log(closeModalButtons);

      // Ouvrir le modal
      openModalButton.addEventListener("click", () => {
        modal.classList.remove("hidden");
        modal.classList.add("block");
        modal.setAttribute("aria-hidden", "false");
        modal.removeAttribute("inert");

        // Déplacer le focus sur le premier élément interactif dans le modal
        const focusableElement = modal.querySelector("input, button, textarea");
        if (focusableElement instanceof HTMLElement) {
          focusableElement.focus();
        }
      });
      // Fermer le modal avec tous les boutons correspondants
      closeModalButtons.forEach((button) => {
        button.addEventListener("click", () => {
          modal.classList.remove("block");
          modal.classList.add("hidden");
          modal.setAttribute("aria-hidden", "true");
          modal.setAttribute("inert", "");

          // Retourner le focus au bouton principal
          openModalButton.focus();
        });
      });

      // Fermer le modal si on clique à l'extérieur
      window.addEventListener("click", (event) => {
        if (event.target === modal) {
          modal.classList.remove("block");
          modal.classList.add("hidden");
          modal.setAttribute("aria-hidden", "true");
          modal.setAttribute("inert", "");

          // Retourner le focus au bouton principal
          openModalButton.focus();
        }
      });
    } else {
      console.error(
        `Bouton ou modal introuvable : openButtonId="${openButtonId}", modalId="${modalId}"`
      );
    }
  }

  async submitForm(form, api) {
    console.log("fghj");
    const formData = new FormData(form); // Récupère les données du formulaire
    const jsonData = Object.fromEntries(formData.entries()); // Convertit en JSON

    try {
      const response = await fetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData), // Envoie les données en JSON
      });
      const response2 = await response.json();
      console.log(response2);

      if (!response.ok) {
        const errorData = response2;
        console.error("Erreur lors de la soumission :", errorData);
        alert("Une erreur est survenue : " + errorData.message);
        return;
      }

      const result = response2;
      console.log("Formulaire soumis avec succès :", result);
      alert("Client créé avec succès !");
    } catch (error) {
      console.error("Erreur lors de la requête :", error);
      alert("Erreur réseau ou problème de communication avec le serveur.");
    }
  }
}
