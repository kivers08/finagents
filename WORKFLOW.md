# System Workflow Diagram

## Visual Overview of Financial Restoration AI Team

This document provides visual representations of the system's workflows and data flows.

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌───────────┐│
│  │Google Sheet│  │Drive Folder│  │Apps Script │  │   Menu    ││
│  │   (View)   │  │   (View)   │  │  (Execute) │  │  (Click)  ││
│  └─────┬──────┘  └─────┬──────┘  └─────┬──────┘  └─────┬─────┘│
└────────┼───────────────┼───────────────┼───────────────┼───────┘
         │               │               │               │
         └───────────────┴───────────────┴───────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                      APPS SCRIPT LAYER                           │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Core System Functions                         │ │
│  │  • initializeSystem()                                      │ │
│  │  • createAIAgentsFolders()                                │ │
│  │  • createFinancialCommandSheet()                          │ │
│  │  • generateGatekeeperCard()                               │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Gatekeeper Agent Functions                    │ │
│  │  • validateFinancialData()                                │ │
│  │  • routeDataToFolder()                                    │ │
│  │  • storeMemoryMarkdownKV()          [Step 5]             │ │
│  │  • logThoughtSignature()            [Step 8]             │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │              Support Functions                             │ │
│  │  • logToAuditLogs()                                       │ │
│  │  • applyDataProtection()                                  │ │
│  │  • initializeTab()                                        │ │
│  └───────────────────────────────────────────────────────────┘ │
└────────┬─────────────────────┬─────────────────────┬───────────┘
         │                     │                     │
         ▼                     ▼                     ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│  Google Drive   │  │ Google Sheets   │  │ Script Props    │
│                 │  │                 │  │                 │
│  AI AGENTS/     │  │ FINANCIAL_      │  │ AgentCard JSON  │
│  ├─00_RAW       │  │ COMMAND         │  │ Storage         │
│  ├─01_CLEANED   │  │ ├─Debt          │  │                 │
│  ├─02_SAFE      │  │ ├─Tax           │  │                 │
│  ├─03_VAULT     │  │ └─AuditLogs     │  │                 │
│  └─04_LOGS      │  │                 │  │                 │
└─────────────────┘  └─────────────────┘  └─────────────────┘
```

## Data Processing Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    FINANCIAL DATA INPUT                          │
│                    (User provides data)                          │
└───────────────────────────┬─────────────────────────────────────┘
                            │
                            ▼
              ┌─────────────────────────┐
              │   Step 1: RECEIVE       │
              │   Financial Data        │
              └────────────┬────────────┘
                           │
                           ▼
              ┌─────────────────────────┐
              │   Step 2: VALIDATE      │
              │   Data Format           │
              │   • Check amount        │
              │   • Check type          │
              │   • Check required fields│
              └────────────┬────────────┘
                           │
                ┌──────────┴──────────┐
                │                     │
                ▼                     ▼
        ┌──────────────┐      ┌──────────────┐
        │   VALID      │      │   INVALID    │
        └──────┬───────┘      └──────┬───────┘
               │                     │
               │                     └────► Log Error
               │                            Route to 00_RAW
               ▼
    ┌─────────────────────────┐
    │   Step 3: CHECK         │
    │   Security Clearance    │
    │   • Verify permissions  │
    │   • Check access rights │
    └────────────┬────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │   Step 4: CLASSIFY      │
    │   Data Sensitivity      │
    │   • Raw                 │
    │   • Cleaned             │
    │   • Safe                │
    │   • Vault               │
    └────────────┬────────────┘
                 │
                 ▼
    ┌─────────────────────────────────────┐
    │   Step 5: STORE MEMORY              │◄─────────┐
    │   Format: Markdown-KV                │          │
    │   **key**: value _(timestamp: ...)_  │          │
    │   Location: 04_LOGS/agent_memory.md  │          │
    └────────────┬────────────────────────┘          │
                 │                                    │
                 ▼                                    │
    ┌─────────────────────────┐                     │
    │   Step 6: ROUTE         │                     │
    │   To Appropriate Folder │                     │
    │   • 00_RAW              │                     │
    │   • 01_CLEANED          │                     │
    │   • 02_SAFE             │                     │
    │   • 03_VAULT            │                     │
    └────────────┬────────────┘                     │
                 │                                    │
                 ▼                                    │
    ┌─────────────────────────┐                     │
    │   Step 7: UPDATE        │                     │
    │   Audit Log             │                     │
    │   • Log action          │                     │
    │   • Record timestamp    │                     │
    │   • Store details       │                     │
    └────────────┬────────────┘                     │
                 │                                    │
                 ▼                                    │
    ┌──────────────────────────────────────┐        │
    │   Step 8: LOG THOUGHT SIGNATURE      │────────┘
    │   {                                   │
    │     timestamp: "...",                 │
    │     decision: "APPROVED/REJECTED",    │
    │     reasoning: "Why...",              │
    │     confidence: 0.0-1.0               │
    │   }                                   │
    │   • Log to AuditLogs                  │
    │   • Store in Memory                   │
    └───────────────────────────────────────┘
                 │
                 ▼
    ┌─────────────────────────┐
    │   PROCESSING COMPLETE   │
    │   • Data stored         │
    │   • Memory updated      │
    │   • Audit trail created │
    └─────────────────────────┘
```

