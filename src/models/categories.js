import db from './db.js'

const getAllCategories = async () => {
  try {
    const query = `
      SELECT category_id, name
      FROM public.category
      ORDER BY name;
    `
    const result = await db.query(query)
    return result.rows
  } catch (error) {
    console.error('Database error in getAllCategories:', error.message)
    return []
  }
}

const getCategoryById = async (categoryId) => {
  const query = `
    SELECT
      category_id,
      name
    FROM public.category
    WHERE category_id = $1;
  `
  const queryParams = [categoryId]
  const result = await db.query(query, queryParams)
  return result.rows.length > 0 ? result.rows[0] : null
}

const getProjectsByCategoryId = async (categoryId) => {
  const query = `
    SELECT
      project.project_id,
      project.organization_id,
      project.title,
      project.description,
      project.location,
      project.date
    FROM public.project
    JOIN public.project_category
      ON project.project_id = project_category.project_id
    WHERE project_category.category_id = $1
    ORDER BY project.date;
  `
  const queryParams = [categoryId]
  const result = await db.query(query, queryParams)
  return result.rows
}

const getCategoriesByProjectId = async (projectId) => {
  const query = `
    SELECT
      category.category_id,
      category.name
    FROM public.category
    JOIN public.project_category
      ON category.category_id = project_category.category_id
    WHERE project_category.project_id = $1
    ORDER BY category.name;
  `
  const queryParams = [projectId]
  const result = await db.query(query, queryParams)
  return result.rows
}

const createCategory = async (name) => {
  const query = `
    INSERT INTO public.category (name)
    VALUES ($1)
    RETURNING category_id;
  `
  const queryParams = [name]
  const result = await db.query(query, queryParams)

  if (result.rows.length === 0) {
    throw new Error('Failed to create category')
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log(
      'Created new category with ID:',
      result.rows[0].category_id
    )
  }

  return result.rows[0].category_id
}

const updateCategory = async (categoryId, name) => {
  const query = `
    UPDATE public.category
    SET name = $1
    WHERE category_id = $2
    RETURNING *;
  `
  const queryParams = [name, categoryId]
  const result = await db.query(query, queryParams)

  if (result.rows.length === 0) {
    throw new Error('Failed to update category')
  }

  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log(
      'Updated category with ID:',
      result.rows[0].category_id
    )
  }

  return result.rows[0]
}

const assignCategoryToProject = async (categoryId, projectId) => {
  const query = `
    INSERT INTO public.project_category (category_id, project_id)
    VALUES ($1, $2);
  `
  await db.query(query, [categoryId, projectId])
}

const updateCategoryAssignments = async (projectId, categoryIds) => {
  const deleteQuery = `
    DELETE FROM public.project_category
    WHERE project_id = $1;
  `
  await db.query(deleteQuery, [projectId])

  for (const categoryId of categoryIds) {
    await assignCategoryToProject(categoryId, projectId)
  }
}

export {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByProjectId,
  createCategory,
  updateCategory,
  updateCategoryAssignments
}