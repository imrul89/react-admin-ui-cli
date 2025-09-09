import fs from 'fs';
import handlebars from 'handlebars';
import path from 'path';
import pluralize from 'pluralize';
import { fileURLToPath } from 'url';
import { Module } from '../models';
import {
  getServiceName,
  getServiceFileName,
  getTag,
} from '@utils/helpers.js';
import * as process from 'node:process';
import { createConfig } from '@utils/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateService = (module: Module): boolean => {
  const config = createConfig(module);
  
  const serviceDir = path.join(process.cwd(), 'src', 'services');
  const serviceFile = path.join(serviceDir, `${getServiceFileName(config.moduleName)}.ts`);
  
  if (fs.existsSync(serviceFile)) {
    console.error(`⚠️ The ${getServiceName(config.moduleName)} service already exist.`);
    return false;
  } else {
    const templatePath = path.resolve(__dirname, '../templates/service.hbs');
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    
    const templateContent = template(config);
    
    // Create file
    fs.writeFileSync(serviceFile, templateContent, { encoding: 'utf8' });
    
    console.log(`✅ The ${config.moduleName} service has been created successfully.`);
    
    // start tag generation
    
    const TAG_FILE_PATH = path.join(serviceDir, 'core', 'base-service.ts');
    let code = fs.readFileSync(TAG_FILE_PATH, 'utf8');
    const tagTypesRegex = /(tagTypes\s*:\s*\[)([\s\S]*?)(\])/m;
    
    const TAGS_TO_ADD = [getTag(pluralize(config.moduleName)), getTag(config.moduleName)];
    
    const match = code.match(tagTypesRegex);
    
    if (match) {
      const [, start, content, end] = match;
      let newContent = content;
      
      const tagExists = TAGS_TO_ADD.every(tag => content.includes(`'${tag}'`));
      
      if (tagExists) {
        console.log(`⚠️ Tags for ${config.moduleName} already exist.`);
      } else {
        TAGS_TO_ADD.forEach(tag => {
          const tagString = `'${tag}'`;
          newContent = newContent.replace(/(\s*)$/, `\n    ${tagString},\n`);
        });
        
        const replaced = start + newContent + end;
        code = code.replace(tagTypesRegex, replaced);
        
        // Write back
        fs.writeFileSync(TAG_FILE_PATH, code, 'utf8');
        console.log('✅ Tags added successfully.');
      }
    } else {
      console.error('⚠️ Could not find tagTypes in base-service.ts');
    }
  }
  
  // end tag generation
  
  // start add api end points
  
  const apiEndPointFilePath = path.join(process.cwd(), 'src', 'utils', 'constants', 'api-end-points.ts');
  let apiEndPointFileContent = fs.readFileSync(apiEndPointFilePath, 'utf8');
  
  const newKey = `  ${config.service.apiEndPoint}: '/v1/${config.service.tagPlural}',\n`;
  
  if (apiEndPointFileContent.includes(newKey.trim())) {
    console.log(`⚠️ API endpoint for ${config.service.apiEndPoint} already exists.`);
  } else {
    apiEndPointFileContent = apiEndPointFileContent.replace(/};\s*$/, `${newKey}};`);
    fs.writeFileSync(apiEndPointFilePath, apiEndPointFileContent, 'utf8');
    
    console.log('✅ New endpoint added successfully!');
  }
  
  return true;
};
