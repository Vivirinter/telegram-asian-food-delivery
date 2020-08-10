const Telegraf = require('telegraf');
const Markup = require('telegraf/markup');

const bot = new Telegraf('1163817297:AAF1wj5Nfi4ldhgncuKf4Uz8d0De6_8SxK4');
const PAYMENT_TOKEN = '410694247:TEST:bf4cd2c9-6e72-4846-91c7-e15b45c2c7d7';

const products = [
    {
        name: 'Wok',
        description: 'All ingredients are pre-prepared for roasting. Cooking on a fire takes 5-10 minutes, so you simply won\'t have time to cut anything in the process, so all products are chopped and laid out in separate cups and bowls before the pan is placed on the stove. It is very important to cut the ingredients into thin or small pieces. This will make the roasting faster and more even. Most of the meat and vegetables are chopped into thin long strips so that these products go well with noodles of the same shape.',
        price: 44.54,
        photo_url: 'https://media-cdn.tripadvisor.com/media/photo-s/18/b5/ab/46/enjoy-your-wok.jpg'

    },
    {
        name: 'Asian soup  "Kimchi Ramen"',
        description: 'Traditional noodles with spicy kimchi cabbage. Improves immunity, is well absorbed. Kimchi Ramen Spicy Noodles Kimchi Ramen "Itomen" has a wonderful composition and is cooked in just a few minutes.',
        price: 56.33,
        photo_url: 'https://cultured.guru/wp-content/uploads/2020/02/miso-ramen-5.jpg'

    },
    {
        name: 'Pork and egg noodle soup',
        description: 'Rich hot pork soup will satisfy you in the winter cold! Very tasty and simple!',
        price: 32.12,
        photo_url: 'https://d1q7fw5qeu4nx.cloudfront.net/wp-content/uploads/sites/2/2017/11/24144442/chinese-roasted-pork-ramen-soup_1200x1200-640x640.jpg'

    },
    {
        name: 'Noodle and shrimp',
        description: 'An original dish for fans of Asian cuisine. The convenient format allows you to take the product on the road or to the office where there are no dishes. Oriental style instant noodles with shrimp and lime flavor Vifon will help you fill up in times of pressure, enjoy and provide you with energy.',
        price: 56.4,
        photo_url: 'https://images-gmi-pmc.edge-generalmills.com/30c2940d-929c-47e8-9ba1-f6551e4eac1e.jpg'

    },
    {
        name: 'Lagman with chicken',
        description: 'Chicken lagman is a delicious dish that belongs to Asian cuisine. It is a thick rich soup or hot with gravy. Every housewife can do Lagman at home. In general, cooking differs depending on the recipe chosen. You can find Uzbek, Uyghur, home and many other lagmans.',
        price: 24.94,
        photo_url: 'https://silkroadchef.files.wordpress.com/2015/01/uyghur_lagman_1024.jpg'

    },
    {
        name: 'Chow fan',
        description: 'Beef chow fun is a staple Cantonese dish, made from stir-frying beef, hor fun and bean sprouts. It is commonly found in yum cha restaurants in Guangdong, Hong Kong, and overseas, as well as in cha chaan tengs. Chow fun, or stir-fried hor fun noodles, is any number of different individual preparations.',
        price: 88.99,
        photo_url: 'https://media-cdn.tripadvisor.com/media/photo-s/18/b5/ab/46/enjoy-your-wok.jpg'

    }
]

function createInvoice (product){
    return {
        provider_token: PAYMENT_TOKEN,
        start_parameter: 'food',
        title: product.name,
        description: product.description,
        currency: "usd",
        photo_url: product.photo_url,
        is_flexible: true,
        prices: [{ label: product.name, amount: Math.trunc(product.price * 100) }],
        payload: {coupon: product.name}
    }
}

bot.command('menu', (ctx) =>{
    ctx.telegram.sendMessage(ctx.chat.id, 'Menu',
    {
        reply_markup: {
            inline_keyboard: [
                [{text: 'Wok', callback_data: 'food_0'}, {text: 'Asian soup  "Kimchi Ramen"', callback_data:'food_1'}, {text: 'Pork and egg noodle soup', callback_data: 'food_2'}],
                [{text: 'Noodle and shrimp', callback_data: 'food_3'}, {text: 'Lagman with chicken', callback_data: 'food_4'}, {text: 'Chow fan', callback_data: 'food_5'}]
            ]
        }
    })
})

const replyOptions = Markup.inlineKeyboard([
    Markup.payButton('💸 Buy')
]).extra()




bot.on("callback_query", function (callback) {
    c_data = callback.callbackQuery.data
    if (c_data.startsWith("food_")) {
        food_id = Number(c_data.slice(5))
        callback.telegram.sendInvoice(
            callback.from.id,
            createInvoice(products[food_id])
        )
    }
})

bot.command('start', ({ reply }) => reply('Hello! We opened recently. What do you want?'))
// bot.start(({ replyWithInvoice }) => replyWithInvoice(createInvoice(products)))
bot.command('buy', ({ replyWithInvoice }) => replyWithInvoice(createInvoice(products), replyOptions))
bot.on('shipping_query', ({ answerShippingQuery }) => answerShippingQuery(true, shippingOptions))
bot.on('pre_checkout_query', ({ answerPreCheckoutQuery }) => answerPreCheckoutQuery(true))
bot.on('successful_payment', () => console.log('Woohoo'))
bot.launch()
