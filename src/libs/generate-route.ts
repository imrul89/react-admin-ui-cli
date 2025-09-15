import { execSync } from 'child_process';
import fs from 'fs';
import { Module } from '../models';
import { createConfig } from '@utils/config.js';
import path from 'path';
import * as console from 'node:console';

export const generateRoute = (module: Module): boolean => {
  const config = createConfig(module);
  
  const routeDir = path.join(process.cwd(), 'src', 'routes');
  const routeFilePath = path.join(routeDir, 'routes.tsx');
  const routesContent = fs.readFileSync(routeFilePath, 'utf8');
  
  if (routesContent.includes(`path: '${config.routeName}'`)) {
    console.error(`⚠️ Route ${config.routeName} already exists.`);
  } else {
    const routeArrayEndIndex = routesContent.lastIndexOf('];');
    
    const newRouteString = `  {
    path: '${config.routeName}',
    breadcrumb: '${config.title}',
    component: '',
    exact: true,
    children: [
      {
        path: '',
        breadcrumb: '${config.title}',
        component: ${config.pages.index.name},
        exact: true
      },
      {
        path: 'create',
        breadcrumb: 'Create ${config.pages.create.actionTitle}',
        component: ${config.pages.create.name}Create,
        exact: true
      },
      {
        path: ':id',
        breadcrumb: 'Edit ${config.pages.create.actionTitle}',
        component: ${config.pages.create.name}Edit,
        exact: true
      }
    ]
  },`;
    
    let updatedContent =
      routesContent.substring(0, routeArrayEndIndex) +
      newRouteString +
      '\n' +
      routesContent.substring(routeArrayEndIndex);
    
    const importStatements = `import ${config.pages.index.name} from '@pages/${config.directoryName}';` + '\n' +
      `import ${config.pages.create.name}Create from '@pages/${config.directoryName}/create';` + '\n' +
      `import ${config.pages.create.name}Edit from '@pages/${config.directoryName}/edit';`;
    
    updatedContent = importStatements + '\n' + updatedContent;
    
    // Write the updated content back to the file
    fs.writeFileSync(routeFilePath, updatedContent, 'utf8');
    
    console.log(`✅ Route ${config.directoryName} added successfully!`);
  }
  
  // add menu item
  const menuDir = path.join(process.cwd(), 'src', 'utils', 'constants');
  const menuFilePath = path.join(menuDir, 'menu-constants.tsx');
  const menuContent = fs.readFileSync(menuFilePath, 'utf8');
  
  // Check if the menu item already exists
  if (menuContent.includes(`to={'${config.routeName}'}`)) {
    console.log(`⚠️ ${config.title} menu already exists.`);
  } else {
    const arrayEndIndex = menuContent.lastIndexOf('];');
    
    const newMenuString = `  {
    key: '${config.routeName}',
    label: <MenuLink to={'${config.routeName}'}>${config.title}</MenuLink>,
    icon: <UserOutlined />
  },`;
    
    const updatedMenuContent =
      menuContent.substring(0, arrayEndIndex) +
      newMenuString +
      '\n' +
      menuContent.substring(arrayEndIndex);
    
    // Write the updated content back to the file
    fs.writeFileSync(menuFilePath, updatedMenuContent, 'utf8');
    console.log(`✅ Menu item ${config.routeName} added successfully.`);
    
  }
  
  execSync(`npx eslint ${routeFilePath} --fix`, { stdio: 'inherit' });
  
  return true;
};
