# Architecture Documentation

## System Overview

The Financial Restoration AI Team system is built on Google Workspace (Drive, Sheets, Apps Script) and implements an agent-based architecture following the A2A (Agent-to-Agent) Protocol.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Google Workspace Layer                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────┐         ┌──────────────────────────┐     │
│  │ Google Drive │         │    Google Sheets         │     │
│  │              │         │                          │     │
│  │  AI AGENTS/  │◄────────┤  FINANCIAL_COMMAND       │     │
│  │  ├─00_RAW    │         │  ├─ Debt                 │     │
│  │  ├─01_CLEANED│         │  ├─ Tax                  │     │
│  │  ├─02_SAFE   │         │  └─ AuditLogs            │     │
│  │  ├─03_VAULT  │         └──────────────────────────┘     │
│  │  └─04_LOGS   │                                          │
│  └──────────────┘                                          │
│         ▲                                                   │
│         │                                                   │
│         │                                                   │
├─────────┼───────────────────────────────────────────────────┤
│         │         Apps Script Layer                         │
├─────────┼───────────────────────────────────────────────────┤
│         │                                                   │
│  ┌──────┴──────────────────────────────────────────┐      │
│  │         Gatekeeper Agent (A2A Protocol)          │      │
│  │                                                   │      │
│  │  ┌─────────────────────────────────────────┐   │      │
│  │  │  AgentCard (JSON)                       │   │      │
│  │  │  - agent_id: gatekeeper-001            │   │      │
│  │  │  - capabilities                         │   │      │
│  │  │  - memory: markdown-kv                  │   │      │
│  │  │  - thought_signature: enabled           │   │      │
│  │  │  - security: business_standard          │   │      │
│  │  └─────────────────────────────────────────┘   │      │
│  │                                                   │      │
│  │  Core Functions:                                 │      │
│  │  ├─ validateFinancialData()                     │      │
│  │  ├─ routeDataToFolder()                         │      │
│  │  ├─ storeMemoryMarkdownKV() [Step 5]           │      │
│  │  └─ logThoughtSignature() [Step 8]             │      │
│  └───────────────────────────────────────────────────┘      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Data Ingestion Flow

```
Financial Data Input
        │
        ▼
┌───────────────────┐
│ Step 1: Receive   │
│ Financial Data    │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Step 2: Validate  │
│ Data Format       │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Step 3: Check     │
│ Security          │
│ Clearance         │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Step 4: Classify  │
│ Data Sensitivity  │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Step 5: Store     │◄── Markdown-KV Format
│ Memory            │    **key**: value
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Step 6: Route to  │
│ Appropriate       │
│ Folder            │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Step 7: Update    │
│ Audit Log         │
└────────┬──────────┘
         │
         ▼
┌───────────────────┐
│ Step 8: Log       │◄── Thought Signature
│ Thought           │    {timestamp, decision,
│ Signature         │     reasoning, confidence}
└───────────────────┘
```

## A2A Protocol Implementation

### AgentCard Structure

The Gatekeeper agent is defined by its AgentCard, a JSON document that specifies:

```json
{
  "agent_id": "unique identifier",
  "protocol": "A2A",
  "capabilities": ["list of capabilities"],
  "endpoints": {"function mappings"},
  "memory": {
    "format": "markdown-kv",
    "storage": "file location"
  },
  "thought_signature": {
    "enabled": true,
    "log_destination": "AuditLogs"
  },
  "security": {
    "level": "business_standard"
  },
  "workflow": {
    "step_1 through step_8": "workflow stages"
  }
}
```

### Memory System (Step 5)

#### Markdown-KV Format

Stores agent state in human-readable, version-control-friendly format:

```markdown
**key**: value _(timestamp: ISO8601)_
```

**Benefits:**
- Human-readable
- Machine-parseable
- Git-friendly
- No database required
- Portable across systems

**Storage Location:** `04_LOGS/{agent_id}_memory.md`

**Example:**
```markdown
# Agent Memory: gatekeeper-001

**last_validation**: All checks passed _(timestamp: 2026-02-11T06:00:00.000Z)_
**validation_count**: 127 _(timestamp: 2026-02-11T06:05:00.000Z)_
**system_status**: operational _(timestamp: 2026-02-11T06:10:00.000Z)_
```

### Thought Signature System (Step 8)

Records the decision-making process of agents for transparency and auditability.

