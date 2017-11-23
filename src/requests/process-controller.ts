/**
 * Processing of custom types from `paths` section
 * in the schema
 */
import * as _ from 'lodash';
import * as path from 'path';

import * as conf from '../conf';
import {Config} from '../generate';
import {indent, writeFile} from '../utils';
import {processMethod} from './process-method';
import {processResponses} from './process-responses';
import {ControllerMethod} from './requests.models';

/**
 * Creates and serializes class for api communication for controller
 * @param controllers list of methods of the controller
 * @param name
 */
export function processController(methods: ControllerMethod[], name: string, config: Config) {
  const filename = path.join(config.dest, conf.apiDir, `${name}.ts`);
  let usesGlobalType = false;

  // make simpleNames unique and process responses
  const simpleNames = _.map(methods, 'simpleName');
  methods.forEach(controller => {
    if (simpleNames.filter(n => n === controller.simpleName).length > 1) {
      controller.simpleName = controller.operationId;
    }

    controller.responseDef = processResponses(controller.responses, controller.simpleName);
    usesGlobalType = usesGlobalType || controller.responseDef.usesGlobalType;
  });

  const processedMethods = methods.map(processMethod);
  usesGlobalType = usesGlobalType || processedMethods.some(c => c.usesGlobalType);

  let content = '';
  // TODO import HttpParams only if needed
  content += 'import {HttpClient, HttpParams} from \'@angular/common/http\';\n';
  content += 'import {Injectable} from \'@angular/core\';\n';
  content += 'import {Observable} from \'rxjs/Observable\';\n';
  content += '\n';
  if (usesGlobalType) {
    content += `import * as ${conf.modelFile} from \'../${conf.modelFile}\';\n`;
  }
  content += '\n';

  const interfaceDef = _.map(processedMethods, 'interfaceDef').filter(Boolean).join('\n');
  if (interfaceDef) {
    content += interfaceDef;
    content += '\n';
  }

  content += `@Injectable()\n`;
  content += `export class ${name}Service {\n`;
  content += indent('constructor(private http: HttpClient) {}');
  content += '\n';
  content += indent(_.map(processedMethods, 'methodDef').join('\n\n'));
  content += '\n}\n';

  if (conf.adHocExceptions.api[name]) {
    content = content.replace(conf.adHocExceptions.api[name][0],
                              conf.adHocExceptions.api[name][1]);
  }

  writeFile(filename, content, config.header);
}
