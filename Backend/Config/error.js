/**
 * Error class for handling response errors
 * @param {string} message - Error message
 * @param {number} status - Error status code
 */

class ResponseError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

export { ResponseError };