**Structure:**
```json
{
  "timestamp": "ISO8601",
  "decision": "DECISION_MADE",
  "reasoning": "Why this decision was made",
  "confidence": 0.0-1.0,
  "context": {}
}
```

**Storage:**
- Primary: AuditLogs tab in FINANCIAL_COMMAND sheet
- Secondary: Agent's Markdown-KV memory file

**Purpose:**
- Audit trail
- Debugging
- Compliance
- Learning/optimization

## Security Architecture

### Business Standard Data Protection

#### Folder-Level Security

```
AI AGENTS (Root)
├── 00_RAW         [Unvalidated - Restricted Access]
├── 01_CLEANED     [Validated - Standard Access]
├── 02_SAFE        [Approved - Analyst Access]
├── 03_VAULT       [Encrypted - Admin Only]
└── 04_LOGS        [Audit Trails - Auditor Access]
```

#### Data Classification Levels

1. **Raw**: Unvalidated, requires processing
2. **Cleaned**: Validated and sanitized
3. **Safe**: Approved for business use
4. **Vault**: Highly sensitive, encrypted
5. **Logs**: System activity, read-only for most users

#### Access Control

- **Role-Based Access**: Users assigned roles with specific permissions
- **Folder Descriptions**: Each folder labeled with protection level
- **Audit Logging**: All access recorded in AuditLogs
- **Encryption**: At-rest encryption for vault storage

### Audit Trail

Every action logged with:
- **Who**: Agent or user identifier
- **What**: Action performed
- **When**: Timestamp
- **Why**: Decision reasoning (thought signature)
- **Result**: Success or failure
- **Context**: Additional details

## Integration Points

### External Systems

The system can be extended to integrate with:

1. **APIs**: Add external data sources via UrlFetchApp
2. **Databases**: Connect to external databases via JDBC
3. **Other Agents**: Implement A2A protocol for agent communication
4. **Webhooks**: Trigger external actions on events

### Extension Pattern

```javascript
// Create new agent following Gatekeeper pattern
function createNewAgent(agentId, capabilities) {
  return {
    agent_id: agentId,
    protocol: 'A2A',
    capabilities: capabilities,
    memory: {
      format: 'markdown-kv',
      storage: '04_LOGS/' + agentId + '_memory.md'
    },
    thought_signature: {
      enabled: true,
      log_destination: 'AuditLogs'
    }
  };
}
```

## Scalability Considerations

### Current Limitations

- **Google Apps Script Quotas**: 
  - 6 min execution time per function
  - 100 MB attachment size
  - 20,000 email recipients per day

- **Drive Storage**: Subject to account storage limits

- **Sheets Capacity**:
  - 10 million cells per spreadsheet
  - 5,000 columns per sheet

### Scaling Strategies

1. **Pagination**: Break large operations into chunks
2. **Async Processing**: Use triggers for long-running tasks
3. **External Storage**: Move large data to Cloud Storage
4. **Database Migration**: Use Cloud SQL for high-volume data

## Performance Optimization

### Best Practices

1. **Batch Operations**: Group Drive/Sheets operations
2. **Caching**: Use CacheService for frequent reads
3. **Lazy Loading**: Load data only when needed
4. **Index Optimization**: Structure sheets for query performance

### Monitoring

- **Execution Logs**: Review Apps Script execution history
- **Audit Logs**: Monitor system activity in AuditLogs tab
- **Memory Files**: Check agent memory for state issues
- **Error Tracking**: Log errors to dedicated error handling

## Technology Stack

- **Platform**: Google Workspace
- **Language**: JavaScript (Google Apps Script - V8 Runtime)
- **Storage**: Google Drive (files), Google Sheets (structured data)
- **Authentication**: Google OAuth 2.0
- **Protocol**: A2A (Agent-to-Agent)
- **Memory Format**: Markdown-KV
- **Logging**: Structured JSON + Markdown

## Enterprise Enhancements (v1.1)

The system has been enhanced with enterprise-grade features for production deployment:

### 1. Duplicate Detection

**Problem**: Multiple folders/sheets with the same name caused unpredictable behavior.

**Solution**: Implemented `checkForDuplicates()` function that:
- Detects multiple resources with identical names
- Logs warnings to AuditLogs when duplicates are found
- Uses the first resource and alerts operators
- Prevents silent failures from iterator exhaustion

