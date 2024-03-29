import {
  type Request,
  type Response,
  type NextFunction,
  type Application
} from 'express'
import Logger from '../util/Logger'
import { ValidationError } from 'sequelize'
/**
 * ErrorHandling class for managing application-wide error handling in an Express application.
 * It utilizes a Logger instance to log exceptions and provides a middleware to handle errors
 * by sending a standardized response or passing the error along if the response headers have already been sent.
 */
class ErrorHandling {
  /**
   * Error handling middleware function.
   * Logs the received error using the Logger instance, checks if response headers have already been sent,
   * and either passes the error to the next error handling middleware or sends a 500 status response.
   *
   * @param err - The error object that was caught.
   * @param req - The request object.
   * @param res - The response object.
   * @param next - The next function to pass control to the next middleware.
   * @returns {void}
   */
  public static handleError (
    err: Error & {
      status?: number
      errorCode?: number
    },
    req: Request,
    res: Response,
    next: NextFunction,
    customStatus?: number
  ): void {
    Logger.logException(err, {
      file: 'ErrorHandling.ts',
      reason: 'Something went wrong from routes'
    })

    if (res.headersSent) {
      next(err)
      return
    }

    // res.status(500).send({ error: "Operation failed." })

    const status = customStatus ?? (err instanceof ValidationError ? 500 : 400)

    const message =
      err.message.length > 0 ? err.message : 'An unexpected error occurred'
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const body = {
      errorCode: err.errorCode ? err.errorCode : -1,
      errorMsg: message
    }

    if (message !== '') {
      this.sendHttpResponse(res, status, body)
    } else {
      // Handle the case where 'message' is an empty string
      this.sendHttpResponse(res, status, {
        errorCode: -1,
        errorMsg: 'Error occurred, but no message provided.'
      })
    }
  }

  /**
   * Registers the error handling middleware within the Express application.
   * This method should be called to add the error handling middleware to the application's middleware stack.
   *
   * @param app - The Express Application instance to which the error handling middleware will be registered.
   * @returns {void}
   */
  public register (app: Application): void {
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      ErrorHandling.handleError(err, req, res, next)
    })
  }

  /**
   * Sends an HTTP response with a given status code and body. Formats the response
   * as a JSON object with either a "success" or "error" key depending on the status code.
   *
   * @param res - The response object.
   * @param status - The HTTP status code for the response.
   * @param body - The response body content. If undefined, sends an empty response.
   */
  private static sendHttpResponse (
    res: Response,
    status: number,
    body?: { errorCode: number, errorMsg: string }
  ): void {
    if (status < 400) {
      res.status(status).json({ success: body })
    } else {
      res.status(status).json({ error: body })
    }
  }
}

export default ErrorHandling
