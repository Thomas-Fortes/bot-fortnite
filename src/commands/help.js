const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Affiche la liste des commandes disponibles',
  usage: '!help',

  async execute(message, args, fortniteAPI) {
    const embed = new EmbedBuilder()
      .setColor('#7289DA')
      .setTitle('🤖 Aide - Bot Fortnite')
      .setDescription('Voici les commandes disponibles')
      .addFields(
        { name: '✅ !shop', value: 'Affiche la boutique du jour Fortnite', inline: false },
        { name: '❌ !stats <pseudo>', value: '~~Affiche les statistiques~~ (Non disponible avec plan Free)', inline: false },
        { name: '❌ !news', value: '~~Affiche les actualités~~ (Non disponible avec plan Free)', inline: false },
        { name: '❓ !help', value: 'Affiche ce message d\'aide', inline: false }
      )
      .setFooter({ text: 'Bot Fortnite - Plan Free | Powered by api-fortnite.com' })
      .setTimestamp();

    await message.reply({ embeds: [embed] });
  }
};
