

/*
const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  host: '98.83.69.254',  // Cambiar según sea necesario
  port: 8006,            // Cambiar según sea necesario
  user: 'postgres',      // Cambiar según sea necesario
  password: 'utec',      // Cambiar según sea necesario
  database: 'servicio_prestamos'  // Cambiar según sea necesario
});

const app = express();
app.use(express.json());

// RUTA 1: Registrar un préstamo de un libro
app.post('/loans', async (req, res) => {
  const { title, author_name, user_name, user_email, loan_date, return_date } = req.body;

  try {
    // Paso 1: Verificar si el usuario ya está registrado
    const userResult = await pool.query('SELECT id FROM users WHERE name = $1 AND email = $2', [user_name, user_email]);
    let user_id;

    if (userResult.rows.length > 0) {
      user_id = userResult.rows[0].id;  // El usuario ya existe
    } else {
      // El usuario no existe, agregarlo a la base de datos
      const newUser = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
        [user_name, user_email]
      );
      user_id = newUser.rows[0].id;
    }

    // Paso 2: Obtener el book_id llamando al microservicio 1 (Python) para obtener el ID del libro
    const response = await axios.get(`http://api-microservicio1_c:8001/books/get_book_id`, {
      params: { title, author_name }
    });
    const book_id = response.data.book_id;

    // Paso 3: Registrar el préstamo en la tabla loans
    await pool.query(
      'INSERT INTO loans (book_id, user_id, loan_date, return_date) VALUES ($1, $2, $3, $4)',
      [book_id, user_id, loan_date, return_date]
    );

    res.status(201).send({ message: 'Loan registered successfully!' });

  } catch (error) {
    console.error('Error processing loan:', error);
    res.status(500).send({ error: 'An error occurred while processing the loan' });
  }
});

// RUTA 2: Verificar si un libro está prestado
app.get('/loans/check_availability', async (req, res) => {
  const { title, author_name } = req.query;

  try {
    // Paso 1: Obtener el book_id llamando al microservicio 1 (Python)
    const response = await axios.get(`http://api-microservicio1_c:8001/books/get_book_id`, {
      params: { title, author_name }
    });
    const book_id = response.data.book_id;

    // Paso 2: Consultar la tabla loans para ver el historial de préstamos del libro, ordenado por loan_date
    const loansResult = await pool.query(
      'SELECT loan_date, return_date FROM loans WHERE book_id = $1 ORDER BY loan_date DESC',
      [book_id]
    );

    if (loansResult.rows.length === 0) {
      res.send({ message: 'Este libro se encuentra disponible para ser prestado.' });
    } else {
      const lastLoan = loansResult.rows[0];  // Obtener el último préstamo

      const today = new Date();
      const returnDate = new Date(lastLoan.return_date);

      if (returnDate < today) {
        res.send({ message: 'Este libro se encuentra disponible para ser prestado.' });
      } else {
        res.send({
          message: `Este libro actualmente está tomado como prestado hasta el ${lastLoan.return_date}.`
        });
      }
    }

  } catch (error) {
    console.error('Error checking book availability:', error);
    res.status(500).send({ error: 'An error occurred while checking book availability' });
  }
});

// NUEVA RUTA 1: Buscar o registrar un usuario por name y email
app.post('/users/find_or_create', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Verificar si el usuario ya está registrado
    const userResult = await pool.query('SELECT id FROM users WHERE name = $1 AND email = $2', [name, email]);

    if (userResult.rows.length > 0) {
      // El usuario ya existe, devolver el user_id
      const user_id = userResult.rows[0].id;
      res.status(200).send({ user_id });
    } else {
      // El usuario no existe, crearlo y devolver el user_id
      const newUser = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
        [name, email]
      );
      const user_id = newUser.rows[0].id;
      res.status(201).send({ user_id });
    }

  } catch (error) {
    console.error('Error finding or creating user:', error);
    res.status(500).send({ error: 'An error occurred while processing the request' });
  }
});

// NUEVA RUTA 2: Obtener name y email de un usuario por id
app.get('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Buscar el usuario por ID
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [id]);

    if (userResult.rows.length > 0) {
      const { name, email } = userResult.rows[0];
      res.status(200).send({ name, email });
    } else {
      res.status(404).send({ error: 'User not found' });
    }

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ error: 'An error occurred while processing the request' });
  }
});

// NUEVA RUTA: Obtener user_id por name y email
app.get('/users/get_user_id', async (req, res) => {
    const { name, email } = req.query;  // Los parámetros se pasan como query en lugar de body
  
    try {
      // Verificar si el usuario ya está registrado
      const userResult = await pool.query('SELECT id FROM users WHERE name = $1 AND email = $2', [name, email]);
  
      if (userResult.rows.length > 0) {
        // El usuario existe, devolver el user_id
        const user_id = userResult.rows[0].id;
        res.status(200).send({ user_id });
      } else {
        // El usuario no fue encontrado
        res.status(404).send({ error: 'User not found' });
      }
  
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send({ error: 'An error occurred while processing the request' });
    }
  });

// Escuchar en el puerto 8002
app.listen(8002, () => {
  console.log('Microservicio 2 (servicio_prestamos) está corriendo en el puerto 8002');
});*/





