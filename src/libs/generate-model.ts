import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import { createConfig } from '@utils/config.js';
import * as console from 'node:console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateModel = (module: Module): boolean => {
  const config = createConfig(module);
  
  const modelDir = path.join(process.cwd(), 'src', 'models');
  const modelFile = path.join(modelDir, `${config.model.fileName}.ts`);
  
  if (fs.existsSync(modelFile)) {
    console.error(`⚠️ The ${config.model.name} model already exists.`);
    return false;
  }
  
  const templatePath = path.resolve(__dirname, '../templates/model.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  
  const templateContent = template(config);
  
  if (!fs.existsSync(modelDir)) {
    fs.mkdirSync(modelDir, { recursive: true });
  }
  
  fs.writeFileSync(modelFile, templateContent, { encoding: 'utf8' });
  console.log(`✅ The ${config.model.name} model has been created successfully.`);
  
  return true;
};