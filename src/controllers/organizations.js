import {
    getAllOrganizations,
    getOrganizationDetails,
    createOrganization,
    updateOrganization
} from '../models/organizations.js';
import { getProjectsByOrganizationId } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define validation and sanitization rules for organization form
const organizationValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 150 })
        .withMessage('Organization name must be between 3 and 150 characters'),
    body('description')
        .trim()
        .notEmpty()
        .withMessage('Organization description is required')
        .isLength({ max: 500 })
        .withMessage('Organization description cannot exceed 500 characters'),
    body('contactEmail')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Contact email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
];

const showOrganizationsPage = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', {
        title,
        organizations
    });
};

const showOrganizationDetailsPage = async (req, res) => {
    const organizationId = req.params.id;

    const organizationDetails = await getOrganizationDetails(organizationId);
    const projects = await getProjectsByOrganizationId(organizationId);

    const title = 'Organization Details';

    res.render('organization', {
        title,
        organizationDetails,
        projects
    });
};

const showNewOrganizationForm = async (req, res) => {
    const title = 'Add New Organization';

    res.render('new-organization', {
        title
    });
};

const showEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;
        const organizationDetails = await getOrganizationDetails(organizationId);

        const title = 'Edit Organization';
        res.render('edit-organization', { title, organizationDetails });
    } catch (error) {
        next(error);
    }
};

const processNewOrganizationForm = async (req, res, next) => {
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

                res.redirect('/new-organization');
            });
        }

        // Get the validated and sanitized form data
        const { name, description, contactEmail } = req.body;

        // Use the placeholder logo for new organizations
        const logoFilename = 'placeholder-logo.png';

        // Create the organization
        const organizationId = await createOrganization(
            name,
            description,
            contactEmail,
            logoFilename
        );

        // Add success flash message
        req.flash(
            'success',
            'Organization added successfully!'
        );

        // Save the session before redirecting
        req.session.save((err) => {
            if (err) {
                return next(err);
            }

            res.redirect(`/organization/${organizationId}`);
        });
    } catch (error) {
        next(error);
    }
};

const processEditOrganizationForm = async (req, res, next) => {
    try {
        const organizationId = req.params.id;

        // Check validation errors
        const results = validationResult(req);
        if (!results.isEmpty()) {
            results.array().forEach((error) => {
                req.flash('error', error.msg);
            });

            return req.session.save((err) => {
                if (err) {
                    return next(err);
                }
                res.redirect(`/edit-organization/${organizationId}`);
            });
        }

        const { name, description, contactEmail, logoFilename } = req.body;

        await updateOrganization(
            organizationId,
            name,
            description,
            contactEmail,
            logoFilename
        );

        req.flash('success', 'Organization updated successfully!');

        req.session.save((err) => {
            if (err) {
                return next(err);
            }
            res.redirect(`/organization/${organizationId}`);
        });
    } catch (error) {
        next(error);
    }
};

export {
    showOrganizationsPage,
    showOrganizationDetailsPage,
    showNewOrganizationForm,
    showEditOrganizationForm,
    processNewOrganizationForm,
    processEditOrganizationForm,
    organizationValidation
};