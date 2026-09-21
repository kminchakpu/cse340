import {
  getUpcomingProjects,
  getProjectDetails,
  createProject
} from '../models/projects.js';

import {
  getCategoriesByProjectId
} from '../models/categories.js';

import {
  getAllOrganizations
} from '../models/organizations.js';

import {
  body,
  validationResult
} from 'express-validator';

// Define validation and sanitization rules for project form
const projectValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 1000 })
    .withMessage('Description must be less than 1000 characters'),
  body('location')
    .trim()
    .notEmpty()
    .withMessage('Location is required')
    .isLength({ max: 200 })
    .withMessage('Location must be less than 200 characters'),
  body('date')
    .notEmpty()
    .withMessage('Date is required')
    .isISO8601()
    .withMessage('Date must be a valid date format'),
  body('organizationId')
    .notEmpty()
    .withMessage('Organization is required')
    .isInt()
    .withMessage('Organization must be a valid integer')
];

const NUMBER_OF_UPCOMING_PROJECTS = 5;

const showProjectsPage = async (req, res, next) => {
  try {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Service Projects';

    res.render('projects', {
      title,
      projects
    });
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

const showNewProjectForm = async (req, res, next) => {
  try {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', {
      title,
      organizations
    });
  } catch (error) {
    next(error);
  }
};

const processNewProjectForm = async (req, res, next) => {
  try {
    // Check for validation errors
    const results = validationResult(req);

    // If validation fails, display errors and return to the form
    if (!results.isEmpty()) {
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      return req.session.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect('/new-project');
      });
    }

    // Get the validated and sanitized form data
    const {
      title,
      description,
      location,
      date,
      organizationId
    } = req.body;

    // Create the new service project
    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId
    );

    // Add success flash message
    req.flash(
      'success',
      'New service project created successfully!'
    );

    // Save the session before redirecting
    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(`/project/${newProjectId}`);
    });
  } catch (error) {
    next(error);
  }
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  showNewProjectForm,
  processNewProjectForm,
  projectValidation
};