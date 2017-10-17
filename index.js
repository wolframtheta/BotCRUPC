var Telebot = require('telebot');
var lang = require('./lang/lang-default'); // Change this to change the language
var fs = require('fs');
var dict = lang.vortaro();

fs.writeFileSync("crupc.json", '{"stateCRUPC":"closed", "counterHolis":"0"}');
const bot = new Telebot("457148721:AAH59U4s3FEVqiE_V43koSUSG0QEVZVp_HI");

var file = fs.readFileSync("crupc.json");
var obj = JSON.parse(file);

bot.on('/start', (ctx) => {
  if (ctx.from.username == 'XvaiKawaii') {
    ctx.reply.text("Holi crupcero!");
  } else {
      ctx.reply.text(dict['5']);
  }
});

bot.on('/isopen', (ctx) => {
  var isopen = (obj.stateCRUPC == "open") ? true : false;
  if (isopen) bot.sendSticker(ctx.chat.id, 'CAADBAADRgADZhkVBXvnbcBrbN7EAg');
  else bot.sendSticker(ctx.chat.id, 'CAADBAADSAADZhkVBR-6hyRG6fjYAg');
});

bot.on('/countholis', (ctx) => {
  ctx.reply.text(obj.counterHolis + dict['1']);
  
});

bot.on('/eurobeat', (ctx) => {
  ctx.reply.text('https://www.youtube.com/watch?v=6ftCIfHwqtg');
});

bot.on('/slure', (ctx) => {
  ctx.reply.text('¯\\_(ツ)_/¯');
});

bot.on('/lemmy', (ctx) => {
  ctx.reply.text('( ͡° ͜ʖ ͡°)');
});

bot.on('/fliptable', (ctx) => {
  ctx.reply.text('(╯°□°）╯︵ ┻━┻');
});

bot.on('/repository', (ctx) => {
  ctx.reply.text('https://github.com/wolframtheta/BotCRUPC');
});

bot.on('/kawaiipotato', (ctx) => {
    bot.sendSticker(ctx.chat.id, 'CAADBAADkAADm9tZAcSYdB1cDI0jAg');
});

