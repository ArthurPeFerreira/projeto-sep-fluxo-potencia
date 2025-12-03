const fs = require('fs');
const path = require('path');
const https = require('https');
const zlib = require('zlib');
const { spawn } = require('child_process');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

const NODE_VERSION = '20.18.0'; // Versão LTS do Node.js
const NODE_DIR = path.join(__dirname, '../nodejs-portable');

// URLs do Node.js portátil para Windows
const NODE_URLS = {
  win32: {
    x64: `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x64.zip`,
    ia32: `https://nodejs.org/dist/v${NODE_VERSION}/node-v${NODE_VERSION}-win-x86.zip`
  }
};

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    console.log(`Baixando ${url}...`);
    const file = fs.createWriteStream(dest);
    
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Redirecionamento
        return downloadFile(response.headers.location, dest).then(resolve).catch(reject);
      }
      
      if (response.statusCode !== 200) {
        reject(new Error(`Falha ao baixar: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Download completo: ${dest}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlinkSync(dest);
      reject(err);
    });
  });
}

function unzipFile(zipPath, destDir) {
  return new Promise((resolve, reject) => {
    console.log(`Extraindo ${zipPath}...`);
    
    // Usa unzip no Linux/Mac, PowerShell no Windows
    let command;
    let args;
    
    if (process.platform === 'win32') {
      command = 'powershell';
      args = ['-Command', `Expand-Archive -Path "${zipPath}" -DestinationPath "${destDir}" -Force`];
    } else {
      command = 'unzip';
      args = ['-q', '-o', zipPath, '-d', destDir];
    }
    
    const unzip = spawn(command, args);
    
    let output = '';
    let errorOutput = '';
    
    unzip.stdout?.on('data', (data) => {
      output += data.toString();
    });
    
    unzip.stderr?.on('data', (data) => {
      errorOutput += data.toString();
    });
    
    unzip.on('close', (code) => {
      if (code === 0) {
        console.log('Extração completa!');
        
        // Move os arquivos da pasta node-v* para nodejs-portable
        try {
          const extractedDirs = fs.readdirSync(destDir).filter(dir => 
            dir.startsWith(`node-v${NODE_VERSION}`)
          );
          
          if (extractedDirs.length > 0) {
            const extractedDir = extractedDirs[0];
            const sourcePath = path.join(destDir, extractedDir);
            
            // Move todo o conteúdo para NODE_DIR
            const files = fs.readdirSync(sourcePath);
            files.forEach(file => {
              const srcFile = path.join(sourcePath, file);
              const destFile = path.join(NODE_DIR, file);
              if (fs.statSync(srcFile).isDirectory()) {
                // Copia diretórios recursivamente
                copyRecursiveSync(srcFile, destFile);
              } else {
                fs.copyFileSync(srcFile, destFile);
              }
            });
            
            // Remove diretório extraído
            fs.rmSync(sourcePath, { recursive: true, force: true });
          }
        } catch (err) {
          console.error('Erro ao mover arquivos:', err);
          reject(err);
          return;
        }
        
        resolve();
      } else {
        reject(new Error(`Falha ao extrair: código ${code}. Erro: ${errorOutput}`));
      }
    });
    
    unzip.on('error', reject);
  });
}

async function downloadNodeJS() {
  // Sempre baixa o Node.js para Windows (mesmo se estiver no Linux fazendo build para Windows)
  const arch = 'x64'; // Sempre x64 para Windows
  const url = NODE_URLS.win32[arch];
  
  if (!url) {
    console.log(`Arquitetura ${arch} não suportada. Pulando download.`);
    return;
  }
  
  // Cria diretório se não existir
  if (!fs.existsSync(NODE_DIR)) {
    fs.mkdirSync(NODE_DIR, { recursive: true });
  }
  
  // Verifica se já existe
  const nodeExe = path.join(NODE_DIR, 'node.exe');
  if (fs.existsSync(nodeExe)) {
    console.log('Node.js portátil já existe. Pulando download.');
    return;
  }
  
  const zipPath = path.join(__dirname, '../nodejs-temp.zip');
  const tempDir = path.join(__dirname, '../nodejs-temp');
  
  try {
    // Cria diretório temporário
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    // Baixa o arquivo
    await downloadFile(url, zipPath);
    
    // Extrai
    await unzipFile(zipPath, tempDir);
    
    // Limpa arquivos temporários
    if (fs.existsSync(zipPath)) {
      fs.unlinkSync(zipPath);
    }
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    console.log('Node.js portátil preparado com sucesso!');
  } catch (error) {
    console.error('Erro ao baixar Node.js portátil:', error);
    console.log('Você pode baixar manualmente de:', url);
    console.log('E extrair para:', NODE_DIR);
    throw error;
  }
}

if (require.main === module) {
  downloadNodeJS().catch(console.error);
}

module.exports = { downloadNodeJS };

