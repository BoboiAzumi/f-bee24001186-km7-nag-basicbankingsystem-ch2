const express = require('express');
const UsersProfilesRouter = require('./routes/UsersProfiles');
const AccountsRouter = require('./routes/Accounts');
const TransactionRouter = require('./routes/Transactions');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const { Authenticate } = require('./routes/Authenticate');
const { Authorization } = require('./middleware/Authorization');
const { newUser } = require('./handler/UsersProfiles');
const { ImageUpload } = require('./routes/ImageUpload');
const dotenv = require('dotenv');
const { testNodeMailer } = require('./services/ResetPassword');
const { Forgot } = require('./routes/Forgot');

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express();

const http = require('http').Server(app)
const io = require('socket.io')(http)

http.listen(PORT, '0.0.0.0',() => console.log(`Start on ${PORT}`));

io.on('connect', (socket) => {
  console.log('=============================================================')
  console.log('Terkoneksi')

  socket.on('chat', (data) => {
    console.log('=============================================================')
    console.log(`Client mengirimkan : ${data.message}`)
    console.log(`Server akan mengirimkan : ${data.message + ' Diterima'}`)

    data.message = data.message + ' Diterima'
    io.sockets.emit('chat', data)

    setTimeout(() => {
      const message = 'Ayo Kirim Lagi'
      console.log(`Server akan mengirimkan lagi : ${message}`)
      io.sockets.emit('chat', {message: message})
    }, 5000)
  })
})

const swaggerJson = fs.readFileSync('./swagger.json');

app.all('/', (req, res) => {
  res.redirect('/api-docs')
})

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views')

app.get('/notification', (req, res) => {
  res.render('notification')
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerJson)));
app.use('/api/v1/users', UsersProfilesRouter);
app.use('/api/v1/accounts', Authorization, AccountsRouter);
app.use('/api/v1/transactions', Authorization, TransactionRouter);
app.use('/api/v1/authenticate', Authenticate);
app.use('/api/v1/register', newUser);
app.use('/api/v1/uploads', Authorization, ImageUpload)
app.use('/api/v1/forgot-password', Forgot)

app.get('/email/:email', (req, res) => {
  try{
    const email = req.params.email

    return res.send(testNodeMailer(email))
  }
  catch(e){
    next(e)
  }
})

app.use((err, req, res, next) => {
  if (err.name == 'Error') {
    res.status(400);
  } else {
    res.status(500);
  }

  res.json({
    status: 'ERROR',
    name: err.name,
    message: err.message,
    data: []
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: '404',
    message: 'Not Found'
  })
})