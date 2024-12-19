import ArticleRepository from "../model/ArticleRepository.js";
import Controller from "../Core/Controller.js";
export default class ArticleController {
  controller = new Controller();
  articleRepository = new ArticleRepository();
  async load() {
    const mainContainer = document.getElementById("moi");
    const articles = await this.articleRepository.GetDatas(
      "http://127.0.0.1:8000/api/articles"
    );
    if (mainContainer) {
      fetch("./HTML/ArticleIndex.html")
        .then((response) => response.text())
        .then((html) => {
          mainContainer.innerHTML = html;
          const tbody = document.getElementById("trut");
          this.controller.initializeModal(
            "nouveauArticleButton",
            "articleModal"
          );
          this.fillTable(tbody, articles);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du articleIndex :", error);
        });
    } else {
      console.error('Élément avec l\'ID "main" introuvable dans le DOM.');
    }
  }

  async fillTable(tbody, clients) {
    const itemsPerPage = 3; // Nombre de clients par page
    let currentPage = 1;

    if (Array.isArray(clients)) {
      console.log("Clients récupérés:", clients);
    } else {
      console.error("Les clients récupérés ne sont pas un tableau:", clients);
      return;
    }

    // Fonction pour afficher les clients d'une page donnée
    const renderPage = (page) => {
      // Calculer les indices des clients pour la page actuelle
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = page * itemsPerPage;
      const currentClients = clients.slice(startIndex, endIndex);

      // Vider le tableau
      tbody.innerHTML = "";

      // Ajouter les lignes pour les clients de la page
      currentClients.forEach((article) => {
        const row = document.createElement("tr");
        row.classList.add("border-t");

        row.innerHTML = `
          <tr>
            <td class="p-2 text-center">
              <input
                type="checkbox"
                name="article[]"
                value="1"
                class="form-checkbox h-4 w-4 text-blue-600"
              />
            </td>
            <td class="py-2 px-4 text-center">${article.libelle}</td>
            <td class="py-2 px-4 text-center">${article.prix}</td>
            <td class="py-2 px-4 text-center">${article.qteStock}</td>
          </tr>
        `;
        tbody.appendChild(row);
      });
    };

    // Fonction pour générer les boutons de pagination
    const renderPagination = () => {
      const paginationContainer = document.getElementById("pagination");
      if (!paginationContainer) {
        console.error('Élément avec l\'ID "pagination" introuvable.');
        return;
      }

      // Vider les boutons existants
      paginationContainer.innerHTML = "";

      // Calculer le nombre total de pages
      const totalPages = Math.ceil(clients.length / itemsPerPage);

      // Ajouter le bouton "Précédent"
      const prevButton = document.createElement("button");
      prevButton.className =
        "px-3 py-1 bg-gray-300 rounded-md shadow hover:bg-gray-400";
      prevButton.textContent = "<";
      prevButton.disabled = currentPage === 1; // Désactiver si sur la première page
      prevButton.addEventListener("click", () => {
        if (currentPage > 1) {
          currentPage--;
          renderPage(currentPage);
          renderPagination();
        }
      });
      paginationContainer.appendChild(prevButton);

      // Ajouter les boutons des pages
      for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement("button");
        pageButton.className =
          i === currentPage
            ? "px-3 py-1 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600"
            : "px-3 py-1 bg-gray-300 rounded-md shadow hover:bg-gray-400";
        pageButton.textContent = i.toString();
        pageButton.addEventListener("click", () => {
          currentPage = i;
          renderPage(currentPage);
          renderPagination();
        });
        paginationContainer.appendChild(pageButton);
      }

      // Ajouter le bouton "Suivant"
      const nextButton = document.createElement("button");
      nextButton.className =
        "px-3 py-1 bg-gray-300 rounded-md shadow hover:bg-gray-400";
      nextButton.textContent = ">";
      nextButton.disabled = currentPage === totalPages; // Désactiver si sur la dernière page
      nextButton.addEventListener("click", () => {
        if (currentPage < totalPages) {
          currentPage++;
          renderPage(currentPage);
          renderPagination();
        }
      });
      paginationContainer.appendChild(nextButton);
    };

    // Initialisation
    renderPage(currentPage);
    renderPagination();
  }

  // initializeModal() {
  //   const openModalButton = document.getElementById("nouveauArticleButton");
  //   const modal = document.getElementById("articleModal");

  //   if (openModalButton && modal) {
  //     const closeModalButton = modal.querySelector(
  //       '[data-modal-hide="articleModal"]'
  //     );

  //     // Ouvrir le modal
  //     openModalButton.addEventListener("click", () => {
  //       modal.classList.remove("hidden");
  //       modal.classList.add("block");
  //       modal.setAttribute("aria-hidden", "false");
  //       modal.removeAttribute("inert");

  //       // Déplacer le focus sur le premier élément interactif dans le modal
  //       const focusableElement = modal.querySelector("input, button, textarea");
  //       if (focusableElement instanceof HTMLElement) {
  //         focusableElement.focus();
  //       }
  //     });
  //     // Fermer le modal
  //     if (closeModalButton) {
  //       closeModalButton.addEventListener("click", () => {
  //         modal.classList.remove("block");
  //         modal.classList.add("hidden");
  //         modal.setAttribute("aria-hidden", "true");
  //         modal.setAttribute("inert", "");

  //         // Retourner le focus au bouton principal
  //         openModalButton.focus();
  //       });
  //     }

  //     // Fermer le modal si on clique à l'extérieur
  //     window.addEventListener("click", (event) => {
  //       if (event.target === modal) {
  //         modal.classList.remove("block");
  //         modal.classList.add("hidden");
  //         modal.setAttribute("aria-hidden", "true");
  //         modal.setAttribute("inert", "");

  //         // Retourner le focus au bouton principal
  //         openModalButton.focus();
  //       }
  //     });
  //   }
  // }
}
