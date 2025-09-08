import _ from 'lodash';
import pluralize from 'pluralize';
import { Field, Module } from '../models';
import { getFormInputs, getLink, getModelName } from './helpers.js';

export const createConfig = (module: Module) => {
  const moduleName = module.moduleName;
  
  return {
    moduleName,
    directoryName: _.kebabCase(pluralize(moduleName)),
    routeName: _.kebabCase(pluralize(moduleName)),
    title: _.startCase(pluralize(moduleName)),
    model: {
      name: _.upperFirst(_.camelCase(moduleName)),
      fileName: `${_.lowerCase(_.kebabCase(moduleName))}-model`,
      namePlural: pluralize(getModelName(moduleName)),
      dataName: _.camelCase(pluralize(moduleName)),
      fields: module.options.fields
    },
    service: {
      name: `${_.camelCase(pluralize(moduleName))}Service`,
      fileName: `${_.lowerCase(_.kebabCase(pluralize(moduleName)))}-service`,
      tag: _.kebabCase(moduleName),
      tagPlural: _.kebabCase(pluralize(moduleName)),
      apiEndPoint: _.camelCase(pluralize(moduleName)),
      hooks: {
        getAll: _.camelCase(pluralize(moduleName)),
        getOne: _.camelCase(moduleName),
        save: _.camelCase(moduleName),
      }
    },
    hook: {
      name: {
        getAll: _.upperFirst(_.camelCase(pluralize(moduleName))),
        getOne: _.upperFirst(_.camelCase(moduleName)),
        form: _.upperFirst(_.camelCase(moduleName)),
      },
      exportName: {
        getAll: _.upperFirst(_.camelCase(pluralize(moduleName))),
        getOne: _.upperFirst(_.camelCase(moduleName)),
        save: _.upperFirst(_.camelCase(`${moduleName}`)),
      },
      fileName: `use-${_.lowerCase(_.kebabCase(pluralize(moduleName)))}`,
      dataName: _.camelCase(moduleName),
      link: getLink(moduleName),
      parameters: _.camelCase(moduleName)
    },
    features: {
      table: {
        name: `${_.upperFirst(_.camelCase(moduleName))}Table`,
        title: _.startCase(pluralize(moduleName)),
        fileName: `${_.kebabCase(moduleName)}-table`,
        dataSource: `{data?.${_.lowerFirst(pluralize(getModelName(moduleName)))}}`
      },
      tableColumns: {
        fileName: `${_.kebabCase(moduleName)}-table-columns`,
        actionData: '{{ items: getActions(record) }}',
      },
      form: {
        title: _.kebabCase(moduleName),
        name: _.upperFirst(_.camelCase(moduleName)),
        fileName: `${_.kebabCase(moduleName)}-form`,
        formImportInputs: getFormInputs(module.options.fields),
        inputs: module.options.fields.map((field: Field) => ({
          ...field,
          title: _.startCase(field.name),
          placeholder: _.startCase(field.name),
          fieldObject: `{record.${field.name}}`,
        }))
      }
    },
    pages: {
      index: {
        name: _.upperFirst(_.camelCase(pluralize(moduleName))),
        title: _.startCase(pluralize(moduleName)),
        actionTitle: _.startCase(moduleName),
      },
      create: {
        name: _.upperFirst(_.camelCase(moduleName)),
        actionTitle: _.startCase(moduleName),
        actionTitleLower: _.lowerCase(moduleName)
      }
    }
  };
};