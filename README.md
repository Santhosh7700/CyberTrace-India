CyberTraceIndia
Online Scam Evidence Gathering System
A frontend-first prototype for reporting online scams, organizing
supporting evidence, and tracking case progress.
Current development phase: Frontend only. The application
currently uses mock authentication and mock/sample report data. It
does not transmit reports to investigators, connect to law-enforcement
systems, or persist reports/evidence in a backend database.

Project Overview
CyberTraceIndia is intended to provide citizens/victims with a clear
interface to document online fraud incidents, attach supporting
evidence, and follow the status of their reports. The longer-term plan
is to add an authorized investigator workflow so genuine case updates
can be communicated back to citizens.

The current milestone focuses on completing and reviewing the frontend
before beginning backend and database integration.
Technology Stack
  Layer      Technology                  Current status
  Frontend   React + TypeScript + Vite   In use
Styling    Tailwind CSS                In use
Backend    Java + Spring Boot          Planned; not implemented
Database   PostgreSQL                  Planned; not connected
Completed Frontend Tasks
  Task                    Scope                   Status
  01                      Public Landing Page     Completed

  02                      Citizen Sign In         Completed

  03                      Citizen Account         Completed
Creation / Registration 

  04                      Mock Authentication and Completed
Session Management      
05                      Citizen / Victim        Completed; review and
Dashboard               testing ongoing
Task 05 dashboard scope
The citizen dashboard includes the frontend experience for: - Dashboard
overview and sample statistics. - Recent reports and report listing. -
Scam report form with client-side validation. - Mock report creation and
reference IDs. - Evidence file selection and temporary frontend
handling. - Case details and a visual status timeline. - Citizen profile
details from the mock authenticated session. - Logout using the existing
Task 04 authentication flow.

Evidence-format note: PDF selection and preview should be verified
in the running application. Do not assume PDF preview is implemented
unless it is visible and tested.
Important: Mock Data vs. Real Investigation
The current timeline is a demonstration of the future workflow. For
example, labels such as Submitted, Under Review,
Under Investigation, and Resolved are mock statuses in the frontend.

At this stage: - A report is not sent to an investigator. - No police
officer or investigation team receives a report through this
prototype. - Status changes are not real investigation updates. -
Reports and evidence are not permanently stored in PostgreSQL or another
backend database. - Evidence selection/previews are temporary
browser-side functionality.

In the future full-stack system, an authorized investigator workflow
should be responsible for reviewing assigned reports and recording
status updates. The citizen dashboard should display those genuine
updates from the backend. Statuses must not advance automatically or
imply real-world action without an authorized update.
Run Locally
Prerequisites
- Node.js (LTS recommended)
- npm
- Git
Install dependencies
npm install
Start the development server
npm run dev
Open the local URL printed by Vite in the terminal (commonly
http://localhost:5173).
Production build check
npm run build
Development Rules
Please preserve these project decisions when continuing development:
1. Complete the frontend modules first using mock/sample data.
2. Do not add Spring Boot APIs or PostgreSQL integration until the
   frontend phase is reviewed and approved.
3. Reuse the existing routing, components, styling, and Task 04 mock
   authentication/session logic.
4. Do not redesign completed tasks unless a specific bug or approved
   requirement needs it.
5. Keep the UI responsive and maintain consistent CyberTraceIndia
   branding.
6. Clearly label simulated statuses and demo data so they cannot be
   mistaken for real investigation activity.
7. Do not claim that reports or evidence have been submitted to
   authorities during the frontend-only phase.
Planned Next Phase
After the frontend is complete and reviewed:
1. Finalize remaining frontend modules and workflows.
2. Test navigation, form validation, mock authentication, report
   handling, evidence selection, and responsive layouts.
3. Design the backend API and data model.
4. Implement Java Spring Boot services and PostgreSQL persistence.
5. Implement role-based access for citizens and authorized
   investigators.
6. Connect genuine investigator case updates to the citizen tracking
   timeline.
7. Add secure evidence upload, access control, audit logging, and
   appropriate validation.
These are planned capabilities, not features of the current frontend
prototype.
Repository / Project Notes
- Keep the project source in Git and commit completed milestones.
- Before making changes, inspect the existing project structure and
  current implementation.
- Update this README when a task is completed or when the architecture
  changes.
- Never commit secrets, API keys, passwords, or real victim evidence.
Project: CyberTraceIndia
Purpose: Online Scam Evidence Gathering System
Current milestone: Frontend prototype -- Tasks 01 to 05 completed,
subject to review and testing.