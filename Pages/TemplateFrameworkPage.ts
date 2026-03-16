import {Page, Locator} from '@playwright/test';

export class TemplateFrameworkPage {
  readonly page: Page;
  readonly addSectionButton: Locator;
  readonly newQuestionBtn: Locator;
  readonly questionTypeDropdown: Locator;
  readonly previewBtn: Locator;
  readonly saveBtn: Locator;

    constructor(page: Page) {
      this.page = page;
      this.addSectionButton = page.getByRole('button', { name: 'Add Section' });
      this.newQuestionBtn = page.getByRole('button', { name: 'New Question' });
      this.questionTypeDropdown = page.getByRole('combobox', { name: 'Question Type' });
      this.previewBtn = page.getByRole('button', { name: 'Preview' });
      this.saveBtn = page.getByRole('button', { name: 'Save' });
    }

    async goto(templateId: string) {
      await this.page.goto(`/templates/${templateId}`);
    }

    async addSection(sectionName: string) {
      await this.addSectionButton.click();
      await this.page.getByRole('textbox', { name: 'Section Name' }).fill(sectionName);
      await this.page.getByRole('combobox', { name: 'Section Type' }).selectOption('questionnaire');
      await this.page.getByRole('button', { name: 'Add Section' }).click();
    }

    async addQuestion(sectionName: string, questionText: string, questionType: string) {
        const sectionLocator = this.page.locator('.section-container', { hasText: sectionName });
        await sectionLocator.getByRole('button', { name: 'New Question' }).click();
        await this.page.getByPlaceholder('Enter your question here').fill(questionText);
        await this.questionTypeDropdown.selectOption(questionType);
        await this.saveBtn.click();
    }

    async addConditionalLogic(sectionName: string, questionText: string, triggerValue: string, triggerSection: string) {
        await this.page.locator('.question-row', { hasText: questionText }).getByRole('button', { name: 'Add Logic' }).click();
        await this.page.getByRole('combobox', { name: 'Trigger Question' }).selectOption(questionText);
        await this.page.getByLabel('If client selects').selectOption(triggerValue);
        await this.page.getByRole('combobox', { name: 'Then show section' }).selectOption(triggerSection);
        await this.saveBtn.click();
    }

}