/**
 * Exposes helper methods to work with file paths, URL strings, segments, etc.
 */
export class Path {
  private static CombineInternal(path1: string, path2: string, pathSeparator?: string): string {
    let separator = pathSeparator || '/';
    path1 = path1 || '';
    path2 = path2 || '';

    if (path1.length > 0 && !path1.endsWith(separator) && !path2.startsWith(separator)) {
      //Add separator if neither path1 nor path2 contain trailing/starting separator respectively
      path1 += separator;
    } else if (path1.endsWith(separator) && path2.startsWith(separator)) {
      //remove excessive separator if both contain separator at end/start respectively
      path2 = path2.length > 1 ? path2.substring(1) : '';
    }

    return path1 + path2;
  }

  public static Combine(...args: string[]): string {
    //Combine one by one
    return args.reduce((result, currentValue) => this.CombineInternal(result, currentValue), '');
  }
}
