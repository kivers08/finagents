# Step-by-Step Implementation Guide

## Financial Restoration AI Team - Complete Implementation Instructions

This guide provides detailed, step-by-step instructions to implement the Financial Restoration AI Team system in Google Workspace.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Part 1: Setup Google Apps Script Project](#part-1-setup-google-apps-script-project)
3. [Part 2: Configure Script Files](#part-2-configure-script-files)
4. [Part 3: Authorize and Test](#part-3-authorize-and-test)
5. [Part 4: Initialize the System](#part-4-initialize-the-system)
6. [Part 5: Verify Installation](#part-5-verify-installation)
7. [Part 6: Test Core Functionality](#part-6-test-core-functionality)
8. [Part 7: Using the System](#part-7-using-the-system)
9. [Part 8: Advanced Configuration](#part-8-advanced-configuration)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Items

Before you begin, ensure you have:

- ✅ **Google Account** with access to:
  - Google Drive
  - Google Sheets
  - Google Apps Script
- ✅ **Web Browser** (Chrome, Firefox, Safari, or Edge recommended)
- ✅ **Internet Connection**
- ✅ **Basic understanding of JavaScript** (helpful but not required)

### Time Required

- **First-time setup**: 15-20 minutes
- **Testing and verification**: 10-15 minutes
- **Total**: Approximately 30-35 minutes

---

## Part 1: Setup Google Apps Script Project

### Step 1.1: Access Google Apps Script

1. Open your web browser
2. Navigate to [https://script.google.com](https://script.google.com)
3. Sign in with your Google account if prompted
4. You should see the Google Apps Script dashboard

**Expected Result**: You're now on the Apps Script home page.

### Step 1.2: Create a New Project

1. Click the **"New project"** button (usually in the top-left corner)
2. A new Apps Script editor window will open
3. You'll see a default `Code.gs` file with a sample function

**Expected Result**: Apps Script editor is open with `myFunction()` placeholder code.

### Step 1.3: Rename the Project

1. At the top of the editor, click on **"Untitled project"**
2. Enter the name: `Financial Restoration AI Team`
3. Press **Enter** or click away to save

**Expected Result**: Project is now named "Financial Restoration AI Team".

---

## Part 2: Configure Script Files

### Step 2.1: Add the Main Code File

1. **Delete the existing placeholder code** in `Code.gs`
   - Select all content (Ctrl+A or Cmd+A)
   - Delete it (Backspace or Delete key)

2. **Copy the Code.gs content**
   - Open the `Code.gs` file from this repository
   - Copy ALL the content (569 lines)

3. **Paste into the Apps Script editor**
   - Click in the empty `Code.gs` editor
   - Paste (Ctrl+V or Cmd+V)

4. **Save the file**
   - Click the save icon (💾) or press Ctrl+S (Cmd+S)
   - You should see "Saved" confirmation

**Expected Result**: Code.gs contains the complete Financial Restoration AI Team code.

### Step 2.2: Configure the Manifest File

1. **Enable manifest file visibility**
   - Click the gear icon ⚙️ (Project Settings) on the left sidebar
   - Scroll down to "Show 'appsscript.json' manifest file in editor"
   - Check the checkbox to enable it

2. **Navigate back to the editor**
   - Click the pencil icon (< >) on the left sidebar to return to the editor
   - You should now see `appsscript.json` in the file list

3. **Open appsscript.json**
   - Click on `appsscript.json` in the file list

4. **Replace the manifest content**
   - Select all content in `appsscript.json`
   - Delete it
   - Copy the content from `appsscript.json` in this repository
   - Paste it into the editor

5. **Save the manifest**
   - Click save icon (💾) or press Ctrl+S (Cmd+S)

**Expected Result**: appsscript.json is configured with proper OAuth scopes.

**Important OAuth Scopes**:
```json
{
  "oauthScopes": [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive",
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

---

## Part 3: Authorize and Test

### Step 3.1: Select a Function to Run

1. At the top of the editor, locate the function dropdown menu
2. Click on the dropdown (it may say "Select function")
3. Select `initializeSystem` from the list

**Expected Result**: "initializeSystem" is selected in the function dropdown.

### Step 3.2: Run and Authorize

1. Click the **Run** button (▶️) next to the function dropdown
2. A dialog will appear: "Authorization required"
3. Click **"Review Permissions"**

4. **Select your Google account**
   - Choose the account you want to use

5. **Review permissions warning**
   - You may see "Google hasn't verified this app"
   - This is normal for personal scripts
   - Click **"Advanced"** at the bottom left
   - Click **"Go to Financial Restoration AI Team (unsafe)"**

6. **Grant permissions**
   - Review the permissions requested:
     - View and manage your spreadsheets in Google Drive
     - See, edit, create, and delete all your Google Drive files
   - Click **"Allow"**

**Expected Result**: Script is now authorized. You'll return to the Apps Script editor.

### Step 3.3: Monitor First Execution

1. After authorization, the function will start running
2. Watch the **Execution log** at the bottom of the screen
3. You should see log messages appearing

**Expected Log Messages**:
```
Created root folder: [folder-id]
Created subfolder: 00_RAW ([folder-id])
Created subfolder: 01_CLEANED ([folder-id])
...
Created new sheet: [sheet-id]
Created tab: Debt
Created tab: Tax
Created tab: AuditLogs
Generated Gatekeeper AgentCard
Folder structure created successfully
```

**Expected Result**: Function completes without errors. You should see a success alert dialog.

---

## Part 4: Initialize the System

### Step 4.1: Verify System Initialization

If the function ran successfully in Step 3.3, your system is already initialized!

If you need to run it again or it failed:

1. Select `initializeSystem` from the function dropdown
2. Click the **Run** button (▶️)
3. Wait for completion (usually 10-30 seconds)
4. Check for the success alert dialog

**Success Dialog Message**:
```
System Initialized Successfully!

Root Folder: AI AGENTS
Sheet: FINANCIAL_COMMAND

AgentCard generated for Gatekeeper
```

**Expected Result**: Success dialog appears with folder and sheet information.

### Step 4.2: Check Execution Log

1. Scroll down to the **Execution log** panel at the bottom
2. Look for these key messages:
   - ✅ "Created root folder" or "Using existing root folder"
   - ✅ "Created subfolder" (5 times for each subfolder)
   - ✅ "Created new sheet" or "Using existing sheet"
   - ✅ "Created tab" (3 times for Debt, Tax, AuditLogs)
   - ✅ "Generated Gatekeeper AgentCard"
   - ✅ "Folder structure created successfully"

**Expected Result**: No error messages in the log.

---

## Part 5: Verify Installation

### Step 5.1: Verify Folder Structure in Google Drive

1. Open a new browser tab
2. Navigate to [https://drive.google.com](https://drive.google.com)
3. In the main view, look for the **"AI AGENTS"** folder
4. Click on the "AI AGENTS" folder to open it

**Expected Contents**:
```
AI AGENTS/
├── 00_RAW/
├── 01_CLEANED/
├── 02_SAFE/
├── 03_VAULT/
└── 04_LOGS/
```

5. **Verify each subfolder**:
   - Click on each folder to ensure it opens
   - Check that each folder has a description (hover over the ⓘ icon)

**Expected Result**: All 5 subfolders are present and accessible.

### Step 5.2: Verify FINANCIAL_COMMAND Sheet

1. While still in Google Drive, look for **"FINANCIAL_COMMAND"** spreadsheet
2. It should be inside the "AI AGENTS" folder
3. Click on it to open the spreadsheet

**Expected Sheet Tabs** (at the bottom of the screen):
- ✅ **Debt** tab (blue header)
- ✅ **Tax** tab (green header)
- ✅ **AuditLogs** tab (yellow header)

4. **Check each tab**:

   **Debt Tab Headers**:
   - ID | Creditor | Amount | Due Date | Status | Notes

   **Tax Tab Headers**:
   - Year | Type | Amount | Status | Filed Date | Notes

   **AuditLogs Tab Headers**:
   - Timestamp | Agent | Action | Status | Details | ThoughtSignature | Memory

5. **Check for initialization log**:
   - Click on the **AuditLogs** tab
   - Look for a row with:
     - Timestamp: (current date/time)
     - Agent: SYSTEM
     - Action: SYSTEM_INITIALIZATION
     - Status: SUCCESS

**Expected Result**: All tabs present with proper headers and initialization logged.

### Step 5.3: Verify AgentCard Generation

1. Return to the Apps Script editor tab
2. In the function dropdown, select `getGatekeeperCard`
3. Click the **Run** button (▶️)
4. Check the **Execution log** for the AgentCard JSON

**Expected Log Output** (partial):
```json
{
  "agent_id": "gatekeeper-001",
  "agent_name": "Financial Gatekeeper",
  "protocol": "A2A",
  "memory": {
    "format": "markdown-kv"
  },
  "thought_signature": {
    "enabled": true
  }
}
```

**Expected Result**: Complete AgentCard JSON appears in the log.

---

## Part 6: Test Core Functionality

### Step 6.1: Test Memory Storage (Step 5)

1. In the Apps Script editor, click in the code editor area
2. Clear the function dropdown and select `Custom` or use the immediate window
3. In the **Console** at the bottom, click the **"Execution log"** tab
4. In the function dropdown, type or select a function to test

**Option A: Use the built-in demo**
```javascript
// Select 'demoSystem' from the function dropdown
// Click Run
```

**Option B: Test memory directly**
1. Add this test function to your Code.gs temporarily:
```javascript
function testMemory() {
  storeMemoryMarkdownKV('test_run', 'Successfully stored memory', 'gatekeeper-001');
  Logger.log('Memory storage test complete');
}
```
2. Save the file
3. Select `testMemory` from the dropdown
4. Click Run

5. **Verify memory file created**:
   - Go to Google Drive
   - Navigate to AI AGENTS > 04_LOGS
   - Look for `gatekeeper-001_memory.md`
   - Open it to verify the Markdown-KV format:
     ```markdown
     **test_run**: Successfully stored memory _(timestamp: 2026-02-11T...)_
     ```

**Expected Result**: Memory file exists with Markdown-KV formatted entries.

### Step 6.2: Test Thought Signature Logging (Step 8)

1. Add this test function to your Code.gs:
```javascript
function testThoughtSignature() {
  logThoughtSignature({
    agent: 'gatekeeper-001',
    action: 'TEST_SIGNATURE',
    decision: 'SUCCESS',
    reasoning: 'Testing the thought signature system',
    confidence: 1.0,
    details: { test: true }
  });
  Logger.log('Thought signature test complete');
}
```

2. Save the file
3. Select `testThoughtSignature` from the dropdown
4. Click Run

5. **Verify in AuditLogs**:
   - Open the FINANCIAL_COMMAND sheet
   - Go to the AuditLogs tab
   - Look for the newest entry with:
     - Action: TEST_SIGNATURE
     - ThoughtSignature column contains JSON

**Expected Result**: New entry in AuditLogs with thought signature details.

### Step 6.3: Test Data Validation

1. Add this test function:
```javascript
function testValidation() {
  const validData = {
    type: 'debt',
    amount: 1000.00,
    creditor: 'Test Bank'
  };
  
  const result = validateFinancialData(validData);
  Logger.log('Validation result: ' + JSON.stringify(result));
  
  const invalidData = {
    amount: 'invalid',
    // missing type
  };
  
  const result2 = validateFinancialData(invalidData);
  Logger.log('Invalid data result: ' + JSON.stringify(result2));
}
```

2. Save, select `testValidation`, and Run

**Expected Log Output**:
```
Validation result: {"isValid":true,"errors":[],"warnings":[]}
Invalid data result: {"isValid":false,"errors":["Invalid amount","Missing data type"],"warnings":[]}
```

**Expected Result**: Valid data passes, invalid data fails with errors listed.

---

## Part 7: Using the System

### Step 7.1: Using with a Google Sheet (Optional Bound Script)

If you want a menu in a specific Google Sheet:

1. Open a new or existing Google Sheet
2. Go to **Extensions > Apps Script**
3. Delete any existing code
4. Copy the entire `Code.gs` content again
5. Copy the `appsscript.json` content to the manifest
6. Save and authorize as before
7. Refresh the Google Sheet

**Result**: You'll see an "AI Agents" menu in the menu bar with options:
- Initialize System
- Create Folder Structure
- Create Financial Command Sheet
- Generate Gatekeeper AgentCard
- Log Thought Signature

### Step 7.2: Add Financial Data to Sheets

1. Open the FINANCIAL_COMMAND sheet
2. Go to the **Debt** tab
3. Add sample debt data:

| ID | Creditor | Amount | Due Date | Status | Notes |
|----|----------|--------|----------|--------|-------|
| 1 | Credit Card Co. | $5,000 | 2026-03-01 | Active | High interest |
| 2 | Student Loan | $25,000 | 2026-12-31 | Active | Federal loan |

4. Go to the **Tax** tab
5. Add sample tax data:

| Year | Type | Amount | Status | Filed Date | Notes |
|------|------|--------|--------|------------|-------|
| 2025 | Federal | $3,500 | Filed | 2026-04-15 | Refund expected |
| 2024 | State | $800 | Filed | 2025-04-10 | Paid in full |

**Expected Result**: Financial data is organized and tracked in the sheet.

### Step 7.3: Process Data Through the System

1. Create a processing function:
```javascript
function processDebtData() {
  const debtData = {
    type: 'debt',
    amount: 5000.00,
    creditor: 'Credit Card Co.',
    cleaned: true,
    safe: false
  };
  
  // Validate
  const validation = validateFinancialData(debtData);
  Logger.log('Validation: ' + JSON.stringify(validation));
  
  // Route
  const folder = routeDataToFolder(debtData, validation);
  Logger.log('Routed to folder: ' + folder);
  
  // Store memory
  storeMemoryMarkdownKV('last_processed_debt', debtData.creditor, 'gatekeeper-001');
  
  Logger.log('Processing complete');
}
```

2. Save, select `processDebtData`, and Run
3. Check AuditLogs for the processing trail

**Expected Result**: Data validated, routed, and logged with thought signatures.

---

## Part 8: Advanced Configuration

### Step 8.1: Customize Folder Structure

To add more folders:

1. Open Code.gs
2. Find the `FOLDER_STRUCTURE` constant (around line 8)
3. Modify the SUBFOLDERS array:

```javascript
const FOLDER_STRUCTURE = {
  ROOT: 'AI AGENTS',
  SUBFOLDERS: [
    '00_RAW', 
    '01_CLEANED', 
    '02_SAFE', 
    '03_VAULT', 
    '04_LOGS',
    '05_ARCHIVE',  // Add your custom folders
    '06_REPORTS'
  ]
};
```

4. Save and re-run `createAIAgentsFolders()`

### Step 8.2: Add More Sheet Tabs

To add more tabs:

1. Find the `SHEET_CONFIG` constant (around line 13)
2. Modify the TABS array:

```javascript
const SHEET_CONFIG = {
  NAME: 'FINANCIAL_COMMAND',
  TABS: [
    'Debt', 
    'Tax', 
    'AuditLogs', 
    'Budget',      // Add your custom tabs
    'Investments'
  ]
};
```

3. Update the `initializeTab()` function to handle new tabs
4. Save and re-run `createFinancialCommandSheet()`

### Step 8.3: Create Additional Agents

To create a new agent following the Gatekeeper pattern:

1. Add a new function:
```javascript
function generateAnalystCard() {
  const agentCard = {
    agent_id: 'analyst-001',
    agent_name: 'Financial Analyst',
    agent_type: 'analyst',
    version: '1.0.0',
    protocol: 'A2A',
    created: new Date().toISOString(),
    
    capabilities: [
      'data_analysis',
      'reporting',
      'trend_detection'
    ],
    
    memory: {
      format: 'markdown-kv',
      storage: '04_LOGS/analyst_memory.md'
    },
    
    thought_signature: {
      enabled: true,
      log_destination: 'AuditLogs'
    },
    
    security: {
      level: 'business_standard'
    }
  };
  
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('analyst_agent_card', JSON.stringify(agentCard, null, 2));
  
  return agentCard;
}
```

2. Save and run `generateAnalystCard()`

### Step 8.4: Set Up Automatic Triggers (Optional)

To run functions automatically:

1. In the Apps Script editor, click the clock icon ⏰ (Triggers) on the left
2. Click **"+ Add Trigger"** in the bottom right
3. Configure the trigger:
   - Choose which function to run (e.g., `demoSystem`)
   - Choose which deployment should run: Head
   - Select event source: Time-driven
   - Select type of time based trigger: Day timer
   - Select time of day: Your preference
4. Click **Save**
5. Authorize if prompted

**Example Use Cases**:
- Daily backup of memory files
- Weekly report generation
- Monthly data archiving

---

## Troubleshooting

### Issue: "Authorization required" Error

**Solution**:
1. Click "Review Permissions"
2. Select your account
3. Click "Advanced" if you see the warning
4. Click "Go to [project name] (unsafe)"
5. Click "Allow"

### Issue: "Folder/Sheet Already Exists"

**Solution**:
This is normal! The system reuses existing resources. If you want to start fresh:
1. Go to Google Drive
2. Delete the "AI AGENTS" folder
3. Delete the "FINANCIAL_COMMAND" sheet
4. Re-run `initializeSystem()`

### Issue: "Cannot find function"

**Solution**:
1. Verify the function name is spelled correctly
2. Check that you saved the file (Ctrl+S or Cmd+S)
3. Refresh the Apps Script editor (F5)
4. Check the function dropdown again

### Issue: "Execution timed out"

**Solution**:
1. For long operations, break them into smaller chunks
2. Use triggers to run functions at scheduled times
3. Optimize by reducing logging or operations per run

### Issue: Memory File Not Created

**Solution**:
1. Verify the folder structure exists (run `createAIAgentsFolders()`)
2. Check that 04_LOGS folder is present
3. Verify the function completed without errors
4. Check the Execution log for error messages

### Issue: Thought Signatures Not Appearing in AuditLogs

**Solution**:
1. Verify FINANCIAL_COMMAND sheet exists
2. Check that AuditLogs tab is present
3. Ensure the function completed successfully
4. Refresh the spreadsheet (F5)
5. Check if the sheet was moved to a different location

### Issue: Permission Denied

**Solution**:
1. Verify you're logged into the correct Google account
2. Check that you have access to Drive and Sheets
3. Re-authorize the script:
   - Click gear icon ⚙️ (Project Settings)
   - Scroll to "OAuth Consent Screen"
   - Remove authorizations
   - Re-run the function and authorize again

---

## Completion Checklist

Before considering your implementation complete, verify:

- [ ] ✅ Apps Script project created and named
- [ ] ✅ Code.gs file contains all 570 lines of code
- [ ] ✅ appsscript.json manifest configured
- [ ] ✅ Script authorized with proper OAuth scopes
- [ ] ✅ initializeSystem() executed successfully
- [ ] ✅ AI AGENTS folder exists in Drive with 5 subfolders
- [ ] ✅ FINANCIAL_COMMAND sheet exists with 3 tabs
- [ ] ✅ Gatekeeper AgentCard generated
- [ ] ✅ Memory storage tested (Step 5 - Markdown-KV format)
- [ ] ✅ Thought signatures tested (Step 8 - logs to AuditLogs)
- [ ] ✅ Data validation tested
- [ ] ✅ System initialization logged in AuditLogs
- [ ] ✅ No errors in Execution log
- [ ] ✅ Example data added to sheets (optional)
- [ ] ✅ Demo system tested successfully

---

## Next Steps

Now that your system is implemented:

1. **Review Documentation**:
   - Read README.md for API reference
   - Check ARCHITECTURE.md for system design
   - Review WORKFLOW.md for visual diagrams
   - See TESTING.md for comprehensive tests

2. **Customize for Your Needs**:
   - Add custom folders
   - Create additional tabs
   - Develop new agents
   - Extend functionality

3. **Start Using**:
   - Add your actual financial data
   - Process data through the system
   - Review audit logs regularly
   - Monitor agent memory files

4. **Share and Collaborate**:
   - Share the Drive folder with team members
   - Share the spreadsheet for collaborative editing
   - Document your customizations

---

## Support and Resources

- **Example Files**: Check the `examples/` directory for sample outputs
- **Documentation**: Refer to README.md for detailed information
- **Quick Start**: See QUICKSTART.md for rapid setup
- **Testing**: Use TESTING.md for comprehensive test procedures

---

## Congratulations! 🎉

You have successfully implemented the Financial Restoration AI Team system. Your AI-powered financial management system is now operational with:

- ✅ Organized folder structure for data management
- ✅ Centralized spreadsheet for financial tracking
- ✅ Gatekeeper agent with A2A Protocol compliance
- ✅ Step 5 Memory using Markdown-KV format
- ✅ Step 8 Thought Signatures for audit trails
- ✅ Business-standard data protection

Your system is ready to help manage financial restoration workflows with AI agent capabilities, comprehensive logging, and secure data handling.

Happy financial restoration! 💰📊
