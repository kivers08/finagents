# Financial Restoration AI Team Mission Context

## 1. Project Overview

**Project Name:** AI Financial Command Center

**Environment:** Google Workspace Business Standard (2026 Edition)

**Principal:** Small Business Owner / Head of Household

**Mission:** Orchestrate an autonomous transition from high-debt insolvency ($130k total) to stable, debt-free homeownership.

---

## 2. Core Strategic Goals

### Debt Liquidation
Systematic elimination of student loans ($100k) and credit card debt ($30k) using optimized repayment strategies (Snowball/Avalanche).

### Regulatory Settlement
Navigating the Kentucky Offer in Settlement (OIS) program for existing business tax liabilities while mitigating Successor Liability (KRS 139.670).

### Asset Acquisition
Restoring credit scores and accumulating required savings to qualify for the Louisville Metro Down Payment Assistance (DPA) 20% forgivable loan.

### Operational Excellence
Building an autonomous, persistent AI workforce that handles memory, error logging, and execution for a 5+ year roadmap.

---

## 3. The "AI AGENTS" Atmosphere

The system operates within the native 2026 Google Workspace stack:

### Intelligence
- **Gemini 3 Pro:** "Thinking Mode" for complex strategy and legal reasoning.
- **Gemini 3 Flash:** "Fast Mode" for data extraction and PII stripping.

### Protocols
- **Google A2A:** Autonomous communication via JSON Agent Cards.
- **Google ADK:** Custom tool development for Sheets/API interaction.
- **FileSearch API:** Multi-modal ingestion of Drive assets.

---

## 4. Current Directory Structure

All agents must adhere to this "Digital Assembly Line" file pathing:

```
AI AGENTS/ (Root)
├── 00_RAW_UPLOADS/       - Trigger source for Data Ingestion
├── 01_GATEKEEPER_OUTPUT/ - Handoff for clean, non-anonymized Markdown-KV data
├── 02_SAFE_DATA/         - Handoff for PII-stripped files ready for strategy agents
├── 03_STRATEGY_VAULT/    - Knowledge base for legal/tax references (KRS 139, Form 12A018)
└── 04_SYSTEM_LOGS/       - Storage for Thought Signatures and trace-level audit logs
```

---

## 5. Memory & Persistence

Following the 8-Step Build Framework, this system replaces "sloppy code" with structured memory:

- **Working Memory:** Local session state.
- **Structured DB:** The FINANCIAL_COMMAND Google Sheet serves as the persistent memory.
- **Knowledge Base:** NotebookLM serves as the shared "brain" for state-level regulatory updates.

---

## 6. Product Manager Critique

As a Google Workspace Product Manager, three specific architectural weaknesses have been identified. If these are not addressed, the "Digital Assembly Line" will collapse under the weight of real-world data variance.

### 6.1 The "A2A Discovery" Bottleneck

**Issue:** The plan relies on the Google A2A (Agent-to-Agent) protocol for autonomous handoffs. However, A2A specifications are still evolving, and cross-framework communication (e.g., a Gem talking to an ADK-built agent) requires rigid authentication tokens. On a Business Standard account, you may face "Agentic Gridlock" where the PII Anonymizer cannot independently verify the "Agent Card" of the Debt Commander without a manual human OAuth token refresh.

**PM Recommendation:** Move from a peer-to-peer handoff to a **Coordinator/Dispatcher pattern**. Use a single "Manager Gem" to explicitly call sub-agents by name to ensure control.

### 6.2 Persistence Fragility (The User Context Problem)

**Issue:** The system lists SQL/Structured DB as the memory system, but uses Google Sheets. In Workspace Studio, flows execute with the permissions of the user who created them. If you change your account password or modify sharing settings on the root folder, the entire 5-year project will die instantly.

**PM Recommendation:** Implement **"System-Level" persistence**. Use a Google Cloud Service Account with domain-wide delegation for your Apps Script worker code to decouple the system from your individual user session.

### 6.3 Successor Liability Calculation Error

**Issue:** The Succession Watchdog agent is tasked with scanning for triggers under KRS 139.670. AI agents often struggle with the "Valuable Consideration" element of Kentucky law, where the assumption of any liability or forgiveness of any debt can trigger the successor's obligation to withhold tax. If the agent rounding math is off by even 0.01, your Offer in Settlement could be rejected for "Inaccurate Financial Condition".

**PM Recommendation:** Implement **Schema Enforcement**. Do not let the AI "describe" your business assets. It must output data into a pre-defined JSON schema that validates against the specific fields in Kentucky Form 12A638(I).

---

## 7. Conclusion

The plan is conceptually strong but technically "optimistic." You must move from a "Folder-Trigger" system to a **State-Machine Architecture** where every file status is logged in the AuditLogs tab. This is the only way to achieve the "Zero Unplanned Downtime" required for a multi-year recovery plan.

---

## 8. Implementation Considerations

### State-Machine Architecture
Transition from folder-based triggers to a state-machine where:
- Every file status is logged in the AuditLogs tab
- All agent transitions are tracked
- Error states are handled gracefully with rollback mechanisms

### Authentication & Authorization
- Implement Service Account delegation for persistent access
- Decouple from individual user sessions
- Use domain-wide delegation where appropriate

### Data Validation
- Enforce strict JSON schemas for all financial data
- Validate against Kentucky Form requirements
- Implement rounding precision controls (minimum 2 decimal places)

### Coordinator Pattern
- Implement a central Manager Gem that:
  - Orchestrates all sub-agent calls
  - Maintains the execution state
  - Handles authentication token management
  - Provides unified error handling and logging

---

## 9. References

1. Google A2A Protocol Specification (2026)
2. NotebookLM Integration Guide
3. Google Workspace Studio Permissions Model
4. Google Apps Script Service Accounts
5. Kentucky Revised Statutes (KRS) 139.670
6. Kentucky Form 12A638(I) - Offer in Settlement
7. Louisville Metro Down Payment Assistance Program Guidelines
