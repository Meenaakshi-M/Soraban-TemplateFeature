# Test Plan for Template Editor Feature

Test Goal - The goal is to ensure that Conditional logic, data structures, rollover behavior and rendering across different views remain consistent and stable

Scenario 1 - Template Editor

TestCases

1. Template Creation
    1. Create from scratch by clicking on Add Template
        1. Add a new section
        2. Add new questions (Have one test that covers 6 question types and another covering remaining 6.)
        3. Verify the newly created template in preview page and client page
	2. Create template using or by duplicating existing template
		1. Add a new section
		2. Add new questions  
		3. Reorder the sections
        4. Verify the newly created template in preview page and client page
2. Template edits
    1. Add a new section to an existing template
    2. Add a new question to an existing template
    3. Remove existing section
    4. Remove existing questions from a section
    5. Reorder the sections in an existing template
    6. Reorder the questions in an existing template
    7. Copying section or questions 
3. Template Deletion(Section/question)
    1. Remove a section from an existing template
    2. Remove questions from an existing template

Scenario 2 - Client Entries

Testcases

New template from scratch
1. Create a new template from scratch an existing template
2. Add a section and add new questions of type client entry
3. Populate questions for all three tabs
4. Edit a question
5. Make sure edits show up in preview and client page

Use an existing template
1. Create a new template from an existing template
2. Add a section and add new questions of type client entry
3. Populate questions for all three tabs
4. Edit a question
5. Make sure rollover answers map correctly after the edits
6. Make sure edits show up in preview and client page

Scenario 3: Conditional Logic

Testcases

1. Add a new template
2. Add a new section for collecting personal information
3. Add questions with follow up question for personal information
4. Add a new section for collecting business information
5. Add questions with follow up question for business information
6. Verify the new template, section and questions in preview page
7. Edit an existing conditional logic in a section
8. Delete an existing conditional logic and add a new one
9. Verify the edits are consistent across preview and client views