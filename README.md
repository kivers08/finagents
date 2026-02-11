# Financial Restoration AI Team - Google Apps Script

A Google Apps Script implementation for building a financial restoration AI team in Google Workspace, following the A2A (Agent-to-Agent) Protocol with business-standard data protection.

## Overview

This system creates an automated financial restoration environment with:
- **Structured folder hierarchy** for data management
- **Google Sheets-based command center** for financial tracking
- **AI Agent framework** with Gatekeeper implementation
- **Markdown-KV memory system** for agent state management
- **Thought Signature logging** for audit trails
- **Business Standard data protection** enforcement

## Architecture

### 1. Folder Structure
The system creates an `AI AGENTS` root folder with organized subfolders:

```
AI AGENTS/
├── 00_RAW/          # Raw financial data requiring validation
├── 01_CLEANED/      # Validated and sanitized data
├── 02_SAFE/         # Approved data ready for processing
├── 03_VAULT/        # Secure encrypted financial records
└── 04_LOGS/         # System activity and agent memory logs
```

### 2. Financial Command Sheet
`FINANCIAL_COMMAND` Google Sheet with three tabs:

- **Debt**: Track creditors, amounts, due dates, and status
- **Tax**: Manage tax years, types, amounts, and filing status
- **AuditLogs**: Complete audit trail with thought signatures

### 3. Gatekeeper Agent
Implements A2A Protocol with:
- Financial data validation
- Access control and authorization
- Intelligent data routing
- Security enforcement
- Markdown-KV memory storage (Step 5)
- Thought signature logging (Step 8)

## Installation

