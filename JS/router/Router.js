import LayoutController from "../controller/LayoutController.js";
import ClientModalController from "../controller/ClientModalController.js";
import ArticleModalController from "../controller/ArticleModalController.js";
import CompteModalController from "../controller/CompteModalController.js";
import UserModalController from "../controller/UserModalController.js";
import HeaderController from "../controller/HeaderController.js";

class Router {
  constructor() {
    this.controllers = {
      dashbord: () => import("../controller/DashbordController.js"),
      client: () => import("../controller/ClientController.js"),
      article: () => import("../controller/ArticleController.js"),
      demande: () => import("../controller/DemandeController.js"),
      user: () => import("../controller/UserController.js"),
      dette: () => import("../controller/DetteController.js"),
    };
  }

  async run() {
    const params = new URLSearchParams(window.location.search);
    const controllerName = params.get("controller") || "dashbord";

    const layoutControllerInstance = new LayoutController();
    layoutControllerInstance.load();
    const headerControllerInstance = new HeaderController();
    headerControllerInstance.load();

    const loadController = this.controllers[controllerName];
    if (loadController) {
      try {
        const module = await loadController();
        const ControllerClass = module.default;
        const controllerInstance = new ControllerClass();
        controllerInstance.load();
      } catch (error) {
        console.error(
          `Erreur lors du chargement du contrôleur "${controllerName}":`,
          error
        );
      }
    } else {
      console.error(`Contrôleur "${controllerName}" non défini.`);
    }

    const clientmodalControllerInstance = new ClientModalController();
    clientmodalControllerInstance.load();
    const articlemodalControllerInstance = new ArticleModalController();
    articlemodalControllerInstance.load();
    const comptemodalControllerInstance = new CompteModalController();
    comptemodalControllerInstance.load();
    const useremodalControllerInstance = new UserModalController();
    useremodalControllerInstance.load();
  }
}

export default Router;
