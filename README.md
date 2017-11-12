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

Afterwards the site can be accessed on http://localhost:8080. You can also configure the site to be accessed using a DNS name.
Use the CERT_TRAINER_VHOST variable and set it to the domain name you'd like.
Afterwards make sure to edit the /etc/hosts file (Linux + Windows) on your host server.
If you plan on using this tool in your company, you need to configure your company's DNS server to redirect to your host server for the domain you configured.

## Courses
Courses can be imported using the Certification Management page.
You can press "Create New Certification" and then either enter your certification manually or import a JSON file.
For the format of your courses, please take a look at MB2-716 file in the project root.
IDs for the certification, questions and answers don't have to be set in your import file, they will be generated automatically if they're missing.

## Impressions
### Certification Overview
![certificationoverview](https://user-images.githubusercontent.com/4287938/32636139-c0a1cb6a-c5b3-11e7-9076-b7d8cc9a5517.png)

Select a certification / course and take a look at the questions contained including the correct answers.

### Assessment
![assessment](https://user-images.githubusercontent.com/4287938/32636137-beeb639e-c5b3-11e7-8cce-c28e3ffcb423.png)

Take an assessment for a certification / course. You will have to answer all questions contained in the course. Once you're done, the course will be regarded as passed, if you answered 70% or more of the questions correctly.

## Planned features
- User Accounts

## License
Licensed using the MIT license, happy learning!
