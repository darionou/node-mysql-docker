const mysql = require('mysql2');

const { parseResult } = require('./helpers');

const {
  DB_USER, DB_PASSWORD, DB_NAME, DB_HOST, DB_PORT,
} = process.env;

const pool = mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}).promise();

/**
 * 
 * Get project by id with jobs
 */
const getProjectById = async (req, res) => {
  try{
    const {id} = req.params;
    const [result] = await pool.query(`
    SELECT Projects.title as projectTitle, Projects.id as id, Jobs.id as jobsId, Jobs.price as jobPrice, Jobs.status as jobStatus
    FROM Projects LEFT JOIN Jobs ON Projects.id = Jobs.projectId WHERE Projects.id = ${id}`);
  
    const jobs = result.reduce((acc, item) => {
      acc[`jobs`] = (acc[`jobs`] || []);
      acc[`jobs`].push({price: item.jobPrice, id: item.jobsId, status: item.jobStatus});
      return acc;
    }, {});

    const response = {
      id: result[0].id,
      title: result[0].projectTitle,
      ...jobs,
    }

    res.json(response || null);

  } catch (error) {
    res.status(500).send("Internal Server Error");
  }

};

/**
 * 
 * get all project with jobs
 */
const getProjects = async (req, res) => {

  try {
    const [result] = await pool.query(`
    SELECT Projects.title as projectTitle, Projects.id as id, Jobs.id as jobId, Jobs.price as jobPrice, Jobs.status as jobStatus
    FROM Projects LEFT JOIN Jobs ON Projects.id = Jobs.projectId`);
  
    const response = parseResult(result);
  
    res.json(response || []);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

/**
 * add a project with a job
 */
const addProject = async (req, res) => {
  try {
    const { title, price, status } = req.body;

    const [result] = await pool.query(`INSERT INTO Projects (title) VALUES ('${title}')`);
    const id = result.insertId;
    await pool.query(`INSERT INTO Jobs (price, status, projectId) VALUES ('${price}', '${status}', '${id}')`)

    res.json({title, price, status, id});
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};


/**
 * Get all jobs, 
 * It can recieves status and order: asc | desc
 */
const getJobs = async (req, res) => {
  try {
    const {status, order} = req.query;
    if(order && !['asc', 'desc'].includes(order)) res.status(401).send("Invalid order - use asc | desc");

    const [result] = await pool.query(`
    SELECT Jobs.id as jobId, Jobs.price as jobPrice, Jobs.status as jobStatus
    FROM Jobs ${status ? `WHERE status = ${status}` : ''} ${order ? `ORDER BY creationDate ${order}` : ''}`);
  
    res.json(result || []);

  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
}

/**
 * update a specific job
 */
const updateJob = async (req, res) => {
  try {
    const {id} = req.params;
    const {status} = req.body;

    await pool.query(`
      UPDATE Jobs
      SET status = '${status}'
      WHERE id = ${id}
    `);
  
    const response = {
      id,
      status,
    }
    res.status(201).json(response);
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

module.exports = {
  addProject,
  getProjectById,
  getProjects,
  getJobs,
  updateJob,
}