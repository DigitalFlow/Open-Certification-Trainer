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
This project was tested on Arch Linux, Ubuntu and Windows 10.
You'll need to have [NodeJS](https://nodejs.org/en/) and [PostgreSQL](https://www.postgresql.org/) installed.
Restore the database schema using the databaseSchema.sql file in the project root while following the instructions in there.

For restoring, you should use psql, which is bundled with every PostgreSQL installation.
For me it was installed at `C:\Program Files\PostgreSQL\10\bin`. I added it to my Windows path, so that it can be used without having to specify the full folder every time. When installing PostgreSQL on Linux, psql should become available automatically.

For importing the database schema, open your PowerShell and enter:
`psql -U postgres -h localhost -d postgres -f "C:\Open-Certification-Trainer\dataBaseSchema.sql"`

Where -U is the user name of your root user (usually postgres), -h is the server (can be ommitted if localhost), -d is the database (postgres is the default database) and -f is the file location of your database schema.

After restoring the database, there will be an admin user for open certification trainer with user name and password root.
Afterwards, clone the project, navigate to the project folder using your PowerShell / Bash, and launch

`npm install`

Once this installed all packages, you can edit the .env.config, where you'll have to update the database user login settings for your environment. For production use, you should generate some key for usage as your own JWT secret.
When done, you can start the website by running

`npm start`.

Afterwards the site can be accessed on http://localhost:8080. You can also configure the site to be accessed using a DNS name.
Use the CERT_TRAINER_VHOST variable and set it to the domain name you'd like.
Afterwards make sure to edit the /etc/hosts file (Linux + Windows) on your host server.
If you plan on using this tool in your company, you need to configure your company's DNS server to redirect to your host server for the domain you configured.

For production use, consider running the server using [forever](https://github.com/foreverjs/forever).

## Courses
Courses can be imported using the Certification Management page.
You can press "Create New Certification" and then either enter your certification manually or import a JSON file.
For the format of your courses, please take a look at the demoCert.json file in the project root.
IDs for the certification, questions and answers don't have to be set in your import file, they will be generated automatically if they're missing.

## Impressions
### Sign Up
![signup](https://user-images.githubusercontent.com/4287938/34416337-487fabb4-ebf3-11e7-8e28-dfa8ed40b05c.gif)

### Log In
![login](https://user-images.githubusercontent.com/4287938/34416333-482f4016-ebf3-11e7-8079-4220be37c31d.gif)

### Study
Select a certification / course and take a look at the questions contained including the correct answers.
![study](https://user-images.githubusercontent.com/4287938/34416338-4899c27e-ebf3-11e7-9fc7-672fe357ac2e.gif)

### Train
Take an assessment for a certification. You will have to answer all questions contained in the course, but questions and answers are shuffled. Once you're done, the course will be regarded as passed, if you answered 70% or more of the questions correctly.
![train](https://user-images.githubusercontent.com/4287938/34416339-48b35efa-ebf3-11e7-8988-43d3074c45c9.gif)

### Check your learning progress
![check](https://user-images.githubusercontent.com/4287938/34416332-48137fa2-ebf3-11e7-8650-13ee45e2c416.gif)

### GUI Management of Certifications
![management](https://user-images.githubusercontent.com/4287938/34416334-484b4c70-ebf3-11e7-8152-c3119cfaf359.gif)

### Post / News Management
![posts](https://user-images.githubusercontent.com/4287938/34416335-48645b20-ebf3-11e7-9b6e-d98a6eb882cf.gif)

## License
Licensed using the MIT license, happy learning!
