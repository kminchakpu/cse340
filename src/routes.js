import express from 'express';
import { showHomePage } from './controllers/index.js';
import { showOrganizationsPage, 
    showOrganizationDetailsPage, 
    showNewOrganizationForm, 
    showEditOrganizationForm,
    processEditOrganizationForm,
    processNewOrganizationForm,
    organizationValidation } from './controllers/organizations.js';
import { showProjectsPage, showProjectDetailsPage } from './controllers/projects.js';
import { showCategoriesPage, showCategoryDetailsPage } from './controllers/categories.js';
import { testErrorPage } from './controllers/errors.js';


const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/organization/:id', showOrganizationDetailsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
// Route for new organization page
router.get('/new-organization', showNewOrganizationForm);

// Route for editing an organization
router.get('/edit-organization/:id', showEditOrganizationForm);

// Route for processing the new organization form
router.post('/new-organization',  organizationValidation, processNewOrganizationForm);

router.post('/edit-organization/:id', organizationValidation, processEditOrganizationForm );



// Error-handling routes
router.get('/test-error', testErrorPage);

export default router;