const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const db = require("./queries");
require("dotenv").config();

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.get("/", (request, response) => {
  response.json({ info: "Node.js, Express, and Postgres API" });
});

app.get("/tasks", db.getTasks);
app.get('/tasks/month/:year/:month', db.getTasksByMonth);
app.post("/create-task", db.createTask);
// app.get("/user", db.getUserById);
// app.post("/create-user", db.createUser);
// app.put("/update-user", db.updateUser);
// app.delete("/delete-user", db.deleteUser);



app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}.`);
});