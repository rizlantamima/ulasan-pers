const axios = require('axios');
const NewsAPI = require('newsapi');


async function newsApiIndonesian(){
    
    const response = await axios.get('https://berita-indo-api.vercel.app/v1/kumparan-news');
    return response.data.data.map((val) => {
        const date = new Date(val.isoDate);
        const isoDate = date.toISOString().split('.')[0] + 'Z';
        return {
            source:val.creator,
            title:val.title,
            link:val.link,
            author:val.author,
            date:isoDate,
            description:val.description,
            image:val.image.medium,
        }
    })
}

async function newsApiOrg () {
    
    const today = new Date()
    const today_formated = today.toISOString().substring(0, 10);
    const a_week_ago = new Date();
    a_week_ago.setDate(a_week_ago.getDate() - 7);
    const a_week_ago_formated = a_week_ago.toISOString().substring(0, 10)
    
    
    const newsapi = new NewsAPI(process.env.NEWS_API_TOKEN);
    
    const response  = await newsapi.v2.everything({
        q:'Indonesia',
        from: a_week_ago_formated,
        to: today_formated,
        language: 'id',
        sortBy: 'relevancy',
        page: 1,
    });
    return response.articles.map((val) => {
        return {
            source:val.source.name,
            title:val.title,
            link:val.url,
            author:val.author,
            date:val.publishedAt,
            description:val.description,
            image:val.urlToImage,
        }
    })
}

module.exports = {
    newsApiIndonesian: newsApiIndonesian,
    newsApiOrg: newsApiOrg
};