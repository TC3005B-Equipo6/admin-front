export class AppConfigError extends Error {
  constructor() {
    super("Application configuration error");
    this.name = "AppConfigError";
  }
}
