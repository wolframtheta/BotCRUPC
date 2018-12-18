var Telebot = require('telebot');
var lang = require('./lang/lang-default'); // Change this to change the language
var loadCommands = require('./loadCommands');
var fs = require('fs');
var dict = lang.vortaro();
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.JAWSDB_MARIA_URL);

connection.connect();

const bot = new Telebot(process.env.TOKEN);
checkClub();
bot.on(/^\/lang (.+$)/, (ctx, props) => {
    if (props.match[1] == "help") ctx.reply.text("catala, default, english, german, klingon, polish, portuguese-brazil, portuguese, quenya, russian, turkish");
    else {
        lang = require('./lang/lang-' + props.match[1]);
        dict = lang.vortaro();
    }
});

function checkClub() {
    setInterval(function(){
      var d = new Date();
      var h = d.getHours();
      if (d.getHours() == 00 && d.getMinutes() == 00) closeClub();
    }, 1000*60);
}

function closeClub() {
  connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'stateCRUPC'", function(err, res) {
    if (err) throw err;
    var state = res[0]._Value;
    if (state == "open") {
      connection.query("UPDATE map_crupc SET _Value = 'closed' WHERE _Key = 'stateCRUPC'", function(err) {
        if (err) throw err;
      });
      console.log("write");
    }
    console.log("closed");
  });
}

bot.on('/showlang', (ctx) => {
    ctx.reply.text(dict['lang_name'])
});
bot.on('/stopspam', (ctx) => {
    if (ctx.from.username == process.env.administrator) {
        console.log('stop spam true');
        connection.query("UPDATE map_crupc SET _Value = 'true' WHERE _Key = 'stopSpam'", function(err) {
          if (err) throw err;
        });
    } else {
        ctx.reply.text(dict['no_admin']);
    }
});

bot.on('/startspam', (ctx) => {
    if (ctx.from.username == process.env.administrator) {
        console.log('stop spam false');
        connection.query("UPDATE map_crupc SET _Value = 'false' WHERE _Key = 'stopSpam'", function(err) {
          if (err) throw err;
        });
    } else {
        ctx.reply.text(dict['no_admin']);
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
    ctx.reply.text(res[0]._Value + dict['hi_times']);
  });
});

bot.on('/partidas', (ctx) => {
    ctx.reply.text("https://docs.google.com/spreadsheets/d/1EwKgNWh2WUObYMFJfB-NotKiCPz8fTmhG4abx-THlFM/edit#gid=0");
});

loadCommands.loadUrls(bot);
loadCommands.loadLenny(bot, connection, dict);
loadCommands.loadSticker(bot);

bot.on('/randomplaylist', (ctx) => {
  ctx.reply.text(dict['enjoy_tune']);
  var roulette = Math.random();
  if ( 0 <= roulette && roulette < 0.1) ctx.reply.text('https://youtu.be/mobtxEJHhY4');
  if ( 0.1 <= roulette && roulette < 0.2) ctx.reply.text('https://www.youtube.com/watch?v=XhQIXO0vUOM');
  if ( 0.2 <= roulette && roulette < 0.3) ctx.reply.text('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  if ( 0.3 <= roulette && roulette < 0.4) ctx.reply.text('https://youtu.be/L_jWHffIx5E?t=36s');
  if ( 0.4 <= roulette && roulette < 0.5) ctx.reply.text('https://www.youtube.com/watch?v=n5rS9vNbCDg');
  if ( 0.5 <= roulette && roulette < 0.6) ctx.reply.text('https://youtu.be/PfIB7h7rsOw');
  if ( 0.6 <= roulette && roulette < 0.7) ctx.reply.text('https://www.youtube.com/watch?v=UbQgXeY_zi4');
  if ( 0.7 <= roulette && roulette < 0.8) ctx.reply.text('https://www.youtube.com/watch?v=OBklXeUs6HU');
  if ( 0.8 <= roulette && roulette < 0.9) ctx.reply.text('https://www.youtube.com/watch?v=KmWjWFfcLIQ&t=932s');
  if ( 0.9 <= roulette && roulette < 1) ctx.reply.text('https://www.youtube.com/watch?v=xy4evbxF40w');
});

bot.on(RegExp(/kawaii+/, "i"), (ctx) => {
    connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'stopSpam'", function(err, res) {
        if (err) throw err;
        stop = res[0]._Value;
        if (stop == 'false') {
            kannaAtack(ctx);
        }
    });
});

