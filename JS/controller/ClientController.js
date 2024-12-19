import ClientRepository from "../model/ClientRepository.js";
import Controller from "../Core/Controller.js";
export default class ClientController {
  clientRepository = new ClientRepository();
  controller = new Controller();
  async load() {
    console.log("Chargement du contrôleur...");
    const mainContainer = document.getElementById("moi");
    const clients = await this.clientRepository.GetDatas(
      "http://127.0.0.1:8000/api/clients"
    );
    if (mainContainer) {
      fetch("./HTML/ClientIndex.html")
        .then((response) => response.text())
        .then((html) => {
          mainContainer.innerHTML = html;
          const tbody = document.getElementById("trut");
          const form = document.getElementById("formClient");
          const boutonOk = document.getElementById("searchPhoneButton");
          console.log(tbody);
          console.log(
            this.clientRepository.GetDatas("http://127.0.0.1:8000/api/clients")
          );
          this.controller.initializeModal("nouveauClientButton", "clientModal");
          this.fillTable(tbody, clients);
          if (boutonOk != null) {
            boutonOk.addEventListener("click", () => {
              this.searchClientsByPhone(tbody, clients);
            });
          }
          this.toggleAccountFields();
          // Ajoute un listener pour la soumission du formulaire
          if (form) {
            form.addEventListener("submit", (event) => {
              event.preventDefault(); // Empêche le rechargement de la page
              this.controller.submitForm(
                form,
                "http://127.0.0.1:8000/api/clientspost"
              ); // Envoie les données au back-end
            });
          }
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du clientIndex:", error);
        });
    } else {
      console.error('Élément avec l\'ID "main" introuvable dans le DOM.');
    }
  }

  // async submitForm(form) {
  //   const formData = new FormData(form); // Récupère les données du formulaire
  //   const jsonData = Object.fromEntries(formData.entries()); // Convertit en JSON

  //   try {
  //     const response = await fetch("http://127.0.0.1:8000/api/clientspost", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(jsonData), // Envoie les données en JSON
  //     });
  //     const response2 = await response.json();

  //     if (!response.ok) {
  //       const errorData = response2;
  //       console.error("Erreur lors de la soumission :", errorData);
  //       alert("Une erreur est survenue : " + errorData.message);
  //       return;
  //     }

  //     const result = response2;
  //     console.log("Formulaire soumis avec succès :", result);
  //     alert("Client créé avec succès !");
  //   } catch (error) {
  //     console.error("Erreur lors de la requête :", error);
  //     alert("Erreur réseau ou problème de communication avec le serveur.");
  //   }
  // }

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
      currentClients.forEach((client) => {
        const row = document.createElement("tr");
        row.classList.add("border-t");

        row.innerHTML = `
          <td class="px-6 py-4">${client.prenom} ${client.nom}</td>
          <td class="px-6 py-4">${client.tel}</td>
          <td class="px-6 py-4">${client.adresse}</td>
          <td class="px-6 py-4">${client.montantDue}</td>
          <td class="px-6 py-4">
            <a href="../Boutiquier/listDettesClient.html">
              <button class="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600">
                Détails
              </button>
            </a>
          </td>
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
  //   const openModalButton = document.getElementById("nouveauClientButton");
  //   const modal = document.getElementById("clientModal");

  //   if (openModalButton && modal) {
  //     const closeModalButton = modal.querySelector(
  //       '[data-modal-hide="clientModal"]'
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

  async searchClientsByPhone(tbody, clients) {
    const input = document.getElementById("searchPhoneInput");
    if (input instanceof HTMLInputElement) {
      const searchValue = input.value.trim();
      const filteredClients = clients.filter((client) =>
        client.tel.includes(searchValue)
      );
      this.fillTable(tbody, filteredClients);
    }
  }

  toggleAccountFields() {
    const checkbox = document.getElementById("creerCompte");
    const accountFields = document.getElementById("accountFields");
    if (checkbox != null && accountFields != null) {
      if (checkbox.checkVisibility()) {
        accountFields.classList.remove("hidden");
      } else {
        accountFields.classList.add("hidden");
      }
    }
  }
}
