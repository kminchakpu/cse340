import db from './db.js';

const addVolunteer = async (userId, projectId) => {
  const query = `
    INSERT INTO project_volunteers (user_id, project_id)
    VALUES ($1, $2)
    ON CONFLICT (user_id, project_id) DO NOTHING
    RETURNING user_id, project_id;
  `;
  const queryParams = [userId, projectId];
  const result = await db.query(query, queryParams);
  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log(
      `User ${userId} volunteered for project ${projectId}`
    );
  }
  return result.rows.length > 0 ? result.rows[0] : null;
};

const removeVolunteer = async (userId, projectId) => {
  const query = `
    DELETE FROM project_volunteers
    WHERE user_id = $1
      AND project_id = $2
    RETURNING user_id, project_id;
  `;
  const queryParams = [userId, projectId];
  const result = await db.query(query, queryParams);
  if (process.env.ENABLE_SQL_LOGGING === 'true') {
    console.log(
      `User ${userId} removed volunteer signup for project ${projectId}`
    );
  }
  return result.rows.length > 0 ? result.rows[0] : null;
};

const isUserVolunteering = async (userId, projectId) => {
  const query = `
    SELECT user_id, project_id
    FROM project_volunteers
    WHERE user_id = $1
      AND project_id = $2;
  `;
  const queryParams = [userId, projectId];
  const result = await db.query(query, queryParams);
  return result.rows.length > 0;
};

const getVolunteerProjectsByUserId = async (userId) => {
  const query = `
    SELECT
      p.project_id,
      p.title,
      p.description,
      p.location,
      p.date,
      p.organization_id,
      o.name AS organization_name,
      pv.created_at AS volunteered_at
    FROM project_volunteers pv
    JOIN project p
      ON pv.project_id = p.project_id
    JOIN organization o
      ON p.organization_id = o.organization_id
    WHERE pv.user_id = $1
    ORDER BY p.date ASC;
  `;
  const queryParams = [userId];
  const result = await db.query(query, queryParams);
  return result.rows;
};

export {
  addVolunteer,
  removeVolunteer,
  isUserVolunteering,
  getVolunteerProjectsByUserId
};