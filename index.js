const express = require('express');
const mongoRouter = require('./src/database/index')
const path = require('path');
const cors = require('cors')
const expressUploader = require('express-fileupload')

const app = express();
const port = 3000;
app.use(expressUploader())
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  const user = req.user
  res.send('Hello world');
});

app.use('/api', mongoRouter);

// Iniciar el servidor e
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});