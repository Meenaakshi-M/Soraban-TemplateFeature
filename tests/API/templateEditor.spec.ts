import {test, expect} from '@playwright/test';
import { addQuestionData, addSectionData, addTemplateData } from '../../TestData/TemplateEditorData.ts';

const baseURL =  process.env.API_BASE_URL;

test.describe('Template Editor API Tests', () => {
  

  test('E2E: Template, sections questions CRUD and related validations', async ({request}) => {
    // Create a new template
    const templateData = addTemplateData();
    const postResponse = await request.post(`${baseURL}/api/v1/templates`, { data: {
      name: templateData.templateName,
      description: templateData.templateDescription
    }});
    console.log('Template Data:', templateData);
   
    expect(postResponse.status()).toBe(201);
    const postResponseBody = await postResponse.json();
    expect(postResponseBody).toHaveProperty('id');
    expect(postResponseBody.name).toBe(templateData.templateName);
    expect(postResponseBody.description).toBe(templateData.templateDescription);

    const templateId = postResponseBody.id;

    //Add 2 sections to the created template
    const sectionData = addSectionData();
   
    const postSection1Response = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections`, { data: {
      name: sectionData.sectionName,
      sectionType: 'questionnaire',
      instruction: sectionData.instruction
    }});

    // Validate that the response status is 201 (Created)
    expect(postSection1Response.status()).toBe(201);
    const postSection1ResponseBody = await postSection1Response.json();
    expect(postSection1ResponseBody).toHaveProperty('id');
    expect(postSection1ResponseBody.name).toBe(sectionData.sectionName);
    expect(postSection1ResponseBody.instruction).toBe(sectionData.instruction);
    const section1Id = postSection1ResponseBody.id;
  
    
    const postSection2Response = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections`, { data: {
      name: sectionData.sectionName,
      sectionType: 'questionnaire',
      instruction: sectionData.instruction
    } });
   
    expect(postSection2Response.status()).toBe(201);
    const postSection2ResponseBody = await postSection2Response.json();
    expect(postSection2ResponseBody).toHaveProperty('id');
    const section2Id = postSection2ResponseBody.id;

    // Add questions to the created section
    const questionData = addQuestionData();
   
    const postQuestion1Response = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections/${section1Id}/questions`, { data: {
      text: questionData.questionText,
      type: questionData.questionType
    } });
    
    expect(postQuestion1Response.status()).toBe(201);
    const postQuestion1ResponseBody = await postQuestion1Response.json();
    expect(postQuestion1ResponseBody).toHaveProperty('id');
    expect(postQuestion1ResponseBody.text).toBe(questionData.questionText);
    expect(postQuestion1ResponseBody.type).toBe(questionData.questionType);
    const question1Id = postQuestion1ResponseBody.id;

    
    const postQuestion2Response = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections/${section2Id}/questions`, { data: {
      text: questionData.questionText,
      type: questionData.questionType
    } });
    // Validate that the response status is 201 (Created)
    expect(postQuestion2Response.status()).toBe(201);
    const postQuestion2ResponseBody = await postQuestion2Response.json();
    expect(postQuestion2ResponseBody).toHaveProperty('id');
    const question2Id = postQuestion2ResponseBody.id;

    // Validate Section Edits'
    const putSectionResponse = await request.put(`/api/v1/templates/${templateId}/sections/${section1Id}`, { data: {
      name: 'New Section Name',
    } });
    // Validate that the response status is 200 (OK)
    expect(putSectionResponse.status()).toBe(200);
    const putSectionResponseBody = await putSectionResponse.json();
    expect(putSectionResponseBody.name).toBe('New Section Name');

    // Validate Question Edits
    const putQuestionResponse = await request.put(`/api/v1/templates/${templateId}/sections/${section1Id}/questions/${question1Id}`, { data: {
      text: 'New Question Text',
    } });
    // Validate that the response status is 200 (OK)
    expect(putQuestionResponse.status()).toBe(200);
    const putQuestionResponseBody = await putQuestionResponse.json();
    expect(putQuestionResponseBody.text).toBe('New Question Text');

   //Delete the question from section2 and validate deletion
    const deleteQuestionResponse = await request.delete(`/api/v1/templates/${templateId}/sections/${section1Id}/questions/${question2Id}`);
    expect(deleteQuestionResponse.status()).toBe(204);

    const getDeletedQuestionResponse = await request.get(`/api/v1/templates/${templateId}/sections/${section1Id}/questions/${question2Id}`);
    expect(getDeletedQuestionResponse.status()).toBe(404);

    //Delete section2 and validate deletion
    const deleteSectionResponse = await request.delete(`/api/v1/templates/${templateId}/sections/${section2Id}`);
    expect(deleteSectionResponse.status()).toBe(204);
  
    const getDeletedSectionResponse = await request.get(`/api/v1/templates/${templateId}/sections/${section2Id}`);
    expect(getDeletedSectionResponse.status()).toBe(404);

  });
});
