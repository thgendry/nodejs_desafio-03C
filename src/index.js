const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

const repositories = [];

function checkRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repo = repositories.find((repo) => repo.id === id);

  if (!repo) {
    return response.status(404).json({ error: "Repository not found." });
  }

  request.repo = repo;

  return next();
}

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const updatedRepo = repositories.find(repository => repository.id === id);

  if (title) {
    updatedRepo.title = title
  };
  if (url) {
    updatedRepo.url = url
  };
  if (techs) {
    updatedRepo.techs = techs
  };

  return response.json(updatedRepo);
});

app.delete("/repositories/:id", checkRepositoryExists, (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories
    .findIndex(repository => repository.id === id);

  repositories.splice(repositoryIndex, 1);

  return response.status(204).json();
});

app.post("/repositories/:id/like", checkRepositoryExists, (request, response) => {
  const repository = request.repo;

  repository.likes += 1;

  return response.json({ likes: repository.likes });
});

module.exports = app;
