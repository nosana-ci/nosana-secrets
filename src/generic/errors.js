const { ValidationError } = require('yup');

class GenericError extends Error {
    constructor(message, error) {
        super(message);

        if (message && typeof message !== 'string') {
            error = message;
            message = undefined;
        }

        this.body = {message,error};
    }
}

class BadRequestError extends GenericError {}
class ForbiddenError extends GenericError {}
class NotFoundError extends GenericError {}
class TooManyRequestsError extends GenericError {}
class InternalServerError extends GenericError {
    constructor(message, error) {

        // Don't wrap if an error object is passed to constructor.
        if (message instanceof Error) return message;

        super(message, error);
    }
}

module.exports = {
    GenericError,
    BadRequestError,
    ValidationError,
    ForbiddenError,
    NotFoundError,
    TooManyRequestsError,
    InternalServerError
};
