export const paginationMiddleware = (req, res, next) => {

    // Récuperation des  données de pagniation depuis l'url
    const offsetUrl = parseInt(req.query.offset);
    const limitUrl = parseInt(req.query.limit);

    // Injection des informations dans l'objet request
    req.pagination = {
        offset: !isNaN(offsetUrl) ? offsetUrl : 0,
        limit: !isNaN(limitUrl) ? limitUrl : 20
    };

    // Middleware suivant !
    next();
}