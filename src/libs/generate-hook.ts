import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import { createConfig } from '@utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateHook = (module: Module): boolean => {
  const config = createConfig(module);
  
  const hookDir = process.cwd() + '/src/hooks';
  const hookFile = path.join(hookDir, `${config.hook.fileName}.ts`);
  
  if (fs.existsSync(hookFile)) {
    console.error(`❌ The ${config.moduleName} hook already exist.`);
    return false;
  }
  
  const templatePath = path.join(__dirname, '../templates/hook.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  const templateContent = template(config);

  // Create file
  fs.writeFileSync(hookFile, templateContent, { encoding: 'utf8' });
  
  console.log(`✅ The ${(config.moduleName)} hook has been created successfully.`);
  
  return true;
};
