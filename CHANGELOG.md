# Changelog

All notable changes to the Financial Restoration AI Team project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-02-11

### Added

- **Duplicate Detection**: `checkForDuplicates()` function warns when multiple resources with the same name are found (Code.gs:79-98)
- **Memory File Rotation**: Automatic archiving when memory files exceed 1MB threshold (Code.gs:552-568)
- **Rate Limiting**: `checkRateLimit()` prevents API quota exhaustion - max 60 calls/minute (Code.gs:43-59)
- **XSS Protection**: `sanitizeInput()` function removes malicious content from user inputs (Code.gs:64-74)
- **STATUS Constants**: Standardized status codes (SUCCESS, FAILURE, INFO, WARNING, ERROR) (Code.gs:32-38)
- **MEMORY_CONFIG Constants**: Configuration for memory rotation threshold (Code.gs:19-22)
- **Comprehensive Input Validation**: Type whitelist, amount range checks, length limits, date validation (Code.gs:722-794)

### Changed

- **Breaking**: `storeMemoryMarkdownKV()` now requires `agentId` parameter - no longer has default value
- **Error Handling**: All functions now throw descriptive Error objects instead of returning false
- **Logging**: Replaced all `Logger.log()` calls with `logToAuditLogs()` for complete audit trails
- **Validation**: Enhanced `validateFinancialData()` with 6 validation checks (up from 2)
- **Thought Signatures**: Now include explicit `errors` and `warnings` fields in context
- **Folder/Sheet Creation**: All resource creation now includes duplicate detection
- **logToAuditLogs()**: Falls back to Logger.log() only when AuditLogs unavailable, doesn't throw

### Fixed

- **Critical**: Iterator exhaustion bug in duplicate detection (was calling hasNext() twice)
- **Critical**: Missing error context in validation thought signatures
- **Medium**: Inconsistent error handling across functions
- **Medium**: Memory files growing indefinitely without rotation
- **Medium**: Hardcoded agent ID defaults preventing multi-agent support

### Security

- Added input sanitization to prevent XSS attacks
- Added creditor name length validation (max 500 chars)
- Added input length limits (max 10,000 chars)
- Removed dangerous HTML/JavaScript patterns from inputs

### Documentation

- Added "Enterprise Enhancements (v1.1)" section to ARCHITECTURE.md
- Documented all 9 major improvements with problem/solution/impact
- Added this CHANGELOG.md file

## [1.0.0] - 2026-02-11

### Added

- Initial implementation of Financial Restoration AI Team
- A2A Protocol compliance with AgentCard JSON structure
- Markdown-KV memory format (**key**: value with timestamps)
- Thought Signature logging with dual storage (Sheets + Markdown)
- Google Drive folder structure: AI AGENTS/{00_RAW, 01_CLEANED, 02_SAFE, 03_VAULT, 04_LOGS}
- FINANCIAL_COMMAND Google Sheet with Debt, Tax, AuditLogs tabs
- Gatekeeper agent with 8-step workflow
- Business-standard data protection at folder level
- OAuth scopes: spreadsheets, drive, script.external_request
- Comprehensive documentation (ARCHITECTURE.md, TESTING.md, IMPLEMENTATION_STEPS.md, WORKFLOW.md)
- 18 test cases covering unit, integration, error handling, and performance
- Example files for AgentCard, memory format, and thought signatures

### Features

- `createAIAgentsFolders()`: Folder structure creation with data protection
- `createFinancialCommandSheet()`: Sheet creation with formatted tabs
- `generateGatekeeperCard()`: AgentCard generation per A2A Protocol
- `storeMemoryMarkdownKV()`: Memory storage in Markdown-KV format
- `logThoughtSignature()`: Thought signature logging to AuditLogs and memory
- `validateFinancialData()`: Financial data validation
- `routeDataToFolder()`: Data routing based on validation status
- `demoSystem()`: Complete system demonstration

### Bug Fixes

- Fixed iterator exhaustion in `storeMemoryMarkdownKV()` (commit a3a3a28)

---

## Version Comparison

### Small-Scale Deployment (v1.0.0)
- Suitable for personal use or small teams
- Basic validation and error handling
- Manual monitoring required
- No protection against edge cases

### Enterprise Deployment (v1.1.0)
- Production-ready for business use
- Comprehensive validation and security
- Automated monitoring via audit logs
- Protection against quota exhaustion, duplicates, XSS
- Sustainable long-term operation with memory rotation
- Complete audit trail for compliance

---

## Upgrade Path: 1.0.0 → 1.1.0

**Breaking Changes:**
1. Update all calls to `storeMemoryMarkdownKV()` to include the `agentId` parameter:
   ```javascript
   // Old (v1.0.0)
   storeMemoryMarkdownKV('key', 'value');  // Used default 'gatekeeper-001'

   // New (v1.1.0)
   storeMemoryMarkdownKV('key', 'value', 'gatekeeper-001');  // Required
   ```

**Recommended Actions:**
1. Back up existing memory files from 04_LOGS folder
2. Update Code.gs to v1.1.0
3. Test with `demoSystem()` function
4. Monitor AuditLogs for duplicate warnings
5. Review memory file sizes - rotation will happen automatically at 1MB

**No Data Migration Required** - All existing data remains compatible.
