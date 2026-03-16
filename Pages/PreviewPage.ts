import { Page, Locator } from "@playwright/test";

export class PreviewPage {
    readonly page: Page;
    readonly sectionHeaders: Locator;
    readonly questionTexts: Locator;

    constructor(page: Page) {
        this.page = page;
        this.sectionHeaders = page.locator('.preview-section-header');
        this.questionTexts = page.locator('.preview-question-text');
    }

    async getSectionHeaders() {
        return await this.sectionHeaders.allTextContents();
    }

    async getQuestionTexts() {
        return await this.questionTexts.allTextContents();
    }

    async goto(templateId: string) {
        await this.page.getByRole('button', { name: 'Preview' }).click();
        await this.page.goto(`/preview/template/${templateId}/`);
    }
}