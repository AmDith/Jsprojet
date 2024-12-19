export default class HeaderController {
  load() {
    const mainContainer = document.getElementById("header");
    if (mainContainer) {
      fetch("./HTML/Header.html")
        .then((response) => response.text())
        .then((html) => {
          mainContainer.innerHTML = html;
          this.initPopovers();
        })
        .catch((error) => {
          console.error("Erreur lors du chargement du header :", error);
        });
    } else {
      console.error('Élément avec l\'ID "main" introuvable dans le DOM.');
    }
  }

  initPopovers() {
    const popoverTriggers = document.querySelectorAll(
      '[data-popover-trigger="click"]'
    );

    // Gestion de l'affichage du popover lorsqu'on clique sur l'avatar
    popoverTriggers.forEach((trigger) => {
      const targetPopoverId = trigger.getAttribute("data-popover-target");
      if (targetPopoverId != null) {
        const popover = document.getElementById(targetPopoverId);
        if (popover) {
          trigger.addEventListener("click", () => {
            // Vérification si le popover existe
            const isVisible = !popover.classList.contains("visible");
            if (isVisible) {
              popover.classList.add("visible");
              popover.style.visibility = "visible";
              popover.style.opacity = "1"; // pour afficher
            } else {
              popover.classList.remove("visible");
              popover.style.visibility = "hidden";
              popover.style.opacity = "0"; // pour masquer
              // Masquer le popover lorsque l'utilisateur clique ailleurs
              document.addEventListener("click", (event) => {
                // Vérifier si event.target est un HTMLElement avant d'utiliser contains
                const target = event.target;

                if (
                  popover &&
                  target instanceof HTMLElement &&
                  !trigger.contains(target) &&
                  !popover.contains(target)
                ) {
                  popover.classList.remove("visible");
                  popover.style.visibility = "hidden";
                  popover.style.opacity = "0";
                }
              });
            }
          });
        }
      }
    });
  }
}
