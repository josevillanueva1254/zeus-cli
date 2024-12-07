#!/usr/bin/env node

const { generateProject } = require('./commands/generateProject');
const { generateModule } = require('./commands/generateModule');
const chalk = require('chalk');

// Mostrar el encabezado de branding
function showBranding() {
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
}

// Punto de entrada principal
async function main() {
  showBranding();

  const [command, arg1] = process.argv.slice(2);

  if (command === 'project') {
    if (!arg1) {
      console.error(chalk.red('❌ Especifica el nombre del proyecto: ./zeus project <nombre>'));
      return;
    }
    await generateProject(arg1);
  } else if (command === 'module') {
    if (!arg1) {
      console.error(chalk.red('❌ Especifica el nombre del módulo: ./zeus module <nombre>'));
      return;
    }
    await generateModule(arg1);
  } else {
    console.error(chalk.red('❌ Comando no válido. Usa:'));
    console.error(chalk.blue('   ./zeus project <nombre>'));
    console.error(chalk.blue('   ./zeus module <nombre>'));
  }
}

main().catch((err) => console.error(chalk.red('❌ Error:', err)));
