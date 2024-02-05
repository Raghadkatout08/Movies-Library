'use strict'

const exprss = require('express')
require('dotenv').config()
const axios = require('axios')
const cors = require('cors')

const app = exprss();
const port = process.env.PORT;
const api_key = process.env.API_KEY;

app.use(cors())

//routing
//app.METHOD(PATH , HANDLER)
app.get('/', homePageHandler)
app.get('/favorite', favoriteHandler)
app.get('/trending', trendingHandler)
app.get('/search', searchTtrinfHandler)
app.get('/videos', videosHandler)
app.get('/list', listHandler)



// app.get('/mediaType', mediaTypeHandler)


const homeData = require('./Movie Data/data.json');

function Movies(id, title, release_date, poster_path, overview) {
    this.id = id;
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}

function Videos(name, type) {
    this.name = name;
    this.type = type;
}

function List(name, description) {
    this.name = name;
    this.description = description;
}

//Home Page
//http://localhost:3001/
function homePageHandler(req, res) {
    try {
        const result = homeData.data.map(element =>
            new Movies(element.title, element.poster_path, element.overview));
        res.send(result);
    } catch (error) {
        next(error)
    }
}

//Favorite Page
//http://localhost:3001/favorite
function favoriteHandler(req, res) {
    res.send(`Welcome to Favorite Page`)
}

//trending Page
//http://localhost:3001/trending
function trendingHandler(req, res) {
    let url = `https://api.themoviedb.org/3/trending/all/week?api_key=37ddc7081e348bf246a42f3be2b3dfd0&language=en-US?apiKey=${api_key}`
    axios.get(url)
        .then(result => {
            console.log(result.data)
            const trends = result.data.trends || result.data.results || [];

            if (Array.isArray(trends)) {
                let trendData = trends.map(trend => {
                    return new Movies(trend.id, trend.title, trend.release_date, trend.poster_path, trend.overview)
                })
                res.json(trendData)
            } else {
                console.log('Invalid Response format from the API')
                res.status(500).send('Sorry, Something Went Wrong')
            }


        })
        .catch(error => {
            console.log(error)
            res.status(500).send('Sorry, Something Went Wrong')
        })
}

//Search Page
//http://localhost:3001/search?title=Raiders
function searchTtrinfHandler(req, res) {
    let trendName = req.query.title;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=en-US&query=${trendName}&page=2`
    axios.get(url)
        .then(result => {
            console.log(req.query.title)
            const results = result.data.results || [];
            if (results.length > 0) {
                let response = results.map(movie => {
                    return new Movies(movie.id, movie.title, movie.release_date, movie.poster_path, movie.overview);
                });
                res.json(response);
            } else {
                console.log('No results found');
                res.json([]);
            }
        })
        .catch(error => {
            console.log(error)
            res.status(500).send('Sorry, Something Went Wrong')
        })
}


//videos Page
//http://localhost:3001/videos
function videosHandler(req,res)
{
    let url = `https://api.themoviedb.org/3/movie/157336/videos?api_key=${api_key}&language=en-US&query=The&page=2`
    axios.get(url)
        .then(result => {
            console.log(result.data)
            const videos = result.data.videos || result.data.results || [];

            if (Array.isArray(videos)) {
                let videoData = videos.map(video => {
                    return new Videos(video.name, video.type)
                })
                res.json(videoData)
            } else {
                console.log('Invalid Response format from the API')
                res.status(500).send('Sorry, Something Went Wrong')
            }


        })
        .catch(error => {
            console.log(error)
            res.status(500).send('Sorry, Something Went Wrong')
        })
}


//list Page
//http://localhost:3001/list
function listHandler(req,res)
{
    let url = `https://api.themoviedb.org/3/movie/157336/lists?api_key=${api_key}&language=en-US&query=The&page=2`
    axios.get(url)
    .then(result => {
        console.log(result.data)
        const lists = result.data.lists || result.data.results || [];

        if (Array.isArray(lists)) {
            let listData = lists.map(list => {
                return new List(list.name, list.description)
            })
            res.json(listData)
        } else {
            console.log('Invalid Response format from the API')
            res.status(500).send('Sorry, Something Went Wrong')
        }


    })
        .catch(error => {
            console.log(error)
            res.status(500).send('Sorry, Something Went Wrong')
        })
}

//page test fot error 500 output 
app.get('/error', testErrorHadler)
function testErrorHadler(req, res, next) {
    next(new Error('This is a test error'))
}


//error 404
app.use('*', errorHandler404)
function errorHandler404(req, res, next) {
    let status404 = 404;
    let response404 = "Page Not Found Error";

    res.status(404).send(
        `status: ${status404}
        responseText: ${response404}`
    )
}

//error 500
app.use((err, req, res, next) => {
    let status500 = 500;
    let response500 = "Sorry, Something Went Wrong";
    console.error(err.stack);
    res.status(500).send(
        `status: ${status500}
        responseText: ${response500}`
    );
});


app.listen(port, () => {
    console.log(`listening on port ${port}`)
})