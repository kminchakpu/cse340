-- ========================================
-- Organization Table
-- ========================================

CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================

INSERT INTO organization (
    name,
    description,
    contact_email,
    logo_filename
)
VALUES
(
    'BrightFuture Builders',
    'A nonprofit focused on improving community infrastructure through sustainable construction projects.',
    'info@brightfuturebuilders.org',
    'brightfuture-logo.png'
),
(
    'GreenHarvest Growers',
    'An urban farming collective promoting food sustainability and education in local neighborhoods.',
    'contact@greenharvest.org',
    'greenharvest-logo.png'
),
(
    'UnityServe Volunteers',
    'A volunteer coordination group supporting local charities and service initiatives.',
    'hello@unityserve.org',
    'unityserve-logo.png'
);


-- ========================================
-- Project Table
-- ========================================

CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
);


-- ====================================================
-- Insert sample data: BrightFuture Builders Projects
-- ====================================================

INSERT INTO project
    (organization_id, title, description, location, date)
VALUES
    (
        1,
        'Community Park Restoration',
        'Restore and improve a local community park through sustainable construction and landscaping.',
        'Abuja Community Park',
        '2026-09-12'
    ),
    (
        1,
        'Sustainable Housing Workshop',
        'Teach community members about sustainable and affordable construction methods.',
        'Abuja Civic Center',
        '2026-09-19'
    ),
    (
        1,
        'School Building Renovation',
        'Renovate classrooms and improve learning facilities for students in the community.',
        'Matama Primary School, Abuja',
        '2026-09-26'
    ),
    (
        1,
        'Clean Water Facility Project',
        'Assist with the construction and improvement of a clean water facility for local residents.',
        'Wura Apo Community, Abuja',
        '2026-10-03'
    ),
    (
        1,
        'Community Garden Construction',
        'Build sustainable garden spaces that provide food and educational opportunities for residents.',
        'Wuse Community Garden, Abuja',
        '2026-10-10'
    );



-- ======================================================
-- Insert sample data: GreenHarvest Growers projects
-- ======================================================

    INSERT INTO project
    (organization_id, title, description, location, date)
VALUES
    (
        2,
        'Urban Garden Initiative',
        'Create community gardens to promote local food production and environmental sustainability.',
        'Bwari Urban District, Abuja',
        '2026-09-13'
    ),
    (
        2,
        'Youth Farming Workshop',
        'Teach young people practical farming skills and sustainable food production techniques.',
        'GreenHarvest Learning Center, Niger',
        '2026-09-20'
    ),
    (
        2,
        'Community Composting Day',
        'Introduce residents to composting and environmentally responsible waste management.',
        'Accra, Ghana',
        '2026-09-27'
    ),
    (
        2,
        'School Garden Project',
        'Develop a school garden where students can learn about agriculture and food sustainability.',
        'Freetown Secondary School, Siera Leon',
        '2026-10-04'
    ),
    (
        2,
        'Harvest and Nutrition Fair',
        'Organize a community event focused on local food, nutrition, farming, and healthy living.',
        'Abuja Civic Center',
        '2026-10-11'
    );


    -- ====================================================
    -- Insert sample data: UnityServe Volunteers Projects
    -- ====================================================

    INSERT INTO project
    (organization_id, title, description, location, date)
VALUES
    (
        3,
        'Community Food Drive',
        'Collect and distribute food items to families and individuals who need assistance.',
        'Kigali Community Hall, Rwanda',
        '2026-09-14'
    ),
    (
        3,
        'Neighborhood Cleanup',
        'Bring volunteers together to clean public spaces and improve the local environment.',
        'Central Kinshasha, DRC',
        '2026-09-21'
    ),
    (
        3,
        'Senior Support Day',
        'Provide assistance and companionship to elderly members of the community.',
        'Kathmandu Senior Center, Nepal',
        '2026-09-28'
    ),
    (
        3,
        'Charity Clothing Drive',
        'Collect gently used clothing and distribute items to families in need.',
        'UnityServe Community Center',
        '2026-10-05'
    ),
    (
        3,
        'Community Volunteer Fair',
        'Connect volunteers with local charities and organizations seeking service assistance.',
        'Lagos Civic Center',
        '2026-10-12'
    );




    SELECT * FROM project;


    SELECT
    project.project_id,
    project.title,
    project.description,
    project.location,
    project.date,
    organization.name AS organization_name
FROM project
JOIN organization
    ON project.organization_id = organization.organization_id
ORDER BY project.date;