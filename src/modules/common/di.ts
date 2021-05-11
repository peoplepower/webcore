/**
 * Dependency Injection container. Singleton only.
 */
export class Container {
  protected readonly constructors: { [key: string]: new (...args: any[]) => any } = {};
  protected readonly injectables: { [key: string]: any } = {};

  /**
   * Add injectable type
   * @param {Function} constructor type (constructor function)
   * @param {string} [typeName]
   */
  public addInjectable<T>(constructor: new (...args: any[]) => T, typeName?: string) {
    let name = typeName || constructor.name;
    if (this.constructors.hasOwnProperty(name)) {
      throw new Error(`DI error: injectable with such name already exists: ${name}`);
    }
    this.constructors[name] = constructor;
  }

  /**
   * Create new instance of injectable
   * @param {string} identifier
   * @returns {any}
   */
  private getNewInstance<T>(identifier: string): T {
    //console.log('Creating: ' + identifier);
    if (!this.constructors.hasOwnProperty(identifier)) {
      throw new Error(`DI error: There is no object with name ${identifier} in DI Container`);
    }
    return new this.constructors[identifier]();
  }

  /**
   * Get injectable instance
   * @param typeOrName
   * @returns {T}
   */
  public get<T>(typeOrName: string | (new (...args: any[]) => T)): T {
    let identifier: string;
    if (typeof typeOrName === 'string') {
      identifier = typeOrName;
    } else {
      identifier = typeOrName.name;
    }
    if (this.injectables.hasOwnProperty(identifier)) {
      return this.injectables[identifier];
    }
    this.injectables[identifier] = this.getNewInstance<T>(identifier);
    return this.injectables[identifier];
  }

  /**
   * Clear DI Container. You can specify exact type name to clear the only entry.
   * @param {string|Function} [typeOrName] name of the type or type itself to clear
   */
  public clear<T>(typeOrName?: string | (new (...args: any[]) => T)) {
    if (typeOrName) {
      let identifier: string;
      if (typeof typeOrName === 'string') {
        identifier = typeOrName;
      } else {
        identifier = typeOrName.name;
      }
      if (this.injectables.hasOwnProperty(identifier)) {
        delete this.injectables[identifier];
      }
      return;
    } else {
      for (let key in this.injectables) {
        delete this.injectables[key];
      }
      return;
    }
  }
}

let container = new Container();
export { container };

/**
 * Mark type as injectable. This object will be accessible to inject via @inject() decorator
 * @param {string} typeName name of the type (you should use it to make it working after minification)
 */
export function injectable<T>(typeName: string) {
  return function (constructor: new (...args: any[]) => T) {
    container.addInjectable(constructor, typeName);
  };
}

/**
 * Inject instance into the type. This decorator will create property with getter
 * @param {string|type} [typeOrName] You can specify type itself (constructor function) or string with type name or
 *     just skip this parameter - the type from decorated field will be used. But it is better to use strings to avoid
 *     late type resolution in case of circular module dependency
 */
export function inject<T>(typeOrName?: string | (new (...args: any[]) => T)): Function {
  return function (target: Object, propertyName: string) {
    if (!typeOrName) {
      throw new Error(
        `DI error: you should pass type name to @inject() decorator on "${propertyName}" property in "${target.constructor.name}" class`,
      );
    }
    let identifier: string;
    if (typeof typeOrName === 'string') {
      identifier = typeOrName;
    } else {
      identifier = typeOrName.name;
    }

    // Delete property.
    // @ts-ignore
    if (delete target[propertyName]) {
      // Create new property with getter
      Object.defineProperty(target, propertyName, {
        get: () => {
          return container.get<T>(identifier);
        },
        enumerable: true,
        configurable: true,
      });
    }
  };
}