/*

use servicio_opiniones

// Crear colección de reviews
db.createCollection("reviews")

// Insertar reseñas con base en los préstamos de libros
db.reviews.insertMany([
    {
        "book_id": 1,  // El universo en tu mano
        "author_id": 1,  // Carlos Pérez Jiménez
        "user_id": 1,  // Juan Pérez
        "rating": 5,
        "comment": "Increíble libro, muy recomendado para los amantes de la ciencia."
    },
    {
        "book_id": 2,  // Caminos a la libertad
        "author_id": 2,  // Eduardo Santos Gallegos
        "user_id": 2,  // María Gómez
        "rating": 4,
        "comment": "Un libro profundo y bien escrito, aunque algo denso en algunas partes."
    },
    {
        "book_id": 3,  // Programación en Python
        "author_id": 3,  // Lucía Mendoza Ríos
        "user_id": 3,  // Carlos Lima
        "rating": 5,
        "comment": "Perfecto para aprender Python desde cero. Muy didáctico."
    },
    {
        "book_id": 4,  // El arte de la guerra moderna
        "author_id": 4,  // María Fernanda Ortega
        "user_id": 4,  // Ana Martínez
        "rating": 3,
        "comment": "Interesante, pero esperaba más profundidad en los análisis estratégicos."
    },
    {
        "book_id": 1,  // El universo en tu mano
        "author_id": 1,  // Carlos Pérez Jiménez
        "user_id": 5,  // Luis Rodríguez
        "rating": 4,
        "comment": "Buena introducción a la ciencia, aunque algunas secciones fueron un poco técnicas."
    }
])

// Comprobar los datos insertados
db.reviews.find().pretty()



*/

const express = require('express');
const { Pool } = require('pg');
const axios = require('axios');

// Configuración de la base de datos PostgreSQL
const pool = new Pool({
  host: '98.83.69.254',  // Cambiar según sea necesario
  port: 8006,            // Cambiar según sea necesario
  user: 'postgres',      // Cambiar según sea necesario
  password: 'utec',      // Cambiar según sea necesario
  database: 'servicio_prestamos'  // Cambiar según sea necesario
});

const app = express();
app.use(express.json());

// RUTA 1: Registrar un préstamo de un libro
app.post('/loans', async (req, res) => {
  const { title, author_name, user_name, user_email, loan_date, return_date } = req.body;

  try {
    console.log(`Verificando si el usuario ${user_name} con email ${user_email} ya está registrado`);
    
    // Paso 1: Verificar si el usuario ya está registrado
    const userResult = await pool.query('SELECT id FROM users WHERE name = $1 AND email = $2', [user_name, user_email]);
    let user_id;

    if (userResult.rows.length > 0) {
      user_id = userResult.rows[0].id;  // El usuario ya existe
      console.log(`Usuario encontrado. ID del usuario: ${user_id}`);
    } else {
      console.log(`Usuario no encontrado. Registrando nuevo usuario`);
      // El usuario no existe, agregarlo a la base de datos
      const newUser = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
        [user_name, user_email]
      );
      user_id = newUser.rows[0].id;
      console.log(`Nuevo usuario registrado. ID del usuario: ${user_id}`);
    }

    // Paso 2: Obtener el book_id llamando al microservicio 1 (Python) para obtener el ID del libro
    console.log(`Obteniendo book_id para el libro "${title}" del autor "${author_name}"`);
    const response = await axios.get(`http://api-microservicio1_c:8001/books/get_book_id`, {
      params: { title, author_name }
    });
    const book_id = response.data.book_id;
    console.log(`Book ID obtenido: ${book_id}`);

    // Paso 3: Registrar el préstamo en la tabla loans
    console.log(`Registrando el préstamo del libro con ID ${book_id} para el usuario con ID ${user_id}`);
    await pool.query(
      'INSERT INTO loans (book_id, user_id, loan_date, return_date) VALUES ($1, $2, $3, $4)',
      [book_id, user_id, loan_date, return_date]
    );

    res.status(201).send({ message: 'Loan registered successfully!' });
    console.log('Préstamo registrado con éxito');

  } catch (error) {
    console.error('Error processing loan:', error);
    res.status(500).send({ error: 'An error occurred while processing the loan' });
  }
});

