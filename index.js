// const express = require('express');
// const app = express();
// const bodyParser = require('body-parser');
// const mysql = require('mysql');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mysql = require('mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const dbConn = mysql.createConnection({
    host: '',
    port: 3306,
    user: 'root',
    database: 'node_js',
    password: 'test_learning_js',
})

dbConn.connect();

// default route
// app.get('/', function (req, res) {
//     return res.send({ error: true, message: 'hello' })
// });

// Retrieve all users 
app.get('/users', function (req, res) {
    console.log('this is req', req.query);
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});

// Retrieve user with id 
app.get('/user/:id', function (req, res) {
    let user_id = req.params.id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    dbConn.query('SELECT * FROM users where id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'users list.' });
    });
});

// Add a new user  
app.post('/user', function (req, res) {
    let user = req.body.user;

    if (!user) {
      return res.status(400).send({ error:true, message: 'Please provide user' });
    }

    dbConn.query("INSERT INTO users SET ? ", { name: user.name, email: user.email }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created successfully.' });
    });
});

//  Update user with id
app.put('/user', function (req, res) {
    let user_id = req.body.user_id;

    let name = req.body.name;
    let email = req.body.email;

    if (!user_id || !email || !name) {
        return res.status(400).send({ error: true, message: 'Please provide name, email and user_id' });
    }

    dbConn.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated successfully.' });
    });
});


//  Delete user
app.delete('/user', function (req, res) {
    let user_id = req.body.user_id;

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id' });
    }

    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been deleted successfully.' });
    });    
}); 



// set port
app.listen(3000, function () {
    console.log('Node app is running on port 3000');
});

module.exports = app;

