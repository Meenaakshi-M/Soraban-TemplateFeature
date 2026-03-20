import {test, expect} from '@playwright/test';
import { TemplateFrameworkPage } from '../../Pages/TemplateFrameworkPage.ts';
import { PreviewPage } from '../../Pages/PreviewPage.ts';

test.describe('Template Editor Conditional Logic Tests', () => {
    test('Section dynamically appears when trigger question is answered', async ({ page }) => {
        const templateFrameworkPage = new TemplateFrameworkPage(page);
        const previewPage = new PreviewPage(page);

        // Use an existing template and add sections/questions with conditional logic
        await templateFrameworkPage.goto('test_123');
        await templateFrameworkPage.addSection('Personal Information');
        await templateFrameworkPage.addQuestion('Personal Information', 'Did you own a business?', 'Yes/No');
        
        await templateFrameworkPage.addSection('Business Details');
        await templateFrameworkPage.addConditionalLogic('Personal Information', 'Did you own a business?', 'Yes', 'Business Details');

        //Check if added sections and questions are visible in the template page
        const section1 = templateFrameworkPage.page.locator('.section-container', { hasText: 'Personal Information' });
        const section2 = templateFrameworkPage.page.locator('.section-container', { hasText: 'Business Details' });
        const question = section1.locator('.question-row', { hasText: 'Did you own a business?' });

        await expect(section1).toBeVisible();
        await expect(section2).toBeVisible();
        await expect(question).toBeVisible();
        

        // Preview the template and validate conditional logic
        await previewPage.goto('test_123');
        await expect(previewPage.page).toHaveURL(/\/preview\/template\/test_123\//);
        const sectionHeaders = await previewPage.getSectionHeaders();
        const questionTexts = await previewPage.getQuestionTexts();

        // Validate that the trigger question is present
        expect(questionTexts).toContain('Did you own a business?');

        // Validate that the conditional section is not visible initially
        expect(sectionHeaders).not.toContain('Business Details');

        // Simulate answering the trigger question and validate that the conditional section appears
        await page.getByRole('button', { name: 'Yes' }).click();
        const updatedSectionHeaders = await previewPage.getSectionHeaders();
        expect(updatedSectionHeaders).toContain('Business Details');
    });
});
