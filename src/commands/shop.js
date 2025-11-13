const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'shop',
  description: 'Affiche la boutique Fortnite du jour',
  usage: '!shop',

  async execute(message, args, fortniteAPI) {
    try {
      const loadingMsg = await message.reply('⏳ Récupération de la boutique...');

      const shop = await fortniteAPI.getShop();

      if (!shop || shop.error) {
        return loadingMsg.edit('❌ Impossible de récupérer la boutique.');
      }

      // Vérifier que la structure de la réponse est valide
      if (!shop.storefronts || !Array.isArray(shop.storefronts)) {
        return loadingMsg.edit('❌ Format de boutique invalide.');
      }

      // Extraire tous les items de tous les storefronts
      const allItems = [];

      shop.storefronts.forEach(storefront => {
        if (storefront.catalogEntries && Array.isArray(storefront.catalogEntries)) {
          storefront.catalogEntries.forEach(entry => {
            if (entry.itemGrants && entry.itemGrants.length > 0) {
              const mainItem = entry.itemGrants[0];
              if (mainItem.cosmetic) {
                const itemName = mainItem.cosmetic.displayName || mainItem.cosmetic.name || 'Unknown';

                // Filtrer les items avec des noms génériques ou placeholder
                const isPlaceholder = itemName.toLowerCase().includes('placeholder') ||
                                      itemName.toLowerCase().includes('sid ') ||
                                      itemName.toLowerCase().match(/^(id |wheel |wrap )/);

                // Ne garder que les items valides avec des vrais noms
                if (!isPlaceholder && itemName !== 'Unknown') {
                  // Priorité : largeIcon > icon
                  const itemIcon = mainItem.cosmetic.images?.largeIcon ||
                                   mainItem.cosmetic.images?.icon ||
                                   null;

                  allItems.push({
                    name: itemName,
                    type: mainItem.cosmetic.shortDescription || mainItem.cosmetic.type || 'Item',
                    rarity: mainItem.cosmetic.rarity || 'common',
                    price: entry.prices?.[0]?.finalPrice || 0,
                    section: entry.sectionDisplayName || 'Shop',
                    icon: itemIcon
                  });
                }
              }
            }
          });
        }
      });

      if (allItems.length === 0) {
        return loadingMsg.edit('❌ Aucun article disponible dans la boutique.');
      }

      // Fonction pour obtenir la couleur selon la rareté
      const getRarityColor = (rarity) => {
        const colors = {
          common: '#b0b0b0',
          uncommon: '#5ebc5e',
          rare: '#4a9eff',
          epic: '#b441ff',
          legendary: '#ffbf00',
          mythic: '#ff4444'
        };
        return colors[rarity.toLowerCase()] || '#7289DA';
      };

      // Fonction pour obtenir l'emoji selon la rareté
      const getRarityEmoji = (rarity) => {
        return {
          common: '⚪',
          uncommon: '🟢',
          rare: '🔵',
          epic: '🟣',
          legendary: '🟡',
          mythic: '🔴'
        }[rarity.toLowerCase()] || '⚪';
      };

      // Créer un embed principal avec résumé
      const mainEmbed = new EmbedBuilder()
        .setColor('#7289DA')
        .setTitle('🛒 Boutique Fortnite')
        .setDescription(`**${allItems.length}** articles disponibles aujourd'hui\nExpiration: <t:${Math.floor(new Date(shop.expiration).getTime() / 1000)}:R>`)
        .setTimestamp()
        .setFooter({ text: 'Fortnite Shop' });

      const embeds = [mainEmbed];

      // Filtrer et trier les items par rareté
      const rarityOrder = { mythic: 6, legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
      const sortedItems = allItems
        .sort((a, b) => (rarityOrder[b.rarity.toLowerCase()] || 0) - (rarityOrder[a.rarity.toLowerCase()] || 0));

      // Séparer items avec et sans images
      const itemsWithImages = sortedItems.filter(item => item.icon);
      const itemsWithoutImages = sortedItems.filter(item => !item.icon);

      // Créer un embed pour chaque item avec image (limite Discord: 10 embeds max)
      // On prend les 9 premiers items les plus rares avec images (+ 1 embed principal = 10 total)
      const featuredItems = itemsWithImages.slice(0, 9);

      featuredItems.forEach(item => {
        const itemEmbed = new EmbedBuilder()
          .setColor(getRarityColor(item.rarity))
          .setTitle(`${getRarityEmoji(item.rarity)} ${item.name}`)
          .setDescription(`**${item.type}**\n💰 **${item.price}** V-Bucks`)
          .setImage(item.icon)
          .setFooter({ text: item.section });

        embeds.push(itemEmbed);
      });

      // Ajouter les items restants dans le résumé du premier embed
      const remainingItems = [...itemsWithImages.slice(9), ...itemsWithoutImages];

      if (remainingItems.length > 0) {
        // Limiter à 15 items dans le résumé pour ne pas dépasser la limite de caractères Discord
        const summaryItems = remainingItems.slice(0, 15);
        const summaryText = summaryItems
          .map(item => `${getRarityEmoji(item.rarity)} **${item.name}** - ${item.price} V-Bucks`)
          .join('\n');

        const moreCount = remainingItems.length > 15 ? ` (+${remainingItems.length - 15} autres)` : '';

        if (summaryText) {
          mainEmbed.addFields({
            name: `📋 Autres articles (${remainingItems.length})${moreCount}`,
            value: summaryText,
            inline: false
          });
        }
      }

      await loadingMsg.edit({ content: null, embeds });
    } catch (error) {
      console.error('Erreur shop:', error);
      try {
        await loadingMsg.edit(`❌ ${error.message}`);
      } catch (editError) {
        return message.reply(`❌ ${error.message}`);
      }
    }
  }
};
