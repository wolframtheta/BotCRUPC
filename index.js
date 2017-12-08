var Telebot = require('telebot');
var lang = require('./lang/lang-default'); // Change this to change the language
var loadCommands = require('./loadCommands');
var fs = require('fs');
var dict = lang.vortaro();
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

connection.connect();
var TelegramBot = require('node-telegram-bot-api');
var bot = new TelegramBot(process.env.TOKEN, {
  polling: true
});

const bot = new Telebot(process.env.TOKEN);

bot.on(/^\/lang (.+$)/, (ctx, props) => {
    if (props.match[1] == "help") ctx.reply.text("default, english, polish, portuguese, russian, turkish");
    else {
        lang = require('./lang/lang-' + props.match[1]);
        dict = lang.vortaro();
    }
});
bot.on('/stopspam', (ctx) => {
    if (ctx.from.username == process.env.administrator) {
        console.log('stop spam true');
        connection.query("UPDATE map_crupc SET _Value = 'true' WHERE _Key = 'stopSpam'", function(err) {
          if (err) throw err;
        });
    } else {
        ctx.reply.text(dict['5']);
    }
});

bot.on('/startspam', (ctx) => {
    if (ctx.from.username == process.env.administrator) {
        console.log('stop spam false');
        connection.query("UPDATE map_crupc SET _Value = 'false' WHERE _Key = 'stopSpam'", function(err) {
          if (err) throw err;
        });
    } else {
        ctx.reply.text(dict['5']);
    }
});

bot.on('/isopen', (ctx) => {
  connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'stateCRUPC'", function(err, res) {
    if (err) throw err;
    var isopen = (res[0]._Value == "open") ? true : false;
    if (isopen) bot.sendSticker(ctx.chat.id, 'CAADBAADRgADZhkVBXvnbcBrbN7EAg');
    else bot.sendSticker(ctx.chat.id, 'CAADBAADSAADZhkVBR-6hyRG6fjYAg');
  });
});

bot.on('/countholis', (ctx) => {
  connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'counterHolis'", function(err, res) {
    if (err) throw err;
    ctx.reply.text(res[0]._Value + dict['1']);
  });
});

loadCommands.loadUrls(bot);
loadCommands.loadLenny(bot, connection, dict);
loadCommands.loadSticker(bot);

bot.on(RegExp(/kawaii+/, "i"), (ctx) => kannaAtack(ctx));

bot.on(/(^h|^H)i$/, (ctx) => holis(ctx));
bot.on('sticker', (ctx) => {
  if (ctx.chat.id < 0 || (ctx.chat.id > 0 && ctx.from.username == process.env.administrator)) {
    connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'stateCRUPC'", function(err, res) {
      if (err) throw err;
      var state = res[0]._Value;
      if (ctx.sticker.emoji == '🚪' && ctx.sticker.set_name == "CRUPC") {
        console.log("map:" + state);
        if (state == "closed") {
          console.log("write");
          connection.query("UPDATE map_crupc SET _Value = 'open' WHERE _Key = 'stateCRUPC'", function(err) {
            if (err) throw err;
          });
        }
        console.log("open");
        ctx.reply.text(dict['6']);
      }
      else if (ctx.sticker.emoji == '😒' && ctx.sticker.set_name == "CRUPC") {
        console.log("map:" + state);
        if (state == "open") {
          connection.query("UPDATE map_crupc SET _Value = 'closed' WHERE _Key = 'stateCRUPC'", function(err) {
            if (err) throw err;
          });
          console.log("write");
        }
        console.log("closed");
        ctx.reply.text(dict['7']);
      }
    });
  }
  else {
  ctx.reply.text(dict['5']);
  }

});

function holis(ctx) {
  connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'counterHolis'", function(err, res) {
      if (err) throw err;
      var count = res[0]._Value;
    count++;
    connection.query("UPDATE map_crupc SET _Value = '"  + count + "' WHERE _Key = 'counterHolis'", function(err) {
      if (err) throw err;
    });
  });
  ctx.reply.text(dict['4'])
}

function kannaAtack(ctx){
    var stop;
    connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'stopSpam'", function(err, res) {
      if (err) throw err;
      stop = res[0]._Value;
      if (stop == 'false') {
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

    });
}

bot.start();