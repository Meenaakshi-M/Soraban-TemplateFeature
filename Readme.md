I have used Typescript with Playwright as the test automation framework for both API and UI tests.

## Automation Folder Structure

    Soraban-TemplateFeature/
        TestPlan.md - Test Plan for the template editor feature. 
        tests/API - Contains API test files.
        tests/UI - Contains UI test files.
        Pages - Contains page object design pattern files for template framework and preview page.
        Environments - Contains environment specific configuration details like URL, API Key.
        Utils/helper.ts - Contains helper functions for API Response logging and Custom assertions.
        Utils/TemplateDataFactory.ts - Generates test data for template, section and question
        github/workflows - Github Actions worflows that automatically triggers the tests after every pull request or push to master

## External Libraries used

    dotenv - Used for handling configuration for different environments

## Helper Functions

    Function to log API Response object
    Custom assertion function to check if returned status code is part of an array of status codes

