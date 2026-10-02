import {
  getUpcomingProjects,
  getProjectDetails,
  createProject,
  updateProject
} from '../models/projects.js';
import {
  getCategoriesByProjectId
} from '../models/categories.js';
import {
  getAllOrganizations
} from '../models/organizations.js';
import {
  addVolunteer,
  removeVolunteer,
  isUserVolunteering
} from '../models/volunteers.js';
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
    const projects = await getUpcomingProjects(
      NUMBER_OF_UPCOMING_PROJECTS
    );
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

    const categories = await getCategoriesByProjectId(
      projectId
    );

    let isVolunteering = false;

    if (req.session && req.session.user) {
      isVolunteering = await isUserVolunteering(
        req.session.user.user_id,
        projectId
      );
    }

    const title = 'Project Details';

    res.render('project', {
      title,
      project,
      categories,
      isVolunteering
    });
  } catch (error) {
    next(error);
  }
};

const processVolunteerSignup = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;
    const project = await getProjectDetails(projectId);

    if (!project) {
      const error = new Error('Project Not Found');
      error.status = 404;
      return next(error);
    }

    const volunteer = await addVolunteer(
      userId,
      projectId
    );

    if (volunteer) {
      req.flash(
        'success',
        'You are now volunteering for this project!'
      );
    } else {
      req.flash(
        'success',
        'You are already volunteering for this project.'
      );
    }

    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(`/project/${projectId}`);
    });
  } catch (error) {
    next(error);
  }
};

const processVolunteerRemoval = async (
  req,
  res,
  next
) => {
  try {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    const redirectTo =
      req.body.redirectTo === '/dashboard'
        ? '/dashboard'
        : `/project/${projectId}`;

    const project = await getProjectDetails(projectId);

    if (!project) {
      const error = new Error('Project Not Found');
      error.status = 404;
      return next(error);
    }

    const removedVolunteer = await removeVolunteer(
      userId,
      projectId
    );

    if (removedVolunteer) {
      req.flash(
        'success',
        'You are no longer volunteering for this project.'
      );
    } else {
      req.flash(
        'error',
        'You were not registered as a volunteer for this project.'
      );
    }

    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(redirectTo);
    });
  } catch (error) {
    next(error);
  }
};

const showNewProjectForm = async (
  req,
  res,
  next
) => {
  try {
    const organizations =
      await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', {
      title,
      organizations
    });
  } catch (error) {
    next(error);
  }
};

const processNewProjectForm = async (
  req,
  res,
  next
) => {
  try {
    const results = validationResult(req);

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

    const {
      title,
      description,
      location,
      date,
      organizationId
    } = req.body;

    const newProjectId = await createProject(
      title,
      description,
      location,
      date,
      organizationId
    );

    req.flash(
      'success',
      'New service project created successfully!'
    );

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

const showEditProjectForm = async (
  req,
  res,
  next
) => {
  try {
    const projectId = req.params.id;
    const project = await getProjectDetails(
      projectId
    );

    if (!project) {
      const error = new Error(
        'Project Not Found'
      );
      error.status = 404;
      return next(error);
    }

    const organizations =
      await getAllOrganizations();
    const title = 'Edit Service Project';

    res.render('edit-project', {
      title,
      project,
      organizations
    });
  } catch (error) {
    next(error);
  }
};

const processEditProjectForm = async (
  req,
  res,
  next
) => {
  try {
    const projectId = req.params.id;
    const results = validationResult(req);

    if (!results.isEmpty()) {
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      return req.session.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect(
          `/edit-project/${projectId}`
        );
      });
    }

    const {
      title,
      description,
      location,
      date,
      organizationId
    } = req.body;

    await updateProject(
      projectId,
      title,
      description,
      location,
      date,
      organizationId
    );

    req.flash(
      'success',
      'Service project updated successfully!'
    );

    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(`/project/${projectId}`);
    });
  } catch (error) {
    next(error);
  }
};

export {
  showProjectsPage,
  showProjectDetailsPage,
  processVolunteerSignup,
  processVolunteerRemoval,
  showNewProjectForm,
  processNewProjectForm,
  showEditProjectForm,
  processEditProjectForm,
  projectValidation
};