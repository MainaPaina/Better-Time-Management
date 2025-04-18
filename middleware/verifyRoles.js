const verifyRoles = (allowedRoles) => {
    // Admin authorization middleware
    return (req, res, next) => {
        if (!req.session.user) {
            req.flash('error', 'Please log in to access this page.');
            req.session.returnTo = req.originalUrl;
            return res.redirect('/account/login?return=' + encodeURIComponent(req.originalUrl));
        }
        if (!req.session.user.roles) {
            req.flash('error', 'Please log in to access this page.');
            req.session.returnTo = req.originalUrl;
            return res.redirect('/account/login?return=' + encodeURIComponent(req.originalUrl));
        }
        let hasRole = false;
        for (const role of req.session.user.roles) {
            //console.log('User role:', role); // Log the user role)
            if (allowedRoles.includes(role)) {
                hasRole = true; // Set hasRole to true if the user has one of the allowed roles
                break; // Exit the loop if a matching role is found
            }
        }
        if (!hasRole) {
            req.flash('error', 'Access denied. Admin privileges required.');
            // Redirect non-admins away from admin pages
            return res.redirect('/dashboard?message=No access to this page'); // Or another appropriate non-admin page
        }
        if (!req.user) req.user = req.session.user;
        next();
    };
}

module.exports = verifyRoles;