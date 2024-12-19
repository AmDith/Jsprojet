export default class Repository {
  async GetDatas(api) {
    try {
      const apiUrl = api;
      const response = await fetch(apiUrl);
      const datas = await response.json();
      return datas;
    } catch (error) {
      console.error("Erreur lors de la récupération des datas:", error);
    }
  }
}
