const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const jwtsecret = process.env.JWT_SECRET;


const authMiddleware = require('./middlewares/auth')

const newsServices = require('./services/news');

const app = express();
const PORT = process.env.PORT || 8080;




function errorResponse(statusCode, message, req, res) {
    return res.status(statusCode).json({
        message:message
    });        
}

app.use(bodyParser.json());
app.use(errorResponse);


app.get('/',  (req, res)  => {
    res.status(400).send("mau ngapain sih");
})

app.post('/sign-in', (req, res) => {
    const reqUsername = req.body.username
    const reqPass = req.body.password
    const usernameEligilbe = process.env.USERNAME_ELIGILBE
    const usernameEligilbeArray = usernameEligilbe.split(',');
    const passwordAccess = process.env.PASSWORD_ACCESS
    
    
    if (usernameEligilbeArray.includes(reqUsername) && reqPass === passwordAccess) {
        const payload = {
            username:reqUsername
        }
        
        // 12jam dalam sec = 36000
        const token = jwt.sign(payload, jwtsecret, { expiresIn: '36000s' });
        res_status = 200
        res.status(res_status);
        res.json({
            token:token
        })
    }else{
        errorResponse(401, 'invalid username or password',req, res)
    }
    
})

app.use(authMiddleware(jwtsecret))


app.get('/category', async (req, res)  => {
    res.status(200).json([
        {
            id:"Indonesia,viral",
            title:"Yang viral-viral"
        },{
            id:"Indonesia,culture",
            title:"Budaya"
        },
        {
            id:"Indonesia,sport",
            title:"Yang sehat sehat"
        },
        {
            id:"Indonesia,politic",
            title:"Politic"
        },
        {
            id:"Indonesia,technology",
            title:"Teknologi"
        },
        
    ])
})
app.get('/news', async (req, res)  => {
    try {
        let query = req.query.q
        if(query == ""){
            query = "Indonesia"
        }
        data_news = await newsServices.newsApiOrg()
        data = {
            last_generated: new Date(),
            news: data_news
        }
        
        app.locals.data = data
        response = app.locals.data
        response.resource = 'api'
        res.send(response);
    } catch (error) {
        res.status(400).send(error);
    }
})

// app.get('/news', async (req, res)  => {
//     try {
//         if (typeof app.locals.data !== 'undefined' && app.locals.data !== null && typeof app.locals.data.last_generated !== 'undefined' && app.locals.data.last_generated !== null){
//             last_generated = app.locals.data.last_generated
//             now = new Date()
//             time_diff_second = Math.round((now - last_generated) / 1000);
//             time_diff_minutes = Math.round(time_diff_second / 60);

//             response = app.locals.data
//             response.resource = 'local-memory'
//             if (time_diff_minutes > 5){
//                 data_news = await newsServices.newsApiOrg()
//                 data = {
//                     last_generated: new Date(),
//                     news: data_news
//                 }
//                 app.locals.data = data
//                 response = app.locals.data                
//                 response.resource = 'api'
//             }
//             res.send(response)
//         }else{
//             data_news = await newsServices.newsApiOrg()
//             data = {
//                 last_generated: new Date(),
//                 news: data_news
//             }

//             app.locals.data = data
//             response = app.locals.data
//             response.resource = 'api'
//             res.send(response);
//         }
//     } catch (error) {
//         res.status(400).send(error);
//     }
// })

app.use(function (error, request, response, next) {
    console.error(error.stack);
    console.error('error.cause',error.cause);
    console.error('error.code',error.code);
    console.error('error.message',error.message);            
    response.status(500).send('Something went wrong!');
});

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})

module.exports = app;