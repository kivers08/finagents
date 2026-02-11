# Quick Start Guide

Get your Financial Restoration AI Team up and running in minutes.

## Prerequisites

- Google Account with access to:
  - Google Drive
  - Google Sheets
  - Google Apps Script

## Installation Steps

### Step 1: Create Apps Script Project

1. Go to [script.google.com](https://script.google.com)
2. Click **New Project**
3. Name it "Financial Restoration AI Team"

### Step 2: Add the Code

1. Delete any default code in the editor
2. Copy the contents of `Code.gs` from this repository
3. Paste it into the editor
4. Save the project (Ctrl+S or Cmd+S)

### Step 3: Add the Manifest

1. In the Apps Script editor, click the gear icon (⚙️) for "Project Settings"
2. Check "Show 'appsscript.json' manifest file in editor"
3. Go back to the editor
4. Click on `appsscript.json` in the file list
5. Replace its contents with the `appsscript.json` from this repository
6. Save

### Step 4: Authorize the Script

1. Click on any function in the dropdown (e.g., `initializeSystem`)
2. Click the **Run** button (▶️)
3. Review and authorize the permissions:
   - View and manage your spreadsheets in Google Drive
   - View and manage your Google Drive files
4. Click **Allow**

### Step 5: Initialize the System

In the Apps Script editor:

1. Select `initializeSystem` from the function dropdown
2. Click **Run** (▶️)
3. Check the **Execution log** at the bottom for success messages

Or run it from code:

```javascript
initializeSystem();
```

### Step 6: Verify Setup

Check that everything was created:

**In Google Drive:**
- Look for the "AI AGENTS" folder
- Inside should be: 00_RAW, 01_CLEANED, 02_SAFE, 03_VAULT, 04_LOGS

**In Google Sheets:**
- Look for "FINANCIAL_COMMAND" spreadsheet
- Should have tabs: Debt, Tax, AuditLogs

**In Apps Script:**
- Check the Execution log for confirmation messages
- No errors should be present

## First Use

### Using the Menu (Bound Script)

If you created the script bound to a Google Sheet:

1. Open your Google Sheet
2. Refresh the page
3. Look for "AI Agents" menu in the menu bar
4. Click **AI Agents > Initialize System**

### Using Functions Directly

Run these functions to test the system:

```javascript
// Test data validation
const testData = {
  type: 'debt',
  amount: 1000.00,
  creditor: 'Test Bank'
};

const validation = validateFinancialData(testData);
Logger.log(validation);

// Test data routing
const folder = routeDataToFolder(testData, validation);
Logger.log('Routed to: ' + folder);

// Test memory storage
storeMemoryMarkdownKV('test_key', 'test_value', 'gatekeeper-001');

// Test thought signature logging
logThoughtSignature({
  agent: 'gatekeeper-001',
  action: 'TEST',
  decision: 'SUCCESS',
  reasoning: 'Testing the system',
  confidence: 1.0
});
```

### Run the Demo

```javascript
demoSystem();
```

This runs a complete demonstration of:
- Data validation
- Data routing
- Memory storage
- Thought signature logging

## Next Steps

1. **Add Financial Data**: Open FINANCIAL_COMMAND sheet and add debt/tax information
2. **Review Logs**: Check the AuditLogs tab to see system activity
3. **Check Memory**: Look in Drive > AI AGENTS > 04_LOGS for memory files
4. **Customize**: Modify the code to fit your specific needs

## Troubleshooting

### "Authorization Required" Error
- Re-run the function
- Click "Review Permissions"
- Authorize the script

### "Folder/Sheet Already Exists"
- The script reuses existing resources
- To start fresh, delete them manually and run again

### "Cannot find function"
- Make sure you saved the code
- Check that the function name is spelled correctly
- Refresh the Apps Script editor

### Permission Denied
- Check that your Google account has Drive and Sheets access
- Verify you're logged in to the correct account

## Getting Help

1. Check the main README.md for detailed documentation
2. Review the examples/ folder for sample outputs
3. Check the Execution log in Apps Script for error details
4. Review the AuditLogs tab in FINANCIAL_COMMAND for system activity

## Configuration

### Change Folder Names

Edit in `Code.gs`:

```javascript
const FOLDER_STRUCTURE = {
  ROOT: 'AI AGENTS',
  SUBFOLDERS: ['00_RAW', '01_CLEANED', '02_SAFE', '03_VAULT', '04_LOGS']
};
```

### Change Sheet Name or Tabs

Edit in `Code.gs`:

```javascript
const SHEET_CONFIG = {
  NAME: 'FINANCIAL_COMMAND',
  TABS: ['Debt', 'Tax', 'AuditLogs']
};
```

### Adjust Security Settings

Modify the `applyDataProtection()` function to change protection levels.

## Success Indicators

✅ AI AGENTS folder exists in Google Drive  
✅ All 5 subfolders created (00_RAW through 04_LOGS)  
✅ FINANCIAL_COMMAND sheet exists  
✅ Three tabs present: Debt, Tax, AuditLogs  
✅ Gatekeeper AgentCard generated  
✅ No errors in Execution log  
✅ AuditLogs shows initialization entry  

## What's Next?

- Explore the A2A Protocol implementation
- Understand Markdown-KV memory format
- Review Thought Signature logging
- Customize for your specific financial restoration needs
- Add more agents following the Gatekeeper pattern

Congratulations! Your Financial Restoration AI Team is now operational! 🎉
