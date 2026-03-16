import {test, expect} from '@playwright/test';
import { addQuestionData, addSectionData, addTemplateData } from '../../TestData/TemplateEditorData.ts';
import { logresponse, StatusCodeTobBeOneOf } from '../../Utils/helper.ts';

const baseURL =  process.env.API_BASE_URL;

test.describe('Template Editor API Tests', () => {
  

  test('E2E: Template, sections, questions CRUD and related validations', async ({request}) => {
    // Create a new template from scratch via API and validate response
    const templateData = addTemplateData();
    const postResponse = await request.post(`${baseURL}/api/v1/templates`, { data: {
      name: templateData.templateName,
      description: templateData.templateDescription
    }});
    await logresponse(postResponse);
   
    expect(postResponse.status()).toBe(201);
    const postResponseBody = await postResponse.json();
    expect(postResponseBody).toHaveProperty('id');
    expect(postResponseBody.name).toBe(templateData.templateName);
    expect(postResponseBody.description).toBe(templateData.templateDescription);

    const templateId = postResponseBody.id;

    //Add 2 sections to the created template and validate the responses
    const sectionData = addSectionData();
   
    const postSection1Response = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections`, { data: {
      name: sectionData.sectionName,
      sectionType: 'questionnaire',
      instruction: sectionData.instruction
    }});

    await logresponse(postSection1Response);
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

    await logresponse(postSection2Response);
    expect(postSection2Response.status()).toBe(201);
    const postSection2ResponseBody = await postSection2Response.json();
    expect(postSection2ResponseBody).toHaveProperty('id');
    const section2Id = postSection2ResponseBody.id;

    // Add questions to the created section and validate responses
    const questionData = addQuestionData();
   
    const postQuestion1Response = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections/${section1Id}/questions`, { data: {
      text: questionData.questionText,
      type: questionData.questionType
    } });
    
    await logresponse(postQuestion1Response);
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
    
    await logresponse(postQuestion2Response);
    expect(postQuestion2Response.status()).toBe(201);
    const postQuestion2ResponseBody = await postQuestion2Response.json();
    expect(postQuestion2ResponseBody).toHaveProperty('id');
    const question2Id = postQuestion2ResponseBody.id;

    // Validate Section Edits
    const putSectionResponse = await request.put(`/api/v1/templates/${templateId}/sections/${section1Id}`, { data: {
      name: 'New Section Name',
    } });
   
    expect(putSectionResponse.status()).toBe(200);
    const putSectionResponseBody = await putSectionResponse.json();
    expect(putSectionResponseBody.name).toBe('New Section Name');

    // Validate Question Edits
    const putQuestionResponse = await request.put(`/api/v1/templates/${templateId}/sections/${section1Id}/questions/${question1Id}`, { data: {
      text: 'New Question Text',
    } });
    
    expect(putQuestionResponse.status()).toBe(200);
    const putQuestionResponseBody = await putQuestionResponse.json();
    expect(putQuestionResponseBody.text).toBe('New Question Text');

    // Delete the question from section2
    const deleteQuestionResponse = await request.delete(`/api/v1/templates/${templateId}/sections/${section1Id}/questions/${question2Id}`);
    expect(deleteQuestionResponse.status()).toBe(204);

    // Validate that the deleted question is not accessible anymore
    const getDeletedQuestionResponse = await request.get(`/api/v1/templates/${templateId}/sections/${section1Id}/questions/${question2Id}`);
    expect(getDeletedQuestionResponse.status()).toBe(404);

    // Delete section2 and validate deletion
    const deleteSectionResponse = await request.delete(`/api/v1/templates/${templateId}/sections/${section2Id}`);
    expect(deleteSectionResponse.status()).toBe(204);
    
    // Validate that the deleted section is not accessible anymore
    const getDeletedSectionResponse = await request.get(`/api/v1/templates/${templateId}/sections/${section2Id}`);
    expect(getDeletedSectionResponse.status()).toBe(404);

  });

  test('Template, Session, QuestionCreation Validations - Negative Scenarios', async ({request}) => {
    // Attempt to create a template without a name
    const postResponse = await request.post(`${baseURL}/api/v1/templates`, { data: {
      description: 'Template without a name'
    }});
    expect(postResponse.status()).toBe(400);
    const postResponseBody = await postResponse.json();
    expect(postResponseBody).toHaveProperty('error');
    expect(postResponseBody.error).toContain('name is required');

    // Attempt to create a section without a name
    const templateData = addTemplateData();
    const postTemplateResponse = await request.post(`${baseURL}/api/v1/templates`, { data: {
      name: templateData.templateName,
      description: templateData.templateDescription
    }});
    expect(postTemplateResponse.status()).toBe(201);
    const postTemplateResponseBody = await postTemplateResponse.json();
    const templateId = postTemplateResponseBody.id;

    const postSectionResponse = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections`, { data: {
      sectionType: 'questionnaire',
      instruction: 'Section without a name'
    } });
    expect(postSectionResponse.status()).toBe(400);
    const postSectionResponseBody = await postSectionResponse.json();
    expect(postSectionResponseBody).toHaveProperty('error');
    expect(postSectionResponseBody.error).toContain('name is required');

    // Attempt to create a question without text
    const sectionData = addSectionData();
    const postSectionResponse2 = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections`, { data: {
      name: sectionData.sectionName,
      sectionType: 'questionnaire',
      instruction: sectionData.instruction
    } });
    expect(postSectionResponse2.status()).toBe(201);
    const postSectionResponseBody2 = await postSectionResponse2.json();
    const sectionId = postSectionResponseBody2.id;

    const postQuestionResponse = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections/${sectionId}/questions`, { data: {
      type: 'text'
    } });
    expect(postQuestionResponse.status()).toBe(400);
    const postQuestionResponseBody = await postQuestionResponse.json();
    expect(postQuestionResponseBody).toHaveProperty('error');
    expect(postQuestionResponseBody.error).toContain('text is required');

    // Attempt to update a phone number question with invalid options
    const questionData = addQuestionData();
    const postQuestionResponse2 = await request.post(`${baseURL}/api/v1/templates/${templateId}/sections/${sectionId}/questions`, { data: {
      text: questionData.questionText,
      type: 'phone'
    } });
    expect(postQuestionResponse2.status()).toBe(201);
    const postQuestionResponseBody2 = await postQuestionResponse2.json();
    const questionId = postQuestionResponseBody2.id;

    const putQuestionResponse = await request.put(`/api/v1/templates/${templateId}/sections/${sectionId}/questions/${questionId}`, { data: {
      options: ['invalid phone number']
    } });
    StatusCodeTobBeOneOf(putQuestionResponse, [400, 404]);
    const putQuestionResponseBody = await putQuestionResponse.json();
    expect(putQuestionResponseBody).toHaveProperty('error');
    expect(putQuestionResponseBody.error).toContain('Invalid phone number');
  });
});
