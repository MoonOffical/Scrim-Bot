const Discord = require('discord.js');
const db = require('croxydb')
const { google } = require('googleapis');
const { SAMPLE_ID, SERVİCES_FİLES, SCOP, sahip } = require('../ayarlar.json')

exports.run = async (client, message, args) => {
    if (message.author.id === sahip) {
        message.channel.send({ content: `Kurulum yapılıyor...` }).then(async (e) => {
            let yetkilirol = await message.guild.roles.create({
                name: `Bot Kullanım`,
                reason: "Scrim Bot"
            })
            let a = await message.guild.channels.create({
                name: `Scrim Bot`,
                type: Discord.ChannelType.GuildCategory,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [Discord.PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: yetkilirol.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    }
                ]
            });

            let b = await message.guild.channels.create({
                parent: a.id,
                name: `slot-oluştur`,
                type: Discord.ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [Discord.PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: yetkilirol.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    }
                ]
            });

            let c = await message.guild.channels.create({
                parent: a.id,
                name: `komut-kullanım`,
                type: Discord.ChannelType.GuildText,
                permissionOverwrites: [
                    {
                        id: message.guild.roles.everyone.id,
                        deny: [Discord.PermissionFlagsBits.ViewChannel]
                    },
                    {
                        id: yetkilirol.id,
                        allow: [Discord.PermissionFlagsBits.ViewChannel, Discord.PermissionFlagsBits.SendMessages]
                    }
                ]
            })
            db.set(`${message.guild.id}_botkullanım`, yetkilirol.id)
            db.set(`${message.guild.id}_slotkanalid`, b.id)
            db.set(`${message.guild.id}_komutkullanımkanal`, c.id)
            e.edit({ content: `Kurulum tamamlandı!` })
        })
    }
}

exports.conf = {
    aliases: [],
    kategori: "ResultSlot"
};

exports.help = {
    name: 'kurulum',
    description: 'Sistemi kurar.',
};
