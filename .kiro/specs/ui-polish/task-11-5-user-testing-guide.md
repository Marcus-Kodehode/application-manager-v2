# Task 11.5: Test med ikke-tekniske brukere - Guide

## Status
⏳ **Pending Manual Testing** - This task requires the user to conduct manual testing with non-technical users.

## Purpose
Validate that all the usability improvements made in tasks 11.1-11.4 are effective for non-technical users.

## Testing Guide

### Preparation

#### 1. Recruit Test Participants
- Find 3-5 non-technical users (friends, family, colleagues)
- Ideal participants:
  - Not developers or tech-savvy
  - Varying ages and backgrounds
  - Preferably people who might actually use a job search tracker

#### 2. Prepare Test Environment
- Set up a test account with some sample data
- Prepare a list of tasks for users to complete
- Have a way to take notes (paper, laptop, recording with permission)

### Test Scenarios

#### Scenario 1: Add a New Job Application
**Task**: "Legg til en 2-3 jobbsøknad for stillinger du er interessert i"

**Observe**:
- Do they understand all the form fields?
- Do they notice and read the help text (💡 Tips)?
- Do they understand the emoji icons?
- Do they know what to do with optional fields?
- Do they understand the "Fjernarbeid mulig" checkbox?

**Questions to ask**:
- "Var det noe som var uklart?"
- "Var det noen felt du ikke forsto?"
- "Hjalp tipsene deg?"

#### Scenario 2: Filter and Search Jobs
**Task**: "Flytt en jobb fra 'Søkt' til 'Intervju'"

**Observe**:
- Do they understand they can drag jobs?
- Do they notice the drag handle?
- Do they see the tooltip on the drag handle?
- Do they understand the Kanban board concept?

**Questions to ask**:
- "Var det intuitivt å flytte jobber?"
- "Forsto du hva drag-håndtaket var til for?"

#### Scenario 3: Add a Note to a Job
**Task**: "Legg til et notat på en jobb om et intervju du hadde"

**Observe**:
- Can they find the notes tab?
- Do they understand the purpose of notes?
- Do they notice the help text?
- Can they save the note easily?

**Questions to ask**:
- "Var det lett å finne hvor du skulle legge til notatet?"
- "Forsto du hva notater er til for?"

#### Scenario 4: Upload a Document
**Task**: "Last opp en CV eller søknad"

**Observe**:
- Do they understand the file type restrictions?
- Do they notice the help text about file naming?
- Do they understand the document types (CV, Søknad, Annet)?
- Can they handle errors if they upload wrong file type?

**Questions to ask**:
- "Var det klart hvilke filtyper du kunne laste opp?"
- "Forsto du feilmeldingen hvis du fikk en?"


#### Scenario 6: Handle an Error
**Task**: "Prøv å slette en jobb" (observe error handling)

**Observe**:
- Do they understand the confirmation dialog?
- If an error occurs, do they understand the error message?
- Do they know what to do next?

**Questions to ask**:
- "Var feilmeldingen forståelig?"
- "Visste du hva du skulle gjøre for å fikse problemet?"

### What to Look For

#### Positive Signs ✅
- Users complete tasks without asking for help
- Users read and understand help text
- Users understand error messages
- Users feel confident using the application
- Users say things like "Dette var lett" or "Dette gir mening"

#### Warning Signs ⚠️
- Users ask "Hva betyr dette?"
- Users click wrong buttons repeatedly
- Users ignore help text
- Users express frustration
- Users say things like "Dette er forvirrende" or "Jeg skjønner ikke"

### Data to Collect

#### For Each Task
1. **Completion**: Did they complete the task? (Yes/No)
2. **Time**: How long did it take?
3. **Errors**: How many mistakes did they make?
4. **Help needed**: Did they need help? (None/Hints/Full help)
5. **Confidence**: How confident did they seem? (1-5 scale)

#### Overall Feedback
1. **Clarity**: "Var applikasjonen lett å forstå?" (1-5 scale)
2. **Confidence**: "Følte du deg trygg på å bruke den?" (1-5 scale)
3. **Language**: "Var språket forståelig?" (1-5 scale)
4. **Help text**: "Hjalp tipsene og forklaringene deg?" (1-5 scale)
5. **Errors**: "Var feilmeldingene forståelige?" (1-5 scale)

#### Open Questions
- "Hva likte du best?"
- "Hva var mest forvirrende?"
- "Hva ville du endre?"
- "Ville du brukt denne applikasjonen?"

### After Testing

#### 1. Analyze Results
- Identify common pain points
- Note which tasks were easiest/hardest
- Look for patterns in feedback

#### 2. Prioritize Issues
- **Critical**: Blocks users from completing tasks
- **High**: Causes significant confusion or frustration
- **Medium**: Minor confusion but users can work around it
- **Low**: Nice-to-have improvements

#### 3. Create Action Items
For each issue found:
- Describe the problem
- Note which users experienced it
- Propose a solution
- Estimate effort to fix

#### 4. Implement Fixes
- Start with critical and high priority issues
- Test fixes with same or new users
- Iterate until users can complete tasks confidently

### Success Criteria

Task 11.5 is complete when:
- ✅ At least 3 non-technical users have tested the application
- ✅ 80%+ of users can complete all tasks without help
- ✅ Average clarity rating is 4/5 or higher
- ✅ Average confidence rating is 4/5 or higher
- ✅ No critical usability issues remain
- ✅ All high-priority issues have been addressed

## Example Test Report Template

```markdown
# User Testing Report - [Date]

## Participant Information
- **ID**: User 1
- **Age**: 45
- **Tech Experience**: Low (uses email and Facebook)
- **Job Search Experience**: Currently job hunting

## Task Results

### Task 1: Add New Job
- **Completed**: Yes
- **Time**: 3 minutes
- **Errors**: 1 (confused about "Kilde" field)
- **Help needed**: Hint
- **Confidence**: 4/5
- **Notes**: Understood most fields, needed clarification on "Kilde"

[Repeat for each task]

## Overall Feedback
- **Clarity**: 4/5
- **Confidence**: 4/5
- **Language**: 5/5
- **Help text**: 5/5
- **Errors**: N/A (no errors encountered)

## Quotes
- "Dette var mye lettere enn jeg trodde!"
- "Jeg likte tipsene, de hjalp meg å forstå hva jeg skulle gjøre"
- "Hva betyr 'Kilde'? Er det hvor jeg fant jobben?"

## Issues Found
1. **"Kilde" field unclear** (Medium priority)
   - User didn't understand what "Kilde" meant
   - Suggestion: Add example in placeholder or help text

## Recommendations
1. Add more examples in help text for "Kilde" field
2. Consider renaming "Kilde" to "Hvor fant du stillingen?"
```

## Notes for Implementation

This task cannot be completed by an AI agent as it requires:
- Real human participants
- Observation of actual usage
- Subjective feedback collection
- Iterative testing and refinement

The user should conduct this testing themselves and use the findings to make any necessary improvements to the application.

