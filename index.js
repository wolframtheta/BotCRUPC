var Telebot = require('telebot');
var lang = require('./lang/lang-default'); // Change this to change the language
var loadCommands = require('./loadCommands');
var fs = require('fs');
var dict = lang.vortaro();
var mysql = require('mysql');
var connection = mysql.createConnection(process.env.DB_AUTH);


connection.connect();

function handleDisconnect() {
  connection = mysql.createConnection(process.env.DB_AUTH); // Recreate the connection, since
                                                  // the old one cannot be reused.

  connection.connect(function(err) {              // The server is either down
    if(err) {                                     // or restarting (takes a while sometimes).
      console.log('error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
    }                                     // to avoid a hot loop, and to allow our node script to
  });                                     // process asynchronous requests in the meantime.
                                          // If you're also serving http, display a 503 error.
  connection.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
      handleDisconnect();                         // lost due to either server restart, or a
    } else {                                      // connnection idle timeout (the wait_timeout
      throw err;                                  // server variable configures this)
    }
  });
}

handleDisconnect();

const bot = new Telebot(process.env.TOKEN_BOT);
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
    ctx.reply.text(dict['0'])
});
bot.on('/stopspam', (ctx) => {
    if (ctx.from.username == process.env.ADMIN) {
        console.log('stop spam true');
        connection.query("UPDATE map_crupc SET _Value = 'true' WHERE _Key = 'stopSpam'", function(err) {
          if (err) throw err;
        });
    } else {
        ctx.reply.text(dict['5']);
    }
});

