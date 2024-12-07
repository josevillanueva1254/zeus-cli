const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const chalk = require('chalk');

/**
 * Genera un proyecto base con NestJS y estructura Clean Architecture.
 * @param {string} name Nombre del proyecto
 */
async function generateProject(name) {
  const cliDir = path.resolve(__dirname, '..'); // Ruta del CLI
  const parentDir = path.resolve(cliDir, '..'); // Directorio padre del CLI
  const projectPath = path.join(parentDir, name); // Ruta del proyecto

  // Branding
  console.log(chalk.blue.bold(`
███████╗███████╗██╗   ██╗███████╗     ██████╗██╗     ██╗
██╔════╝██╔════╝██║   ██║██╔════╝    ██╔════╝██║     ██║
███████╗█████╗  ██║   ██║███████╗    ██║     ██║     ██║
╚════██║██╔══╝  ╚██╗ ██╔╝╚════██║    ██║     ██║     ██║
███████║███████╗ ╚████╔╝ ███████║    ╚██████╗███████╗██║
╚══════╝╚══════╝  ╚═══╝  ╚══════╝     ╚═════╝╚══════╝╚═╝
`));
  console.log(chalk.yellow.bold('         ZEUS-CLI - Clean Architecture Generator'));
  console.log(chalk.green.bold('         Created by: José David Villanueva Villanobos\n'));

  if (fs.existsSync(projectPath)) {
    console.error(chalk.red(`❌ El proyecto "${name}" ya existe en ${projectPath}.`));
    return;
  }

  console.log(chalk.yellow.bold(`🔧 Generando proyecto "${name}" en: ${projectPath}`));

  // Crear el proyecto base usando Nest CLI
  try {
    console.log(chalk.blue('📦 Ejecutando Nest CLI para crear la estructura base...'));
    execSync(`npx @nestjs/cli new ${name} --skip-install --package-manager npm`, { cwd: parentDir, stdio: 'inherit' });
  } catch (error) {
    console.error(chalk.red('❌ Error al ejecutar Nest CLI:', error.message));
    return;
  }

  console.log(chalk.green('✅ Proyecto base de NestJS creado.'));

  // Crear carpetas adicionales para la arquitectura Clean
  const additionalPaths = [
    'src/application/use-cases',
    'src/presentation/http',
    'src/presentation/dtos',
    'src/domain/entities',
    'src/infrastructure/interceptors',
    'src/config',
  ];
  additionalPaths.forEach((dir) => {
    const fullPath = path.join(projectPath, dir);
    console.log(chalk.yellow(`📁 Creando carpeta: ${fullPath}`));
    fs.mkdirSync(fullPath, { recursive: true });
  });

  // Copiar plantillas desde templates
  console.log(chalk.blue('🔄 Copiando plantillas...'));
  const templates = [
    {
      src: path.join(cliDir, 'templates/cleanModule/application/use-cases/use-case.template.ts'),
      dest: path.join(projectPath, 'src/application/use-cases/get-hello.use-case.ts'),
    },
    {
      src: path.join(cliDir, 'templates/cleanModule/presentation/http/controller.template.ts'),
      dest: path.join(projectPath, 'src/presentation/http/hello.controller.ts'),
    },
    {
      src: path.join(cliDir, 'templates/cleanModule/app.module.template.ts'),
      dest: path.join(projectPath, 'src/app.module.ts'),
    },
    {
      src: path.join(cliDir, 'templates/cleanModule/main.template.ts'),
      dest: path.join(projectPath, 'src/main.ts'),
    },
    {
      src: path.join(cliDir, 'templates/cleanModule/infrastructure/interceptors/response.interceptor.template.ts'),
      dest: path.join(projectPath, 'src/infrastructure/interceptors/response.interceptor.ts'),
    },
    {
      src: path.join(cliDir, 'templates/cleanModule/infrastructure/interceptors/pagination.interceptor.template.ts'),
      dest: path.join(projectPath, 'src/infrastructure/interceptors/pagination.interceptor.ts'),
    },{
      src: path.join(cliDir, 'templates/cleanModule/config/constants.template.ts'),
      dest: path.join(projectPath, 'src/config/constants.ts'),
    },
  ];

  templates.forEach(({ src, dest }) => {
    if (!fs.existsSync(src)) {
      console.error(chalk.red(`❌ Archivo de plantilla no encontrado: ${src}`));
      return;
    }
    try {
      fs.copyFileSync(src, dest);
      console.log(chalk.green(`✅ Plantilla copiada: ${dest}`));
    } catch (error) {
      console.error(chalk.red(`❌ Error al copiar plantilla ${src}:`, error.message));
    }
  });

  console.log(chalk.blue('📦 Instalando dependencias adicionales...'));
  try {
    execSync('npm install class-validator class-transformer uuid @types/uuid', { cwd: projectPath, stdio: 'inherit' });
    console.log(chalk.green('✅ Dependencias adicionales instaladas.'));
  } catch (error) {
    console.error(chalk.red('❌ Error al instalar dependencias adicionales:', error.message));
  }

  console.log(chalk.green.bold('✅ Proyecto reorganizado con arquitectura Clean.\n'));
  console.log(chalk.cyan(`📂 Carpeta del proyecto: ${projectPath}`));
  console.log(chalk.cyan('💡 Recuerda ejecutar:'));
  console.log(chalk.cyan(`   cd ${name}`));
  console.log(chalk.cyan('   npm install'));
  console.log(chalk.cyan('   npm run start:dev\n'));
}

module.exports = { generateProject };
