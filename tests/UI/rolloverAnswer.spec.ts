import {test, expect} from '@playwright/test';
import { TemplateFrameworkPage } from '../../Pages/TemplateFrameworkPage.ts';

// This test file will cover test scenarios related to rollover functionality 
// Use an existing template with sections and questions that has client entries

test.describe('Template Editor Rollover and Export Tests', () => {
    test('Edit existing template with client entries, validate rollover', async ({ page }) => {
        const templateFrameworkPage = new TemplateFrameworkPage(page);

        await templateFrameworkPage.goto('tpl_rollover_123');
        await templateFrameworkPage.page.locator('.section-container', { hasText: 'Business' }).click();
        const questionLocator = templateFrameworkPage.page.locator('.question-row', { hasText: 'Schedule C Businesses' });
        await questionLocator.getByRole('button', { name: 'Edit' }).click();

        
        // Rename an existing client entry tab for a question in the business section
        await page.getByRole('button', { name: 'Enter Details' }).click();
        // Rename General tab to 'Updated General'
        await page.getByRole('button', { name: 'Edit Tabs' }).click();
        await page.getByRole('textbox', { name: 'Tab Name', exact: true }).fill('Updated General');
        await page.getByRole('button', { name: 'Save' }).click();

        // Validate that the tab name is updated in the UI
        const updatedTab = page.getByRole('tab', { name: 'Updated General' });
        await expect(updatedTab).toBeVisible();

        //validate that the rollover answers for client entries are present in the updated tab 
        const answerInput = page.getByRole('textbox', { name: 'Amount' });
        await expect(answerInput).toHaveValue('5000');
        const businessNameInput = page.getByRole('textbox', { name: 'Business Name' });
        await expect(businessNameInput).toHaveValue('Test Business');

    });
});