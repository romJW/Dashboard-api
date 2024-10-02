"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPError = void 0;
class HTTPError extends Error {
    constructor(statusCode, message, context) {
        super(message);
    }
}
exports.HTTPError = HTTPError;
//# sourceMappingURL=http-error.class.js.map