bot.on('/startspam', (ctx) => {
    if (ctx.from.username == process.env.ADMIN) {
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
  if (ctx.chat.id < 0 || (ctx.chat.id > 0 && ctx.from.username == process.env.ADMIN)) {
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
    ctx.reply.text(dict['4'])
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

//Keyboards
var kMenuGeneral = bot.inlineKeyboard([
        [
            bot.inlineButton('Activas', {callback: 'showActivePartidas'}),
            bot.inlineButton('Finalizadas', {callback: 'showFinishedPartidas'}),
            bot.inlineButton('En proyecto', {callback: 'showProjectPartidas'}),
        ], 
        [
            bot.inlineButton('Añadir partida', {callback: 'addPartida'})
        ]
    ]);

var kAddAccept = bot.inlineKeyboard([
        [
            bot.inlineButton('Si', {callback: 'acceptPartida'}),
            bot.inlineButton('No', {callback: 'addPartida'})
        ]
    ]);

var kDeleteAccept = bot.inlineKeyboard([
        [
            bot.inlineButton('Si', {callback: 'acceptDeletePartida'}),
            bot.inlineButton('No', {callback: 'kMenuPartida'})
        ]
    ]);

var kEditStates = bot.inlineKeyboard([
        [
            bot.inlineButton('Activa', {callback: 'editStateActive'}),
            bot.inlineButton('Finalizada', {callback: 'editStateFinished'}),
            bot.inlineButton('En Proyecto', {callback: 'editStateProject'})
        ]
    ]);

var kCreateStates = bot.inlineKeyboard([
        [
            bot.inlineButton('Activa', {callback: 'createStateActive'}),
            bot.inlineButton('Finalizada', {callback: 'createStateFinished'}),
            bot.inlineButton('En Proyecto', {callback: 'createStateProject'})
        ]
    ]);

var kCancel = bot.inlineKeyboard([
        [
            bot.inlineButton('Cancelar accion', {callback: 'cancelAction'})
        ]
    ]);

var kEditPartida;
var kId;
var kActive;
var kProject;
var kFinished;
var kPjs;

//Global vars
var step = 0;
var partida;
var idGame;
var actionBack;
var actualPartida = new Object();
var chatId;
var messageId;
var textActualPartida;
var userActivePartidasBlock = null;

bot.on('/partidas', msg => {
    return bot.sendMessage(msg.chat.id, '¿Que partidas quieres ver?', {replyMarkup: kMenuGeneral});
});

bot.on('callbackQuery', msg => {
    chatId = msg.message.chat.id;
    messageId = msg.message.message_id;
    console.log(msg.data + ' ' + step);
    if ((id = /^idA_\d+/.exec(msg.data))) {
        id = id.input.split('_')[1];
        idGame = id;
        createTextShow(chatId, messageId, id, 'showActivePartidas', msg); 
    } 
    else if ((id = /^idP_\d+/.exec(msg.data))) {
        id = id.input.split('_')[1];
        idGame = id;
        createTextShow(chatId, messageId, id, 'showProjectPartidas', msg);
    } 
    else if ((id = /^idF_\d+/.exec(msg.data))) {
        id = id.input.split('_')[1];
        idGame = id;
        createTextShow(chatId, messageId, id, 'showFinishedPartidas', msg);
    } 
    // Show Active Games
    else if (msg.data == 'showActivePartidas') {
        connection.query("SELECT * FROM partidas WHERE State = '1'", function(err, res) {
            if (err) throw err;
            if (res.length == 0) bot.editMessageText({chatId, messageId}, 'No hay ninguna partida activa', {replyMarkup: kMenuGeneral});
            else {
                var keyboard = [];
                var count = res[0]._Value;

                for (var i = 0; i < res.length; i++) {
                    keyboard.push([{'text': res[i].Name + ' - ' + res[i].Master, 'callback_data': 'idA_' + res[i].ID}]);
                }
                keyboard.push([{'text': '<< Atras', 'callback_data': 'menuGeneral'}]);
                kActive = bot.inlineKeyboard(keyboard);
                bot.editMessageText({chatId, messageId}, '¿Que partida activa quieres ver?', {replyMarkup: kActive});
            }
        });   
    } 
    // Show Project Games
    else if (msg.data == 'showProjectPartidas') {
        connection.query("SELECT * FROM partidas WHERE State = '2'", function(err, res) {
            if (err) throw err;
            if (res.length == 0) bot.editMessageText({chatId, messageId}, 'No hay ninguna partida en proyecto', {replyMarkup: kMenuGeneral});
            else {
                var keyboard = [];
                var count = res[0]._Value;

                for (var i = 0; i < res.length; i++) {
                    keyboard.push([{'text': res[i].Name + ' - ' + res[i].Master, 'callback_data': 'idP_' + res[i].ID}]);
                }
                keyboard.push([{'text': '<< Atras', 'callback_data': 'menuGeneral'}]);
                kProject = bot.inlineKeyboard(keyboard);
                bot.editMessageText({chatId, messageId}, '¿Que partida en proyecto quieres ver?', {replyMarkup: kProject});
            }
        }); 
    } 
    // Show Finished Games
    else if (msg.data == 'showFinishedPartidas') {
        connection.query("SELECT * FROM partidas WHERE State = '0'", function(err, res) {
            if (err) throw err;
            if (res.length == 0) bot.editMessageText({chatId, messageId}, 'No hay ninguna partida finalizada', {replyMarkup: kMenuGeneral});
            else {
                var keyboard = [];
                var count = res[0]._Value;

                for (var i = 0; i < res.length; i++) {
                    keyboard.push([{'text': res[i].Name + ' - ' + res[i].Master, 'callback_data': 'idF_' + res[i].ID}]);
                }
                keyboard.push([{'text': '<< Atras', 'callback_data': 'menuGeneral'}]);
                kFinished = bot.inlineKeyboard(keyboard);
                bot.editMessageText({chatId, messageId}, '¿Que partida finalizada quieres ver?', {replyMarkup: kFinished});
            }
        }); 
    } 
    // Add Game
    else if (msg.data == 'addPartida') {
        if (userActivePartidasBlock == null) userActivePartidasBlock = msg.from.id;
        if (!isPrivateChat(msg)) bot.sendMessage(msg.message.chat.id, 'Solo puedes anadir partidas hablandome en privado');
        else if (isSameUserCreating(msg.from.id)) {
            console.log(msg);
            step = 1;
            bot.sendMessage(msg.message.chat.id, 'OK. Enviame el nombre de la partida', {replyMarkup: kCancel});
            partida = new Object();
        }
        else bot.sendMessage(msg.message.chat.id, 'Alguien esta creando ya una partida, esperate unos minutos');
    } 
    // Edit Game
    else if ((id = /^editPartida_\d+/.exec(msg.data))) {
        console.log(msg.from.id);
        console.log(userActivePartidasBlock);
        if (userActivePartidasBlock == null) userActivePartidasBlock = msg.from.id;
        if (userActivePartidasBlock == msg.from.id) {

            idGame = msg.data.split('_')[1];
            kEditPartida = bot.inlineKeyboard([
                [
                    bot.inlineButton('Nombre', {callback: 'editName'}),
                    bot.inlineButton('Master', {callback: 'editMaster'}),
                    bot.inlineButton('Mail', {callback: 'editMail'}),
                ], 
                [
                    bot.inlineButton('Sistema', {callback: 'editSystem'}),
                    bot.inlineButton('Fecha', {callback: 'editDay'}),
                    bot.inlineButton('Horario', {callback: 'editHour'}),
                ],
                [
                    bot.inlineButton('Personajes', {callback: 'editPjs'}),
                    bot.inlineButton('Estado', {callback: 'editState'}),
                ],
                [
                    bot.inlineButton('<< Atras', {callback: actionBack})
                ]
            ]);
            bot.editMessageText({chatId, messageId}, '¿Que quieres modificar?', {replyMarkup: kEditPartida});
        }
        else {
            bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
        }
    }
    // Delete Partida
    else if ((id = /^deletePartida_\d+/.exec(msg.data))) {
        idGame = msg.data.split('_')[1];
        bot.sendMessage(chatId, 'Seguro que quieres eliminar esta partida?', {replyMarkup: kDeleteAccept});    
    } 
    // General Menu
    else if (msg.data == 'menuGeneral') {
        bot.editMessageText({chatId, messageId}, '¿Que partidas quieres ver?', {replyMarkup: kMenuGeneral});
    } 
    // Accept Game
    else if (msg.data == 'acceptPartida') {
        var q = "INSERT INTO partidas VALUES ('', '" + partida.Name + "', '" 
                                                     + partida.Master + "', '" 
                                                     + partida.Mail + "', '" 
                                                     + partida.System + "', '" 
                                                     + partida.Day + "', '" 
                                                     + partida.Hour_from + "', '" 
                                                     + partida.Hour_to + "', '" 
                                                     + stateToInt(partida.State) + "')";
        connection.query(q, function(err, res) {
            if (err) throw err;
            partida.Pjs.forEach(function(pj) {
                q = "INSERT INTO players VALUES ('" + pj[0] + "', '" + pj[1] + "', '" + res.insertId +  "', '" + pj[2] + "')";
                connection.query(q, function(err, res) {
                    if (err) throw err;
                    console.log(msg);
                    userActivePartidasBlock = null;
                    return bot.answerCallbackQuery(chatId, 'Partida creada!!', true);
                });
            });
        });
        bot.editMessageText({chatId, messageId}, '¿Que partidas quieres ver?', {parseMode: 'html', replyMarkup: kMenuGeneral});
    }
    // Delete Game
    else if (msg.data == 'acceptDeletePartida') {
        connection.query("DELETE FROM partidas WHERE ID = '" + idGame + "'", function(err, res) {
            if (err) throw err;
            return bot.answerCallbackQuery(chatId, 'Partida eliminada!!', true);
        });
        bot.editMessageText({chatId, messageId}, '¿Que partidas quieres ver?', {parseMode: 'html', replyMarkup: kMenuGeneral});
    }
    // Edit Name
    else if (msg.data == 'editName') {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            step = 'editName';
            bot.editMessageText({chatId, messageId}, 'Nombre actual de la partida: <b>' + actualPartida.Name + "</b>\nEnviame el nuevo nombre de la partida.", {parseMode: 'html', replyMarkup: kCancel});
        } 
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Edit Master
    else if (msg.data == 'editMaster') {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            step = 'editMaster';
            bot.editMessageText({chatId, messageId}, 'Master actual de la partida: <b>' + actualPartida.Master + "</b>\nEnviame el nuevo master de la partida.", {parseMode: 'html', replyMarkup: kCancel});
        } 
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Edit Master's Mail
    else if (msg.data == 'editMail') {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            step = 'editMail';
            bot.editMessageText({chatId, messageId}, 'Mail actual de la partida: <b>' + actualPartida.Mail_Master + "</b>\nEnviame el nuevo mail de la partida.", {parseMode: 'html', replyMarkup: kCancel, replyMarkup: kCancel});
        } 
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Edit System
    else if (msg.data == 'editSystem') {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            step = 'editSystem';
            bot.editMessageText({chatId, messageId}, 'Sistema actual de la partida: <b>' + actualPartida.System + "</b>\nEnviame el nuevo sistema de la partida.", {parseMode: 'html'});
        } 
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Edit Date
    else if (msg.data == 'editDay') {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            step = 'editDay';
            bot.editMessageText({chatId, messageId}, 'Dia actual de la partida: <b>' + actualPartida.Day + "</b>\nEnviame el nuevo dia de la partida.", {parseMode: 'html', replyMarkup: kCancel});
        } 
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Edit Schedule
    else if (msg.data == 'editHour') {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            step = 'editHour';
            bot.editMessageText({chatId, messageId}, 'Hora actual de la partida: <b>' + actualPartida.Hour_from + '-' + actualPartida.Hour_to + "</b>\nEnviame la nueva hora de la partida.", {parseMode: 'html', replyMarkup: kCancel});
        } 
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Edit PJs
    else if (msg.data == 'editPjs') {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            step = 'editPjs';
            var a = 'Pjs actuales de la partida:\n';
            for (var i = 0; i < actualPartida.Pjs.length; i++) {
                a += '▫️' + actualPartida.Pjs[i].NamePj + ' - ' + actualPartida.Pjs[i].RolePj + ' (' + actualPartida.Pjs[i].NamePlayer + ')' + "\n";
            }
            var keyboard = [];

            for (var i = 0; i < actualPartida.Pjs.length; i++) {
                keyboard.push([{'text': actualPartida.Pjs[i].NamePj}]);
            }
            keyboard.push([{'text': '<< Atras', 'callback_data': 'editPartida_' + idGame}]);
            kPjs = bot.inlineKeyboard(keyboard);
            console.log(kPjs);
            console.log(a);
            bot.editMessageText({chatId, messageId}, a, {parseMode: 'html', replyMarkup: kId});
        }
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Edit State
    else if (msg.data == 'editState') {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            step = 'editState';
            bot.editMessageText({chatId, messageId}, 'Estado actual de la partida: <b>' + actualPartida.State + "</b>\nEn que estado se encuentra ahora?", {parseMode: 'html', replyMarkup: kEditStates});
        } 
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Edit State
    else if (/^editState/g.exec(msg.data) != null && step != "") {
        makeUserActive(msg);
        if (userActivePartidasBlock == msg.from.id) {
            var st = msg.data.split('editState')[1];
            console.log("st " + st);
            connection.query("UPDATE partidas SET State = \"" + stateToInt(st) + "\" WHERE ID = '" + actualPartida.ID + "'", function(err, res) {
                if (err) throw err;
                connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = " + actualPartida.ID, function(err, res) {
                    if (err) throw err;
                    updatePartida(res);
                    createTextPartida();
                    bot.sendMessage(chatId, textActualPartida, {parseMode: 'html', replyMarkup: kEditPartida});
                });
                
            });
            step = "";
        } 
        else bot.editMessageText({chatId, messageId}, 'Alguien esta editando o creando una partida, esperate unos minutos');
    }
    // Create State
    else if (/^createState/g.exec(msg.data) != null) {
        var st = msg.data.split('createState')[1];
        step = "";
        partida.State = st;
        var text =  '<b>Nombre:</b><code> ' + partida.Name + '</code>' + "\n" + 
                    '<b>Master:</b><code> ' + partida.Master + ' (' + partida.Mail + ')</code>' + "\n" + 
                    '<b>Sistema:</b><code> ' + partida.System + "</code>\n" + 
                    '<b>Fecha:</b><code> ' + partida.Day + "</code>\n" + 
                    '<b>Horario:</b><code> ' + partida.Hour_from + ' - ' + partida.Hour_to + "</code>\n" +  
                    '<b>Estado:</b><code> ' + partida.State + "</code>\n" + 
                    '<b>Personajes</b>' + "\n" + 
                    '<pre>';
        for (var i = 0; i < partida.Pjs.length; i++) {
            text += '▫️' + partida.Pjs[i][1] + ' - ' + partida.Pjs[i][2] + ' (' + partida.Pjs[i][0] + ')' + "\n";
        }
        text += '</pre>';
        bot.sendMessage(chatId, text, {parseMode: 'html', replyMarkup: kAddAccept})
    }
    // Cancel Action
    else if (msg.data == 'cancelAction') {
        step = "";
        userActivePartidasBlock = null;
        bot.sendMessage(chatId, 'Accion cancelada', true);
        bot.sendMessage(chatId, '¿Que partidas quieres ver?', {replyMarkup: kMenuGeneral});
    }
});

function makeUserActive(msg) {
    if (userActivePartidasBlock == null) userActivePartidasBlock = msg.from.id;
}
function isSameUserCreating(username) {
    return username == userActivePartidasBlock;
}
function isPrivateChat(msg) {
    // console.log(msg);
    if (typeof msg.chat == 'undefined') {
        if (msg.message.chat.id > 0) return true;
    }
    else {
        if (typeof msg.message == 'undefined') {
            if (msg.chat.id > 0) return true;
        }
    }
    console.log("isPrivateChat false");
    return false;
}

function stateToInt(state) {
    if (/Activa|Active/gi.exec(state) != null) return '1';
    else if (/Finalizada|Finished/gi.exec(state) != null) return '0';
    else if (/Proyecto|Project/gi.exec(state) != null) return '2';
}

function intToState(state) {
    if (state == '1') return 'Activa';
    else if (state == '0') return 'Finalizada';
    else if (state == '2') return 'En Proyecto';
}

function createTextShow(chatId, messageId, id, action, msg) {
    actionBack = action;
    if (isPrivateChat(msg)) {
        var kMenuPartida = [[
                bot.inlineButton('Editar partida',  {callback: 'editPartida_' + id}), 
                bot.inlineButton('Eliminar partida', {callback: 'deletePartida_' + id})
        ]];
        kMenuPartida.push([{'text': '<< Atras', 'callback_data': actionBack}]);
    } else {
        var kMenuPartida = [[
            bot.inlineButton('<< Atras', {callback: actionBack})
        ]];
    }

    kId = bot.inlineKeyboard(kMenuPartida);
    connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = '" + id + "'", function(err, res) {
        createPartida(res);
        createTextPartida();
        
        bot.editMessageText({chatId, messageId}, textActualPartida, {parseMode: 'html', replyMarkup: kId});
    });
}

