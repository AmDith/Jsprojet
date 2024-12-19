import ClientRepository from "../model/ClientRepository.js";
import ArticleRepository from "../model/ArticleRepository.js";
export default class DashbordController {
  clientRepository = new ClientRepository();
  articleRepository = new ArticleRepository();
  async load() {
    const mainContainer = document.getElementById("moi");
    const clients = await this.clientRepository.GetDatas(
      "http://127.0.0.1:8000/api/clients"
    );
    const articles = await this.articleRepository.GetDatas(
      "http://127.0.0.1:8000/api/articles"
    );
    if (mainContainer) {
      fetch("./HTML/Dashbord.html") // Charge le fichier HTML
        .then((response) => response.text())
        .then((html) => {
          mainContainer.innerHTML = html;
          const tbody = document.getElementById("trut");
          const tbody2 = document.getElementById("trut2");
          this.fillTable(tbody, tbody2, clients, articles);
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du dashboard:", error);
        });
    } else {
      console.error('Élément avec l\'ID "moi" introuvable dans le DOM.');
    }
  }

  async fillTable(tbody, tbody2, clients, articles) {
    const itemsPerPage = 2; // Nombre de clients par page
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
      const currentArticles = articles.slice(startIndex, endIndex);
      // Vider le tableau
      tbody.innerHTML = "";
      tbody2.innerHTML = "";

      // Ajouter les lignes pour les clients de la page
      currentClients.forEach((client) => {
        const row = document.createElement("tr");
        row.classList.add("border-t");

        row.innerHTML = `
        <td class="px-6 py-4">${client.nom}</td>
        <td class="px-6 py-4">${client.prenom}</td>
        <td class="px-6 py-4">${client.tel}</td>
        <td class="px-6 py-4">${client.montantDue}</td>
      `;
        tbody.appendChild(row);
      });

      currentArticles.forEach((article) => {
        const row2 = document.createElement("tr");
        row2.classList.add("border-t");

        row2.innerHTML = `
        <td class="px-6 py-4">${article.libelle}</td>
        <td class="px-6 py-4">${article.qteStock}</td>
        <td class="px-6 py-4">${article.prix}</td>
      `;
        tbody2.appendChild(row2);
      });
    };

    // Fonction pour générer les boutons de pagination
    const renderPagination = () => {
      const paginationContainer = document.getElementById("pagination");
      const paginationContainer2 = document.getElementById("pagination2");
      if (!paginationContainer) {
        console.error('Élément avec l\'ID "pagination" introuvable.');
        return;
      }
      if (!paginationContainer2) {
        console.error('Élément avec l\'ID "pagination" introuvable.');
        return;
      }

      // Vider les boutons existants
      paginationContainer.innerHTML = "";
      paginationContainer2.innerHTML = "";

      // Calculer le nombre total de pages
      const totalPages = Math.ceil(clients.length / itemsPerPage);
      const totalPages2 = Math.ceil(articles.length / itemsPerPage);
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

      for (let i = 1; i <= totalPages2; i++) {
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
        paginationContainer2.appendChild(pageButton);
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
}
