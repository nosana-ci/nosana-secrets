import { ValidationError as ValidationErrorYup } from "yup";

export class GenericError extends Error {
  body: { message: string; error: Error | undefined };
  constructor(message: string, error?: Error) {
    super(message);

    this.body = { message, error };
  }
}

export class BadRequestError extends GenericError {}
export class ForbiddenError extends GenericError {}
export class NotFoundError extends GenericError {}
export class TooManyRequestsError extends GenericError {}
export class InternalServerError extends GenericError {}
export class ValidationError extends ValidationErrorYup {}