// RUTA 2: Verificar si un libro está prestado
app.get('/loans/check_availability', async (req, res) => {
  const { title, author_name } = req.query;

  try {
    console.log(`Verificando disponibilidad del libro "${title}" del autor "${author_name}"`);
    
    // Paso 1: Obtener el book_id llamando al microservicio 1 (Python)
    const response = await axios.get(`http://api-microservicio1_c:8001/books/get_book_id`, {
      params: { title, author_name }
    });
    const book_id = response.data.book_id;
    console.log(`Book ID obtenido: ${book_id}`);

    // Paso 2: Consultar la tabla loans para ver el historial de préstamos del libro, ordenado por loan_date
    const loansResult = await pool.query(
      'SELECT loan_date, return_date FROM loans WHERE book_id = $1 ORDER BY loan_date DESC',
      [book_id]
    );

    if (loansResult.rows.length === 0) {
      res.send({ message: 'Este libro se encuentra disponible para ser prestado.' });
      console.log('El libro está disponible para ser prestado.');
    } else {
      const lastLoan = loansResult.rows[0];  // Obtener el último préstamo

      const today = new Date();
      const returnDate = new Date(lastLoan.return_date);

      if (returnDate < today) {
        res.send({ message: 'Este libro se encuentra disponible para ser prestado.' });
        console.log('El libro está disponible para ser prestado.');
      } else {
        res.send({
          message: `Este libro actualmente está tomado como prestado hasta el ${lastLoan.return_date}.`
        });
        console.log(`El libro está prestado hasta el ${lastLoan.return_date}.`);
      }
    }

  } catch (error) {
    console.error('Error checking book availability:', error);
    res.status(500).send({ error: 'An error occurred while checking book availability' });
  }
});

// NUEVA RUTA 1: Buscar o registrar un usuario por name y email
app.post('/users/find_or_create', async (req, res) => {
  const { name, email } = req.body;

  try {
    console.log(`Buscando o registrando usuario con nombre: ${name}, email: ${email}`);

    // Verificar si el usuario ya está registrado
    const userResult = await pool.query('SELECT id FROM users WHERE name = $1 AND email = $2', [name, email]);

    if (userResult.rows.length > 0) {
      // El usuario ya existe, devolver el user_id
      const user_id = userResult.rows[0].id;
      res.status(200).send({ user_id });
      console.log(`Usuario encontrado. ID del usuario: ${user_id}`);
    } else {
      // El usuario no existe, crearlo y devolver el user_id
      console.log('Usuario no encontrado. Registrando nuevo usuario');
      const newUser = await pool.query(
        'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING id',
        [name, email]
      );
      const user_id = newUser.rows[0].id;
      res.status(201).send({ user_id });
      console.log(`Nuevo usuario registrado. ID del usuario: ${user_id}`);
    }

  } catch (error) {
    console.error('Error finding or creating user:', error);
    res.status(500).send({ error: 'An error occurred while processing the request' });
  }
});

// NUEVA RUTA 2: Obtener name y email de un usuario por id
app.get('/users/get_name_email_by_id/:id', async (req, res) => {
  const { id } = req.params;

  try {
    console.log(`Buscando usuario con ID: ${id}`);

    // Buscar el usuario por ID
    const userResult = await pool.query('SELECT name, email FROM users WHERE id = $1', [id]);

    if (userResult.rows.length > 0) {
      const { name, email } = userResult.rows[0];
      res.status(200).send({ name, email });
      console.log(`Usuario encontrado: ${name}, ${email}`);
    } else {
      res.status(404).send({ error: 'User not found' });
      console.log('Usuario no encontrado');
    }

  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ error: 'An error occurred while processing the request' });
  }
});


app.get('/users/get_user_id', async (req, res) => {
    const { name, email } = req.query;  // Los parámetros se pasan como query en lugar de body

    try {
      console.log(`Buscando user_id para nombre: ${name}, email: ${email}`);

      // Validar que name y email sean strings válidos
      if (typeof name !== 'string' || typeof email !== 'string') {
          return res.status(400).send({ error: 'Invalid name or email format' });
      }
  
      // Verificar si el usuario ya está registrado
      const userResult = await pool.query('SELECT id FROM users WHERE name = $1 AND email = $2', [name, email]);
  
      if (userResult.rows.length > 0) {
        // El usuario existe, devolver el user_id
        const user_id = userResult.rows[0].id;
        res.status(200).send({ user_id });
        console.log(`User ID obtenido: ${user_id}`);
      } else {
        // El usuario no fue encontrado
        res.status(404).send({ error: 'User not found' });
        console.log('Usuario no encontrado');
      }
  
    } catch (error) {
      console.error('Error fetching user:', error);
      res.status(500).send({ error: 'An error occurred while processing the request' });
    }
});

// Escuchar en el puerto 8002
app.listen(8002, () => {
  console.log('Microservicio 2 (servicio_prestamos) está corriendo en el puerto 8002');
});


