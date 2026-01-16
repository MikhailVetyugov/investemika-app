import { execSync } from 'child_process';

export async function GET() {
  try {
    const memory = process.memoryUsage();

    const nodeProcesses = execSync('ps aux | grep node | grep -v grep').toString();
    const processes = nodeProcesses.split('\n').filter(Boolean);

    let totalRssKb = 0;

    processes.forEach(p => {
      const columns = p.trim().split(/\s+/);

      if (columns.length >= 6) {
        const rssKb = parseFloat(columns[5]);

        if (!isNaN(rssKb)) {
          totalRssKb += rssKb;
        }
      }
    });

    const totalRssAllProcessesMb = Math.round(totalRssKb / 1024);
    const currentProcessRssMb = Math.round(memory.rss / 1024 / 1024);

    return Response.json({
      currentProcess: {
        pid: process.pid,
        rss: currentProcessRssMb,
        heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      },

      allNodeProcesses: {
        count: processes.length,
        totalRss: totalRssAllProcessesMb,
        processes: processes.map(p => p.substring(0, 100)),
      },
    });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return Response.json({
      error: errorMessage,
    });
  }
}