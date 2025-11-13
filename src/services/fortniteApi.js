const axios = require('axios');

class FortniteAPI {
  constructor(apiKey, authMethod = 'x-api-key') {
    this.apiKey = apiKey;
    this.baseURL = 'https://prod.api-fortnite.com'; // ✅ CORRECT URL avec prod.
    this.authMethod = authMethod; // Options: 'x-api-key' (par défaut), 'bearer', 'direct'
  }

  /**
   * Génère les headers d'authentification selon la méthode configurée
   * @returns {Object} Headers d'authentification
   */
  getAuthHeaders() {
    switch (this.authMethod) {
      case 'bearer':
        return { 'Authorization': `Bearer ${this.apiKey}` };
      case 'direct':
        return { 'Authorization': this.apiKey };
      case 'x-api-key':
      default:
        return { 'x-api-key': this.apiKey }; // ✅ Méthode par défaut qui fonctionne !
    }
  }

  /**
   * Gestion centralisée des erreurs API
   * @param {Error} error - Erreur axios
   * @param {string} context - Contexte de l'erreur
   */
  handleError(error, context) {
    if (error.response) {
      const { status, data } = error.response;
      const message = data?.error || data?.message || 'Erreur inconnue';

      switch (status) {
        case 401:
        case 403:
          throw new Error(`${context}: Authentification échouée. Vérifiez votre clé API (Status: ${status})`);
        case 404:
          throw new Error(`${context}: Endpoint non trouvé (404). L'API a peut-être changé. Consultez https://documentation.api-fortnite.com`);
        case 429:
          throw new Error(`${context}: Limite de requêtes atteinte. Réessayez plus tard.`);
        case 500:
        case 502:
        case 503:
          throw new Error(`${context}: Serveur indisponible (${status}). Vérifiez https://api-fortnite.com/status`);
        default:
          throw new Error(`${context}: ${message} (Status: ${status})`);
      }
    } else if (error.request) {
      throw new Error(`${context}: Impossible de contacter l'API. Vérifiez votre connexion.`);
    } else {
      throw new Error(`${context}: ${error.message}`);
    }
  }

  /**
   * Récupère les statistiques d'un joueur
   * @param {string} username - Nom d'utilisateur Epic Games
   * @param {string} accountId - Account ID Epic Games (optionnel si username fourni)
   * @returns {Promise<Object>} Statistiques du joueur
   */
  async getPlayerStats(username, accountId = null) {
    try {
      // NOUVEAU ENDPOINT: /api/v1/profile/stats
      // Nécessite soit accountId, soit displayName (pas "name")
      const params = {};
      if (accountId) {
        params.accountId = accountId;
      } else if (username) {
        params.displayName = username; // ✅ Utilise displayName au lieu de name
      }

      const response = await axios.get(`${this.baseURL}/api/v1/profile/stats`, {
        headers: this.getAuthHeaders(),
        params: params,
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Récupération des stats');
    }
  }

  /**
   * Récupère la boutique du jour
   * @returns {Promise<Object>} Boutique actuelle
   */
  async getShop() {
    try {
      // NOUVEAU ENDPOINT: /api/v1/shop
      const response = await axios.get(`${this.baseURL}/api/v1/shop`, {
        headers: this.getAuthHeaders(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Récupération de la boutique');
    }
  }

  /**
   * Récupère les assets et métadonnées des bundles de la boutique
   * @returns {Promise<Object>} Bundles avec images et métadonnées
   */
  async getShopBundles() {
    try {
      // ENDPOINT: /api/v1/assets/bundles/shop
      const response = await axios.get(`${this.baseURL}/api/v1/assets/bundles/shop`, {
        headers: this.getAuthHeaders(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Récupération des bundles de la boutique');
    }
  }

  /**
   * Récupère les informations de la saison actuelle
   * @returns {Promise<Object>} Informations de la saison
   */
  async getCurrentSeason() {
    try {
      // NOUVEAU ENDPOINT: /api/v1/season
      const response = await axios.get(`${this.baseURL}/api/v1/season`, {
        headers: this.getAuthHeaders(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Récupération de la saison actuelle');
    }
  }

  /**
   * Récupère les événements actuels
   * @returns {Promise<Object>} Événements actuels
   */
  async getCurrentEvents() {
    try {
      // NOUVEAU ENDPOINT: /api/v1/events/data/current
      const response = await axios.get(`${this.baseURL}/api/v1/events/data/current`, {
        headers: this.getAuthHeaders(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Récupération des événements actuels');
    }
  }

  /**
   * Récupère les informations d'un compte par ID
   * @param {string} accountId - ID du compte Epic Games
   * @returns {Promise<Object>} Informations du compte
   */
  async getAccountById(accountId) {
    try {
      // NOUVEAU ENDPOINT: /api/v1/account/{accountId}
      const response = await axios.get(`${this.baseURL}/api/v1/account/${accountId}`, {
        headers: this.getAuthHeaders(),
        timeout: 10000
      });
      return response.data;
    } catch (error) {
      this.handleError(error, 'Récupération du compte');
    }
  }

  /**
   * DEPRECATED: L'endpoint news n'existe plus dans la nouvelle API
   * Utilisez getCurrentEvents() à la place
   */
  async getNews(language = 'fr') {
    throw new Error('DEPRECATED: L\'endpoint news n\'existe plus. Utilisez getCurrentEvents() à la place.');
  }

  /**
   * DEPRECATED: L'endpoint challenges n'existe plus dans la nouvelle API
   * Les défis font maintenant partie des événements
   */
  async getChallenges(season = 'current', language = 'fr') {
    throw new Error('DEPRECATED: L\'endpoint challenges n\'existe plus. Utilisez getCurrentEvents() à la place.');
  }
}

module.exports = FortniteAPI;
