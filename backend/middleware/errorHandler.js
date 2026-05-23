export const notFound = (req, res, next) =>
{
    res.status(404).json({
        message: `route not found: ${req.originalUrl}`
    });
};

export const errorHandler = (err, req, res, next) =>
{
    console.error(err.stack);
    
    const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    res.status(status).json({
        message: err.message || 'server error',
    });   

};
