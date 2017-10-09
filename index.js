var Telebot = require('telebot');
var lang = require('./lang/lang-default'); // Change this to change the language
var dict = lang.vortaro();


const bot = new Telebot(process.env.TOKEN);

var map = new Object();
bot.on('/start', (ctx) => {
  if (ctx.from.username == 'XvaiKawaii') {
    map = {"stateCRUPC":"closed", "counterHolis":"0"};
    ctx.reply.text("Holi crupcero!");
  } else {
      ctx.reply.text(dict['5']);
  }
});
bot.on('/isopen', (ctx) => {
  var isopen = (map.stateCRUPC == "open") ? true : false;
  if (isopen) bot.sendSticker(ctx.chat.id, 'CAADBAADRgADZhkVBXvnbcBrbN7EAg');
  else bot.sendSticker(ctx.chat.id, 'CAADBAADSAADZhkVBR-6hyRG6fjYAg');
});
bot.on('/countholis', (ctx) => {
  ctx.reply.text(map.counterHolis + dict['1']);
});
bot.on('/eurobeat', (ctx) => {
  ctx.reply.text('https://www.youtube.com/watch?v=7u3jv7zC4kU&list=PLGdEbnOoiEOOaFFYKh3A66wOUlrHUwzTs');
});
bot.on('/kawaiipotato', (ctx) => {
    bot.sendSticker(ctx.chat.id, 'CAADBAADkAADm9tZAcSYdB1cDI0jAg');
});

bot.on(/(^h|^H)i$/, (ctx) => holis(ctx));
bot.on('sticker', (ctx) => {

  if (ctx.chat.id < 0 || (ctx.chat.id > 0 && ctx.from.username == 'XvaiKawaii')) {
    if (ctx.sticker.emoji == '🚪' && ctx.sticker.set_name == "CRUPC") {
      console.log("map:" + map.stateCRUPC);
      if (map.stateCRUPC == "closed") {
        map.stateCRUPC = "open";
        console.log("write");
      }
      console.log("open");
      ctx.reply.text(dict['6']);
    }
    else if (ctx.sticker.emoji == '😒' && ctx.sticker.set_name == "CRUPC") {
      console.log("map:" + map.stateCRUPC);
      if (map.stateCRUPC == "open") {
        map.stateCRUPC = "closed";
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
  map.counterHolis++;
  ctx.reply.text(dict['4'])
}
