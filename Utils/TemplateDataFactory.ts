
import fs, { stat } from 'fs';
import path from 'path';

export class TemplateDataFactory {
    static getTemplateData() {
        const dataPath = path.join(__dirname, 'templateData.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const templateData = JSON.parse(rawData);
        return templateData;
    }

    static getSectionData() {
        const dataPath = path.join(__dirname, 'templateData.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const sectionData = JSON.parse(rawData);
        return sectionData;
    }

    static getQuestionData() {
        const dataPath = path.join(__dirname, 'templateData.json');
        const rawData = fs.readFileSync(dataPath, 'utf-8');
        const questionData = JSON.parse(rawData);
        return questionData;
    }

    static getRandomTemplateName(): string {
        const templateData = this.getTemplateData();
        const chosenTemplate = templateData[Math.round(Math.random() * templateData.length)];
        return chosenTemplate.templateName;
    }

    static getRandomSectionName(templateName: string): string {
        const sectionData = this.getSectionData();
        const sections = sectionData[templateName];
        const chosenSection = sections[Math.round(Math.random() * sections.length)];
        return chosenSection.sectionName;
    }

    static getRandomQuestion(sectionName: string): { questionText: string, questionType: string } {
        const questionData = this.getQuestionData();
        const questions = questionData[sectionName];
        const chosenQuestion = questions[Math.round(Math.random() * questions.length)];
        return { questionText: chosenQuestion.questionText, questionType: chosenQuestion.questionType };
    }
}
