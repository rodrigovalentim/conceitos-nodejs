const express = require("express");
const cors = require("cors");
const { uuid, isUuid} = require("uuidv4");

const app = express();

function logRequests(request, response, next) {
  const { method, url } = request;
  const logLabel = `[${method.toUpperCase()}] ${url}`;
  console.time(logLabel);
  next();
  console.timeEnd(logLabel);
}

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryId(request, response, next) {
  const { id } = request.params;
  
  if (!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid Repository Id'});
  }
  return next();
}

app.use(logRequests);
app.use('/repositories/:id', validateRepositoryId);
app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id );
  
  if (index < 0 ) {
    return response.status(400).json({ error: 'Invalid Repository ID'});
  }
  const { title, url, techs } = request.body;
  const { likes } = repositories[index];
  //let repository = repositories[index]
  
  const repository = {id, title, url, techs, likes };
  console.log(repository);
  repositories[index] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id );
  
  if (index < 0 ) {
    return response.status(400).json({ error: 'Invalid Repository ID'});
  }

  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex(repository => repository.id === id );
  
  if (index < 0 ) {
    return response.status(400).json({ error: 'Invalid Repository ID'});
  }

  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
