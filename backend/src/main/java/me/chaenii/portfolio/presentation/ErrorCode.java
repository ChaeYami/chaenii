package me.chaenii.portfolio.presentation;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    // Global
    G001("G001", "Invalid input", HttpStatus.BAD_REQUEST),
    G002("G002", "Resource not found", HttpStatus.NOT_FOUND),
    G003("G003", "Internal server error", HttpStatus.INTERNAL_SERVER_ERROR),
    G004("G004", "Rate limit exceeded", HttpStatus.TOO_MANY_REQUESTS),

    // Auth
    A001("A001", "Invalid credentials", HttpStatus.UNAUTHORIZED),
    A002("A002", "Access denied", HttpStatus.FORBIDDEN),
    A003("A003", "Token expired", HttpStatus.UNAUTHORIZED),

    // Guestbook (Content)
    C001("C001", "Password mismatch", HttpStatus.FORBIDDEN),
    C002("C002", "Guestbook entry not found", HttpStatus.NOT_FOUND),
    C003("C003", "Reply already exists", HttpStatus.CONFLICT);

    private final String code;
    private final String message;
    private final HttpStatus httpStatus;

    ErrorCode(String code, String message, HttpStatus httpStatus) {
        this.code = code;
        this.message = message;
        this.httpStatus = httpStatus;
    }

    public String code() { return code; }
    public String message() { return message; }
    public HttpStatus httpStatus() { return httpStatus; }
}