bot.on(/^hi$/gi, (ctx) => holis(ctx));

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
        ctx.reply.text(dict['open']);
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
        ctx.reply.text(dict['closed']);
      }
    });
  }
  else {
  ctx.reply.text(dict['no_admin']);
  }

});

bot.start();

function holis(ctx) {
    connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'counterHolis'", function(err, res) {
        if (err) throw err;
        var count = res[0]._Value;
        count++;
        connection.query("UPDATE map_crupc SET _Value = '"  + count + "' WHERE _Key = 'counterHolis'", function(err) {
            if (err) throw err;
        });
    });
    ctx.reply.text(dict['hi_long'])
}

function kannaAtack(ctx) {
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
    bot.sendSticker(ctx.chat.id, kannaStickers[rand]);
}

bot.on('/changelog', msg => {
    connection.query("SELECT * FROM changelog ORDER BY date DESC LIMIT 1", function(err, res) {
        var v = res[0].version.split('\n')[0];
        var date = new Date(res[0].date);
        var text = "<b>New in version " + v + " (" + date.getDate() + ' ' + date.toLocaleString("en-us", {month: "short"}) + ' ' + date.getFullYear() + "):</b>" + res[0].text;
        bot.sendMessage(msg.chat.id, text, {parseMode: 'html'});
    });
});

bot.on(/^\/addversion (.+)$/, (msg, props) => {
    var args = props.match[1].split(' ');
    var date = new Date();
    var version = args[0];
    args.shift();
    var text = args.join(' ').replace(/-/g, '\n-');
    var d = date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
    connection.query("INSERT INTO changelog VALUES ('" + d  +  "', '" + text + "', " + version + ")"), function(err, res) {
        bot.answerCallbackQuery(chatId, 'Nueva versión añadida', true);
    }
});

bot.on('/help', (ctx) => {
    const commands = {
        data: [{
            name: "/changelog",
            desc: "Shows the changes in the latest version"
        }, {
            name: "/help",
            desc: "Shows this message"
        }, {
            name: "/lang language_name",
            desc: "Changes the bot language"
        }, {
            name: "/showlang",
            desc: "Shows the current language"
        }, {
            name: "/isopen",
            desc: "Pretty self explanatory this one"
        }, {
            name: "/countholis",
            desc: "Shows how many times we have said hi"
        }, {
            name: "/randomplaylist",
            desc: "Gives you a nice random playlist, courtesy of CEUPC"
        }, {
            name: "/puttable",
            desc: "Puts a table"
        }, {
            name: "/fliptable",
            desc: "Flips a table"
        }, {
            name: "/ragefliptable",
            desc: "Angrily flips a table"
        }, {
            name: "/fliptables",
            desc: "Angrily flips two tables"
        }, {
            name: "/shrug",
            desc: "¯\\_(ツ)_/¯"
        }, {
            name: "/lenny",
            desc: "How to pronounce"
        }, {
            name: "/partidas",
            desc: "Show the link to the excel of partidas"
        }, {
            name: "/repository",
            desc: "T-this is my source code s-s-senpai... b-be gentle... (｡>_<｡)"
        }]
    }
    var t = "";
    for (var i = 0, l = commands.data.length; i < l; i++) {
      t = t + "\n" + (commands.data[i].name) + ": " + (commands.data[i].desc);
    }
    ctx.reply.text(t);
});