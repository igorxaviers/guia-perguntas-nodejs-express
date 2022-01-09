const express = require('express');
const app = express();
const PORT = process.env.PORT || 80;
const bodyParser = require('body-parser');
const connection = require('./database/database');
const Pergunta = require('./database/Pergunta');
const Resposta = require('./database/Resposta');

//Conexão com o banco de dados
connection.
    authenticate()
    .then(() => {
        console.log('Conectado ao banco de dados');
    })
    .catch(err => console.log(err));

//Configuração do ejs para renderizar html
app.set('view engine', 'ejs');

//Confuguração do diretório de conteúdos estáticos
app.use(express.static('public'));

//Configuração do BodyParser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Rotas
app.get('/', (req, res) => {
    Pergunta.findAll({ 
        raw: true,
        order: [['id', 'DESC']] //Ordena pela coluna 'id' de forma decrescente
    })
    .then(perguntas => {
        res.render('home/index', {
            perguntas
        });
    })
    .catch(err => console.log(err));
});

app.get('/pergunta/:id', (req, res) => {
    let id = req.params.id;
    console.log(id);
    Pergunta.findOne({
        raw: true,
        where: { id }
    })
    .then(pergunta => {
        if(pergunta != undefined) {
            Resposta.findAll({
                raw: true,
                where: { perguntaId: id },
                order: [['id', 'DESC']]
            })
            .then(respostas => {
                res.render('pergunta', {
                    pergunta,
                    respostas
                })
            })
            .catch(err => console.log(err));
        }
        else {
            res.redirect('/');
        }
    })
    .catch(err => console.log(err));
});

app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

app.post('/responder', (req, res) => {
    let corpo = req.body.corpo;
    let perguntaId = req.body.perguntaId;
    console.log(corpo, perguntaId);
    Resposta.create({
        corpo,
        perguntaId
    })
    .then(() => {
        res.redirect(`/pergunta/${perguntaId}`);
    })
    .catch(err => console.log(err));
});

app.post('/salvar-pergunta', (req, res) => {
    let titulo = req.body.titulo;
    let descricao = req.body.descricao;

    //Inserir dados na tabela Pergunta - equivalente ao insert do sql
    Pergunta.create({
        titulo,
        descricao
    })
    .then(() => {
        res.redirect('/');
    });
});


//Criar servidor
app.listen(PORT, (errorMessage) => {
    if (errorMessage) {
        console.log(errorMessage);
    } else {
        console.log('Server is running on port 5000');
    }
});