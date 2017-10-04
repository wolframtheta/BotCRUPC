var Telegraf = require('telegraf')
var fs = require('fs')
var path = require('path');


const app = new Telegraf("457148721:AAH59U4s3FEVqiE_V43koSUSG0QEVZVp_HI")
app.command('isopen', (ctx) => {
  var file = fs.readFileSync("stateCRUPC", 'utf-8');
  var isopen = (file == "open") ? true : false;
  if (isopen) ctx.telegram.sendSticker(ctx.message.chat.id, 'CAADBAADRgADZhkVBXvnbcBrbN7EAg');
  else ctx.telegram.sendSticker(ctx.message.chat.id, 'CAADBAADSAADZhkVBR-6hyRG6fjYAg');
})
app.hears('Hi', (ctx) => ctx.reply('Holiiiiiiiiiiiiiiii!!'))
app.hears('hi', (ctx) => ctx.reply('Holiiiiiiiiiiiiiiii!!'))
app.on('text', (ctx) => {
  if (ctx.message.chat.id > 0 && ctx.message.from.username != 'XvaiKawaii') {
    ctx.reply('A ti no te hago ni puto caso');
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
      ctx.reply('Club abierto')
    }
    else if (ctx.message.sticker.emoji == '😒' && ctx.message.sticker.set_name == "CRUPC") {
      if (file == "open") {
        fs.writeFileSync("stateCRUPC", "closed");
        console.log("write");
      }
      console.log("closed");
      ctx.reply('Club cerrado')
    }
  } 
  else {
    ctx.reply('A ti no te hago ni puto caso');
  }
})
app.startPolling()
