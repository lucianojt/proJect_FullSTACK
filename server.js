var express = require('express');
var pgp = require('pg-promise')();
var app = express();
//ver db = pgp(process.env.DATABASE_URL);
var db = pgp('postgres://zxsbvfocaemzby:d1645124538119110cd38631af5212c7da75b480d786f19b8effcc3433d1dafd@ec2-54-243-147-162.compute-1.amazonaws.com:5432/dnaovudsp0d1v?ssl=true');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
    var name = 'Jidapa Tassanakul';
    var hobbies = 'Read a book';
    var bdate = '22/08/2540'
    response.render('pages/about', { fullname: name, hobbies: hobbies, bdate: bdate });


});

app.get('/products', function (req, res) {

    var id = req.param('id');
    var sql = `select * from products 
               ORDER BY ABS(id) ASC `;
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

app.post('/product/update', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `update products 
               set title =  '${title}' , price = '${price}'
               where id = '${id}'`;
    db.any(sql)
        .then(function (data) {

            res.render('/product/update')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
    res.redirect('/products');
  


});

app.get('/insert', function (req, res) {
    res.render('pages/insert')

});

app.post('/product/insert', function (req, res) {
    var id = req.body.id;
    var title = req.body.title;
    var price = req.body.price;
    var sql = `insert into products (id,title,price) 
               values('${id}','${title}','${price}')`;
    db.any(sql)
        .then(function (data) {

            res.render('/product/insert')

        })
        .catch(function (error) {
            console.log('ERROR:' + error);

        })
    res.redirect('/products');


});
app.get('/products_delete/:id', function (req, res) {
    var id = req.params.id;
    var sql = 'delete from products';
    if (id) {
        sql += 'where id =' + id;
    }
    db.any(sql)
        .then(function (data) {
             res.redirect('/products');
        })
        .catch(function (error) {
            console.log('ERROR:' + error);
        })
});


var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log('App is running on http://localhost:' + port);
});