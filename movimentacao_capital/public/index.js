const express = require('express');
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config(); // Carrega as variáveis de ambiente do arquivo .env

const app = express();
const port = 3000;

// Configurando o Express para usar o EJS como mecanismo de visualização
app.set('view engine', 'ejs');

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Servindo arquivos estáticos (CSS, JavaScript, imagens, etc.)
app.use(express.static(path.join(__dirname, 'public'), {
  // Definindo tipos MIME para arquivos CSS e JavaScript
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    } else if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Middleware para analisar dados de formulário codificados
app.use(express.urlencoded({ extended: true }));

// Rota para a página inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para lidar com a busca
app.post('/buscar', async (req, res) => {
  const { nr_matricula, data_inicio, data_fim } = req.body;
  try {
    const query = `
      SELECT * FROM camda.view_movimento_capital
      WHERE codigo_operacao NOT IN (982, 1201, 1242, 1243, 1244, 1245, 1251)
      AND nr_matricula = $1
      AND dt_movimento BETWEEN $2 AND $3
    `;
    const values = [nr_matricula, data_inicio, data_fim];
    const result = await pool.query(query, values);
    // Renderizando a página resultado.ejs e passando os resultados da consulta como dados
    res.render('resultado', { resultados: result.rows });
  } catch (error) {
    console.error('Erro ao executar a consulta:', error);
    res.status(500).send('Erro interno do servidor');
  }
});

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
