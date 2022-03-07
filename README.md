# TUITION REIMBURSEMENT MANAGEMENT SYSTEM

## Project Description

- TRMS is a full-stack web application which provides reimbursements for university courses, seminars, certification preparation classes, certification, and technical training. Each employee is allowed to claim up to $1000 in tuition reimbursement a year.
  Event types have different standard reimbursement coverage: University Courses 80%, Seminars 60%, Certification Preparation Classes 75%, Certification 100%, Technical Training 90%, Other 30%.

- After a Benco has approved a reimbursement, the reimbursement is pending until a passing grade or presentation over the event is provided. The monetary amount available for an employee to reimburse is defined by the foloowing formula: AvailableReimbursement = $1000 - PendingReimbursements - AwardedReimbursements.

## Business Rules

- All employees must complete the Tuition Reimbursement from one week prior to the start of the event.
- The form must collect basic employee information, date, time, location, description, cost, grading format, type of event, and work-related justification
- Certain grading formats require the employee to perform a presentation to management after the event's completion and prior to awarded reimbursements. A passing grade is needed for reimbursement.
- The direct supervisor must provide approval for Tuition Reimbursement. The Direct Supervisor can request additional information from the employeee before approval. If denied, the Direct Supervisor must provide a reason.
- The Department Head must provide approval for Tuition Reimbursement. The Department Head can request additional information from the employee or direct supervisor before approval.
- The Benefits Coordinator (Benco) must provide approval for Tuition Reimbursement. The Benco can request additional information from the employee, direct supervisor, or department head before approval. The Benco has ability to alter the reimbursement amount. If the Benco does not approve in a timely manner, an escalation email should be sent to the Benco's direct supervisor.
- Upon completeion of the event, the employee should attach either the Grade or Presentation. After upload of grade or presentation, the direct manager must confirm that either the grade is passing or the presentation was satisfactory. Upon confirmation, the amount is awarded to the requestor.

## Technology Used

- NodeJS
- TypeScript
- AWS SDK
- DynamoDB
- React
- Redux
- Express

## Features

- As an employee, I can login, complete TRMS form, view, update and delete the form.
- As an employee, I can check the status of approvals by the direct supervisor, Department Head, and Benco.
- As a direct supervisor, I can view my workers TRMS and approve or deny the requests
- As a Department Head, I can view all workers TRMS and approve or deny the requests forms approved by the direct supervisor of the worker.
- As a Benco, I can view all workers TRMS and approve or deny the requests froms approved by the Department Head.

## To DO

- Improve backend security related to authorization and authentication

## Usage

- Employees: Michael, Elisa, Chris
- Supervisors: Richard, David
- Department Head: Jim
- Benco: Benco
- The Supervisor of Benco: King

To use the app first login:
![Login](/Screenshots/login.png 'Login')

You will be taken to the Home Screen:
![Home Screen](/Screenshots/home-screen.png 'Home Screen')
You can create, view more detail, update after the completetion of the course, or delete the form. Click See more info:
![Detail](/Screenshots/more-info.png 'More Info')

![Update](/Screenshots/update.png 'Update TRMS')

Direct Supervisor, Department Head, Benco can login and approve or deny the employee's TRMS request:
![approve](/Screenshots/approve.png 'approved TRMS')
