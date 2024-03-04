import { type Request, type Response } from 'express'
import { ApplicationService } from '../services/applicationService'
import AuthService from '../services/authService'
import { createToken } from '../middleware/auth.middleware'
import Logger from '../util/Logger'

/**
 * Controller for user-related operations in an Express application.
 * Provides static methods for handling login, registration, fetching user applications, and logout functionalities.
 */
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class UserController {
  /**
   * Handles user login requests. Authenticates the user with provided credentials,
   * and on successful authentication, returns the user's details along with a JWT token.
   * If authentication fails, responds with an appropriate error message.
   *
   * @param {Request} req - The Express request object containing login credentials.
   * @param {Response} res - The Express response object used for sending back the login response.
   * @returns {Promise<void>} A promise that resolves with no return value.
   */
  public static async login (req: Request, res: Response): Promise<void> {
    const { username, password } = req.body

    try {
      const user = await AuthService.login({ username, password })

      if (user === null || user === undefined) {
        res.status(401).send({ error: { errorCode: 1, message: 'Invalid credentials' } }) /** Remove later */
        Logger.logException(new Error('Something wrong with the inputs'), { file: 'UserController.ts', reason: 'Invalid credentials' })
        return
      }
      const foundUser = {
        name: user.name,
        surname: user.surname,
        pnr: user.pnr,
        email: user.email,
        username: user.username,
        role_id: user.role_id
      }

      const token = createToken(foundUser.email)
      res.cookie('jwt', token, { httpOnly: true })

      res.json({ message: 'Login successful', foundUser })
      Logger.log('info', 'Login successful', { file: 'UserController.ts', reason: 'User logged in successfully.' })
    } catch (error) {
      res.status(500).send('error logging in')
      Logger.logException(new Error('Something went wrong with the login'),
        { file: 'UserController.ts', reason: 'Login was unsuccessful.' })
    }
  }

  /**
   * Handles user registration requests. Registers a new user with the provided details
   * and returns the newly created user's details along with a JWT token.
   * If registration fails, responds with an appropriate error message.
   *
   * @param {Request} req - The Express request object containing user registration details.
   * @param {Response} res - The Express response object used for sending back the registration response.
   * @returns {Promise<void>} A promise that resolves with no return value.
   */
  public static async register (req: Request, res: Response): Promise<void> {
    const userDTO = req.body

    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const user = await AuthService.register(userDTO)
      if (user === null || user === undefined) {
        res.status(401).send('Invalid credentials')
        Logger.logException(new Error('Something wrong with the inputs'), { file: 'UserController.ts', reason: 'Invalid credentials' })
        return
      }
      if (typeof user === 'string') {
        res.status(401).send(user)
      } else {
        const createdUser = {
          person_id: user.person_id,
          name: user.name,
          surname: user.surname,
          pnr: user.pnr,
          email: user.email,
          username: user.username,
          role_id: user.role_id
        }

        const token = createToken(createdUser.email)
        res.cookie('jwt', token, { httpOnly: true })

        res.json({ message: 'Register successful', createdUser })
        Logger.log('info', 'Register successful', { file: 'UserController.ts', reason: 'Registration was successful.' })
      }
    } catch (error) {
      Logger.logException(new Error('Something went wrong with the registration'),
        { file: 'UserController.ts', reason: 'Registration was unsuccessful.' })
      res.status(500).send(error)
    }
  }

  /**
   * Retrieves and sends all applications associated with the user.
   * Requires authentication and appropriate user permissions.
   *
   * @param {Request} req - The Express request object, potentially containing filters or identifiers.
   * @param {Response} res - The Express response object used for sending back the applications.
   * @returns {Promise<void>} A promise that resolves with no return value, sending the applications in the response.
   */
  public static async getUserApplications (
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const applications = await ApplicationService.getAllApplications()
      res.json({ message: 'Applications gotten successfully', applications })
      Logger.log('info', 'Applications gotten successfully', { file: 'UserController.ts', reason: 'Sent all applications' })
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send(error.message)
      } else {
        res.status(500).send('An unknown error occurred')
        Logger.logException(new Error('An unknown error occurred'),
          { file: 'UserController.ts', reason: 'Error in getting user applications' })
      }
    }
  }

  /**
   * Handles user logout requests. Clears the JWT token cookie, effectively logging the user out.
   *
   * @param {Request} req - The Express request object, not used in this method but required for consistency.
   * @param {Response} res - The Express response object used for sending back the logout confirmation.
   * @param {NextFunction} next - The next middleware function in the Express request-response cycle.
   * @returns {Promise<void>} A promise that resolves with no return value.
   */
  public static async logout (
    res: Response
  ): Promise<void> {
    res.clearCookie('jwt')
    res.status(200).send('User logged out successfully')
    Logger.log('info', 'User has been logged out', { file: 'UserController.ts', reason: 'Logged Out' })
  }
}
export default UserController
