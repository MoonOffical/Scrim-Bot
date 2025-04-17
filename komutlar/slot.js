const Discord = require('discord.js');
const fs = require('fs');
const db = require('croxydb')
const { google } = require('googleapis');
const { SAMPLE_ID, SERVİCES_FİLES, SCOP, slote, sX, sY, slot, font } = require('../ayarlar.json')
const { createCanvas, loadImage, registerFont, getContext } = require('canvas')
const SCOPES = SCOP;
const SERVICE_ACCOUNT_FILE = SERVİCES_FİLES;
const SPREADSHEET_ID = SAMPLE_ID;

const auth = new google.auth.GoogleAuth({
    keyFile: SERVICE_ACCOUNT_FILE,
    scopes: SCOPES,
});

exports.run = async (client, message, args) => {
    let botkullanım = db.get(`${message.guild.id}_botkullanım`)
    if (message.channel.id === db.get(`${message.guild.id}_komutkullanımkanal`)) {
        if (message.member.roles.cache.has(botkullanım)) {
            var data = await Data()
            const canvas = createCanvas(1920, 1080)
            const ctx = canvas.getContext('2d')

            loadImage(slot).then((image) => {

                ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
                registerFont(font, { family: 'Impact' })
                ctx.fillStyle = '#ffffff';
                ctx.font = '30px Impact';

                for (let i = 0; i < data.length; i++) {
                    if (data[i] && data[i][0]) {
                        let takımlar = turkkelimeler(data[i][0])
                        ctx.fillText(takımlar, sX[i], sY[i]);
                    }
                }

                const attachment = new Discord.AttachmentBuilder(canvas.toBuffer(), { name: 'slot.png' });
                message.channel.send({ files: [attachment] });

            })
        } else {
            let botk = message.guild.roles.cache.get(botkullanım)
            return message.channel.send({ content: `Bu komutu kullanabilmek için \`${botk.name}\` rolüne ihtiyacın var.` })
        }
    }
}

exports.conf = {
    aliases: [],
    kategori: "ResultSlot"
};

exports.help = {
    name: 'slot',
    description: 'Slot hakkında bilgi verir.',
};

async function Data() {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });
    try {
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: slote,
        });
        return response.data.values || [];
    } catch (error) {
        return [];
    }
}

function turkkelimeler(team) {
    if (!team) return '';
    const turkkelimeler = {
        'ı': 'i',
        'İ': 'I',
        'ş': 's',
        'Ş': 'S',
        'ğ': 'g',
        'Ğ': 'G',
        'ü': 'u',
        'Ü': 'U',
        'ö': 'o',
        'Ö': 'O',
        'ç': 'c',
        'Ç': 'C',
    };
    return team.replace(/[ıİşŞğĞüÜöÖçÇ]/g, function (match) {
        return turkkelimeler[match];
    });
}
