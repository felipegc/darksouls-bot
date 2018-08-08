const Telegraf = require('telegraf');
const fs = require('fs');
const itemService = require('./services/itemService');

// TODO: felipegc put the token in a secret place
// Create a bot using TOKEN provided as environment variable
const bot = new Telegraf('631807407:AAEzPnUTpZ5emqrEVZpWgSSxBVtIhoIxm-Q');

bot.command('items', ctx => {
    console.log(JSON.stringify(ctx.message));

    itemService.buildCategories().then(response => {
        let categoriesHelp = 'Available items to search for:\n\n' + response;
        ctx.reply(categoriesHelp);
    }).catch(err => {
        console.log(err);
        ctx.reply(err);
    });
});

bot.command('weapons', ctx => {
    console.log(JSON.stringify(ctx.message));

    itemService.buildWeaponsList().then(response => {
        let availableWeapons = 'Type one of the following weapons:\n\n' + response;
        ctx.reply(availableWeapons);
    }).catch(err => {
        console.log(err);
        ctx.reply(err);
    });
});

bot.on('text', (ctx) => {
    console.log(JSON.stringify(ctx.message));

    itemService.findCommandItem(ctx.message.text).then(response => {
        ctx.replyWithPhoto({ source: fs.readFileSync(response)});
    }).catch(err => {
        console.log(err);
        ctx.reply(err);
    });
}).catch(err => {console.log(err)})


//TODO: felipegc remove them all
//////////////////// DEMOS //////////////

// Import replies file
const replies = require('./replies')

// Extract reply_to_message.message_id field from Telegraf ctx
// If not present, return null
const getReplyToMessageId = ctx => (
    ctx.message.reply_to_message ? ctx.message.reply_to_message.message_id : null
)

// This method will send the reply, based on the answer type
// (text / gif / sticker). See replies.js for objects structure.
const sendReply = (ctx, reply) => {
  // reply method will be the Telegraf method for sending the reply
  let replyMethod = {
    text: ctx.reply,
    gif: ctx.replyWithDocument,
    sticker: ctx.replyWithSticker
  }[reply.type]

  replyMethod(reply.value, {
    // this will make the bot reply to the original message instead of just sending it
    reply_to_message_id: getReplyToMessageId(ctx)
  })
}

// /list command - will send all the triggers defined in replies.js.
bot.command('list', ctx => {
    ctx.reply(
        'Available triggers:\n\n' +
        Object.keys(replies).join('\n')
    )
})

// Listen on every text message, if message.text is one of the trigger,
// send the reply
bot.on('text', ctx => {
  let cmd = ctx.message.text.toLowerCase()
  if (cmd in replies)
    sendReply(ctx, replies[cmd])
})

bot.startPolling();