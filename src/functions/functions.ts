import type { Page } from  '@playwright/test';

interface returnedApp {
    app: string,
    instance: string,
    glue42gd: object,
    page: Page
}


export const waitForAppToLoad = (appName:string, electronApp:any) => {
    return new Promise<returnedApp>((resolve, reject) => {
      electronApp.on('window', async (page:any) => {
        try {
          const glue42gd = await page.evaluate(`glue42gd`);
          if (appName === glue42gd.applicationName) {
            page.on('load', () => {
              resolve({
                app: glue42gd.applicationName,
                instance: glue42gd.instance,
                glue42gd,
                page
              });
            })
          }
        } catch (e) {
          
        }
      });
    });
  }