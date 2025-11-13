require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const FortniteAPI = require('./services/fortniteApi');
const fs = require('fs');
const path = require('path');

// Initialisation du client Discord
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// Initialisation de l'API Fortnite
const fortniteAPI = new FortniteAPI(process.env.FORTNITE_API_KEY);

// Collection pour stocker les commandes
client.commands = new Collection();

// Chargement des commandes
const commandsPath = path.join(__dirname, 'commands');
if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ('name' in command && 'execute' in command) {
      client.commands.set(command.name, command);
      console.log(`✅ Commande chargée: ${command.name}`);
    }
  }
}

// Event: Bot prêt
client.once('ready', () => {
  console.log(`✅ Bot connecté en tant que ${client.user.tag}`);
  console.log(`📊 Serveurs: ${client.guilds.cache.size}`);
  client.user.setActivity('Fortnite', { type: 'PLAYING' });
});

// Event: Nouveau message
client.on('messageCreate', async (message) => {
  // Ignorer les messages des bots
  if (message.author.bot) return;

  // Préfixe des commandes
  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  // Parser la commande et les arguments
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  // Vérifier si la commande existe
  const command = client.commands.get(commandName);
  if (!command) return;

  // Exécuter la commande
  try {
    await command.execute(message, args, fortniteAPI);
  } catch (error) {
    console.error(`Erreur lors de l'exécution de ${commandName}:`, error);
    await message.reply('❌ Une erreur est survenue lors de l\'exécution de cette commande.');
  }
});

// Gestion des erreurs
client.on('error', error => {
  console.error('Erreur Discord:', error);
});

process.on('unhandledRejection', error => {
  console.error('Erreur non gérée:', error);
});

// Connexion du bot
if (!process.env.DISCORD_TOKEN) {
  console.error('❌ DISCORD_TOKEN manquant dans le fichier .env');
  process.exit(1);
}

if (!process.env.FORTNITE_API_KEY) {
  console.error('❌ FORTNITE_API_KEY manquant dans le fichier .env');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
