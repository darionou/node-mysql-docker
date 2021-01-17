const parseResult = (result) => {
  const projects = {};
  const projectArrayRes = [];
  result.forEach((project) => {
    if(!projects[project.id]) projects[project.id] = [];
    projects[project.id].push({jobsId: project.jobId, jobPrice: project.jobPrice, jobStatus: project.jobStatus});
  })

  for(key in projects) {
    const projectDetails = result.find((elem) => {return elem.id === Number(key)});
    projectArrayRes.push({
      title: projectDetails.projectTitle,
      id: projectDetails.id,
      jobs: projects[key],
    })
  }
  return projectArrayRes;
}

module.exports = {
  parseResult,
}