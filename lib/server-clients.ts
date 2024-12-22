import {
  createSafeActionClient,
  DEFAULT_SERVER_ERROR_MESSAGE,
} from 'next-safe-action'

export const actionClient = createSafeActionClient({
  handleReturnedServerError(e) {
    // and return them with their actual messages to the client.
    console.log('handling server error ', e)
    if (e instanceof Error) {
      return e.message
    }

    // Every other error that occurs will be masked with the default message.
    return DEFAULT_SERVER_ERROR_MESSAGE
  },
})