## Memory System (Step 5) - Markdown-KV Format

```
┌──────────────────────────────────────────────────────────┐
│ Agent Memory Storage                                      │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Location: AI AGENTS/04_LOGS/gatekeeper-001_memory.md   │
│                                                           │
│  Format: Markdown with Key-Value pairs                   │
│                                                           │
│  ┌────────────────────────────────────────────────────┐ │
│  │ # Agent Memory: gatekeeper-001                     │ │
│  │                                                     │ │
│  │ **Created**: 2026-02-11T06:34:17.763Z             │ │
│  │                                                     │ │
│  │ ## Memory Entries                                  │ │
│  │                                                     │ │
│  │ **key_1**: value_1 _(timestamp: 2026-02-11...)_   │ │
│  │                                                     │ │
│  │ **key_2**: value_2 _(timestamp: 2026-02-11...)_   │ │
│  │                                                     │ │
│  │ **key_3**: value_3 _(timestamp: 2026-02-11...)_   │ │
│  │                                                     │ │
│  └────────────────────────────────────────────────────┘ │
│                                                           │
│  Benefits:                                                │
│  ✓ Human-readable                                         │
│  ✓ Machine-parseable                                      │
│  ✓ Version control friendly (git diff works)             │
│  ✓ No database required                                   │
│  ✓ Portable across systems                                │
│  ✓ Timestamped for audit                                  │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

## Thought Signature System (Step 8)

```
┌──────────────────────────────────────────────────────────┐
│ Thought Signature Flow                                    │
├──────────────────────────────────────────────────────────┤
│                                                           │
│  Agent Makes Decision                                     │
│         │                                                 │
│         ▼                                                 │
│  ┌─────────────────────────────────┐                    │
│  │ Create Thought Signature        │                    │
│  │ {                               │                    │
│  │   timestamp: "ISO8601",         │                    │
│  │   decision: "APPROVED",         │                    │
│  │   reasoning: "Why...",          │                    │
│  │   confidence: 0.95,             │                    │
│  │   context: {...}                │                    │
│  │ }                               │                    │
│  └──────────┬──────────────────────┘                    │
│             │                                            │
│             ├──────────────┬──────────────┐             │
│             │              │              │             │
│             ▼              ▼              ▼             │
│  ┌──────────────┐ ┌──────────────┐ ┌────────────┐     │
│  │ AuditLogs    │ │ Memory File  │ │ Logger     │     │
│  │ Sheet        │ │ (Markdown)   │ │ (Console)  │     │
│  │              │ │              │ │            │     │
│  │ Structured   │ │ Timestamped  │ │ Debug      │     │
│  │ Row          │ │ Entry        │ │ Output     │     │
│  └──────────────┘ └──────────────┘ └────────────┘     │
│                                                          │
│  Use Cases:                                              │
│  • Audit compliance                                      │
│  • Debugging decisions                                   │
│  • Performance analysis                                  │
│  • Learning from patterns                                │
│  • Transparency reporting                                │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## Folder Hierarchy & Data Flow

