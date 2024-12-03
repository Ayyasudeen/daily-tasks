const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getTasks = (request, response) => {
  pool.query("SELECT * FROM daily_tasks ORDER BY id", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getTasksByMonth = (request, response) => {
  const year = request.params.year;
  const month = request.params.month;
  pool.query(
    `SELECT * FROM daily_tasks 
     WHERE DATE_PART('year', task_date) = $1 
     AND DATE_PART('month', task_date) = $2 
     ORDER BY id;`, 
    [year, month], 
    (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const createTask = (request, response) => {
    const { task, date, isCompleted } = request.body;
  
    pool.query(
      `INSERT INTO daily_tasks (task_name, task_date, is_completed) 
       VALUES ($1, $2, $3) 
       ON CONFLICT (task_name, task_date) 
       DO UPDATE SET is_completed = $3 
       RETURNING id`,
      [task, date, isCompleted],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Task added/updated with ID: ${results.rows[0].id}`);
      }
    );
  };

// const getUserById = (request, response) => {
//   const id = request.query.id;
//   pool.query(`SELECT * FROM users WHERE id = ${id}`, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).json(results.rows);
//   });
// };


// const updateUser = (request, response) => {
//   const id = request.query.id;
//   const { name, email } = request.body;

//   pool.query(
//     "UPDATE users SET name = $1, email = $2 WHERE id = $3",
//     [name, email, id],
//     (error, results) => {
//       if (error) {
//         throw error;
//       }
//       response.status(200).send(`User modified with ID: ${id}`);
//     }
//   );
// };

// const deleteUser = (request, response) => {
//   const id = request.query.id;

//   pool.query(`DELETE FROM users WHERE id = ${id}`, (error, results) => {
//     if (error) {
//       throw error;
//     }
//     response.status(200).send(`User deleted with ID: ${id}`);
//   });
// };

module.exports = {
  getTasks,
  getTasksByMonth,
  createTask,
//   getUserById,
//   updateUser,
//   deleteUser,
};