
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
      bot.sendSticker(ctx.chat.id, e);
    });
  });
}

function loadSendText(map, bot){
  map.forEach(function(e, k, m) {
    bot.on(k, (ctx) => {
      ctx.reply.text(e);
    });
  });
}

var loadUrls    = module.exports.loadUrls =     function(bot){loadSendText(urls,bot);}
var loadLenny   = module.exports.loadLenny =    function(bot){loadSendText(lenny,bot);}
var loadSticker = module.exports.loadSticker =  function(bot){loadSendSticker(sticker,bot);}
