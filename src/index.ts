#!/usr/bin/env node

import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import * as console from 'node:console';
import * as process from 'node:process';
import { generateFeatures } from '@libs/generate-features.js';
import { generatePages } from '@libs/generate-pages.js';
import { generateHook } from '@libs/generate-hook.js';
import { generateModel } from '@libs/generate-model.js';
import { generateRoute } from '@libs/generate-route.js';
import { generateService } from '@libs/generate-service.js';
import { Module } from './models';
import { getDirectoryName } from '@utils/helpers.js';
import pkg from 'pluralize';

const { singular } = pkg;

const rcliSettingsFile = path.join(process.cwd(), 'rcli-settings.json');
const settings: Module = JSON.parse(fs.readFileSync(rcliSettingsFile, 'utf8'));

// Validate CLI arguments
const validateArguments = (): string => {
  if (
    !(
      (process.argv[2] === 'generate' || process.argv[2] === 'g') &&
      (process.argv[3] === 'module' || process.argv[3] === 'm')
    )
  ) {
    console.error('❌ Invalid command. Use: rcli generate module <ModuleName> or rcli g m <ModuleName>');
    process.exit(1);
  }
  
  const moduleName = process.argv[4];
  if (!moduleName) {
    console.error('❌ Please provide a module name.');
    process.exit(1);
  }
  
  return _.upperFirst(singular(moduleName));
};

// Validate module settings
const validateModule = (moduleName: string, settings: Module): void => {
  if (_.toLower(settings.moduleName) !== _.toLower(moduleName)) {
    console.error(`❌ Module name doesn't match with settings module name.`);
    console.error(`Please check your rcli-settings.json file in root directory.`);
    process.exit(1);
  }
  
  const moduleDir = path.join(process.cwd(), 'src', 'pages', getDirectoryName(moduleName));
  if (fs.existsSync(moduleDir)) {
    console.error(`❌ The ${moduleName} module already exists.`);
    process.exit(1);
  }
};

// Generate module components
const generateModuleComponents = (module: Module): void => {
  const generators = [
    generateModel,
    generateService,
    generateHook,
    generateFeatures,
    generatePages,
    generateRoute,
  ];
  
  generators.forEach((generator) => {
    if (generator(module)) {
      console.log('----------------------------------------------------------------');
    }
  });
};

// Main execution
const main = (): void => {
  const moduleName = validateArguments();
  const moduleSettings = settings as Module;
  
  validateModule(moduleName, moduleSettings);
  generateModuleComponents(moduleSettings);
};

main();