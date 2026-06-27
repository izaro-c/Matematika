import fs from 'fs';
import path from 'path';

/**
 * Validates that no Lean declaration annotated with @status "proved"
 * contains `sorry`, `admit` or `statement : True` (fake certificates).
 */
function checkFileForFakeCertificates(fullPath: string): boolean {
  let ok = true;
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  
  let currentStatus: string | null = null;
  let currentTheoremLine = -1;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect annotation block
    const statusMatch = line.match(/@(status|verificationStatus)\s+"([^"]+)"/);
    if (statusMatch) {
      currentStatus = statusMatch[2];
      currentTheoremLine = i;
    }
    
    // Detect sorry or admit or fake statement
    if (line.includes('sorry') || line.includes('admit') || line.includes(': True') || line.includes('statement : True')) {
      if (currentStatus === 'proved' || currentStatus === 'lean-checked' || currentStatus === 'lean-audited') {
        console.error(`\n❌ Fake Certificate Detected in ${fullPath}:${i + 1}`);
        console.error(`   A declaration is marked as @status or @verificationStatus "${currentStatus}" (near line ${currentTheoremLine + 1}) but uses \`sorry\` / \`admit\` or a fake statement.`);
        console.error(`   Line content: ${line.trim()}`);
        console.error(`   Action: Change status to "pending", "human-proof", "bridge" or complete the proof.\n`);
        ok = false;
      }
    }
  }
  return ok;
}

function checkNoFakeCertificates(dir: string): boolean {
  let ok = true;
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      if (!checkNoFakeCertificates(fullPath)) ok = false;
    } else if (file.name.endsWith('.lean')) {
      if (!checkFileForFakeCertificates(fullPath)) ok = false;
    }
  }
  
  return ok;
}

console.log('Verificando que no haya certificados falsos en Lean (sorry + proved)...');
const leanDir = 'lean/Matematika';

let allOk = true;
if (fs.existsSync(leanDir)) {
  allOk = checkNoFakeCertificates(leanDir);
}

if (!allOk) {
  console.error('🚨 Fallo: Se han encontrado certificados Lean falsos. Ningún teorema con `sorry` puede considerarse probado.');
  process.exit(1);
}

console.log('✅ Verificación completada: Los certificados "proved" son mecánicamente honestos.');
