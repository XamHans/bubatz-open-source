import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'
import { logger } from './logger'

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    // In this case, we can use the 'MyCustomError` class to unmask errors
    // and return them with their actual messages to the client.
    if (e instanceof Error) {
      return e.message
    }

    // Every other error that occurs will be masked with the default message.
    return DEFAULT_SERVER_ERROR_MESSAGE
  },
  // Can also be an async function.
  handleServerErrorLog(originalError, utils) {
    // And also log it to the console.
    logger.error(originalError, 'Server  error:')
  },
})
