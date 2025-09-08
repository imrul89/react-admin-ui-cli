import _ from 'lodash';
import pluralize from 'pluralize';
import { Field } from '../models';

export const getDirectoryName = (moduleName: string): string => {
  return _.kebabCase(pluralize(moduleName));
};

export const getLink = (moduleName: string): string => {
  return _.kebabCase(pluralize(moduleName));
};

export const getTag = (moduleName: string): string => {
  return _.kebabCase(moduleName);
};

export const getModelName = (moduleName: string): string => {
  return _.upperFirst(_.camelCase(moduleName));
};

export const getModelFileName = (moduleName: string): string => {
  return _.lowerCase(_.kebabCase(moduleName));
};

export const getServiceName = (moduleName: string): string => {
  return `${_.camelCase(pluralize(moduleName))}Service`;
};

export const getServiceFileName = (moduleName: string): string => {
  return `${_.lowerCase(_.kebabCase(pluralize(moduleName)))}-service`;
};

export const getHookFileName = (moduleName: string): string => {
  return `use-${_.lowerCase(_.kebabCase(pluralize(moduleName)))}.ts`;
};

export const getFormInputs = (fields: Field[]) => {
  const components = fields.map(field => {
    if (field.type === 'number') {
      return 'Select';
    }
    
    if (field.type === 'boolean') {
      return 'Switch';
    }
    
    return 'Input';
  });
  
  return Array.from(new Set(components)).join(', ');
};