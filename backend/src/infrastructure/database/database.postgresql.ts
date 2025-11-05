import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { readdirSync, statSync } from 'fs';

export class PostgresDatabase {
  constructor(private readonly configService: ConfigService) {}

  getConnection(): TypeOrmModuleOptions {
    const entities = PostgresDatabase.loadEntities();
    return {
      type: 'postgres',
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: this.configService.get<number>('DB_PORT', 5432),
      username: this.configService.get<string>('DB_USERNAME', 'user'),
      password: this.configService.get<string>('DB_PASSWORD', 'password'),
      database: this.configService.get<string>('DB_NAME', 'movie_explorer'),
      entities,
      synchronize: true, // Auto-create schema for development/testing
      logging: true, // Enable logging to debug queries
      ssl: {
        rejectUnauthorized: false, // Render uses self-signed certs
      },
    };
  }

  private static loadEntitiesFromDirectory(directoryPath: string): any[] {
    let entities: any[] = [];

    try {
      const files = readdirSync(directoryPath);
      files.forEach((file) => {
        const fullPath = join(directoryPath, file);
        const fileStat = statSync(fullPath);

        // If it's a directory, recursively look for entities
        if (fileStat.isDirectory()) {
          const nestedEntities = this.loadEntitiesFromDirectory(fullPath);
          entities = [
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...entities,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            ...(Array.isArray(nestedEntities) ? nestedEntities : []),
          ];
        } else if (
          file.endsWith('.orm-entity.ts') ||
          file.endsWith('.orm-entity.js')
        ) {
          // If it matches the entity file format, load it
          // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment
          const entityModule = require(fullPath);

          // Handle both default and named exports
          if (entityModule.default) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            entities.push(entityModule.default);
          } else {
            // For named exports, push all exported classes
            Object.keys(entityModule).forEach((key) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
              if (typeof entityModule[key] === 'function') {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                entities.push(entityModule[key]);
              }
            });
          }
        }
      });
    } catch (error) {
      console.error(`Error reading directory ${directoryPath}: `, error);
    }

    return entities;
  }

  private static loadEntities(): any[] {
    const rootPath = join(__dirname, '../../');

    console.log('Root path: ', rootPath);
    const entities: any[] = [];

    // Traverse the entire directory, looking for all entities folders
    const traverseDir = (dir: string) => {
      const files = readdirSync(dir);

      files.forEach((file) => {
        const fullPath = join(dir, file);
        const fileStat = statSync(fullPath);

        if (fileStat.isDirectory()) {
          if (file.toLowerCase() === 'entities') {
            // If it's an entities folder, load the entities inside
            const entityFiles = this.loadEntitiesFromDirectory(fullPath);

            entities.push(...entityFiles);
          } else {
            traverseDir(fullPath); // If it's not an entities folder, continue recursion
          }
        }
      });
    };

    // Start traversing the src or dist folder
    traverseDir(rootPath);

    console.log('Loaded Entities: ', entities);
    return entities;
  }
}
