const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'stats',
  description: 'Affiche les statistiques d\'un joueur Fortnite',
  usage: '!stats <pseudo>',

  async execute(message, args, fortniteAPI) {
    if (args.length === 0) {
      return message.reply('❌ Veuillez fournir un pseudo. Exemple: `!stats thm.frts`');
    }

    const username = args[0];

    try {
      const loadingMsg = await message.reply('⏳ Récupération des statistiques...');

      const data = await fortniteAPI.getPlayerStats(username);

      if (!data || !data.stats) {
        return loadingMsg.edit(`❌ Joueur "${username}" introuvable ou aucune statistique disponible.`);
      }

      // Fonction pour agréger les stats de tous les inputs (keyboard, gamepad, touch)
      const aggregateStats = (statPattern) => {
        const keys = Object.keys(data.stats).filter(k => k.includes(statPattern));
        return keys.reduce((sum, key) => sum + (data.stats[key] || 0), 0);
      };

      // Calculer les stats pour chaque mode
      const soloWins = aggregateStats('placetop1_keyboardmouse_m0_playlist_defaultsolo') +
                       aggregateStats('placetop1_gamepad_m0_playlist_defaultsolo') +
                       aggregateStats('placetop1_touch_m0_playlist_defaultsolo');

      const soloKills = aggregateStats('kills_keyboardmouse_m0_playlist_defaultsolo') +
                        aggregateStats('kills_gamepad_m0_playlist_defaultsolo') +
                        aggregateStats('kills_touch_m0_playlist_defaultsolo');

      const soloMatches = aggregateStats('matchesplayed_keyboardmouse_m0_playlist_defaultsolo') +
                          aggregateStats('matchesplayed_gamepad_m0_playlist_defaultsolo') +
                          aggregateStats('matchesplayed_touch_m0_playlist_defaultsolo');

      const duoWins = aggregateStats('placetop1_keyboardmouse_m0_playlist_defaultduo') +
                      aggregateStats('placetop1_gamepad_m0_playlist_defaultduo') +
                      aggregateStats('placetop1_touch_m0_playlist_defaultduo');

      const duoKills = aggregateStats('kills_keyboardmouse_m0_playlist_defaultduo') +
                       aggregateStats('kills_gamepad_m0_playlist_defaultduo') +
                       aggregateStats('kills_touch_m0_playlist_defaultduo');

      const duoMatches = aggregateStats('matchesplayed_keyboardmouse_m0_playlist_defaultduo') +
                         aggregateStats('matchesplayed_gamepad_m0_playlist_defaultduo') +
                         aggregateStats('matchesplayed_touch_m0_playlist_defaultduo');

      const squadWins = aggregateStats('placetop1_keyboardmouse_m0_playlist_defaultsquad') +
                        aggregateStats('placetop1_gamepad_m0_playlist_defaultsquad') +
                        aggregateStats('placetop1_touch_m0_playlist_defaultsquad');

      const squadKills = aggregateStats('kills_keyboardmouse_m0_playlist_defaultsquad') +
                         aggregateStats('kills_gamepad_m0_playlist_defaultsquad') +
                         aggregateStats('kills_touch_m0_playlist_defaultsquad');

      const squadMatches = aggregateStats('matchesplayed_keyboardmouse_m0_playlist_defaultsquad') +
                           aggregateStats('matchesplayed_gamepad_m0_playlist_defaultsquad') +
                           aggregateStats('matchesplayed_touch_m0_playlist_defaultsquad');

      // Calculer les K/D ratios
      const soloKD = soloMatches > 0 ? (soloKills / Math.max(1, soloMatches - soloWins)).toFixed(2) : '0.00';
      const duoKD = duoMatches > 0 ? (duoKills / Math.max(1, duoMatches - duoWins)).toFixed(2) : '0.00';
      const squadKD = squadMatches > 0 ? (squadKills / Math.max(1, squadMatches - squadWins)).toFixed(2) : '0.00';

      // Créer l'embed avec les statistiques
      const embed = new EmbedBuilder()
        .setColor('#7289DA')
        .setTitle(`📊 Statistiques de ${username}`)
        .setDescription(`ID: \`${data.accountId}\``)
        .setTimestamp()
        .setFooter({ text: 'Fortnite Stats' });

      // Ajouter les stats par mode uniquement si > 0
      if (soloWins > 0 || soloKills > 0 || soloMatches > 0) {
        embed.addFields({
          name: '🎮 Mode Solo',
          value: `🏆 Victoires: **${soloWins}**\n⚔️ Kills: **${soloKills}**\n📈 K/D: **${soloKD}**\n🎯 Parties: **${soloMatches}**`,
          inline: true
        });
      }

      if (duoWins > 0 || duoKills > 0 || duoMatches > 0) {
        embed.addFields({
          name: '👥 Mode Duo',
          value: `🏆 Victoires: **${duoWins}**\n⚔️ Kills: **${duoKills}**\n📈 K/D: **${duoKD}**\n🎯 Parties: **${duoMatches}**`,
          inline: true
        });
      }

      if (squadWins > 0 || squadKills > 0 || squadMatches > 0) {
        embed.addFields({
          name: '🏆 Mode Squad',
          value: `🏆 Victoires: **${squadWins}**\n⚔️ Kills: **${squadKills}**\n📈 K/D: **${squadKD}**\n🎯 Parties: **${squadMatches}**`,
          inline: true
        });
      }

      // Si aucune stats trouvée
      if (soloWins === 0 && duoWins === 0 && squadWins === 0 &&
          soloKills === 0 && duoKills === 0 && squadKills === 0) {
        embed.setDescription(`${embed.data.description}\n\n⚠️ Aucune statistique Battle Royale trouvée pour ce joueur.`);
      }

      await loadingMsg.edit({ content: null, embeds: [embed] });
    } catch (error) {
      console.error('Erreur stats:', error);
      try {
        await loadingMsg.edit(`❌ ${error.message}`);
      } catch (editError) {
        return message.reply(`❌ ${error.message}`);
      }
    }
  }
};