### Method 1: Google Apps Script Standalone
1. Go to [script.google.com](https://script.google.com)
2. Create a new project named "Financial Restoration AI Team"
3. Copy the contents of `Code.gs` into the editor
4. Save and authorize the script

### Method 2: Bound to Google Sheets
1. Create or open a Google Sheet
2. Go to **Extensions > Apps Script**
3. Copy the contents of `Code.gs` into the editor
4. Save and authorize the script
5. Refresh the sheet to see the "AI Agents" menu

## Usage

### Initialize System
Run the complete system setup:

```javascript
initializeSystem();
```

Or use the menu: **AI Agents > Initialize System**

This will:
1. Create the AI AGENTS folder structure in Google Drive
2. Create the FINANCIAL_COMMAND sheet with all tabs
3. Generate the Gatekeeper AgentCard JSON

### Individual Components

#### Create Folder Structure Only
```javascript
const rootFolder = createAIAgentsFolders();
```

#### Create Financial Command Sheet Only
```javascript
const sheet = createFinancialCommandSheet();
```

#### Generate Gatekeeper AgentCard
```javascript
const agentCard = generateGatekeeperCard();
```

### Working with Memory (Step 5)

Store data in Markdown-KV format:

```javascript
storeMemoryMarkdownKV('last_validation', '2026-02-11 - All checks passed', 'gatekeeper-001');
```

Memory is stored in `04_LOGS/gatekeeper-001_memory.md` as:

```markdown
**last_validation**: 2026-02-11 - All checks passed _(timestamp: 2026-02-11T06:00:00.000Z)_
```

### Logging Thought Signatures (Step 8)

Log agent decision-making processes:

```javascript
logThoughtSignature({
  agent: 'gatekeeper-001',
  action: 'DATA_VALIDATION',
  decision: 'APPROVED',
  reasoning: 'All validation checks passed',
  confidence: 1.0,
  details: { validated: true }
});
```

### Validate Financial Data

```javascript
const data = {
  type: 'debt',
  amount: 1000.00,
  creditor: 'Bank Name'
};

const validation = validateFinancialData(data);
// Returns: { isValid: true, errors: [], warnings: [] }
```

### Route Data to Folders

```javascript
const targetFolder = routeDataToFolder(data, validation);
// Returns: '00_RAW', '01_CLEANED', '02_SAFE', or '03_VAULT'
```

## A2A Protocol Implementation

The Gatekeeper agent follows the A2A (Agent-to-Agent) Protocol:

### AgentCard Structure
```json
{
  "agent_id": "gatekeeper-001",
  "agent_name": "Financial Gatekeeper",
  "agent_type": "gatekeeper",
  "version": "1.0.0",
  "protocol": "A2A",
  "capabilities": [
    "financial_data_validation",
    "access_control",
    "data_routing",
    "security_enforcement"
  ],
  "memory": {
    "format": "markdown-kv",
    "storage": "04_LOGS/gatekeeper_memory.md"
  },
  "thought_signature": {
    "enabled": true,
    "log_destination": "AuditLogs",
    "format": "structured"
  },
  "security": {
    "level": "business_standard",
    "encryption": "at_rest",
    "access_control": "role_based",
    "audit_logging": "enabled"
  }
}
```

### Workflow Steps
1. **receive_financial_data**: Accept incoming financial data
2. **validate_data_format**: Check data structure and types
3. **check_security_clearance**: Verify access permissions
4. **classify_data_sensitivity**: Determine protection level
5. **store_memory_markdown_kv**: Save state in Markdown-KV format ✓
6. **route_to_appropriate_folder**: Direct to correct folder
7. **update_audit_log**: Record transaction
8. **log_thought_signature**: Log decision reasoning ✓

## Security & Data Protection

### Business Standard Protection
- **Data Classification**: All financial data marked as sensitive
- **Access Control**: Role-based access enforcement
- **Audit Logging**: Complete trail of all actions
- **Folder Descriptions**: Clear security labeling
- **Encryption**: At-rest encryption for vault storage

### Audit Trail
All actions are logged to the AuditLogs tab with:
- Timestamp
- Agent ID
- Action performed
- Status (SUCCESS/FAILURE)
- Detailed information
- Thought signature (for agent decisions)
- Memory references

## API Reference

### Core Functions

#### `initializeSystem()`
Initializes the complete AI Agents system.

**Returns**: Object with `folder`, `sheet`, and `agentCard`

#### `createAIAgentsFolders()`
Creates the folder structure in Google Drive.

**Returns**: Google Drive Folder object (root)

#### `createFinancialCommandSheet()`
Creates the FINANCIAL_COMMAND spreadsheet with tabs.

**Returns**: Google Spreadsheet object

#### `generateGatekeeperCard()`
Generates the AgentCard JSON for the Gatekeeper agent.

**Returns**: Object containing the AgentCard data

### Memory Functions

#### `storeMemoryMarkdownKV(key, value, agentId)`
Stores a key-value pair in Markdown format.

**Parameters**:
- `key`: String - Memory key
- `value`: String - Memory value
- `agentId`: String (optional) - Agent identifier (default: 'gatekeeper-001')

**Returns**: Boolean - Success status

### Logging Functions

#### `logThoughtSignature(thought)`
Logs an agent's decision-making process.

**Parameters**:
- `thought`: Object with properties:
  - `agent`: String - Agent ID
  - `action`: String - Action being performed
  - `decision`: String - Decision made
  - `reasoning`: String - Reasoning behind decision
  - `confidence`: Number - Confidence level (0.0-1.0)
  - `details`: Object - Additional context

**Returns**: Boolean - Success status

#### `logToAuditLogs(logEntry)`
Logs general events to the audit log.

**Parameters**:
- `logEntry`: Object with audit information

**Returns**: Boolean - Success status

### Validation Functions

#### `validateFinancialData(data)`
Validates financial data structure.

**Parameters**:
- `data`: Object containing financial data

**Returns**: Object with `isValid`, `errors`, and `warnings`

#### `routeDataToFolder(data, validationStatus)`
Determines the appropriate folder for data.

**Parameters**:
- `data`: Object - Financial data
- `validationStatus`: Object - Validation result

**Returns**: String - Target folder name

## Demo

Run the demo to see the system in action:

```javascript
demoSystem();
```

This will:
1. Validate sample financial data
2. Route data to appropriate folder
3. Store memory in Markdown-KV format
4. Log thought signatures
5. Create audit trail

## Customization

### Adding New Folders
Edit the `FOLDER_STRUCTURE` constant:

```javascript
const FOLDER_STRUCTURE = {
  ROOT: 'AI AGENTS',
  SUBFOLDERS: ['00_RAW', '01_CLEANED', '02_SAFE', '03_VAULT', '04_LOGS', '05_CUSTOM']
};
```

### Adding New Sheet Tabs
Edit the `SHEET_CONFIG` constant:

```javascript
const SHEET_CONFIG = {
  NAME: 'FINANCIAL_COMMAND',
  TABS: ['Debt', 'Tax', 'AuditLogs', 'CustomTab']
};
```

### Creating Additional Agents
Use the `generateGatekeeperCard()` function as a template to create AgentCards for additional agents with different capabilities.

## Troubleshooting

### Authorization Issues
If you encounter authorization errors:
1. Go to the script editor
2. Run any function manually
3. Review and accept the required permissions
4. Try again

### Folder/Sheet Already Exists
The script checks for existing resources and reuses them. If you want to start fresh:
1. Delete the AI AGENTS folder from Google Drive
2. Delete the FINANCIAL_COMMAND sheet
3. Run `initializeSystem()` again

### Memory File Not Found
Ensure the folder structure exists before storing memory:
1. Run `createAIAgentsFolders()` first
2. Then use `storeMemoryMarkdownKV()`

## Best Practices

1. **Always initialize the system first**: Run `initializeSystem()` before using other functions
2. **Log all financial operations**: Use `logToAuditLogs()` for accountability
3. **Validate before routing**: Always validate data before routing to folders
4. **Use thought signatures**: Log agent decisions for transparency
5. **Regular backups**: Export the FINANCIAL_COMMAND sheet regularly
6. **Review audit logs**: Check AuditLogs tab for system health

## License

This project is provided as-is for financial restoration purposes.

## Support

For issues or questions:
1. Review the audit logs for error details
2. Check the Logger output in Apps Script
3. Verify folder and sheet permissions
4. Ensure all required Google APIs are enabled