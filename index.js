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
const dotenv = require('dotenv')

dotenv.config()

const app = express();

const swaggerJson = fs.readFileSync('./swagger.json');

app.all('/', (req, res) => {
  res.redirect('/api-docs')
})

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerJson)));
app.use(express.json());
app.use('/api/v1/users', UsersProfilesRouter);
app.use('/api/v1/accounts', Authorization, AccountsRouter);
app.use('/api/v1/transactions', Authorization, TransactionRouter);
app.use('/api/v1/authenticate', Authenticate);
app.use('/api/v1/register', newUser);
app.use('/api/v1/uploads', Authorization, ImageUpload)

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

const PORT = process.env.PORT || 3000

app.listen(PORT, '0.0.0.0',() => console.log(`Start on ${PORT}`));