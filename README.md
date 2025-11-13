# Bot Discord Fortnite

Un bot Discord en Node.js qui utilise l'API Fortnite (api-fortnite.com) pour afficher des statistiques de joueurs, la boutique du jour, et les dernières actualités.

## Fonctionnalités

- 📊 **Statistiques de joueur** : Consultez les stats d'un joueur Fortnite
- 🛒 **Boutique du jour** : Affichez les articles disponibles dans la boutique
- 📰 **News** : Restez informé des dernières actualités Fortnite
- ❓ **Aide** : Liste de toutes les commandes disponibles

## Prérequis

- Node.js 16.x ou supérieur
- Un token de bot Discord
- Une clé API de api-fortnite.com

## Installation

1. Clonez le dépôt ou téléchargez les fichiers

2. Installez les dépendances :
```bash
npm install
```

3. Configurez les variables d'environnement :
   - Copiez `.env.example` vers `.env`
   - Remplissez `DISCORD_TOKEN` avec votre token de bot Discord
   - Remplissez `FORTNITE_API_KEY` avec votre clé API Fortnite

## Configuration du Bot Discord

1. Allez sur le [Discord Developer Portal](https://discord.com/developers/applications)
2. Créez une nouvelle application
3. Dans la section "Bot", créez un bot et copiez le token
4. Activez les intentions suivantes :
   - `Guilds`
   - `Guild Messages`
   - `Message Content`
5. Invitez le bot sur votre serveur avec les permissions nécessaires

## Utilisation

### Démarrer le bot

Mode production :
```bash
npm start
```

Mode développement (avec auto-reload) :
```bash
npm run dev
```

### Commandes disponibles

- `!stats <pseudo> [plateforme]` : Affiche les statistiques d'un joueur
  - Exemple : `!stats Ninja pc`
  - Plateformes : `pc`, `psn`, `xbl`

- `!shop` : Affiche la boutique du jour

- `!news` : Affiche les dernières actualités Fortnite

- `!help` : Affiche la liste des commandes

## Structure du projet

```
.
├── src/
│   ├── index.js              # Point d'entrée du bot
│   ├── services/
│   │   └── fortniteApi.js    # Service pour l'API Fortnite
│   └── commands/
│       ├── stats.js          # Commande statistiques
│       ├── shop.js           # Commande boutique
│       ├── news.js           # Commande actualités
│       └── help.js           # Commande aide
├── .env                      # Variables d'environnement
├── .env.example             # Exemple de configuration
├── package.json             # Dépendances du projet
└── README.md               # Ce fichier
```

## API Fortnite

Ce bot utilise l'API de [api-fortnite.com](https://api-fortnite.com/). Consultez leur documentation pour plus d'informations sur les endpoints disponibles.

## Dépannage

- **Le bot ne se connecte pas** : Vérifiez que votre `DISCORD_TOKEN` est correct
- **Les commandes ne fonctionnent pas** : Assurez-vous que l'intention `Message Content` est activée dans le portail Discord
- **Erreurs API** : Vérifiez que votre `FORTNITE_API_KEY` est valide et que vous n'avez pas dépassé les limites de requêtes

## Licence

ISC
