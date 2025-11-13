const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'news',
  description: 'Affiche les dernières news Fortnite',
  usage: '!news',

  async execute(message, args, fortniteAPI) {
    try {
      // L'endpoint news n'existe plus dans la nouvelle API
      // Essayons d'utiliser les événements actuels à la place
      const loadingMsg = await message.reply('⏳ Récupération des actualités...');

      try {
        const events = await fortniteAPI.getCurrentEvents();

        const embed = new EmbedBuilder()
          .setColor('#7289DA')
          .setTitle('📰 Événements Fortnite actuels')
          .setDescription('Événements et actualités en cours')
          .setTimestamp()
          .setFooter({ text: 'Fortnite Events' });

        // Afficher les événements si disponibles
        if (events && typeof events === 'object') {
          const eventsText = JSON.stringify(events, null, 2).substring(0, 400);
          embed.addFields({
            name: 'Événements',
            value: eventsText || 'Aucun événement disponible',
            inline: false
          });
        }

        await loadingMsg.edit({ content: null, embeds: [embed] });
      } catch (eventsError) {
        // Si les événements ne sont pas accessibles non plus
        return loadingMsg.edit(
          '❌ Cette fonctionnalité n\'est pas disponible avec le plan Free.\n' +
          'Endpoints concernés : News et Events nécessitent un plan payant.'
        );
      }
    } catch (error) {
      console.error('Erreur news:', error);
      try {
        await loadingMsg.edit(`❌ ${error.message}`);
      } catch (editError) {
        return message.reply(`❌ ${error.message}`);
      }
    }
  }
};
