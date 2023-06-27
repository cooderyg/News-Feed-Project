require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const router = require('./routes/index.route.js');
const { SESSION_SECRET_KEY } = process.env;

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    store: new MemoryStore({ checkPeriod: 1000 * 60 * 60 }),
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
  })
);

app.use('/api', router);

app.listen(PORT, () => {
  console.log(PORT, '포트 번호로 서버가 실행되었습니다.');
});
