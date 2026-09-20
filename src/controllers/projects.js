import {
  getUpcomingProjects,
  getProjectDetails
} from '../models/projects.js';

import {
  getCategoriesByProjectId
} from '../models/categories.js';

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Service Projects';

    res.render('projects', { title, projects });
  } catch (error) {
    next(error);
  }
};

const showProjectDetailsPage = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const error = new Error('Project Not Found');
      error.status = 404;
      return next(error);
    }

    const categories = await getCategoriesByProjectId(projectId);

    const title = 'Project Details';

    res.render('project', {
      title,
      project,
      categories
    });
  } catch (error) {
    next(error);
  }
};

export {
  showProjectsPage,
  showProjectDetailsPage
};