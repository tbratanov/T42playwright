import { setupElectronApp, initializeGlue } from '../functions/setup.page'
import * as func from '../functions/functions';
import { test, expect, ElectronApplication } from '@playwright/test';

let electronApp: ElectronApplication;
let appManagerObj: any;
let appManager: any;
let glue: any;

test.beforeAll(async () => {
    electronApp = await setupElectronApp();
    appManagerObj = await func.waitForAppToLoad("glue42-application-manager", electronApp);
    appManager = appManagerObj.page;
    glue = await initializeGlue(appManager);
});

test('Open Client List, Client Portfolio, Subscribe to Channel, verify sync', async () => {

    await appManager.click(`id=apps`);

    await appManager.type(`id=app-search`, `Client List 🔗`);

    await appManager.locator('.title-app >> text=Client List 🔗').click();

    const { page: clientList } = await func.waitForAppToLoad("channelsclientlist", electronApp);

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').click();

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').fill('Vernon Mullen');

    await clientList.press('[placeholder="Type\\ to\\ filter"]', 'Enter');

    await clientList.locator('id=017892d7-e11e-4fde-90db-406bfc65f29e').click();

    await clientList.locator('text=Open Portfolio').first().click();

    const { page: clientPortfolio } = await func.waitForAppToLoad("channelsclientportfolio", electronApp);

    await clientPortfolio.isVisible('text=Vernon Mullen')

    await clientList.addScriptTag({ content: `Glue().then((glue) => { glue.channels.join('Red')})` })

    await clientPortfolio.addScriptTag({ content: `Glue().then((glue) => { glue.channels.join('Red')})` })

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').click();

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').fill('Sutton Edwards');

    await clientList.press('[placeholder="Type\\ to\\ filter"]', 'Enter');

    await clientList.locator('text=sutton.edwards@acme.com').click();

    await clientPortfolio.isVisible('text=Vernon Mullen')

    await electronApp.close();

});