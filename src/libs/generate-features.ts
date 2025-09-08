import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import { createConfig } from '@utils/config.js';
import * as process from 'node:process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateFeatures = (module: Module): boolean => {
  handlebars.registerHelper('eq', function (a, b) {
    return a === b;
  });
  
  const config = createConfig(module);
  
  const featureDir = path.join(process.cwd() + '/src/features', config.directoryName);
  const tableFile = path.join(featureDir, `${config.features.table.fileName}.tsx`);
  
  if (fs.existsSync(tableFile)) {
    console.error(`❌ The ${config.moduleName} table already exists.`);
    return false;
  }
  
  const templatePath = path.join(__dirname, '../templates/features/table.hbs');
  const templateSource = fs.readFileSync(templatePath, 'utf8');
  const template = handlebars.compile(templateSource);
  const templateContent = template(config);

  // Create directory if it doesn't exist
  if (!fs.existsSync(featureDir)) {
    fs.mkdirSync(featureDir, { recursive: true });
  }

  // Write the generated table file
  fs.writeFileSync(tableFile, templateContent, { encoding: 'utf8' });

  console.log(`✅ The ${config.moduleName} table has been created successfully.`);

  const tableColumnFile = path.join(featureDir, `${config.features.tableColumns.fileName}.tsx`);
  const tableColumnPath = path.join(__dirname, '../templates/features/table-column.hbs');
  const tableColumnSource = fs.readFileSync(tableColumnPath, 'utf8');
  const tableColumn = handlebars.compile(tableColumnSource);
  const tableColumnContent = tableColumn(config);

  fs.writeFileSync(tableColumnFile, tableColumnContent, { encoding: 'utf8' });

  console.log(`✅ The ${config.moduleName} table column has been created successfully.`);

  const formFile = path.join(featureDir, `${config.features.form.fileName}.tsx`);
  const formPath = path.join(__dirname, '../templates/features/form.hbs');
  const formSource = fs.readFileSync(formPath, 'utf8');
  const form = handlebars.compile(formSource);
  const formContent = form(config);

  fs.writeFileSync(formFile, formContent, { encoding: 'utf8' });

  console.log(`✅ The ${config.moduleName} form has been created successfully.`);
  
  return true;
};