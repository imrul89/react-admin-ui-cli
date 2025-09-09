import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import { createConfig } from '@utils/config.js';
import process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generatePages = (module: Module): boolean => {
  const config = createConfig(module);
  
  const pageDir = path.join(process.cwd(), 'src', 'pages', config.directoryName);
  
  const indexPageFile = path.join(pageDir, `index.tsx`);
  const indexPagePath = path.resolve(__dirname, '../templates/pages/index.hbs');
  const indexPageSource = fs.readFileSync(indexPagePath, 'utf8');
  const indexPageTemplate = handlebars.compile(indexPageSource);
  const indexPageContent = indexPageTemplate(config);

  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  fs.writeFileSync(indexPageFile, indexPageContent, { encoding: 'utf8' });
  console.log(`✅ The ${config.moduleName} list page has been created successfully.`);

  const createPageFile = path.join(pageDir, `create.tsx`);
  const createPagePath = path.resolve(__dirname, '../templates/pages/create.hbs');
  const createPageSource = fs.readFileSync(createPagePath, 'utf8');
  const createPageTemplate = handlebars.compile(createPageSource);
  const createPageContent = createPageTemplate(config);

  fs.writeFileSync(createPageFile, createPageContent, { encoding: 'utf8' });
  console.log(`✅ The ${config.moduleName} create page has been created successfully.`);

  const editPageFile = path.join(pageDir, `edit.tsx`);
  const editPagePath = path.resolve(__dirname, '../templates/pages/edit.hbs');
  const editPageSource = fs.readFileSync(editPagePath, 'utf8');
  const editPageTemplate = handlebars.compile(editPageSource);
  const editPageContent = editPageTemplate(config);

  fs.writeFileSync(editPageFile, editPageContent, { encoding: 'utf8' });
  console.log(`✅ The ${config.moduleName} edit page has been created successfully.`);

  return true;
};