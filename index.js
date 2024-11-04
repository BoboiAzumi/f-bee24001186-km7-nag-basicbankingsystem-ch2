const express = require('express');
const UsersProfilesRouter = require('./routes/UsersProfiles');
const AccountsRouter = require('./routes/Accounts');
const TransactionRouter = require('./routes/Transactions');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');
const { Authenticate } = require('./routes/Authenticate');
const { Authorization } = require('./middleware/authorization');
const { newUser } = require('./handler/UsersProfiles');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

const swaggerJson = fs.readFileSync('./swagger.json');

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(JSON.parse(swaggerJson)));

app.use(express.json());
app.use('/api/v1/users', UsersProfilesRouter);
app.use('/api/v1/accounts', Authorization, AccountsRouter);
app.use('/api/v1/transactions', Authorization, TransactionRouter);
app.use('/api/v1/authenticate', Authenticate);
app.use('/api/v1/register', newUser);

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

app.listen(3000, () => console.log('Start on 3000'));
