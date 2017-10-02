const Telegraf = require('telegraf')

const app = new Telegraf("457148721:AAH59U4s3FEVqiE_V43koSUSG0QEVZVp_HI")
app.command('start', ({ from, reply }) => {
  console.log('start', from)
  return reply('Welcome!')
})
app.hears('hi', (ctx) => ctx.reply('Hey there!'))
app.on('sticker', (ctx) => {
  if (ctx.message.sticker.emoji == '🚪' && ctx.message.sticker.set_name == "CRUPC") {
    console.log("open");
  }
  if (ctx.message.sticker.emoji == '😒' && ctx.message.sticker.set_name == "CRUPC") {
    console.log("close");
  }
  ctx.reply('👍')
})
app.startPolling()
