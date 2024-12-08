const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const inquirer = require('inquirer');

async function executeProjectWithBrand(projectPath) {
    console.log(`ZEUS-CLI: Ejecutando proyecto ${projectPath} con la marca...`);
    execSync(`cd ${projectPath} && npm run start`, { stdio: 'inherit' });
}

async function generateProjectZeus(projectName) {
    const projectPath = path.join(process.cwd(), projectName);

    console.log(`ZEUS-CLI: Generando proyecto NestJS en ${projectPath}...`);

    // Crear proyecto NestJS
    execSync(`npx @nestjs/cli new ${projectName}`, { stdio: 'inherit' });

    // Copiar estructura de templates/src
    const srcTemplatePath = path.join(__dirname, '../templates/src');
    const destSrcPath = path.join(projectPath, 'src');
    copyFolderRecursiveSync(srcTemplatePath, destSrcPath);

    // Modificar package.json para agregar dependencias
    const packagePath = path.join(projectPath, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    const additionalDependencies = {
        "typeorm": "^0.3.0",
        "@nestjs/typeorm": "^10.0.0"
    };
    packageJson.dependencies = { ...packageJson.dependencies, ...additionalDependencies };
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));

    console.log('ZEUS-CLI: Proyecto generado exitosamente.');

    // Instalar dependencias
    console.log('ZEUS-CLI: Instalando dependencias...');
    execSync(`cd ${projectPath} && npm install --legacy-peer-deps`, { stdio: 'inherit' });

    // Ejecutar el proyecto con la marca
    await executeProjectWithBrand(projectPath);
}

function copyFolderRecursiveSync(source, target) {
    if (!fs.existsSync(target)) {
        fs.mkdirSync(target, { recursive: true });
    }

    if (fs.lstatSync(source).isDirectory()) {
        const files = fs.readdirSync(source);
        files.forEach(file => {
            const curSource = path.join(source, file);
            let curTarget = path.join(target, file);

            if (fs.lstatSync(curSource).isDirectory()) {
                copyFolderRecursiveSync(curSource, curTarget);
            } else {
                if (curTarget.endsWith('.template.ts')) {
                    curTarget = curTarget.replace('.template.ts', '.ts');
                } else if (curTarget.endsWith('.template')) {
                    curTarget = curTarget.replace('.template', '');
                }
                fs.copyFileSync(curSource, curTarget);
            }
        });
    }
}

const args = process.argv.slice(2);
if (args.length < 2 || args[0] !== 'project') {
    console.error('Uso: zeus-cli project "Nombre de Proyecto"');
    process.exit(1);
}

const projectName = args[1];
generateProjectZeus(projectName);