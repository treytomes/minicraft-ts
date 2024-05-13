import path from "path";
import Main from "./main";

export const getClientPath = (relativePath: string): string => {
  // return path.join(__dirname, `../dist/client/${relativePath}`);
  return path.join(Main.application.getAppPath(), `/dist/client/${relativePath}`);
}

export const getPreloadPath = (relativePath: string): string => {
  return path.join(Main.application.getAppPath(), `/dist/preload/${relativePath}`);
}
