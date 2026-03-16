import { faker } from '@faker-js/faker';

export function addTemplateData() {
    const templateName = faker.lorem.words(2);
    const templateDescription = faker.lorem.sentence();
    return {
        templateName: templateName,
        templateDescription: templateDescription
    }
}

export function addSectionData() {
    const sectionName = faker.lorem.words(2);
    const instruction = faker.lorem.sentence();
    return {
        sectionName: sectionName,
        instruction: instruction
    }
} 

export function addQuestionData() {
    const questionText = faker.lorem.sentence();
    const questionTypeOptions = ['Yes/No', 'multiple choice', 'multiple select', 'upload', 
    'date', 'short answer', 'long answer', 'sensitive information', 'email', 'phone', 'client entries', 'amount'];
    const questionType = faker.helpers.arrayElement(questionTypeOptions);
    return {
        questionText: questionText,
        questionType: questionType
    }
}