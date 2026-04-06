import { app, BrowserWindow } from "electron";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 700,
    backgroundColor: "#0b1020",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const devUrl = process.env.ELECTRON_DEV_URL;
  if (devUrl) {
    win.loadURL(devUrl);
    win.webContents.openDevTools({ mode: "detach" });
    return;
  }

  const indexHtml = path.join(__dirname, "..", "dist", "index.html");
  win.loadFile(indexHtml);
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

