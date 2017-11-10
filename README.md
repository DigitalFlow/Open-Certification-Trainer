# Open Certification Trainer
This is a website for assisting in training for certifications.
It was built using the awesome React framework.

## Purpose
When having to learn for certifications, it is often useful to use multiple choice questions, as they are a common certification format.
This website is able to host courses with questions and their corresponding answers.

You can view them and take assessments, where your knowledge is checked.
More and more functions will be coming as the project progresses.

## Using
You'll need to have [NodeJS](https://nodejs.org/en/) installed.

Afterwards, clone the project, navigate to the project folder using your PowerShell / Bash, and launch

`npm install`

Once this installed all packages, you can start the website by running

`npm start`.

Afterwards the site can be accessed on http://localhost:8080

## Courses
Courses can currently only be added as json files by copying them to ./dist/courses when the website is running.
For the format of your courses, please take a look at test.json in the project root.

## Impressions
### Certification Overview
![certificationoverview](https://user-images.githubusercontent.com/4287938/32636139-c0a1cb6a-c5b3-11e7-9076-b7d8cc9a5517.png)

Select a certification / course and take a look at the questions contained including the correct answers.

### Assessment
![assessment](https://user-images.githubusercontent.com/4287938/32636137-beeb639e-c5b3-11e7-8cce-c28e3ffcb423.png)

Take an assessment for a certification / course. You will have to answer all questions contained in the course. Once you're done, the course will be regarded as passed, if you answered 70% or more of the questions correctly.

## Planned features
- Import / Export function for courses
- Course Administration (Edit courses inside the website)
- User Accounts

## License
Licensed using the MIT license, happy learning!
