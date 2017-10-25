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
        console.log(obj.stopSpam + " " + k)
        if(!obj.stopSpam) {
            if (k == '/fliptable' || k == '/ragefliptable') {
                if (obj.tables > 0) ctx.reply.text(e);
            }
            else if (k == '/fliptables') {
                if (obj.tables > 1)ctx.reply.text(e);
            }
            else {
                ctx.reply.text(e);
            }
            console.log(obj.stopSpam);
            if (k == '/puttable' && obj.tables < 3) {
                ++obj.tables;
                if (obj.tables < 0) obj.tables = 1;
            }
            else if (k == '/fliptable') {
                if (obj.tables > 0) --obj.tables;
            }
            else if (k == '/ragefliptable') {
                obj.tables = 0;
            }
            else if (k == '/fliptables') {
                if (obj.tables > 1) obj.tables -= 2;
            }
            console.log("obj" + obj.tables);
            fs.writeFileSync('crupc.json', JSON.stringify(obj));
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
