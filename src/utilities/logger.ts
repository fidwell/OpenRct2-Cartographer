/**
 * The available levels of logging.
 */
type LogLevel = "debug" | "warning" | "error";

/**
 * Prints a message with the specified logging and plugin identifier.
 */
function print(level: LogLevel, color: number, message: string): void {
  console.log(`[${color}m<Cartographer-${level}>[0m ${message}`); // eslint-disable-line
}

export function debug(message: string): void {
  print("debug", 94, message);
}

export function warning(message: string): void {
  print("warning", 93, message);
}

export function error(message: string): void {
  print("error", 91, message);
}
