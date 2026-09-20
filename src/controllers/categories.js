import {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId
} from '../models/categories.js';

const showCategoriesPage = async (req, res, next) => {
  try {
    const categories = await getAllCategories();
    const title = 'Service Categories';
    res.render('categories', { title, categories });
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

export {
  showCategoriesPage,
  showCategoryDetailsPage
};