# Testing Guide

This guide provides comprehensive testing instructions for the Financial Restoration AI Team system.

## Prerequisites

Before testing, ensure you have:
- ✅ Google Account with access to Drive and Sheets
- ✅ Google Apps Script editor access
- ✅ Code.gs copied to Apps Script editor
- ✅ appsscript.json manifest configured
- ✅ Script authorized with required OAuth scopes

## Test Environment Setup

### 1. Create Test Project

1. Go to [script.google.com](https://script.google.com)
2. Create new project: "FinAgents Test"
3. Copy `Code.gs` content
4. Copy `appsscript.json` content
5. Save project

### 2. Authorize Script

1. Select `initializeSystem` from function dropdown
2. Click Run
3. Review permissions
4. Click Allow

## Unit Tests

### Test 1: Folder Creation

**Function**: `createAIAgentsFolders()`

**Steps:**
```javascript
const rootFolder = createAIAgentsFolders();
Logger.log('Root Folder ID: ' + rootFolder.getId());
```

**Expected Results:**
- ✅ "AI AGENTS" folder created in Drive
- ✅ 5 subfolders created: 00_RAW, 01_CLEANED, 02_SAFE, 03_VAULT, 04_LOGS
- ✅ Each folder has description with data protection info
- ✅ Function returns root folder object
- ✅ No errors in execution log

**Verification:**
1. Open Google Drive
2. Find "AI AGENTS" folder
3. Check for all 5 subfolders
4. Verify folder descriptions

### Test 2: Sheet Creation

**Function**: `createFinancialCommandSheet()`

**Steps:**
```javascript
const sheet = createFinancialCommandSheet();
Logger.log('Sheet ID: ' + sheet.getId());
```

**Expected Results:**
- ✅ "FINANCIAL_COMMAND" sheet created
- ✅ Three tabs exist: Debt, Tax, AuditLogs
- ✅ Each tab has formatted headers
- ✅ Headers are bold with colored backgrounds
- ✅ First row is frozen
- ✅ Sheet moved to AI AGENTS folder

**Verification:**
1. Open Google Sheets
2. Find "FINANCIAL_COMMAND"
3. Check each tab exists
4. Verify headers are present and formatted

### Test 3: AgentCard Generation

**Function**: `generateGatekeeperCard()`

**Steps:**
```javascript
const agentCard = generateGatekeeperCard();
Logger.log(JSON.stringify(agentCard, null, 2));
```

**Expected Results:**
- ✅ AgentCard JSON object returned
- ✅ Contains agent_id: "gatekeeper-001"
- ✅ Protocol: "A2A"
- ✅ Capabilities array present
- ✅ Memory config uses markdown-kv
- ✅ Thought signature enabled
- ✅ Security level: business_standard
- ✅ Workflow has steps 1-8

**Verification:**
1. Check execution log for JSON output
2. Verify all required fields present
3. Confirm workflow includes step_5 (memory) and step_8 (thought signature)

### Test 4: Memory Storage (Step 5)

**Function**: `storeMemoryMarkdownKV()`

**Steps:**
```javascript
// First run createAIAgentsFolders() if not already done
storeMemoryMarkdownKV('test_key', 'test_value_1', 'gatekeeper-001');
storeMemoryMarkdownKV('test_key_2', 'test_value_2', 'gatekeeper-001');
```

**Expected Results:**
- ✅ Function returns true
- ✅ Memory file created in 04_LOGS/
- ✅ File named: gatekeeper-001_memory.md
- ✅ File contains Markdown-KV formatted entries
- ✅ Each entry has timestamp
- ✅ Subsequent calls append to existing file

**Verification:**
1. Navigate to AI AGENTS > 04_LOGS in Drive
2. Open gatekeeper-001_memory.md
3. Verify format: `**test_key**: test_value_1 _(timestamp: ...)_`
4. Check both entries are present

### Test 5: Thought Signature Logging (Step 8)

**Function**: `logThoughtSignature()`

**Steps:**
```javascript
logThoughtSignature({
  agent: 'gatekeeper-001',
  action: 'TEST_ACTION',
  decision: 'APPROVED',
  reasoning: 'Test reasoning for validation',
  confidence: 0.95,
  details: { test: true }
});
```

**Expected Results:**
- ✅ Function returns true
- ✅ Entry added to AuditLogs tab
- ✅ Timestamp column populated
- ✅ ThoughtSignature column contains JSON
- ✅ JSON includes: timestamp, decision, reasoning, confidence
- ✅ Entry also stored in memory file

**Verification:**
1. Open FINANCIAL_COMMAND sheet
2. Go to AuditLogs tab
3. Check last row for new entry
4. Verify ThoughtSignature column contains proper JSON
5. Check memory file for corresponding entry

### Test 6: Data Validation

**Function**: `validateFinancialData()`

**Steps:**
```javascript
// Valid data
const validData = {
  type: 'debt',
  amount: 1000.00,
  creditor: 'Test Bank'
};
const validResult = validateFinancialData(validData);
Logger.log('Valid: ' + JSON.stringify(validResult));

// Invalid data
const invalidData = {
  amount: 'invalid',
  // missing type
};
const invalidResult = validateFinancialData(invalidData);
Logger.log('Invalid: ' + JSON.stringify(invalidResult));
```

**Expected Results:**
- ✅ Valid data returns: `{isValid: true, errors: [], warnings: []}`
- ✅ Invalid data returns: `{isValid: false, errors: [...], warnings: []}`
- ✅ Thought signatures logged for both validations
- ✅ Entries appear in AuditLogs

**Verification:**
1. Check execution log for results
2. Verify AuditLogs has two new entries
3. Check thought signatures reflect decisions

### Test 7: Data Routing

**Function**: `routeDataToFolder()`

**Steps:**
```javascript
const data = { type: 'debt', amount: 1000, cleaned: true };
const validation = { isValid: true, errors: [], warnings: [] };
const folder = routeDataToFolder(data, validation);
Logger.log('Routed to: ' + folder);
```

**Expected Results:**
- ✅ Function returns folder name
- ✅ Folder based on data flags (cleaned, safe, vault)
- ✅ Thought signature logged for routing decision
- ✅ Entry in AuditLogs with decision details

**Verification:**
1. Check execution log for folder name
2. Verify AuditLogs has routing entry
3. Check thought signature explains routing logic

## Integration Tests

### Test 8: System Initialization

**Function**: `initializeSystem()`

**Steps:**
```javascript
initializeSystem();
```

**Expected Results:**
- ✅ All folders created
- ✅ Sheet created with all tabs
- ✅ AgentCard generated
- ✅ Initialization logged to AuditLogs
- ✅ Success alert displayed
- ✅ No errors in execution

**Verification:**
1. Check Drive for AI AGENTS folder structure
2. Check for FINANCIAL_COMMAND sheet
3. Open AuditLogs tab
4. Verify SYSTEM_INITIALIZATION entry exists
5. Check entry has SUCCESS status

### Test 9: Demo System

**Function**: `demoSystem()`

**Steps:**
```javascript
demoSystem();
```

**Expected Results:**
- ✅ Sample data validated
- ✅ Data routed to appropriate folder
- ✅ Memory stored in Markdown-KV
- ✅ Multiple AuditLogs entries created
- ✅ Execution log shows demo steps

**Verification:**
1. Check execution log for "=== Starting Demo ==="
2. Verify AuditLogs has new entries
3. Check memory file for demo_run entry
4. Confirm "=== Demo Complete ===" in log

### Test 10: Idempotency Test

**Purpose**: Verify system handles repeated initialization

**Steps:**
```javascript
// Run twice
initializeSystem();
initializeSystem();
```

**Expected Results:**
- ✅ First run creates everything
- ✅ Second run reuses existing resources
- ✅ No duplicate folders/sheets created
- ✅ No errors on second run
- ✅ Both initializations logged

**Verification:**
1. Check Drive - only one "AI AGENTS" folder
2. Check Sheets - only one "FINANCIAL_COMMAND"
3. Verify execution logs show "Using existing..."
4. Confirm two SYSTEM_INITIALIZATION entries in AuditLogs

## Error Handling Tests

### Test 11: Missing Agent ID Error

**Steps:**
```javascript
// Attempt to store memory without agentId
try {
  storeMemoryMarkdownKV('test', 'value');
} catch (error) {
  Logger.log('Expected error: ' + error);
}
```

**Expected Results:**
- ✅ Function throws error
- ✅ Error message: "Agent ID is required for memory storage"
- ✅ Error logged to AuditLogs

### Test 12: Missing Sheet Error

**Steps:**
```javascript
// Attempt to log without sheet
logThoughtSignature({
  agent: 'test',
  action: 'TEST'
});
```

**Expected Results:**
- ✅ Function handles missing sheet
- ✅ Creates sheet if needed OR returns false
- ✅ Error logged appropriately

## Performance Tests

### Test 13: Bulk Memory Storage

**Steps:**
```javascript
for (let i = 0; i < 10; i++) {
  storeMemoryMarkdownKV('bulk_test_' + i, 'value_' + i, 'gatekeeper-001');
}
```

**Expected Results:**
- ✅ All entries stored successfully
- ✅ Execution completes within time limit
- ✅ Memory file contains all 10 entries
- ✅ Entries in chronological order

### Test 14: Large Data Validation

**Steps:**
```javascript
const largeData = {
  type: 'debt',
  amount: 999999999.99,
  creditor: 'A'.repeat(1000),  // Long string
  details: { /* large object */ }
};
validateFinancialData(largeData);
```

**Expected Results:**
- ✅ Function handles large data
- ✅ No timeout errors
- ✅ Validation completes
- ✅ Thought signature logged

## Security Tests

### Test 15: OAuth Scope Verification

**Steps:**
1. Check appsscript.json
2. Verify scopes requested

**Expected Scopes:**
- ✅ `spreadsheets` - For sheet operations
- ✅ `drive` - For folder operations
- ✅ `script.external_request` - For future API calls

**Verification:**
1. Review manifest file
2. Check authorization screen shows only these scopes
3. Verify no unnecessary permissions requested

### Test 16: Audit Trail Completeness

**Steps:**
```javascript
// Perform various operations
createAIAgentsFolders();
createFinancialCommandSheet();
validateFinancialData({type: 'debt', amount: 100});
```

**Expected Results:**
- ✅ Each operation logged to AuditLogs
- ✅ Timestamps present for all entries
- ✅ Agent/system identified for each action
- ✅ Status (SUCCESS/FAILURE) recorded
- ✅ Details provided for context

## UI Tests (If Using Bound Script)

### Test 17: Menu Appearance

**Steps:**
1. Create bound script in a Google Sheet
2. Refresh the sheet
3. Check menu bar

**Expected Results:**
- ✅ "AI Agents" menu appears
- ✅ Menu items present:
  - Initialize System
  - Create Folder Structure
  - Create Financial Command Sheet
  - Generate Gatekeeper AgentCard
  - Log Thought Signature

### Test 18: Menu Functions

**Steps:**
1. Click each menu item
2. Observe results

**Expected Results:**
- ✅ Each function executes successfully
- ✅ Alert dialogs appear where appropriate
- ✅ No error messages

## Regression Tests

After any code changes, run:

1. ✅ Test 8: System Initialization
2. ✅ Test 9: Demo System
3. ✅ Test 10: Idempotency Test
4. ✅ Test 16: Audit Trail Completeness

## Test Checklist

Before marking complete:

- [ ] All unit tests passing
- [ ] All integration tests passing
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Security requirements met
- [ ] UI functions correctly (if applicable)
- [ ] Documentation matches behavior
- [ ] No errors in execution logs
- [ ] Audit logs comprehensive

## Troubleshooting Test Failures

### "Authorization required"
- Re-run function
- Accept permissions
- Check OAuth scopes in manifest

### "Folder/Sheet not found"
- Run initializeSystem() first
- Verify resources created in Drive/Sheets
- Check folder/sheet names match constants

### "Execution timeout"
- Reduce batch sizes
- Break operations into smaller chunks
- Use triggers for long operations

### "Permission denied"
- Check OAuth scopes
- Verify Google account permissions
- Re-authorize script

## Test Reporting

Document test results:

```
Test Date: YYYY-MM-DD
Tester: [Name]
Environment: [Production/Test]

Test Results:
✅ Test 1: Folder Creation - PASS
✅ Test 2: Sheet Creation - PASS
...

Issues Found:
- [Issue description and steps to reproduce]

Notes:
- [Any additional observations]
```

## Automated Testing (Future Enhancement)

Consider implementing:
- Google Apps Script testing framework
- Continuous integration with clasp
- Automated regression test suite
- Performance benchmarking

## Conclusion

Following this testing guide ensures the Financial Restoration AI Team system functions correctly and meets all requirements. All tests should pass before deployment to production.
