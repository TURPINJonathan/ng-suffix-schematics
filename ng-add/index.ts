import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonPath = 'angular.json';
    
    if (!tree.exists(angularJsonPath)) {
      context.logger.error('Could not find angular.json. This schematic only works in an Angular workspace.');
      return tree;
    }

    const angularJsonContent = tree.read(angularJsonPath);
    if (!angularJsonContent) {
      context.logger.error('Could not read angular.json');
      return tree;
    }

    const angularJson = JSON.parse(angularJsonContent.toString('utf-8'));

    if (!angularJson.cli) {
      angularJson.cli = {};
    }

    if (!angularJson.cli.schematicCollections) {
      angularJson.cli.schematicCollections = [];
    }

    const packageName = '@turpinjonathan/ng-suffix-schematics';
    
    if (!angularJson.cli.schematicCollections.includes(packageName)) {
      angularJson.cli.schematicCollections.unshift(packageName);
      
      if (!angularJson.cli.schematicCollections.includes('@schematics/angular')) {
        angularJson.cli.schematicCollections.push('@schematics/angular');
      }

      context.logger.info(`✅ Added ${packageName} to schematic collections`);
    } else {
      context.logger.info(`ℹ️ ${packageName} is already configured`);
    }
    
    tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));

    context.logger.info('');
    context.logger.info('🎉 Configuration complete!');
    context.logger.info('');
    context.logger.info('You can now use Angular CLI commands:');
    context.logger.info('  ng g component my-component');
    context.logger.info('  ng g service my-service');
    context.logger.info('  ng g pipe my-pipe');
    context.logger.info('');

    return tree;
  };
}