**Impact**: Eliminates race conditions and improves system reliability.

### 2. Memory File Rotation

**Problem**: Memory files grew indefinitely, risking performance degradation and size limits.

**Solution**: Automatic rotation when files exceed 1MB:
```javascript
const MEMORY_CONFIG = {
  MAX_FILE_SIZE: 1048576, // 1MB
  ROTATION_ENABLED: true
};
```
- Archives old memory files with timestamps
- Creates fresh memory file automatically
- Logs rotation events to AuditLogs
- Maintains complete audit trail

**Impact**: Ensures sustainable long-term operation.

### 3. Comprehensive Input Validation

**Problem**: Basic validation missed edge cases and malformed data.

**Solution**: Enhanced `validateFinancialData()` with:
- Type checking against whitelist: debt, tax, income, expense, asset
- Amount range validation (0 to 999,999,999.99)
- Creditor name length limits (500 chars)
- Date format validation
- Negative number detection
- Input sanitization for XSS protection

**Impact**: Prevents invalid data from entering the system.

### 4. Standardized Error Handling

**Problem**: Inconsistent error handling - some functions threw errors, others returned false.

**Solution**: Unified error handling approach:
- All functions throw descriptive Error objects
- Errors logged to AuditLogs before throwing
- STATUS constants for consistent status codes
- Fallback logging when AuditLogs unavailable

```javascript
const STATUS = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};
```

**Impact**: Predictable error behavior, easier debugging.

### 5. Rate Limiting

**Problem**: Rapid API calls could exhaust Google Apps Script quotas.

**Solution**: Implemented `checkRateLimit()`:
- 60 calls per minute maximum
- Automatic counter reset
- Descriptive error messages with wait time
- Applied to all Drive/Sheets operations

**Impact**: Prevents quota exhaustion and script failures.

### 6. XSS Protection

**Problem**: Unvalidated user input could inject malicious content.

**Solution**: `sanitizeInput()` function that:
- Removes angle brackets (< >)
- Strips javascript: protocol
- Removes event handlers (on*=)
- Limits input length to 10,000 characters
- Applied to all user-provided strings

**Impact**: Protects against cross-site scripting attacks.

### 7. Enhanced Thought Signatures

**Problem**: Validation failures didn't capture enough context for debugging.

**Solution**: Explicit error/warning fields in thought signatures:
```javascript
details: {
  data: data,
  validation: validation,
  errors: validation.errors,    // Explicit
  warnings: validation.warnings  // Explicit
}
```

**Impact**: Faster troubleshooting and better audit trails.

### 8. Mandatory Agent ID

**Problem**: Hardcoded defaults made multi-agent support difficult.

**Solution**:
- Removed `agentId = agentId || 'gatekeeper-001'` default
- Agent ID now required parameter
- Throws error if not provided
- Facilitates future multi-agent deployments

**Impact**: Better architecture for scaling to multiple agents.

### 9. Unified Audit Logging

**Problem**: Mixed use of Logger.log() and logToAuditLogs() created incomplete audit trails.

**Solution**:
- Replaced all Logger.log() calls with logToAuditLogs()
- Fallback to Logger only when AuditLogs unavailable
- Every significant operation logged
- Consistent log format across all functions

**Impact**: Complete, queryable audit trail.

## Deployment

### Development
1. Edit code in Apps Script editor
2. Test with Logger.log()
3. Run individual functions

### Production
1. Create standalone script project
2. Configure OAuth scopes in appsscript.json
3. Deploy as web app or API executable
4. Set up triggers for automation

## Maintenance

### Regular Tasks

1. **Review Audit Logs**: Check for anomalies
2. **Backup Data**: Export FINANCIAL_COMMAND sheet
3. **Clean Logs**: Archive old log files from 04_LOGS
4. **Update Memory**: Review agent memory for accuracy
5. **Monitor Quotas**: Check Apps Script usage

### Version Control

- Store Code.gs in Git repository
- Tag releases with semantic versioning
- Document changes in commit messages
- Maintain changelog

## Future Enhancements

1. **Multi-Agent System**: Add more specialized agents
2. **ML Integration**: Add predictive capabilities
3. **Real-time Dashboard**: Visualize system status
4. **Advanced Analytics**: Process thought signatures for insights
5. **External Integrations**: Connect to banking APIs, tax systems
