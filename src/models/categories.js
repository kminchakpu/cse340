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

export { getAllCategories }