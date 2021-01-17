const app = module.exports = require('express')();
const controllers = require('./controllers');

app.get('/', (req, res) => {
  res.json({status: "ok"});
});

app.post('/projects', controllers.addProject);
app.get('/projects/:id', controllers.getProjectById);
app.get('/projects', controllers.getProjects);
app.get('/jobs', controllers.getJobs);
app.patch('/jobs/:id', controllers.updateJob)

app.all('*', (req, res) => {
  res.status(404).end();
});
