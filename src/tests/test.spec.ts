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

test.skip('Open Client List, Client Portfolio, Subscribe to Channel, verify sync', async () => {

    await appManager.click(`id=apps`);

    await appManager.type(`id=app-search`, `Client List 🔗`);

    await appManager.locator('.title-app >> text=Client List 🔗').click();

    const { page: clientList } = await func.waitForAppToLoad("channelsclientlist", electronApp);

    await clientList.addScriptTag({ content: `Glue().then((glue) => { glue.channels.join('Red')})` })

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').click();

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').fill('Vernon Mullen');

    await clientList.press('[placeholder="Type\\ to\\ filter"]', 'Enter');

    await clientList.locator('id=017892d7-e11e-4fde-90db-406bfc65f29e').click();

    await clientList.locator('text=Open Portfolio').first().click();

    const { page: clientPortfolio } = await func.waitForAppToLoad("channelsclientportfolio", electronApp);

    await clientPortfolio.addScriptTag({ content: `Glue().then((glue) => { glue.channels.join('Red')})` })

    await clientPortfolio.isVisible('text=Vernon Mullen')

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').click();

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').fill('Sutton Edwards');

    await clientList.press('[placeholder="Type\\ to\\ filter"]', 'Enter');

    await clientList.locator('text=sutton.edwards@acme.com').click();

    await clientPortfolio.locator('text=Sutton Edwards').isVisible();
});

test.only('Open Client List, Client Portfolio, Subscribe to Channel, verify sync, save a global layout, restore, check sync', async () => {

    await appManager.click(`id=apps`);

    await appManager.type(`id=app-search`, `Client List 🔗`);

    await appManager.locator('.title-app >> text=Client List 🔗').click();

    const { page: clientList } = await func.waitForAppToLoad("channelsclientlist", electronApp);

    await clientList.addScriptTag({ content: `Glue().then((glue) => { glue.channels.join('Red')})` })

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').click();

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').fill('Vernon Mullen');

    await clientList.press('[placeholder="Type\\ to\\ filter"]', 'Enter');

    await clientList.locator('id=017892d7-e11e-4fde-90db-406bfc65f29e').click();

    await clientList.locator('text=Open Portfolio').first().click();

    const { page: clientPortfolio } = await func.waitForAppToLoad("channelsclientportfolio", electronApp);

    await clientPortfolio.addScriptTag({ content: `Glue().then((glue) => { glue.channels.join('Red')})` })

    await clientPortfolio.isVisible('text=Vernon Mullen')

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').click();

    await clientList.locator('[placeholder="Type\\ to\\ filter"]').fill('Sutton Edwards');

    await clientList.press('[placeholder="Type\\ to\\ filter"]', 'Enter');

    await clientList.locator('text=sutton.edwards@acme.com').click();

    await clientPortfolio.locator('text=Sutton Edwards').isVisible();

    await appManager.locator('id=layout-menu-tool').hover();

    await appManager.locator('id=save').click();

    const globalLayoutName = Math.random().toString();

    await appManager.type(`id=layout-save-name`, globalLayoutName);

    await appManager.locator('id=layout-save-btn').click();

    await appManager.type(`id=layout-search`, globalLayoutName);

    expect(await appManager.locator(`#layout-load div:has-text('${globalLayoutName}')`).isVisible()).toBe(true);

    await glue.layouts.restore({name: `${globalLayoutName}`, type: 'Global'})

    const { page: restoredClientList } = await func.waitForAppToLoad('Client List', electronApp);

    await restoredClientList.locator('[placeholder="Type\\ to\\ filter"]').click({ delay: 1500 });

    await restoredClientList.locator('[placeholder="Type\\ to\\ filter"]').fill('Sutton Edwards');

    await restoredClientList.press('[placeholder="Type\\ to\\ filter"]', 'Enter');

    await restoredClientList.locator('text=sutton.edwards@acme.com').click();

    restoredClientList.pause();

    // Unable to 'wait' for the layout to be restored, actions are attempting to be executed prior to layout loading
});