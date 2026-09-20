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

export {
  getAllCategories,
  getCategoryById,
  getProjectsByCategoryId,
  getCategoriesByProjectId
}