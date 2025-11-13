# Guide de Déploiement - Bot Discord Fortnite

## Option 1 : Railway (RECOMMANDÉ - Gratuit)

Railway est la solution la plus simple et gratuite pour héberger votre bot 24/7.

### Étapes :

1. **Créer un compte Railway**
   - Allez sur https://railway.app
   - Connectez-vous avec GitHub

2. **Préparer le dépôt Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

   Puis poussez sur GitHub :
   - Créez un nouveau dépôt sur GitHub
   - Suivez les instructions pour pusher votre code

3. **Déployer sur Railway**
   - Cliquez sur "New Project" sur Railway
   - Sélectionnez "Deploy from GitHub repo"
   - Choisissez votre dépôt
   - Railway détectera automatiquement Node.js

4. **Configurer les variables d'environnement**
   - Dans votre projet Railway, allez dans "Variables"
   - Ajoutez :
     - `DISCORD_TOKEN` : votre token Discord
     - `FORTNITE_API_KEY` : votre clé API Fortnite

5. **Déploiement automatique**
   - Railway déploiera automatiquement votre bot
   - Il redémarrera automatiquement à chaque push sur GitHub

### Vérification
- Le bot devrait apparaître en ligne sur Discord
- Testez avec `!help` sur votre serveur

---

## Option 2 : Render (Gratuit avec limitations)

### Étapes :

1. **Créer un compte Render**
   - Allez sur https://render.com
   - Inscrivez-vous gratuitement

2. **Créer un nouveau Web Service**
   - Cliquez sur "New +" → "Background Worker"
   - Connectez votre dépôt GitHub
   - Configuration :
     - **Build Command** : `npm install`
     - **Start Command** : `npm start`

3. **Variables d'environnement**
   - Ajoutez `DISCORD_TOKEN` et `FORTNITE_API_KEY`

4. **Déployer**
   - Cliquez sur "Create Web Service"

**Note** : Le plan gratuit de Render peut mettre le bot en veille après inactivité.

---

## Option 3 : Fly.io (Gratuit pour petits projets)

### Étapes :

1. **Installer Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Se connecter**
   ```bash
   flyctl auth signup
   ```

3. **Lancer l'application**
   ```bash
   flyctl launch
   ```
   - Suivez les instructions
   - Choisissez une région proche de vous

4. **Définir les secrets**
   ```bash
   flyctl secrets set DISCORD_TOKEN="votre_token"
   flyctl secrets set FORTNITE_API_KEY="votre_clé"
   ```

5. **Déployer**
   ```bash
   flyctl deploy
   ```

---

## Option 4 : VPS (DigitalOcean, AWS, etc.)

Pour les utilisateurs avancés qui veulent un contrôle total.

### Prérequis :
- Un serveur VPS avec Ubuntu/Debian
- Accès SSH au serveur

### Étapes :

1. **Se connecter au serveur**
   ```bash
   ssh user@votre-serveur-ip
   ```

2. **Installer Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Installer PM2 (gestionnaire de processus)**
   ```bash
   sudo npm install -g pm2
   ```

4. **Cloner le projet**
   ```bash
   git clone votre-repo.git
   cd fortnite-discord-bot
   npm install
   ```

5. **Créer le fichier .env**
   ```bash
   nano .env
   ```
   Ajoutez vos variables

6. **Lancer avec PM2**
   ```bash
   pm2 start src/index.js --name fortnite-bot
   pm2 save
   pm2 startup
   ```

7. **Le bot redémarrera automatiquement**
   - PM2 le relancera en cas de crash
   - Il démarrera automatiquement au redémarrage du serveur

---

## Vérification du déploiement

Une fois déployé, vérifiez que :
1. Le bot apparaît en ligne sur Discord
2. Les commandes fonctionnent : `!help`, `!shop`, `!news`
3. Les logs ne montrent pas d'erreurs

## Mise à jour du bot

### Avec Railway/Render :
- Poussez simplement vos changements sur GitHub
- Le déploiement est automatique

### Avec VPS :
```bash
ssh user@votre-serveur
cd fortnite-discord-bot
git pull
pm2 restart fortnite-bot
```

## Support

En cas de problème :
1. Vérifiez les logs de votre plateforme d'hébergement
2. Assurez-vous que les variables d'environnement sont correctes
3. Vérifiez que le bot Discord a les bonnes permissions et intents
