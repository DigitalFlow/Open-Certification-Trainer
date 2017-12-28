# Open Certification Trainer [![Build Status](https://travis-ci.org/DigitalFlow/Open-Certification-Trainer.svg?branch=master)](https://travis-ci.org/DigitalFlow/Open-Certification-Trainer)
This is a website for assisting in training for certifications.
It was built using the awesome React framework.

## Purpose
When having to learn for certifications, it is often useful to use multiple choice questions, as they are a common certification format.
This website is able to host courses with questions and their corresponding answers.

You can view them and take assessments, where your knowledge is checked.
More and more functions will be coming as the project progresses.

## Features
- Certification Management (Create, Edit)
- User Management
- Post (News) Management
- Learn using overview modes
- Train using assessment mode
- Find your weaknesses using session history and charts

## Using
You'll need to have [NodeJS](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/) installed.
Restore the database schema using the databaseSchema.sql file in the project root while following the instructions in there.
After restoring the database, there will be an admin user for open certification trainer with user name and password root.

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

![oct_management](https://user-images.githubusercontent.com/4287938/32700997-6af32ffc-c7ce-11e7-9e85-7e80390b9082.png)

## Impressions
![check](https://user-images.githubusercontent.com/4287938/34416332-48137fa2-ebf3-11e7-8650-13ee45e2c416.gif)
![login](https://user-images.githubusercontent.com/4287938/34416333-482f4016-ebf3-11e7-8079-4220be37c31d.gif)
![management](https://user-images.githubusercontent.com/4287938/34416334-484b4c70-ebf3-11e7-8152-c3119cfaf359.gif)
![posts](https://user-images.githubusercontent.com/4287938/34416335-48645b20-ebf3-11e7-9b6e-d98a6eb882cf.gif)
![signup](https://user-images.githubusercontent.com/4287938/34416337-487fabb4-ebf3-11e7-8e28-dfa8ed40b05c.gif)
![study](https://user-images.githubusercontent.com/4287938/34416338-4899c27e-ebf3-11e7-9fc7-672fe357ac2e.gif)
![train](https://user-images.githubusercontent.com/4287938/34416339-48b35efa-ebf3-11e7-8988-43d3074c45c9.gif)

### Certification Overview
![certificationoverview](https://user-images.githubusercontent.com/4287938/32636139-c0a1cb6a-c5b3-11e7-9076-b7d8cc9a5517.png)

Select a certification / course and take a look at the questions contained including the correct answers.

### Assessment
![assessment](https://user-images.githubusercontent.com/4287938/32636137-beeb639e-c5b3-11e7-8cce-c28e3ffcb423.png)

Take an assessment for a certification / course. You will have to answer all questions contained in the course. Once you're done, the course will be regarded as passed, if you answered 70% or more of the questions correctly.

## License
Licensed using the MIT license, happy learning!
