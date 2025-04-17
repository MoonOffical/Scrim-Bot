const { Client, GatewayIntentBits, Partials, ButtonBuilder, ButtonComponent, ButtonStyle, ActionRowBuilder, PermissionsFlags, ModalBuilder, TextInputBuilder, TextInputStyle, Collection, AttachmentBuilder } = require("discord.js");
const fs = require("fs")
const ayarlar = require("./ayarlar.json");
const db = require("croxydb")
const Discord = require("discord.js")
const { google } = require('googleapis');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { SAMPLE_ID, SERVİCES_FİLES, SCOP, slote, sX, sY } = require('./ayarlar.json');
const prefix = ayarlar.prefix;
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.User,
        Partials.ThreadMember,
    ],
});

module.exports = client;

const { EmbedBuilder } = require("@discordjs/builders");
const { error } = require("console");

client.login(ayarlar.token)


client.on("messageCreate", async (message) => {
    if (!message.guild) return;
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    let command = message.content.toLocaleLowerCase().split(" ")[0].slice(prefix.length);
    let params = message.content.split(" ").slice(1);
    let cmd;
    if (client.commands.has(command)) {
        cmd = client.commands.get(command);
    } else if (client.aliases.has(command)) {
        cmd = client.commands.get(client.aliases.get(command));
    }
    if (cmd) {
        if (message.guild.id === ayarlar.sunucuid) {
            cmd.run(client, message, params);
        } else {
            return;
        }
    }

});

client.commands = new Collection();
client.aliases = new Collection();

client.on('ready', () => {

    client.user.setPresence({ activities: [{ name: 'Code World' }] });


    console.log('_________________________________________');
    console.log(`Bot Adı     : ${client.user.username}`);
    console.log(`Prefix      : ${ayarlar.prefix}`);
    console.log(`Durum       : Bot Çevrimiçi!`);
    console.log('_________________________________________');
});

fs.readdir("./komutlar", (err, files) => {
    if (err) console.error(err);
    files.forEach(f => {
        let props = require(`./komutlar/${f}`);
        client.commands.set(props.help.name, props);
        props.conf.aliases.forEach(alias => {
            client.aliases.set(alias, props.help.name);
        });
    });

})

////////////////////////////////////////// EKLENDİM /////////////////////////////////////
const SCOPES = SCOP;
const SERVICE_ACCOUNT_FILE = SERVİCES_FİLES;
const SPREADSHEET_ID = SAMPLE_ID;

const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES,
});

async function Data() {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    try {
        const response = sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: slote,
        });
        return response.data.values || [];
    } catch (error) {
        return [];
    }
}


const maxTeams = 25;
const rangeStartRow = 3;
const rangeEndRow = rangeStartRow + maxTeams - 1;
const range = `Scrim!B${rangeStartRow}:B${rangeEndRow}`;

async function updateData(data) {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    try {
        sheets.spreadsheets.values.update({
            spreadsheetId: SPREADSHEET_ID,
            range: range,
            valueInputOption: 'RAW',
            resource: {
                values: data.slice(0, maxTeams),
            },
        });
        return true;
    } catch (error) {
        return false;
    }
}

client.on("messageCreate", async (message) => {
    if (message.channel.id === db.get(`${message.guild.id}_slotkanalid`)) {

        const teams = message.content.split('\n').map(t => t.trim().toUpperCase()).filter(t => t.length > 0)

        if (teams.length < 1 || teams.length > maxTeams) {
            await message.react('❌');
            return;
        }

        const data = await Data();
        if (!data || !Array.isArray(data)) {
            await message.react('❌');
            return;
        }

        const newData = data.slice(0, rangeStartRow - 3).concat(teams.map((team) => [team]))

        const success = await updateData(newData);

        if (success) {
            await message.react('✅');
        } else {
            await message.react('❌');
        }
    }
});