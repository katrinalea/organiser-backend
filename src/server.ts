import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { Client } from "pg";
import { getEnvVarOrFail } from "./support/envVarUtils";
import { setupDBClientConfig } from "./support/setupDBClientConfig";

dotenv.config(); //Read .env file lines as though they were env vars.

const dbClientConfig = setupDBClientConfig();
const client = new Client(dbClientConfig);

//Configure express routes
const app = express();

app.use(express.json()); //add JSON body parser to each following route handler
app.use(cors()); //add CORS support to each following route handler

app.get("/", async (req, res) => {
  res.json({ msg: "Hello! There's nothing interesting for GET /" });
});

app.get("/health-check", async (req, res) => {
  try {
    //For this to be successful, must connect to db
    await client.query("select now()");
    res.status(200).send("system ok");
  } catch (error) {
    //Recover from error rather than letting system halt
    console.error(error);
    res.status(500).send("An error occurred. Check server logs.");
  }
});

//-------------------------------------------------------------------------- get requests

app.get("/todo/items", async (req, res) => {
  try {
    const text = "select * from todolist where completed = 'false'";
    const dbResponse = await client.query(text);
    res.status(200).json({
      status: "success",
      data: dbResponse.rows,
    });
  } catch (err) {
    console.error(err);
  }
});

app.get("/todo/items/completed", async (req, res) => {
  console.log("entered complete");
  const text = "select * from todolist where completed = 'true'";
  const dbResponse = await client.query(text);
  res.status(200).json({
    status: "success",
    data: dbResponse.rows,
  });
});

app.get("/phonebook/items", async (req, res) => {
  const text = "select * from phonebook";
  const dbResponse = await client.query(text);
  res.status(200).json({
    status: "success",
    data: dbResponse.rows,
  });
});

app.get("/addressbook/entries", async (req, res) => {
  const text = "select * from addressbook";
  const dbResponse = await client.query(text);
  res.status(200).json({
    status: "success",
    data: dbResponse.rows,
  });
});

app.get("/notes/items", async (req, res) => {
  const text = "select * from notes";
  const dbResponse = await client.query(text);
  res.status(200).json({
    status: "success",
    data: dbResponse.rows,
  });
});


app.get("/quotes", async (req, res) => {
  const text = "select * from quotes";
  const dbResponse = await client.query(text);
  res.status(200).json({
    status: "success",
    data: dbResponse.rows,
  });
});


//-------------------------------------------------------------------------- post requests
app.post("/todo/items", async (req, res) => {
  const { message, completed } = req.body;
  console.log("whole req.bdoy", req.body);
  if (message.length > 1) {
    const text =
      "insert into todolist (message, completed) values ($1, $2) returning *";
    const values = [message, completed];
    const dbResult = await client.query(text, values);
    res.status(201).json({
      status: "success",
      data: dbResult.rows,
    });
  } else {
    res.status(400).json({
      status: "fail",
      data: {
        message: " A message value is required",
      },
    });
  }
});

app.post("/phonebook/items", async (req, res) => {
  const { first_name, second_name, phonenumber } = req.body;
  console.log("entered post");
  if (first_name.length > 1 && second_name.length > 1) {
  const text =
    "insert into phonebook (first_name, second_name, phonenumber) values ($1, $2, $3) returning *";
  const values = [first_name, second_name, phonenumber];
  const dbResult = await client.query(text, values);
  res.status(201).json({
    status: "success",
    data: dbResult.rows,
  });
} else {
  res.status(400).json({
    status: "fail",
    data: {
      message: " A string is required",
    },
  });

}
});

app.post("/addressbook/entries", async (req, res) => {
  const { first_name, second_name, street_name, house_number, postcode, town } =
    req.body;
  console.log("entered post");
  const text =
    "insert into addressbook (first_name, second_name, street_name, house_number, postcode, town) values ($1, $2, $3, $4, $5, $6) returning *";
  const values = [
    first_name,
    second_name,
    street_name,
    house_number,
    postcode,
    town,
  ];
  const dbResult = await client.query(text, values);
  res.status(201).json({
    status: "success",
    data: dbResult.rows,
  });
});

app.post("/notes/items", async (req, res) => {
  const { title, message } = req.body;
  console.log("entered post");
  const text =
    "insert into notes (title, message) values ($1, $2) returning *";
  const values = [title, message];
  const dbResult = await client.query(text, values);
  res.status(201).json({
    status: "success",
    data: dbResult.rows,
  });
});

//-------------------------------------------------------------------------- patch requetss

app.patch("/todo/items/:id", async (req, res) => {
  const { id } = req.body;
  const text = "update todolist set completed = 'true' where id = $1";
  const values = [id];
  const dbResponse = await client.query(text, values);
  res.status(200).json({
    status: "success",
    data: dbResponse.rows,
  });
});

interface update {
  id: number;
  message: string;
}

app.patch("/todo/update", async (req, res) => {
  console.log("entered update patch", req.body);
  const { id, message }: update = req.body;
  console.log(id, message, req.body);
  try {
    const text = "update todolist set message = $1 where id = $2";
    const values = [message, id];
    const dbResponse = await client.query(text, values);
    res.status(200).json({
      status: "success",
      data: dbResponse.rows,
    });
  } catch (err) {
    console.error(err);
  }
});

//-------------------------------------------------------------------------- delete requests
app.delete("/todo/items/:id", async (req, res) => {
  const id = req.body.id;
  const text = "delete from todolist where id = $1";
  const value = [id];
  await client.query(text, value);
  res.status(200).json({
    status: "success",
  });
});

app.delete("/todo/items/completed", async (req, res) => {
  const text = "delete from todolist where completed = 'false'";
  await client.query(text);
  res.status(200).json({
    status: "success",
  });
});

connectToDBAndStartListening();

async function connectToDBAndStartListening() {
  console.log("Attempting to connect to db");
  await client.connect();
  console.log("Connected to db!");

  const port = getEnvVarOrFail("PORT");
  app.listen(port, () => {
    console.log(
      `Server started listening for HTTP requests on port ${port}.  Let's go!`
    );
  });
}