function createPartida(res) {
    actualPartida = new Object();
    updatePartida(res);
}

function createTextPartida() {
    textActualPartida =  '<b>Nombre:</b><code> ' + actualPartida.Name + '</code>' + "\n" + 
                    '<b>Master:</b><code> ' + actualPartida.Master + ' (' + actualPartida.Mail_Master + ')</code>' + "\n" + 
                    '<b>Sistema:</b><code> ' + actualPartida.System + "</code>\n" + 
                    '<b>Fecha:</b><code> ' + actualPartida.Day + "</code>\n" + 
                    '<b>Horario:</b><code> ' + actualPartida.Hour_from + ' - ' + actualPartida.Hour_to + "</code>\n" +  
                    '<b>Estado:</b><code> ' + actualPartida.State + "</code>\n" + 
                    '<b>Personajes</b>' + "\n" + 
                    '<pre>';
        for (var i = 0; i < actualPartida.Pjs.length; i++) {
            textActualPartida += '▫️' + actualPartida.Pjs[i].NamePj + ' - ' + actualPartida.Pjs[i].RolePj + ' (' + actualPartida.Pjs[i].NamePlayer + ')' + "\n";
        }
        textActualPartida += '</pre>';
}

function updatePartida(res) {
    actualPartida.ID = res[0].ID;
    actualPartida.Name = res[0].Name;
    actualPartida.Master = res[0].Master;
    actualPartida.Mail_Master = res[0].Mail_Master;
    actualPartida.System = res[0].System;
    actualPartida.Day = res[0].Day;
    actualPartida.Hour_from = res[0].Hour_from;
    actualPartida.Hour_to = res[0].Hour_to;
    actualPartida.Pjs = [];
    actualPartida.State = intToState(res[0].State);
    res.forEach(function(pj) {
        actualPartida.Pjs.push({NamePj: pj.NamePj, RolePj: pj.RolePj, NamePlayer: pj.NamePlayer});
    });
}

