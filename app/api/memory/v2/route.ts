import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  const memory = process.memoryUsage();
  
  const processCheck = { error: null as string | null, data: null as string | null };

  try {
    const cmd = 'ps -o pid,comm,rss,args -C node 2>/dev/null || ps aux | grep -E "(node|next)" | grep -v grep 2>/dev/null || echo "No ps command"';
    
    const result = await execAsync(cmd, { shell: '/bin/sh' });
    processCheck.data = result.stdout.trim();
    
  } catch (e: any) {
    processCheck.error = e?.message || 'Unknown error';

    try {
      const fs = await import('fs');
      const dirs = fs.readdirSync('/proc').filter((dir: string) => /^\d+$/.test(dir));
      const nodeProcs: any[] = [];
      
      for (const dir of dirs.slice(0, 10)) {
        try {
          const cmdline = fs.readFileSync(`/proc/${dir}/cmdline`, 'utf8');
          if (cmdline.includes('node') || cmdline.includes('next')) {
            nodeProcs.push({ pid: dir, cmd: cmdline.substring(0, 100) });
          }
        } catch {
          // Пропускаем процессы без доступа
        }
      }
      
      processCheck.data = `Found via /proc: ${nodeProcs.length} processes - ${JSON.stringify(nodeProcs)}`;
    } catch (procError: any) {
      processCheck.error += ` | /proc error: ${procError.message}`;
    }
  }
  
  return Response.json({
    currentProcess: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      pid: process.pid,
      ppid: process.ppid,
      rssRaw: memory.rss
    },
    
    systemProcesses: processCheck,
  });
}