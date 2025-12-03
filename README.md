# Projeto SEP - Fluxo de Potência

Aplicação para análise de fluxo de potência em sistemas elétricos de potência.

## Desenvolvimento

Para executar em modo de desenvolvimento:

```bash
npm install
npm run dev
```

## Gerar Executável

### Instalar dependências

```bash
npm install
```

### Gerar executável para Windows

Para gerar um instalador (.exe), você precisa ter o Wine instalado:

**Instalação do Wine (Ubuntu/Debian):**

```bash
# 1. Atualizar repositórios
sudo apt update

# 2. Instalar Wine (versão 64-bit)
sudo apt install wine64

# Ou instalar a versão completa do Wine
sudo apt install wine-stable

# 3. Verificar instalação
wine --version
```

**Se você estiver em uma distribuição diferente:**

- **Fedora/RHEL:** `sudo dnf install wine`
- **Arch Linux:** `sudo pacman -S wine`
- **openSUSE:** `sudo zypper install wine`

**Node.js Portátil (Automático):**

O aplicativo inclui Node.js portátil automaticamente durante o build. Isso garante que o executável final funcione completamente standalone - o usuário só precisa baixar o .exe e executar, sem instalar nada!

- **No Windows:** O Node.js será baixado automaticamente durante o build
- **No Linux (build para Windows):** O Node.js para Windows será baixado automaticamente durante o build

**Depois de instalar o Wine, gerar o instalador:**

```bash
npm run electron:build:win
```

O instalador será gerado na pasta `dist/` como `Fluxo de Potência SEP Setup 0.1.0.exe`

**Notas importantes:**
- Na primeira execução, o Wine pode pedir para configurar o prefixo. Você pode aceitar as configurações padrão ou cancelar - o electron-builder funcionará mesmo assim.
- **O executável final é completamente standalone:** Inclui Node.js portátil e todos os recursos necessários. O usuário final só precisa baixar o .exe e executar - não precisa instalar Node.js, nem nada mais!

### Gerar executável para Linux

```bash
npm run electron:build:linux
```

### Gerar executável para macOS

```bash
npm run electron:build:mac
```

### Gerar executável para a plataforma atual

```bash
npm run electron:build
```

## Testar Electron em desenvolvimento

Para testar o Electron conectado ao servidor Next.js em desenvolvimento:

```bash
npm run electron:dev
```

## Estrutura do Projeto

- `src/` - Código fonte da aplicação Next.js
- `electron/` - Código do Electron (main.js)
- `public/` - Arquivos estáticos
- `dist/` - Executáveis gerados (não versionado)

