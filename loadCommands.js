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
        if (!obj.stopSpam) {
            bot.sendSticker(ctx.chat.id, e);
        }
    });
  });
}

function loadSendText(map, bot, obj){
  map.forEach(function(e, k, m) {
    bot.on(k, (ctx) => {
        if(!obj.stopSpam) {
            if (k == '/puttable' && obj.tables < 3) {
                ++obj.tables;
            }
            else if (k == '/fliptable' || k == '/ragefliptable') {
                --obj.taules;
            }
            else if (k == '/flitables') {
                obj.taules -= 2;
                if (obj.taules < 0) obj.taules = 0;
            }
            fs.writeFileSync('crupc.json', JSON.stringify(obj));
            if (k == '/fliptable' || k == '/fliptables' || k == '/ragefliptable') {
                if (obj.taules > 0) ctx.reply.text(e);
            }
            else {
                ctx.reply.text(e);
            }
        }
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
var loadLenny   = module.exports.loadLenny =    function(bot, obj){loadSendText(lenny,bot, obj);}
var loadSticker = module.exports.loadSticker =  function(bot){loadSendSticker(sticker,bot);}
