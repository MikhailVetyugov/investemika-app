import type { Instrumentation } from 'next';

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  console.error('[Page render error]', {
    message: error && typeof error === 'object' && 'message' in error ? error.message : '',
    digest: error && typeof error === 'object' && 'digest' in error ? error.digest : '',
    path: request.path,
    method: request.method,
    routePath: context.routePath,
    userAgent: request.headers['user-agent'],
  });
};
