export class DomainError extends Error {
    constructor(message: string) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends DomainError {
    constructor(resource: string, id?: string) {
        super(id ? `${resource} with id ${id} not found` : `${resource} not found`);
    }
}

export class ValidationError extends DomainError {
    constructor(message: string) {
        super(`Validation error: ${message}`);
    }
}

export class UnauthorizedError extends DomainError {
    constructor(message: string = 'Unauthorized access') {
        super(message);
    }
}

export class DuplicateError extends DomainError {
    constructor(resource: string, field: string) {
        super(`${resource} with this ${field} already exists`);
    }
}

export class AuthenticationError extends DomainError {
    constructor(message: string = 'Authentication failed') {
        super(message);
    }
}
