export async function GET() {
  try {
    const memory = process.memoryUsage();

    const { execSync } = require('child_process');
    const nodeProcesses = execSync('ps aux | grep node | grep -v grep').toString();
    const processes = nodeProcesses.split('\n').filter(Boolean);

    let totalRssKb = 0;

    processes.forEach((p: any) => {
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
        processes: processes.map((p: any) => p.substring(0, 100)),
      },
    });
  } catch (e: any) {
    return Response.json({
      error: e.message,
    });
  }
}
