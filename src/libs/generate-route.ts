import { execSync } from 'child_process';
import fs from 'fs';
import { Module } from '../models';
import { createConfig } from '@utils/config.js';

export const generateRoute = (module: Module): boolean => {
  const config = createConfig(module);
  
  const routeDir = process.cwd() + '/src/routes';
  const routeFilePath = `${routeDir}/routes.tsx`;
  const routesContent = fs.readFileSync(routeFilePath, 'utf8');
  
  // Find the closing bracket of the routes array (before the last ]);)
  const lastRouteBracketIndex = routesContent.lastIndexOf('];\n};');
  
  if (lastRouteBracketIndex === -1) {
    throw new Error('Could not find routes array closing bracket');
  }
  
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
  
  const beforeClosing = routesContent.substring(0, lastRouteBracketIndex);
  const afterClosing = routesContent.substring(lastRouteBracketIndex);
  
  let updatedContent = beforeClosing + newRouteString + '\n  ' + afterClosing;
  
  const importStatements = `import ${config.pages.index.name} from '@pages/${config.directoryName}';` + '\n' +
    `import ${config.pages.create.name}Create from '@pages/${config.directoryName}/create';` + '\n' +
    `import ${config.pages.create.name}Edit from '@pages/${config.directoryName}/edit';`;
  
  updatedContent = importStatements + '\n' + updatedContent;
  
  // Write the updated content back to the file
  fs.writeFileSync(routeFilePath, updatedContent, 'utf8');
  
  console.log(`✅ Route '${config.directoryName}' added successfully!`);
  
  execSync(`npx eslint ${routeFilePath} --fix`, { stdio: 'inherit' });
  
  return true;
};
