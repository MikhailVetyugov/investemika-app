export async function GET() {
  const memory = process.memoryUsage();
  
  return Response.json({
    rss: Math.round(memory.rss / 1024 / 1024),
    heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
    heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
    external: Math.round(memory.external / 1024 / 1024),
    version: process.version,
    execArgv: process.execArgv,
    env: {
      NODE_OPTIONS: process.env.NODE_OPTIONS,
      NODE_ENV: process.env.NODE_ENV,
    }
  });
}
