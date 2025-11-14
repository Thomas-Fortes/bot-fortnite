# 🚀 Guide de Déploiement sur Fly.io

## ✅ Problème Résolu

Le bot Discord refusait les connexions avec l'erreur :
```
instance refused connection. is your app listening on 0.0.0.0:3000?
```

**Cause** : Le bot Discord n'avait pas de serveur HTTP pour les health checks de Fly.io.

**Solution** : Ajout d'un serveur HTTP écoutant sur `0.0.0.0:3000` avec un endpoint `/health`.

---

## 📋 Prérequis

1. **Installer Fly.io CLI** (si pas déjà fait) :
   ```bash
   brew install flyctl
   ```

2. **Se connecter à Fly.io** :
   ```bash
   flyctl auth login
   ```

---

## 🔐 Configuration des Secrets

Les variables d'environnement du fichier `.env` ne sont **pas automatiquement transférées** sur Fly.io. Vous devez les configurer comme secrets :

```bash
flyctl secrets set \
  DISCORD_TOKEN="votre_token_discord" \
  FORTNITE_API_KEY="votre_cle_api_fortnite"
```

### Vérifier les secrets configurés :
```bash
flyctl secrets list
```

---

## 🚢 Déploiement

### 1. Premier déploiement (si pas déjà fait)
```bash
flyctl launch
```

### 2. Déploiements suivants
```bash
flyctl deploy
```

### 3. Redémarrer l'application
```bash
flyctl apps restart
```

---

## 🩺 Surveillance et Debug

### Voir les logs en temps réel
```bash
flyctl logs
```

### Vérifier le statut de l'application
```bash
flyctl status
```

### Tester le health check
```bash
curl https://bot-fortnite.fly.dev/health
```

Réponse attendue :
```json
{
  "status": "ok",
  "uptime": 123.456,
  "timestamp": "2024-01-01T12:00:00.000Z",
  "bot": {
    "ready": true,
    "user": "Fortnite bot#1234",
    "guilds": 1,
    "ping": 45
  }
}
```

---

## 🔧 Configuration Fly.io

Le fichier `fly.toml` contient la configuration :

- **Port** : 3000 (sur 0.0.0.0)
- **Health check** : `/health` toutes les 30 secondes
- **Région** : `iad` (Ashburn, USA)
- **Mémoire** : 256MB
- **Auto-start** : Oui
- **Auto-stop** : Non (pour garder le bot en ligne 24/7)

---

## 📝 Commandes Discord Disponibles

- `!shop` - Affiche la boutique Fortnite du jour
- `!stats <username>` - Affiche les statistiques d'un joueur
- `!news` - Affiche les actualités Fortnite
- `!help` - Affiche l'aide

---

## ⚠️ Résolution de Problèmes

### Erreur : "instance refused connection"
✅ **Résolu** - Le serveur HTTP écoute maintenant sur `0.0.0.0:3000`

### Erreur : "Impossible de contacter l'API"
👉 Vérifiez que les secrets sont configurés :
```bash
flyctl secrets list
```
Si manquants, ajoutez-les avec `flyctl secrets set`

### Le bot ne répond pas aux commandes
1. Vérifiez les logs : `flyctl logs`
2. Vérifiez le statut : `flyctl status`
3. Testez le health check : `curl https://bot-fortnite.fly.dev/health`

### Redémarrer le bot
```bash
flyctl apps restart
```

---

## 📚 Ressources

- [Documentation Fly.io](https://fly.io/docs/)
- [Discord.js Documentation](https://discord.js.org/)
- [API Fortnite Documentation](https://documentation.api-fortnite.com/)

---

## 🎯 Checklist de Déploiement

- [x] Serveur HTTP ajouté sur 0.0.0.0:3000
- [x] Health check endpoint `/health` créé
- [x] Fichier `fly.toml` configuré
- [x] `.dockerignore` créé
- [ ] Secrets configurés sur Fly.io
- [ ] Application déployée
- [ ] Bot testé sur Discord

---

**URL de l'application** : https://bot-fortnite.fly.dev/
