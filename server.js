var express = require('express');
var pgp = require('pg-promise')();
var app = express();
var db = pgp('postgres://nkwnjxuiidwrns:b72b4de42f726173c9acee8a85dd10ed1c8dc1a2ab7402a6feebbbccb8b14f85@ec2-54-163-245-44.compute-1.amazonaws.com:5432/d34ii1v5fr4h1e?ssl=true');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// app.get('/',function(request, response){

//     response.send('Hello, ExpressJS');

// });

// app.get('/test',function(request, response){

//     response.send('<H1>Test</H1>');

// });

// app.use(express.static('static'));
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.render('pages/index');

});

app.get('/about', function (request, response) {
    var name = 'Aekburut Rawangngan';
    var hobbies = ['Games', 'Sports', 'Cooking']
    var bdate = '07/03/2541'
    response.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });


});

app.get('/products', function (req, res) {

    var id = req.param('id');
    var sql = 'select * from products';
    if (id) {
        sql += ' whrer id =' + id;
    }


    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/products', { products: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});


app.get('/user', function (req, res) {

    var id = req.param('id');
    var sql = 'select * from users';
    if (id) {
        sql += ' whrer id =' + id;
    }


    db.any(sql)
        .then(function (data) {
            console.log('DATA:' + data);
            res.render('pages/user', { user: data })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
});

app.get('/products/:pid', function (req, res) {
    var pid = req.params.pid;
    var sql = "select * from products where id = " + pid;
    db.any(sql)
        .then(function (data) {
          
            res.render('pages/product_edit', { product: data[0] })

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })

});

app.post('/product/update',function(req, res){
var id = req.body.id;
var title = req.body.title;
var price = req.body.price;
var sql = `update product set title =  ${title}, price = ${price} where id = ${id}`;
console.log('UPDATE: ' + sql)
res.redirect('/products');


});
var port = process.env.PORT || 8080;
app.listen(port, function() {
console.log('App is running on http://localhost:' + port);
});