```
┌────────────────────────────────────────────────────────────┐
│                     AI AGENTS (Root)                        │
│                  Business Standard Protection               │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 00_RAW - Unvalidated Raw Data                      │   │
│  │ • Incoming financial data                          │   │
│  │ • Awaiting validation                              │   │
│  │ • Restricted access                                │   │
│  └──────────────┬─────────────────────────────────────┘   │
│                 │ Validate & Clean                         │
│                 ▼                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 01_CLEANED - Validated & Sanitized                 │   │
│  │ • Passed validation checks                         │   │
│  │ • Data format confirmed                            │   │
│  │ • Standard access                                  │   │
│  └──────────────┬─────────────────────────────────────┘   │
│                 │ Approve for Processing                   │
│                 ▼                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 02_SAFE - Approved for Business Use                │   │
│  │ • Ready for analysis                               │   │
│  │ • Business logic can process                       │   │
│  │ • Analyst access                                   │   │
│  └──────────────┬─────────────────────────────────────┘   │
│                 │ Archive Sensitive Data                   │
│                 ▼                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 03_VAULT - Highly Sensitive / Archived             │   │
│  │ • Encrypted storage                                │   │
│  │ • PII and financial records                        │   │
│  │ • Admin-only access                                │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 04_LOGS - System Activity & Agent Memory           │   │
│  │ • Audit logs                                       │   │
│  │ • Agent memory files (Markdown-KV)                 │   │
│  │ • Thought signatures                               │   │
│  │ • Auditor access                                   │   │
│  └────────────────────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## AgentCard Structure (A2A Protocol)

```
┌────────────────────────────────────────────────────────────┐
│                 Gatekeeper AgentCard                        │
│                    (A2A Protocol)                           │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Identification                                    │     │
│  │  • agent_id: "gatekeeper-001"                    │     │
│  │  • agent_name: "Financial Gatekeeper"            │     │
│  │  • agent_type: "gatekeeper"                      │     │
│  │  • version: "1.0.0"                              │     │
│  │  • protocol: "A2A"                               │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Capabilities                                      │     │
│  │  • financial_data_validation                     │     │
│  │  • access_control                                │     │
│  │  • data_routing                                  │     │
│  │  • security_enforcement                          │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Endpoints (Functions)                             │     │
│  │  • validate: validateFinancialData()             │     │
│  │  • route: routeDataToFolder()                    │     │
│  │  • authorize: authorizeAccess()                  │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Memory (Step 5)                                   │     │
│  │  • format: "markdown-kv"                         │     │
│  │  • storage: "04_LOGS/gatekeeper_memory.md"       │     │
│  │  • structure: key-value with markdown syntax     │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Thought Signature (Step 8)                        │     │
│  │  • enabled: true                                 │     │
│  │  • log_destination: "AuditLogs"                  │     │
│  │  • format: "structured"                          │     │
│  │  • fields: [timestamp, decision, reasoning,      │     │
│  │             confidence]                          │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Security                                          │     │
│  │  • level: "business_standard"                    │     │
│  │  • encryption: "at_rest"                         │     │
│  │  • access_control: "role_based"                  │     │
│  │  • audit_logging: "enabled"                      │     │
│  │  • data_classification: "financial"              │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │ Workflow (8 Steps)                                │     │
│  │  1. receive_financial_data                       │     │
│  │  2. validate_data_format                         │     │
│  │  3. check_security_clearance                     │     │
│  │  4. classify_data_sensitivity                    │     │
│  │  5. store_memory_markdown_kv       ◄── Step 5   │     │
│  │  6. route_to_appropriate_folder                  │     │
│  │  7. update_audit_log                             │     │
│  │  8. log_thought_signature          ◄── Step 8   │     │
│  └──────────────────────────────────────────────────┘     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Initialization Sequence

```
User Runs: initializeSystem()
         │
         ▼
    ┌────────────────────┐
    │ Step 1: Create     │
    │ Folder Structure   │
    └──────┬─────────────┘
           │
           ├─► Create: AI AGENTS/
           ├─► Create: 00_RAW/
           ├─► Create: 01_CLEANED/
           ├─► Create: 02_SAFE/
           ├─► Create: 03_VAULT/
           └─► Create: 04_LOGS/
           │
           ▼
    ┌────────────────────┐
    │ Step 2: Create     │
    │ Spreadsheet        │
    └──────┬─────────────┘
           │
           ├─► Create: FINANCIAL_COMMAND
           ├─► Create Tab: Debt
           ├─► Create Tab: Tax
           ├─► Create Tab: AuditLogs
           └─► Move to AI AGENTS folder
           │
           ▼
    ┌────────────────────┐
    │ Step 3: Generate   │
    │ AgentCard          │
    └──────┬─────────────┘
           │
           ├─► Build JSON structure
           ├─► Include A2A Protocol fields
           ├─► Configure Memory (Step 5)
           ├─► Configure Thought Sig (Step 8)
           └─► Store in Script Properties
           │
           ▼
    ┌────────────────────┐
    │ Step 4: Log        │
    │ Initialization     │
    └──────┬─────────────┘
           │
           └─► Write to AuditLogs
           │   - Timestamp
           │   - Action: SYSTEM_INITIALIZATION
           │   - Status: SUCCESS
           │   - Details: folder/sheet IDs
           │
           ▼
    ┌────────────────────┐
    │ Success!           │
    │ System Ready       │
    └────────────────────┘
```

## Summary

This visual documentation provides a clear understanding of:

1. **System Architecture** - How components interact
2. **Data Flow** - How data moves through the system
3. **Memory System** - How Step 5 memory works with Markdown-KV
4. **Thought Signatures** - How Step 8 decision logging works
5. **Folder Hierarchy** - Data classification and routing
6. **AgentCard** - A2A Protocol implementation
7. **Initialization** - System setup sequence

These diagrams help users understand the complete system at a glance and serve as a reference during development and debugging.
