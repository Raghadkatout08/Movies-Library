//require express framework 
const exprss = require('express')

//invoke express
const app = exprss();
const port = 3001;
const homeData = require('./Movie Data/data.json');

function Movies(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

// //run server make it listening on port
// app.listen(port, () => {
//     console.log(` Port: ${port}`)
// })

//routing

//app.METHOD(PATH , HANDLER)
//Home Page
app.get('/', homePageHandler)

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
app.get('/favorite', favoriteHandler);

function favoriteHandler(req, res) {
    res.send(`Welcome to Favorite Page`)
}

//page test fot error 500 output 
app.get('/error' , testErrorHadler)
function testErrorHadler(req, res)
{
    res.send(error())
}

//If I want to try (errorHandler500) Function by other way, 
//go to data.json file, then delete (data) like this: 
// {"data": [{ }]}   => {"": [{ }]}
//By this way I can display error 500 

//error 500
app.use('*', errorHandler500)

function errorHandler500(err, req, res, text) {
    let status500= 500; 
    let response500 ="Sorry, Something Went Wrong";
    console.error(err.stack);
    res.status(500);
    res.send(
        `status: ${status500}
        responseText: ${response500}`
        )
    // send(`Sorry, something went wrong`)
}

//error 404
app.use('*', errorHandler404)

function errorHandler404(req, res) {
    let status404= 404; 
    let response404 ="Page Not Found Error";

    res.status(404);
    res.send(
        `status: ${status404}
        responseText: ${response404}`
        )
}

app.listen(port)