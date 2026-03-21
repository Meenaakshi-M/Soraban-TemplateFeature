import {test, expect} from '@playwright/test';
import { TemplateDataFactory } from '../../Utils/TemplateDataFactory.ts';
import { logresponse, StatusCodeToBeOneOf } from '../../Utils/helper.ts';
import { get } from 'http';
import { text } from 'stream/consumers';

const baseURL =  process.env.API_BASE_URL;

test.describe('Template Editor API Tests', () => {
  

  test('E2E: Template, sections, questions CRUD and related validations', async ({request}) => {
    // Create a new template from scratch via API and validate response 
    // Get the data from TemplateDataFactory
    const templateName = TemplateDataFactory.getRandomTemplateName();
    const postResponse = await request.post(`${baseURL}/api/templates`, { data: {
      name: templateName
    }});
    await logresponse(postResponse);
   
    expect(postResponse.status()).toBe(201);
    const postResponseBody = await postResponse.json();
    expect(postResponseBody).toHaveProperty('id');
    expect(postResponseBody.name).toBe(templateName);

    const templateId = postResponseBody.id;

    //Add 2 sections to the created template and validate the responses
    const section1Name = TemplateDataFactory.getRandomSectionName(templateName);
    const postSection1Response = await request.post(`${baseURL}/api/templates/${templateId}/sections`, { data: {
      name: section1Name,
      sectionType: 'questionnaire'
    }});

    await logresponse(postSection1Response);
    expect(postSection1Response.status()).toBe(201);
    const postSection1ResponseBody = await postSection1Response.json();
    expect(postSection1ResponseBody).toHaveProperty('id');
    expect(postSection1ResponseBody.name).toBe(section1Name);
    const section1Id = postSection1ResponseBody.id;
  
    const section2Name = TemplateDataFactory.getRandomSectionName(templateName);
    const postSection2Response = await request.post(`${baseURL}/api/templates/${templateId}/sections`, { data: {
      name: section2Name,
      sectionType: 'questionnaire'
    } });

    await logresponse(postSection2Response);
    expect(postSection2Response.status()).toBe(201);
    const postSection2ResponseBody = await postSection2Response.json();
    expect(postSection2ResponseBody).toHaveProperty('id');
    expect(postSection2ResponseBody.name).toBe(section2Name);
    const section2Id = postSection2ResponseBody.id;

    // Add questions to the created section and validate responses
    const question1Data = TemplateDataFactory.getRandomQuestion(section1Name);
   
    const postQuestion1Response = await request.post(`${baseURL}/api/templates/${templateId}/sections/${section1Id}/questions`, { data: {
      text: question1Data.questionText,
      type: question1Data.questionType
    } });
    
    await logresponse(postQuestion1Response);
    expect(postQuestion1Response.status()).toBe(201);
    const postQuestion1ResponseBody = await postQuestion1Response.json();
    expect(postQuestion1ResponseBody).toHaveProperty('id');
    expect(postQuestion1ResponseBody.text).toBe(question1Data.questionText);
    expect(postQuestion1ResponseBody.type).toBe(question1Data.questionType);
    const question1Id = postQuestion1ResponseBody.id;

    const question2Data = TemplateDataFactory.getRandomQuestion(section2Name);
    const postQuestion2Response = await request.post(`${baseURL}/api/templates/${templateId}/sections/${section2Id}/questions`, { data: {
      text: question2Data.questionText,
      type: question2Data.questionType
    } });
    
    await logresponse(postQuestion2Response);
    expect(postQuestion2Response.status()).toBe(201);
    const postQuestion2ResponseBody = await postQuestion2Response.json();
    expect(postQuestion2ResponseBody).toHaveProperty('id');
    expect(postQuestion2ResponseBody.text).toBe(question2Data.questionText);
    expect(postQuestion2ResponseBody.type).toBe(question2Data.questionType);
    const question2Id = postQuestion2ResponseBody.id;

    // Validate Section Edits
    const putSectionResponse = await request.put(`${baseURL}/api/templates/${templateId}/sections/${section1Id}`, { data: {
      name: 'New Section Name',
    } });
   
    expect(putSectionResponse.status()).toBe(200);
    const putSectionResponseBody = await putSectionResponse.json();
    console.log('Put Section Response Body:', putSectionResponseBody);
    expect(putSectionResponseBody.name).toBe('New Section Name');

    // Validate Question Edits
    const putQuestionResponse = await request.put(`${baseURL}/api/templates/${templateId}/sections/${section1Id}/questions/${question1Id}`, { data: {
      text: 'New Question Text',
    } });
    
    expect(putQuestionResponse.status()).toBe(200);
    const putQuestionResponseBody = await putQuestionResponse.json();
    expect(putQuestionResponseBody.text).toBe('New Question Text');

    // Delete the question from section2
    const deleteQuestionResponse = await request.delete(`${baseURL}/api/templates/${templateId}/sections/${section1Id}/questions/${question2Id}`);
    expect(deleteQuestionResponse.status()).toBe(204);

    // Validate that the deleted question is not accessible anymore
    const getDeletedQuestionResponse = await request.get(`${baseURL}/api/templates/${templateId}/sections/${section1Id}/questions/${question2Id}`);
    expect(getDeletedQuestionResponse.status()).toBe(404);

    // Delete section2 and validate deletion
    const deleteSectionResponse = await request.delete(`${baseURL}/api/templates/${templateId}/sections/${section2Id}`);
    expect(deleteSectionResponse.status()).toBe(204);
    
    // Validate that the deleted section is not accessible anymore
    const getDeletedSectionResponse = await request.get(`${baseURL}/api/templates/${templateId}/sections/${section2Id}`);
    expect(getDeletedSectionResponse.status()).toBe(404);

  });

  test('Template, Session, Question Creation Validations - Negative Scenarios', async ({request}) => {
    // Attempt to create a template without a name
    const postResponse = await request.post(`${baseURL}/api/v1/templates`, { data: {
      description: 'Template without a name'
    }});
    expect(postResponse.status()).toBe(400);
    const postResponseBody = await postResponse.json();
    expect(postResponseBody).toHaveProperty('error');
    expect(postResponseBody.error).toContain('name is required');

    // Attempt to create a section without a type
    const postTemplateResponse = await request.post(`${baseURL}/api/v1/templates`, { data: {
      name: 'Negative Test Template'
    }});
    expect(postTemplateResponse.status()).toBe(201);
    const postTemplateResponseBody = await postTemplateResponse.json();
    const templateId = postTemplateResponseBody.id;

    const postSectionResponse = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections`, { data: {
      name: 'Section without type'
    } });
    expect(postSectionResponse.status()).toBe(400);
    const postSectionResponseBody = await postSectionResponse.json();
    expect(postSectionResponseBody).toHaveProperty('error');
    expect(postSectionResponseBody.error).toContain('sectionType is required');

    // Attempt to create a question without text
    const postSectionResponse2 = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections`, { data: {
      name: 'Section for Invalid Question',
      sectionType: 'questionnaire'
    } });
    expect(postSectionResponse2.status()).toBe(201);
    const postSectionResponseBody2 = await postSectionResponse2.json();
    const sectionId = postSectionResponseBody2.id;

    const postQuestionResponse = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections/${sectionId}/questions`, { data: {
      type: 'Yes/No'
    } });
    expect(postQuestionResponse.status()).toBe(400);
    const postQuestionResponseBody = await postQuestionResponse.json();
    expect(postQuestionResponseBody).toHaveProperty('error');
    expect(postQuestionResponseBody.error).toContain('text is required');

    // Attempt to update a phone number question with invalid phone number format
    const postQuestionResponse2 = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections/${sectionId}/questions`, { data: {
      text: 'Enter your phone number',
      type: 'phone'
    } });
    expect(postQuestionResponse2.status()).toBe(201);
    const postQuestionResponseBody2 = await postQuestionResponse2.json();
    const questionId = postQuestionResponseBody2.id;

    const putQuestionResponse = await request.put(`${baseURL}/api/v1/templates/${templateId}/sections/${sectionId}/questions/${questionId}`, { data: {
      phone: '12345'
    } });
    StatusCodeToBeOneOf(putQuestionResponse, [400, 404]);
    const putQuestionResponseBody = await putQuestionResponse.json();
    expect(putQuestionResponseBody).toHaveProperty('error');
    expect(putQuestionResponseBody.error).toContain('Invalid phone number');
  });
});
