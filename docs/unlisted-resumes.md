# Internal Index of Unlisted Resumes & Tailored Opportunity Profiles

> Internal registry of tailored, unlisted resumes created for specific opportunities, roles, and companies.
> These pages and artifacts are strictly unlisted: excluded from `sitemap.xml`, blocked in `robots.txt`, set to `noindex, nofollow`, and excluded from public site navigation.

---

## Active & Available Resumes

### 1. Senior Consultant, Software Engineer (Enterprise Consulting)

- **Target Focus:** Senior Consultant, Software Engineer (Enterprise Consulting)
- **Role:** Senior Consultant, Software Engineer
- **Opportunity Reference / Example:** North Highland Careers (Ref: `50345`)
- **Location:** Quito, Pichincha - Ecuador (Authorized to work in Ecuador without visa sponsorship)
- **Sample Posting URL:** [North Highland Careers - Senior Consultant, Software Engineer (50345)](https://careers.northhighland.com/jobs/senior-consultant-software-engineer-50345/)
- **Date Created:** October 1, 2026
- **Status:** Ready / Active
- **Web Resume URL (Unlisted):** [`/unlisted/senior-consultant-software-engineer`](/unlisted/senior-consultant-software-engineer) (Live on site: `https://ericmaster.ninja/unlisted/senior-consultant-software-engineer`)
- **Direct PDF Download:** [`/pdfs/eric-aguayo-senior-consultant-software-engineer.pdf`](/pdfs/eric-aguayo-senior-consultant-software-engineer.pdf) (Live on site: `https://ericmaster.ninja/pdfs/eric-aguayo-senior-consultant-software-engineer.pdf`)
- **Data Source:** [`src/data/unlisted/senior-consultant-software-engineer.json`](../src/data/unlisted/senior-consultant-software-engineer.json)

#### Key Alignment Highlights
1. **Architecture, SOLID & Rapid Adaptability:** Highlights deep mastery of SOLID principles, OOP/MVC design patterns, and enterprise SDLC for rapid multi-framework adaptability, paired with Angular and TypeScript for admin tooling and partner-config UI.
2. **PostgreSQL & Data Optimization:** Details hands-on schema modeling, JSONB document storage, and query execution optimization.
3. **AWS Cloud & Serverless:** Showcases Lambda, API Gateway, SNS, RDS, and S3 for event-driven, scalable architectures.
4. **Testing Rigor (Automated Unit & Playwright):** Emphasizes automated unit testing and Playwright E2E test coverage for PR gates.
5. **AI-Native & Agentic Tooling Mastery:** Highlights agentic tooling (Claude Code, Antigravity, Codex, OpenCode) and GitHub Copilot workflows for accelerating full-stack delivery and test creation, alongside hands-on experience building and tuning RAG architectures and generative UI protocols.
6. **Consulting & Leadership:** Emphasizes 15+ years of client consulting, cross-functional Agile leadership (Scrum/Kanban), technical mentorship, and daily English client collaboration.
7. **Local Authorization:** Based in Quito, Ecuador, meeting all local residency and authorization requirements.

---

## Technical Architecture & How to Add New Resumes

1. **Add Data File:** Add a new JSON file to `src/data/unlisted/<slug>.json` adhering to the resume schema.
2. **Register in Index:** Add an entry to `src/data/unlisted-resumes.json` with the company name, target role, job link, route, and PDF filename.
3. **Update Documentation:** Document the new entry here in `docs/unlisted-resumes.md`.
4. **Generate PDFs:** Run `npm run pdfs`. The generator will automatically build the ATS-optimized PDF and save it under `public/pdfs/`.
5. **Build & Verify:** Run `npm test` and `npm run build` to verify routes, CSP hashes, and test contracts.
