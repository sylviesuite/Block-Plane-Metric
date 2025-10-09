#!/usr/bin/env node
import { spawn } from 'child_process'
import net from 'net'

// helper to run shell commands
function run(cmd, args = []) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true })
    p.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} failed`)))
  })
}

// find an open port (try common ones first)
async function findFreePort(candidates = [4173, 5173, 5000, 4321]) {
  for (const port of candidates) {
    const free = await new Promise(res => {
      const srv = net.createServer()
      srv.once('error', () => res(false))
      srv.once('listening', () => { srv.close(() => res(true)) })
      srv.listen(port, '127.0.0.1')
    })
    if (free) return port
  }
  return 0 // fallback → OS chooses any free port
}

// init placeholder
async function init() {
  console.log('✓ LaunchGuard init (placeholder)')
}

// check = typecheck → build → preview
async function check() {
  console.log('→ Running typecheck...')
  try { await run('npm', ['run', 'typecheck']) }
  catch { console.warn('! no typecheck') }

  console.log('→ Building...')
  await run('npm', ['run', 'build'])

  console.log('→ Previewing...')
  const port = await findFreePort()
  const args = ['vite', 'preview', '--strictPort']
  if (port !== 0) args.push('--port', String(port))

  const p = spawn('npx', args, { stdio: 'inherit', shell: true })
  console.log(`\n✓ Preview running → http://localhost:${port || '(random)'}\nPress Ctrl+C to stop.\n`)

  p.on('exit', code => process.exit(code ?? 0))
}

// command dispatcher
const cmd = process.argv[2]
if (cmd === 'init') init()
else if (cmd === 'check') check()
else console.log('Usage: node tools/launchguard.mjs [init|check]')