bot.on('text', msg => {
    // console.log('A' + bot.getChatAdministrators('-1001123407471'));
    if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 1) {
        step = 2;
        partida.Name = msg.text;
        bot.sendMessage(msg.chat.id, 'OK. Enviame el nombre del Master', {replyMarkup: kCancel});
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 2) {
        step = 3;
        partida.Master = msg.text;
        bot.sendMessage(msg.chat.id, 'OK. Enviame una forma de contacto con el Master', {replyMarkup: kCancel});
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 3) {
        step = 4;
        partida.Mail = msg.text;
        bot.sendMessage(msg.chat.id, 'OK. Enviame el sistema de juego', {replyMarkup: kCancel});
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 4) {
        step = 5;
        partida.System = msg.text;
        bot.sendMessage(msg.chat.id, 'OK. Enviame que dia se va a jugar', {replyMarkup: kCancel});
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 5) {
        step = 6;
        partida.Day = msg.text;
        bot.sendMessage(msg.chat.id, 'OK. Enviame en que horario se va a jugar (Formato: <i>hora_inicio - hora_final</i>)', {parseMode: 'HTML', replyMarkup: kCancel});
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 6) {
        step = 7;
        var h = msg.text.split('-');
        partida.Hour_from = h[0];
        partida.Hour_to = h[1];
        bot.sendMessage(msg.chat.id, 'OK. Enviame una lista de todos los jugadores con sus respetivos personajes y que clase son separado por `/` y con salto de linia al final de cada personaje .\n<i>Ejemplo: Miguel Angel Munoz/Kanna/Kawaii</i>', {parseMode:'HTML', replyMarkup: kCancel}); 

    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 7) {
        step = 8;
        var pjs = msg.text.split('\n');
        partida.Pjs = [];
        for (var i = 0; i < pjs.length; i++) {
            partida.Pjs.push(pjs[i].split('/'));
        }
        bot.sendMessage(msg.chat.id, 'OK. Finalmente pulsa en que estado esta, Activa, Finalizada o En Proyecto', {replyMarkup: kCreateStates});
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 'editName') {
        connection.query("UPDATE partidas SET Name = \"" + msg.text + "\" WHERE ID = '" + actualPartida.ID + "'", function(err, res) {
            if (err) throw err;
            connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = " + actualPartida.ID, function(err, res) {
                if (err) throw err;
                updatePartida(res);
                createTextPartida();
                bot.sendMessage(msg.chat.id, textActualPartida, {parseMode: 'html', replyMarkup: kEditPartida});
            });
            
        });
        step = "";
        userActivePartidasBlock = null;
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 'editMaster') {
        connection.query("UPDATE partidas SET Master = \"" + msg.text + "\" WHERE ID = '" + actualPartida.ID + "'", function(err, res) {
            if (err) throw err;
            connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = " + actualPartida.ID, function(err, res) {
                if (err) throw err;
                updatePartida(res);
                createTextPartida();
                bot.sendMessage(msg.chat.id, textActualPartida, {parseMode: 'html', replyMarkup: kEditPartida});
            });
            
        });
        step = "";
        userActivePartidasBlock = null;
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 'editMail') {
        connection.query("UPDATE partidas SET Mail = \"" + msg.text + "\" WHERE ID = '" + actualPartida.ID + "'", function(err, res) {
            if (err) throw err;
            connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = " + actualPartida.ID, function(err, res) {
                if (err) throw err;
                updatePartida(res);
                createTextPartida();
                bot.sendMessage(msg.chat.id, textActualPartida, {parseMode: 'html', replyMarkup: kEditPartida});
            });
            
        });
        step = "";
        userActivePartidasBlock = null;
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 'editSystem') {
        connection.query("UPDATE partidas SET System = \"" + msg.text + "\" WHERE ID = '" + actualPartida.ID + "'", function(err, res) {
            if (err) throw err;
            connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = " + actualPartida.ID, function(err, res) {
                if (err) throw err;
                updatePartida(res);
                createTextPartida();
                bot.sendMessage(msg.chat.id, textActualPartida, {parseMode: 'html', replyMarkup: kEditPartida});
            });
            
        });
        step = "";
        userActivePartidasBlock = null;
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 'editDay') {
        connection.query("UPDATE partidas SET Day = \"" + msg.text + "\" WHERE ID = '" + actualPartida.ID + "'", function(err, res) {
            if (err) throw err;
            connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = " + actualPartida.ID, function(err, res) {
                if (err) throw err;
                updatePartida(res);
                createTextPartida();
                bot.sendMessage(msg.chat.id, textActualPartida, {parseMode: 'html', replyMarkup: kEditPartida});
            });
            
        });
        step = "";
        userActivePartidasBlock = null;
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 'editHour') {
        var h = msg.text.split('-');
        connection.query("UPDATE partidas SET Hour_from = \"" + h[0] + "\", Hour_to = \"" + h[1] + "\" WHERE ID = '" + actualPartida.ID + "'", function(err, res) {
            if (err) throw err;
            connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = " + actualPartida.ID, function(err, res) {
                if (err) throw err;
                updatePartida(res);
                createTextPartida();
                bot.sendMessage(msg.chat.id, textActualPartida, {parseMode: 'html', replyMarkup: kEditPartida});
            }); 
            
        });
        step = "";
        userActivePartidasBlock = null;
    }
    else if (isPrivateChat(msg) && isSameUserCreating(msg.from.id) && step == 'editPjs') {
        var pjs = msg.text.split('\n');
        actualPartida.Pjs = [];
        for (var i = 0; i < pjs.length; i++) {
            actualPartida.Pjs.push(pjs[i].split('/'));
        }
        connection.query("DELETE FROM players WHERE Game = " + actualPartida.ID, function(err, res) {
            if (err) throw err;
            actualPartida.Pjs.forEach(function(pj) {
                q = "INSERT INTO players VALUES ('" + pj[0] + "', '" + pj[1] + "', '" + actualPartida.ID +  "', '" + pj[2] + "')";
                connection.query(q, function(err, res) {
                    if (err) throw err;
                    connection.query("SELECT * FROM partidas p, players pj WHERE p.ID = pj.Game && p.ID = " + actualPartida.ID, function(err, res) {
                        if (err) throw err;
                        updatePartida(res);
                        createTextPartida();
                        bot.sendMessage(msg.chat.id, textActualPartida, {parseMode: 'html', replyMarkup: kEditPartida});
                    });
                });
            });
        });
        
        step = "";
        userActivePartidasBlock = null;
    }
});

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
