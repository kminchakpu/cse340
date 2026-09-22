import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  createCategory,
  updateCategory,
  updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import {
  body,
  validationResult
} from 'express-validator';

const categoryValidation = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Category name is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Category name must be between 3 and 100 characters')
];

const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', {
      title,
      categories
    });
  } catch (error) {
    next(error);
  }
};

const showCategoryDetailsPage = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      const error = new Error('Category Not Found');
      error.status = 404;
      return next(error);
    }

    const projects = await getProjectsByCategoryId(categoryId);
    const title = category.name;

    res.render('category', {
      title,
      category,
      projects
    });
  } catch (error) {
    next(error);
  }
};

const showNewCategoryForm = async (req, res, next) => {
  try {
    const title = 'Add New Category';

    res.render('new-category', {
      title
    });
  } catch (error) {
    next(error);
  }
};

const processNewCategoryForm = async (req, res, next) => {
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

        res.redirect('/new-category');
      });
    }

    const { name } = req.body;

    const newCategoryId = await createCategory(name);

    req.flash(
      'success',
      'New category created successfully!'
    );

    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(`/category/${newCategoryId}`);
    });
  } catch (error) {
    next(error);
  }
};

const showEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const category = await getCategoryById(categoryId);

    if (!category) {
      const error = new Error('Category Not Found');
      error.status = 404;
      return next(error);
    }

    const title = 'Edit Category';

    res.render('edit-category', {
      title,
      category
    });
  } catch (error) {
    next(error);
  }
};

const processEditCategoryForm = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    const results = validationResult(req);

    if (!results.isEmpty()) {
      results.array().forEach((error) => {
        req.flash('error', error.msg);
      });

      return req.session.save((err) => {
        if (err) {
          return next(err);
        }

        res.redirect(`/edit-category/${categoryId}`);
      });
    }

    const { name } = req.body;

    await updateCategory(categoryId, name);

    req.flash(
      'success',
      'Category updated successfully!'
    );

    req.session.save((err) => {
      if (err) {
        return next(err);
      }

      res.redirect(`/category/${categoryId}`);
    });
  } catch (error) {
    next(error);
  }
};

const showAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const projectDetails = await getProjectDetails(projectId);

    if (!projectDetails) {
      const error = new Error('Project Not Found');
      error.status = 404;
      return next(error);
    }

    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);
    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
      title,
      projectId,
      projectDetails,
      categories,
      assignedCategories
    });
  } catch (error) {
    next(error);
  }
};

const processAssignCategoriesForm = async (req, res, next) => {
  try {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];

    const categoryIdsArray = Array.isArray(selectedCategoryIds)
      ? selectedCategoryIds
      : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');

    res.redirect(`/project/${projectId}`);
  } catch (error) {
    next(error);
  }
};

export {
  showCategoriesPage,
  showCategoryDetailsPage,
  showNewCategoryForm,
  processNewCategoryForm,
  showEditCategoryForm,
  processEditCategoryForm,
  showAssignCategoriesForm,
  processAssignCategoriesForm,
  categoryValidation
};