class AppError extends Error {
    constructor(message, status) {
        super(); // not sure what this does but it is mandatory
        this.message = message;
        this.status = status;
    }
}

module.exports = AppError;