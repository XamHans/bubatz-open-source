import { createSafeActionClient } from 'next-safe-action';
import { logger } from './logger';

export const actionClient = createSafeActionClient({
    // Can also be an async function.
    handleServerErrorLog(originalError, utils) {
        // You can access these properties inside the `utils` object.
        // Note that here you also have access to the custom server error defined by `handleReturnedServerError`.
        const { clientInput, bindArgsClientInputs, metadata, ctx, returnedError } =
            utils;

        // We can, for example, also send the error to a dedicated logging system.
        //reportToErrorHandlingSystem(originalError);
        logger.info(utils);
        // And also log it to the console.
        logger.error('Server  error:', originalError.message);
    },
});