bot.on('/randomplaylist', (ctx) => {
  ctx.reply.text('Enjoy ma tune ma boi');
  var roulette = Math.random();
  if ( 0 <= roulette < 0.1) ctx.reply.text('https://youtu.be/mobtxEJHhY4');
  if ( 0.1 <= roulette < 0.2) ctx.reply.text('https://www.youtube.com/watch?v=XhQIXO0vUOM');
  if ( 0.2 <= roulette < 0.3) ctx.reply.text('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  if ( 0.3 <= roulette < 0.4) ctx.reply.text('https://youtu.be/L_jWHffIx5E?t=36s');
  if ( 0.4 <= roulette < 0.5) ctx.reply.text('https://www.youtube.com/watch?v=n5rS9vNbCDg');
  if ( 0.5 <= roulette < 0.6) ctx.reply.text('https://youtu.be/PfIB7h7rsOw');
  if ( 0.6 <= roulette < 0.7) ctx.reply.text('https://www.youtube.com/watch?v=UbQgXeY_zi4');
  if ( 0.7 <= roulette < 0.8) ctx.reply.text('https://www.youtube.com/watch?v=OBklXeUs6HU');
  if ( 0.8 <= roulette < 0.9) ctx.reply.text('https://www.youtube.com/watch?v=5LitDGyxFh4');
  if ( 0.9 <= roulette < 1) ctx.reply.text('https://www.youtube.com/watch?v=xy4evbxF40w');
});

bot.on(/kawaii+/, (ctx) => kannaAtack(ctx));

bot.on(/(^h|^H)i$/, (ctx) => holis(ctx));

bot.on('sticker', (ctx) => {
  if (ctx.chat.id < 0 || (ctx.chat.id > 0 && ctx.from.username == 'XvaiKawaii')) {
    if (ctx.sticker.emoji == '🚪' && ctx.sticker.set_name == "CRUPC") {
      console.log("map:" + obj.stateCRUPC);
      if (obj.stateCRUPC == "closed") {
        obj.stateCRUPC = "open";
        console.log("write");
        fs.writeFileSync("crupc.json", JSON.stringify(obj));
      }
      console.log("open");
      ctx.reply.text(dict['6']);
    }
    else if (ctx.sticker.emoji == '😒' && ctx.sticker.set_name == "CRUPC") {
      console.log("map:" + obj.stateCRUPC);
      if (obj.stateCRUPC == "open") {
        obj.stateCRUPC = "closed";
        fs.writeFileSync("crupc.json", JSON.stringify(obj));
        console.log("write");
      }
      console.log("closed");
      ctx.reply.text(dict['7']);
    }
  }
  else {
  ctx.reply.text(dict['5']);
  }
});

bot.start();

function holis(ctx) {
  obj.counterHolis++;
  fs.writeFileSync("crupc.json", JSON.stringify(obj));
  ctx.reply.text(dict['4'])
}

function kannaAtack(ctx){
  var kannaStickers = ["CAADBQADVAEAAhHsTwg9N6p2qMTE3wI","CAADBQADVQEAAhHsTwgIQ0YyGdeH9QI","CAADBQADWAEAAhHsTwj9HGLnMngW1QI",
                       "CAADBQADVwEAAhHsTwicB3U_qK86oAI","CAADBQADVgEAAhHsTwhs3Z6OMn1UawI","CAADBQADUwEAAhHsTwhB0-MIi9feVAI",
                       "CAADBQADUgEAAhHsTwg5I4hPQelh4gI","CAADBQADUQEAAhHsTwg5RdDBLjoHdQI","CAADBQADTgEAAhHsTwhpePGVn-6t9QI",
                       "CAADBQADTwEAAhHsTwh70Gb8FU0DsgI","CAADBQADTQEAAhHsTwjahOlLCxcjIAI","CAADBQADUAEAAhHsTwj4FpK-IIMZ8QI",
                       "CAADBQADTAEAAhHsTwiD24TUwFrgZgI","CAADBQADRQEAAhHsTwgJN6oJRfab5gI","CAADBQADRgEAAhHsTwjJlxDWHYKFagI",
                       "CAADBQADSAEAAhHsTwiCvCzQ_OE7wQI","CAADBQADSgEAAhHsTwi8htmZ7HlbDwI","CAADBQADUAEAAhHsTwj4FpK-IIMZ8QI",
                       "CAADBQADSQEAAhHsTwgIFSX340oseQI","CAADBQADSwEAAhHsTwgDcnQQAgYb8wI","CAADBQADRwEAAhHsTwgSs4dLAAEw0-YC",
                       "CAADBQADRAEAAhHsTwizLpgWuol3egI","CAADBQADQwEAAhHsTwiLT7gXtD7hEgI","CAADBQADQgEAAhHsTwgZw93YJEw8pwI",
                       "CAADBQADNQEAAhHsTwh2vqA8YAke1QI","CAADBQADNgEAAhHsTwgIkNgxKOiWtwI","CAADBQADNwEAAhHsTwhW_BdNqlTtsAI",
                       "CAADBQADOAEAAhHsTwh3u4a5BYLc6gI","CAADBQADOwEAAhHsTwjTDnphc1JaMgI","CAADBQADPAEAAhHsTwhGoP0qNuDe7gI",
                       "CAADBQADPQEAAhHsTwgtSje5XWFTaQI","CAADBQADPgEAAhHsTwiu4CgORjWQaQI","CAADBQADPwEAAhHsTwiK56bndPAnZwI",
                       "CAADBQADQQEAAhHsTwhr-9Ep0-ZvwQI","CAADBQADQAEAAhHsTwhZdn81emDM1AI","CAADBQADNAEAAhHsTwiCsq4UgEk05QI",
                       "CAADBQADMwEAAhHsTwgOGL07V0CZlAI","CAADBQADMgEAAhHsTwicRdiV65zXvQI","CAADBQADMQEAAhHsTwjyk_Fn-P_GKgI"];
    var rand = Math.floor(Math.random() * kannaStickers.length) + 1;
    bot.sendSticker(ctx.chat.id, kannaStickers[rand]).catch(function(){});
}
