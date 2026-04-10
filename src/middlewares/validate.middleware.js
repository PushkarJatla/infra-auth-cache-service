const validate = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (err) {
        const errors = err.issues.map(e => e.message);

        return res.status(400).json({
            success: false,
            errors,
        });
    }
};

module.exports = validate;