import { Page, _electron as electron } from 'playwright';
import path from "path";
import Glue from "@glue42/desktop";

export async function setupElectronApp () {

    const gdDir = `${process.env.LocalAppData}\\Tick42\\GlueDesktop\\`;
    const gdExePath = path.join(gdDir, "tick42-glue-desktop.exe");

    const electronApp = await electron.launch({
        executablePath: gdExePath,
        cwd: gdDir
    });

    return electronApp;
}

export async function initializeGlue (page:Page) {
    const GWConfig:any = await page.evaluate('glue42gd.getGWInfo()')
    const gwToken:any = await page.evaluate('glue42gd.getGWToken()') 
    return await Glue({auth: { gatewayToken: gwToken }, gateway: { ws: GWConfig.url }, activities: false})
}

