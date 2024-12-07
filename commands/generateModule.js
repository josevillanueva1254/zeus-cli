const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

/**
 * Genera un módulo bajo la estructura Clean Architecture.
 * @param {string} moduleName Nombre del módulo
 */
async function generateModule(moduleName) {
  const cwd = process.cwd(); // Directorio actual donde se ejecuta el comando
  const srcDir = path.join(cwd, 'src');

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
  console.log(chalk.green.bold('         Created by: José David Villanueva Villalobos\n'));

  if (!fs.existsSync(srcDir)) {
    console.error(chalk.red('❌ No se encontró el directorio src. Asegúrate de estar en un proyecto NestJS.'));
    return;
  }

  console.log(chalk.yellow.bold(`🔧 Generando módulo "${moduleName}" en el proyecto...\n`));

  const moduleDirs = [
    `domain/entities`,
    `domain/repositories`,
    `application/use-cases`,
    `infrastructure/controllers`,
    `presentation/dtos`,
  ];

  moduleDirs.forEach((dir) => {
    const targetDir = path.join(srcDir, dir);
    fs.mkdirSync(targetDir, { recursive: true });

    const fileContent = generateFileContent(dir, moduleName);
    const fileName = getFileName(dir, moduleName);
    const filePath = path.join(targetDir, fileName);

    fs.writeFileSync(filePath, fileContent, 'utf8');
    console.log(chalk.green(`📄 Archivo creado: ${filePath}`));
  });

  console.log(chalk.green.bold('\n✅ Módulo generado exitosamente.\n'));
}

/**
 * Genera el contenido del archivo según la carpeta y el nombre del módulo.
 * @param {string} dir Directorio
 * @param {string} moduleName Nombre del módulo
 * @returns {string} Contenido del archivo
 */
function generateFileContent(dir, moduleName) {
  const className = capitalize(moduleName);

  switch (dir) {
    case 'domain/entities':
      return `export class ${className} {\n  id: number;\n  name: string;\n}`;
    case 'domain/repositories':
      return `export interface ${className}Repository {\n  findAll(): Promise<${className}[]>;\n}`;
    case 'application/use-cases':
      return `export class Create${className}UseCase {\n  execute(): void {\n    // Lógica del caso de uso\n  }\n}`;
    case 'infrastructure/controllers':
      return `import { Controller } from '@nestjs/common';\n\n@Controller('${moduleName}')\nexport class ${className}Controller {\n  // Métodos del controlador\n}`;
    case 'presentation/dtos':
      return `export class Create${className}Dto {\n  name: string;\n}`;
    default:
      return '';
  }
}

/**
 * Obtiene el nombre del archivo según el directorio.
 * @param {string} dir Directorio
 * @param {string} moduleName Nombre del módulo
 * @returns {string} Nombre del archivo
 */
function getFileName(dir, moduleName) {
  const baseName = moduleName.toLowerCase();
  switch (dir) {
    case 'domain/entities':
      return `${baseName}.entity.ts`;
    case 'domain/repositories':
      return `${baseName}.repository.ts`;
    case 'application/use-cases':
      return `create-${baseName}.use-case.ts`;
    case 'infrastructure/controllers':
      return `${baseName}.controller.ts`;
    case 'presentation/dtos':
      return `create-${baseName}.dto.ts`;
    default:
      return `${baseName}.ts`;
  }
}

/**
 * Capitaliza el nombre de un módulo.
 * @param {string} str Nombre
 * @returns {string} Nombre capitalizado
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

module.exports = { generateModule };
