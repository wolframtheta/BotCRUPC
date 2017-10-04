var Telegraf = require('telegraf')
var fs = require('fs')
var path = require('path');

var lang = require('./lang-default'); // Change this to change the language
var dict = lang.vortaro();


const app = new Telegraf("457148721:AAH59U4s3FEVqiE_V43koSUSG0QEVZVp_HI")
app.command('isopen', (ctx) => {
  var file = fs.readFileSync("stateCRUPC", 'utf-8');
  var isopen = (file == "open") ? true : false;
  if (isopen) ctx.telegram.sendSticker(ctx.message.chat.id, 'CAADBAADRgADZhkVBXvnbcBrbN7EAg');
  else ctx.telegram.sendSticker(ctx.message.chat.id, 'CAADBAADSAADZhkVBR-6hyRG6fjYAg');
})
app.command('countholis', (ctx) => {
  var file = fs.readFileSync("counterHoli", 'utf-8');
  ctx.reply(file + dict['1']);
})
app.hears(dict['2'], (ctx) => holis(ctx))
app.hears(dict['3'], (ctx) => holis(ctx))

function holis(ctx) {
  var file = fs.readFileSync("counterHoli", 'utf-8');
  file++;
  fs.writeFileSync("counterHoli", file);
  ctx.reply(dict['4'])

}
app.on('text', (ctx) => {
  if (ctx.message.chat.id > 0 && ctx.message.from.username != 'XvaiKawaii') {
    ctx.reply(dict['5']);
  }
})
app.on('sticker', (ctx) => {

  if (ctx.message.chat.id < 0 || (ctx.message.chat.id > 0 && ctx.message.from.username == 'XvaiKawaii')) {
    var file = fs.readFileSync("stateCRUPC", 'utf-8');
    if (ctx.message.sticker.emoji == '🚪' && ctx.message.sticker.set_name == "CRUPC") {
      console.log("file:" + file);
      if (file == "closed") {
        fs.writeFileSync("stateCRUPC", "open");
        console.log("write");
      }
      console.log("open");
      ctx.reply(dict['6'])
    }
    else if (ctx.message.sticker.emoji == '😒' && ctx.message.sticker.set_name == "CRUPC") {
      if (file == "open") {
        fs.writeFileSync("stateCRUPC", "closed");
        console.log("write");
      }
      console.log("closed");
      ctx.reply(dict['7'])
    }
  } 
  else {
    ctx.reply(dict['8']);
  }
})
app.startPolling()
