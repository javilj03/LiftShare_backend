const express = require('express');
const mongoRouter = require('./src/database/index')
const path = require('path');
const cors = require('cors')

const app = express();
const port = 3000;

app.use(express.json())
app.use(cors())

app.use('/uploads', express.static('/uploads'));
app.get('/', (req, res) => {
  const user = req.user
  res.send('Hello world');
});

app.use('/api', mongoRouter);

// Iniciar el servidor e
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});