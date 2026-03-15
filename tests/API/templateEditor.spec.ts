import {test, expect} from '@playwright/test';
import {ApiClient} from '../../API/ApiClient.ts';
import { addQuestionData, addSectionData, addTemplateData } from '../../TestData/TemplateEditorData.ts';

test.describe('Template Editor API Tests', () => {
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

  test('Add 2 sections to the created template', async () => {
    const sectionData = addSectionData();
    // Send a POST request to add the first section to the created template
    const postSection1Response = await apiClient.post(`/api/templates/${templateId}/sections`, {
      name: sectionData.sectionName,
      sectionType: 'questionnaire',
      instruction: sectionData.instruction
    });

    // Validate that the response status is 201 (Created)
    expect(postSection1Response.status()).toBe(201);
    const postSection1ResponseBody = await postSection1Response.json();
    expect(postSection1ResponseBody).toHaveProperty('id');
    expect(postSection1ResponseBody.name).toBe(sectionData.sectionName);
    expect(postSection1ResponseBody.instruction).toBe(sectionData.instruction);
    const section1Id = postSection1ResponseBody.id;
  
    // Send a POST request to add the second section to the created template
    const postSection2Response = await apiClient.post(`/api/templates/${templateId}/sections`, {
      name: sectionData.sectionName,
      sectionType: 'questionnaire',
      instruction: sectionData.instruction
    });

    // Validate that the response status is 201 (Created)
    expect(postSection2Response.status()).toBe(201);
    const postSection2ResponseBody = await postSection2Response.json();
    expect(postSection2ResponseBody).toHaveProperty('id');
    const section2Id = postSection2ResponseBody.id;

  // Add questions to the created section
  test('Add 1 question to each of the created sections', async () => {
    const questionData = addQuestionData();
    // Send a POST request to add a question to Section1
    const postQuestion1Response = await apiClient.post(`/api/templates/${templateId}/sections/${section1Id}/questions`, {
      text: questionData.questionText,
      type: questionData.questionType
    });
    // Validate that the response status is 201 (Created)
    expect(postQuestion1Response.status()).toBe(201);
    const postQuestion1ResponseBody = await postQuestion1Response.json();
    expect(postQuestion1ResponseBody).toHaveProperty('id');
    expect(postQuestion1ResponseBody.text).toBe(questionData.questionText);
    expect(postQuestion1ResponseBody.type).toBe(questionData.questionType);
    const question1Id = postQuestion1ResponseBody.id;

    // Send a POST request to add a question to Section2
    const postQuestion2Response = await apiClient.post(`/api/templates/${templateId}/sections/${section2Id}/questions`, {
      text: questionData.questionText,
      type: questionData.questionType
    });
    // Validate that the response status is 201 (Created)
    expect(postQuestion2Response.status()).toBe(201);
    const postQuestion2ResponseBody = await postQuestion2Response.json();
    expect(postQuestion2ResponseBody).toHaveProperty('id');
    const question2Id = postQuestion2ResponseBody.id;

  test('Validate Section Edits', async () => {
    const putSectionResponse = await apiClient.put(`/api/templates/${templateId}/sections/${section1Id}`, {
      name: 'New Section Name',
    });
    // Validate that the response status is 200 (OK)
    expect(putSectionResponse.status()).toBe(200);
    const putSectionResponseBody = await putSectionResponse.json();
    expect(putSectionResponseBody.name).toBe('New Section Name');

  test('Validate Question Edits', async () => {
    const putQuestionResponse = await apiClient.put(`/api/templates/${templateId}/sections/${section1Id}/questions/${question1Id}`, {
      text: 'New Question Text',
    });
    // Validate that the response status is 200 (OK)
    expect(putQuestionResponse.status()).toBe(200);
    const putQuestionResponseBody = await putQuestionResponse.json();
    expect(putQuestionResponseBody.text).toBe('New Question Text');

  test('Delete the question from section2 and validate deletion', async () => {
    const deleteQuestionResponse = await apiClient.delete(`/api/templates/${templateId}/sections/${section1Id}/questions/${question2Id}`);
    // Validate that the response status is 204 (No Content)
    expect(deleteQuestionResponse.status()).toBe(204);
    // Send a GET request to validate that Question2 has been deleted
    const getDeletedQuestionResponse = await apiClient.get(`/api/templates/${templateId}/sections/${section1Id}/questions/${question2Id}`);
    // Validate that the response status is 404 (Not Found)
    expect(getDeletedQuestionResponse.status()).toBe(404);

  test('Delete the section2 and validate deletion', async () => {
    const deleteSectionResponse = await apiClient.delete(`/api/templates/${templateId}/sections/${section2Id}`);
    // Validate that the response status is 204 (No Content)
    expect(deleteSectionResponse.status()).toBe(204);
    // Send a GET request to validate that Section2 has been deleted
    const getDeletedSectionResponse = await apiClient.get(`/api/templates/${templateId}/sections/${section2Id}`);
    // Validate that the response status is 404 (Not Found)
    expect(getDeletedSectionResponse.status()).toBe(404);

  });
  });
  });
  });
  });
  });
  });
});
