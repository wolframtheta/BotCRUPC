var fs = require('fs');
var lenny = new Map ([
              ['/lenny'     , '( ͡° ͜ʖ ͡°)'],
              ['/shrug'     , '¯\\_(ツ)_/¯'],
              ['/fliptable' , '(╯°□°）╯︵ ┻━┻'],
              ['/fliptables', '┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻'],
              ['/puttable', '┬─┬ノ( º _ ºノ)'],
              ['/ragefliptable', '(ノಠ益ಠ)ノ彡┻━┻']
            ]);

var urls = new Map ([
              ['/eurobeat'  , 'https://www.youtube.com/watch?v=6ftCIfHwqtg'],
              ['/repository', 'https://github.com/wolframtheta/BotCRUPC'],
              ['/doit', 'https://www.youtube.com/watch?v=FQRW0RM4V0k']
           ]);
var sticker = new Map ([
                ['/kawaiipotato', 'CAADBAADkAADm9tZAcSYdB1cDI0jAg'],
                ['/byeworld', 'CAADBAADBAEAAoj_wBUcLBtbRMIrawI']
              ]);

function loadSendSticker(map, bot){
  map.forEach(function(e, k, m) {
    bot.on(k, (ctx) => {
        connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'stopSpam'", function(err, res) {
          if (err) throw err;
          if (res[0]._Values == 'false') {
              bot.sendSticker(ctx.chat.id, e);
          }
        });
    });
  });
}

function loadSendText(map, bot, connection, dict){
  map.forEach(function(e, k, m) {
    bot.on(k, (ctx) => {
        connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'stopSpam'", function(err, res) {
          if (err) throw err;
          var stop = res[0]._Value;
          
          console.log(stop + " " + k);
          connection.query("SELECT _Value FROM map_crupc WHERE _Key = 'tables'", function(err, res) {
            if (err) throw err;
            var table = res[0]._Value;
            if(stop == 'false') {
                if (k == '/fliptable' || k == '/ragefliptable') {
                    if (table > 0) ctx.reply.text(e);
                    else ctx.reply.text(dict['no_tables']);
                }
                else if (k == '/fliptables') {
                    if (table > 1)ctx.reply.text(e);
                    else ctx.reply.text(dict['no_tables']);
                }
                else if (k == '/puttable' && table == 3) {
                    ctx.reply.text(dict['full_tables']);
                }
                else {
                    ctx.reply.text(e);
                }
                console.log(stop);
                if (k == '/puttable') {
                    if (table < 3) {
                        ++table;
                        if (table < 0) table = 1;
                    }
                }
                else if (k == '/fliptable') {
                    if (table > 0) --table;
                }
                else if (k == '/ragefliptable') {
                    table = 0;
                }
                else if (k == '/fliptables') {
                    if (table > 1) table -= 2;
                }

                connection.query("UPDATE map_crupc SET _Value = '" + table + "' WHERE _Key = 'tables'", function(err) {
                  if (err) throw err;
                });
            }
          });
        });
    });
  });
}

function loadSendUrl(map, bot) {
    map.forEach(function(e, k, m) {
        bot.on(k, (ctx) => {
            ctx.reply.text(e);
        });
    });
}
var loadUrls    = module.exports.loadUrls =     function(bot){loadSendUrl(urls,bot);}
var loadLenny   = module.exports.loadLenny =    function(bot, connection, dict){loadSendText(lenny,bot, connection, dict);}
var loadSticker = module.exports.loadSticker =  function(bot){loadSendSticker(sticker,bot);}
