const { app, BrowserWindow } = require("electron");
const path = require("path");
const { spawn } = require("child_process");

let mainWindow;
let nextServer;

const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Necessário para carregar arquivos locais
    },
  });

  // Permite abrir DevTools com F12 mesmo em produção para debug
  mainWindow.webContents.on("before-input-event", (event, input) => {
    if (input.key === "F12") {
      mainWindow.webContents.toggleDevTools();
    }
  });
  
  // Abre DevTools automaticamente se houver erro (ajuda no debug)
  mainWindow.webContents.on("did-fail-load", () => {
    // Não abre automaticamente, mas pode ser aberto com F12
  });

  if (isDev) {
    // Em desenvolvimento, conecta ao servidor Next.js local
    mainWindow.loadURL("http://localhost:3000");
    mainWindow.webContents.openDevTools();
  } else {
    // Mostra uma tela de loading enquanto inicia o servidor
    mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Carregando...</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background: #f5f5f5;
            font-family: Arial, sans-serif;
          }
          .loader {
            text-align: center;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          .message {
            color: #333;
            font-size: 16px;
          }
        </style>
      </head>
      <body>
        <div class="loader">
          <div class="spinner"></div>
          <div class="message">Iniciando aplicativo...</div>
        </div>
      </body>
      </html>
    `));
    
    // Em produção, inicia o servidor Next.js standalone
    const fs = require("fs");
    let appPath;
    let serverPath;

    if (app.isPackaged) {
      // Quando empacotado, os arquivos extraResources ficam diretamente em process.resourcesPath
      appPath = process.resourcesPath;
      serverPath = path.join(appPath, ".next", "standalone", "server.js");
    } else {
      appPath = app.getAppPath();
      serverPath = path.join(appPath, ".next", "standalone", "server.js");
    }

    const nextPath = path.dirname(serverPath);

    console.log("Caminho do app:", appPath);
    console.log("Caminho do Next.js:", nextPath);
    console.log("Caminho do servidor:", serverPath);
    console.log("process.resourcesPath:", process.resourcesPath);

    // Verifica se o servidor existe
    if (!fs.existsSync(serverPath)) {
      console.error("Erro: server.js não encontrado em:", serverPath);
      // Lista o conteúdo do diretório para debug
      try {
        console.log(
          "Conteúdo de",
          process.resourcesPath,
          ":",
          fs.readdirSync(process.resourcesPath)
        );
      } catch (e) {
        console.error("Erro ao listar diretório:", e);
      }
      mainWindow.loadURL("about:blank");
      mainWindow.webContents.once("did-finish-load", () => {
        mainWindow.webContents.executeJavaScript(`
          document.body.innerHTML = '<div style="padding: 20px; font-family: Arial;"><h1>Erro</h1><p>Servidor Next.js não encontrado.</p><p>Caminho esperado: ${serverPath.replace(
            /\\/g,
            "\\\\"
          )}</p><p>Recursos: ${process.resourcesPath}</p></div>';
        `);
      });
      return;
    }

    // Encontra o executável Node.js correto - PRIORIDADE para o portátil empacotado
    let nodeExecutable = 'node';
    
    if (app.isPackaged) {
      // PRIMEIRA OPÇÃO: Node.js portátil que vem empacotado
      const portableNodePath = path.join(process.resourcesPath, 'nodejs-portable', 'node.exe');
      if (fs.existsSync(portableNodePath)) {
        nodeExecutable = portableNodePath;
        console.log('Usando Node.js portátil empacotado:', nodeExecutable);
      } else {
        // FALLBACK: Tenta Node.js do sistema
        const possiblePaths = [];
        
        if (process.platform === 'win32') {
          const programFiles = process.env['ProgramFiles'] || 'C:\\Program Files';
          const programFilesX86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
          const localAppData = process.env['LOCALAPPDATA'] || path.join(process.env['USERPROFILE'] || '', 'AppData', 'Local');
          
          possiblePaths.push(
            path.join(programFiles, 'nodejs', 'node.exe'),
            path.join(programFilesX86, 'nodejs', 'node.exe'),
            path.join(localAppData, 'Programs', 'nodejs', 'node.exe'),
            'node.exe'
          );
        } else {
          possiblePaths.push(
            '/usr/bin/node',
            '/usr/local/bin/node',
            '/opt/homebrew/bin/node',
            'node'
          );
        }
        
        for (const testPath of possiblePaths) {
          if (testPath === 'node' || testPath === 'node.exe') {
            nodeExecutable = testPath;
            break;
          } else if (fs.existsSync(testPath)) {
            nodeExecutable = testPath;
            break;
          }
        }
        console.log('Usando Node.js do sistema:', nodeExecutable);
      }
    } else {
      // Em desenvolvimento, usa o Node.js do sistema
      nodeExecutable = 'node';
      console.log('Modo desenvolvimento - usando Node.js do sistema');
    }
    
    console.log('Executável Node.js final:', nodeExecutable);
    
    nextServer = spawn(nodeExecutable, [serverPath], {
      cwd: nextPath,
      env: {
        ...process.env,
        PORT: "3000",
        HOSTNAME: "localhost",
        NODE_ENV: "production",
      },
      stdio: "pipe",
    });

    let serverReady = false;
    const maxWaitTime = 30000; // 30 segundos
    const startTime = Date.now();

    const checkServer = () => {
      if (serverReady) return; // Já está pronto
      
      const http = require("http");
      console.log('Verificando se servidor está respondendo em http://localhost:3000...');
      
      const req = http.get("http://localhost:3000", (res) => {
        console.log(`Servidor respondeu com status: ${res.statusCode}`);
        if (res.statusCode === 200 || res.statusCode === 404 || res.statusCode === 304) {
          serverReady = true;
          console.log("✓ Servidor Next.js está pronto! Carregando aplicação...");
          mainWindow.loadURL("http://localhost:3000");
          
          mainWindow.webContents.once("did-finish-load", () => {
            console.log("✓ Aplicação carregada com sucesso!");
          });
          
          mainWindow.webContents.once(
            "did-fail-load",
            (event, errorCode, errorDescription, validatedURL) => {
              console.error("✗ Erro ao carregar:", errorCode, errorDescription, validatedURL);
              mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
                <!DOCTYPE html>
                <html>
                <head><meta charset="utf-8"><title>Erro</title></head>
                <body style="padding: 20px; font-family: Arial;">
                  <h1>Erro ao carregar aplicação</h1>
                  <p>Código: ${errorCode}</p>
                  <p>Descrição: ${errorDescription}</p>
                  <p>URL: ${validatedURL}</p>
                </body>
                </html>
              `));
            }
          );
        } else {
          console.log(`Servidor respondeu mas com status inesperado: ${res.statusCode}`);
        }
      });

      req.on("error", (err) => {
        const elapsed = Date.now() - startTime;
        console.log(`Servidor ainda não respondeu (${Math.round(elapsed/1000)}s)...`);
        
        if (elapsed < maxWaitTime) {
          setTimeout(checkServer, 1000);
        } else {
          console.error("✗ Timeout: Servidor não respondeu após 30 segundos");
          mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
            <!DOCTYPE html>
            <html>
            <head><meta charset="utf-8"><title>Erro</title></head>
            <body style="padding: 20px; font-family: Arial;">
              <h1>Erro: Servidor não iniciou</h1>
              <p>O servidor Next.js não respondeu após 30 segundos.</p>
              <p>Erro: ${err.message}</p>
              <p>Verifique os logs do console para mais detalhes.</p>
            </body>
            </html>
          `));
        }
      });

      req.setTimeout(3000, () => {
        req.destroy();
        const elapsed = Date.now() - startTime;
        if (elapsed < maxWaitTime && !serverReady) {
          setTimeout(checkServer, 1000);
        }
      });
    };

    nextServer.stdout.on("data", (data) => {
      const output = data.toString();
      console.log(`[Next.js STDOUT]: ${output}`);
      // Verifica se o servidor está pronto
      if (
        output.includes("Ready") ||
        output.includes("started") ||
        output.includes("Local:") ||
        output.includes("started server on") ||
        output.includes("http://localhost")
      ) {
        console.log('Servidor parece estar pronto, verificando...');
        if (!serverReady) {
          setTimeout(checkServer, 1500);
        }
      }
    });

    nextServer.stderr.on("data", (data) => {
      const output = data.toString();
      console.error(`[Next.js STDERR]: ${output}`);
      // Alguns avisos do Next.js vão para stderr mas não são erros fatais
      if (output.includes("Ready") || output.includes("started")) {
        console.log('Servidor parece estar pronto (stderr), verificando...');
        if (!serverReady) {
          setTimeout(checkServer, 1500);
        }
      }
    });

    nextServer.on("error", (error) => {
      console.error("✗ Erro ao iniciar servidor Next.js:", error);
      console.error("Código:", error.code);
      console.error("Caminho tentado:", error.path || nodeExecutable);
      
      let errorMessage = error.message;
      let errorDetails = '';
      
      if (error.code === 'ENOENT') {
        const portablePath = app.isPackaged ? path.join(process.resourcesPath, 'nodejs-portable', 'node.exe') : '';
        errorMessage = 'Node.js não encontrado';
        errorDetails = `
          <h2>Problema:</h2>
          <p>O aplicativo não conseguiu encontrar o Node.js necessário para executar.</p>
          ${app.isPackaged ? `<p><strong>Caminho esperado do Node.js portátil:</strong><br><code>${portablePath}</code></p>` : ''}
          <p><strong>Executável tentado:</strong><br><code>${error.path || nodeExecutable}</code></p>
          <h2>Possíveis soluções:</h2>
          <ol>
            <li>Se você instalou este aplicativo, pode ser que o Node.js portátil não tenha sido incluído corretamente no build.</li>
            <li>Como alternativa, instale o Node.js no sistema: <a href="https://nodejs.org/" target="_blank">https://nodejs.org/</a></li>
            <li>Reinicie o aplicativo após a instalação</li>
          </ol>
          <p><strong>Detalhes técnicos:</strong> ${error.message}</p>
        `;
      } else {
        errorDetails = `
          <p><strong>Erro:</strong> ${error.message}</p>
          <p><strong>Código:</strong> ${error.code || 'N/A'}</p>
        `;
      }
      
      mainWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Erro</title>
          <style>
            body { padding: 20px; font-family: Arial; max-width: 800px; margin: 0 auto; }
            code { background: #f5f5f5; padding: 2px 6px; border-radius: 3px; }
          </style>
        </head>
        <body>
          <h1>Erro ao iniciar servidor</h1>
          <p>${errorMessage}</p>
          ${errorDetails}
        </body>
        </html>
      `));
    });

    nextServer.on("exit", (code) => {
      console.log(`Servidor Next.js encerrado com código ${code}`);
    });

    // Inicia verificação do servidor após 3 segundos
    console.log('Aguardando servidor iniciar...');
    setTimeout(() => {
      console.log('Iniciando verificação do servidor...');
      checkServer();
    }, 3000);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (nextServer) {
    nextServer.kill();
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("before-quit", () => {
  if (nextServer) {
    nextServer.kill();
  }
});
