import {test, expect} from '@playwright/test';
import {ApiClient} from '../../API/ApiClient.ts';
import { addQuestionData, addSectionData, addTemplateData } from '../../TestData/TemplateEditorData.ts';

test.describe('Template Creation API Tests', () => {
  let apiClient: ApiClient;

  // Initialize the API client before each test
  test.beforeEach(async ({request}) => {
    apiClient = new ApiClient(request);
  });

  test('Create a new template', async () => {
    const templateData = addTemplateData();

    // Send a POST request to create a new template
    const postResponse = await apiClient.post('/api/v1/templates', {
      name: templateData.templateName,
      description: templateData.templateDescription
    });

    // Validate that the response status is 201 (Created)
    expect(postResponse.status()).toBe(201);
    const postResponseBody = await postResponse.json();
    expect(postResponseBody).toHaveProperty('id');
    expect(postResponseBody.name).toBe(templateData.templateName);
    expect(postResponseBody.description).toBe(templateData.templateDescription);

    const templateId = postResponseBody.id;

  test('Add a section to the created template', async () => {
    const sectionData = addSectionData();
    // Send a POST request to add a section to the created template
    const postSectionResponse = await apiClient.post(`/api/templates/${templateId}/sections`, {
      name: sectionData.sectionName,
      instruction: sectionData.instruction
    });

    // Validate that the response status is 201 (Created)
    expect(postSectionResponse.status()).toBe(201);
    const postSectionResponseBody = await postSectionResponse.json();
    expect(postSectionResponseBody).toHaveProperty('id');
    expect(postSectionResponseBody.name).toBe(sectionData.sectionName);
    expect(postSectionResponseBody.instruction).toBe(sectionData.instruction);
    const sectionId = postSectionResponseBody.id;
  

  // Add questions to the created section
  test('Add a question to the created section', async () => {
    const questionData = addQuestionData();
    // Send a POST request to add a question to the created section
    const postQuestionResponse = await apiClient.post(`/api/templates/${templateId}/sections/${sectionId}/questions`, {
      text: questionData.questionText,
      type: questionData.questionType
    });
    // Validate that the response status is 201 (Created)
    expect(postQuestionResponse.status()).toBe(201);
    const postQuestionResponseBody = await postQuestionResponse.json();
    expect(postQuestionResponseBody).toHaveProperty('id');
    expect(postQuestionResponseBody.text).toBe(questionData.questionText);
    expect(postQuestionResponseBody.type).toBe(questionData.questionType);
  });
  });
  });
});