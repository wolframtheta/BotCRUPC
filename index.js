var Telegraf = require('telegraf')
var fs = require('fs')
var path = require('path');


const app = new Telegraf("457148721:AAH59U4s3FEVqiE_V43koSUSG0QEVZVp_HI")
app.command('isopen', ({ from, reply }) => {
  var file = fs.readFileSync("stateCRUPC", 'utf-8');
  var isopen = (file == "open") ? true : false;
  if (isopen) reply("El club esta abierto");
  else reply("El club esta cerrado");
})
app.hears('hi', (ctx) => ctx.reply('Hey there!'))
app.on('sticker', (ctx) => {
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
})
app.startPolling()
