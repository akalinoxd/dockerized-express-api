const bodyParser = require("body-parser")
const express = require("express")
const app = express()
const port = 3000

const mysql = require('mysql')
const conn = mysql.createConnection({
    host: '172.17.0.3',
    user: 'root',
    password: 'root',
    database: 'mysqlDB'
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Permitir acesso de qualquer origem
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE'); // Métodos permitidos
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Cabeçalhos permitidos
    next();
});

conn.connect(err => {
    if (err) {
        return console.log('failed to connect, error: ' + err)
    }
    return console.log('connected successfully')
})

// receber informações do banco de dados
app.get('/', (req, res) => {
    conn.query('SELECT * FROM usuarios', (err, results) => {
        !err ? res.json(results) : res.json({ err })
    })
})

// adicionar informações ao banco de dados
app.post('/add', (req, res) => {
    const { nome, idade } = req.body
    const insertElement = `INSERT INTO usuarios (Nome, Idade) VALUES (?, ?)`
    conn.query(insertElement, [nome, idade], (err, result) => {
        if (err) {
            console.log(err)
            return
        }
        const newId = result.insertId
        res.status(201).json({ ID: newId, nome, idade });
    })
})

// acessar UM cadastro do banco de dados pelo seu ID
app.get(`/id/:id`, (req, res) => {
    const id = req.params.id
    conn.query('SELECT * FROM usuarios WHERE ID = ?', [id], (err, results) => {
        !err ? res.json(results) : res.json({ err })
    })
})

// alterar um cadastro do banco de dados pelo seu ID
app.put('/update/:id', (req, res) => {
    const id = req.params.id
    const { nome, idade } = req.body
    conn.query('UPDATE usuarios SET Nome = ?, Idade = ? WHERE ID = ?', [nome, idade, id], (err, results) => {
        !err ? res.json({ id, nome, idade }) : res.json({ err })
    })
})

// deletar um cadastro do banco de dados pelo seu ID
app.delete('/delete/:id', (req, res) => {
    const id = req.params.id
    conn.query('DELETE FROM usuarios WHERE ID = ?', [id], (err, results) => {
        !err ? res.json({ "message": "row deleted", id }) : res.json({ err })
    })
})

app.listen(port, () => {
    return console.log("server started at port " + port)
})
