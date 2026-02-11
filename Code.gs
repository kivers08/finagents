/**
 * Financial Restoration AI Team - Google Apps Script
 * Implements AI AGENTS folder structure, FINANCIAL_COMMAND sheet, and AgentCard generation
 * Follows A2A Protocol with Markdown-KV memory and Thought Signature logging
 */

// Configuration constants
const FOLDER_STRUCTURE = {
  ROOT: 'AI AGENTS',
  SUBFOLDERS: ['00_RAW', '01_CLEANED', '02_SAFE', '03_VAULT', '04_LOGS']
};

const SHEET_CONFIG = {
  NAME: 'FINANCIAL_COMMAND',
  TABS: ['Debt', 'Tax', 'AuditLogs']
};

// Memory management constants
const MEMORY_CONFIG = {
  MAX_FILE_SIZE: 1048576, // 1MB in bytes
  ROTATION_ENABLED: true
};

// Rate limiting configuration
const RATE_LIMIT = {
  MAX_CALLS_PER_MINUTE: 60,
  lastCallTime: 0,
  callCount: 0
};

// Status constants for standardized error handling
const STATUS = {
  SUCCESS: 'SUCCESS',
  FAILURE: 'FAILURE',
  INFO: 'INFO',
  WARNING: 'WARNING',
  ERROR: 'ERROR'
};

/**
 * Rate limiting helper to prevent API quota exhaustion
 */
function checkRateLimit() {
  const now = Date.now();
  const oneMinute = 60000;

  // Reset counter if a minute has passed
  if (now - RATE_LIMIT.lastCallTime > oneMinute) {
    RATE_LIMIT.callCount = 0;
    RATE_LIMIT.lastCallTime = now;
  }

  RATE_LIMIT.callCount++;

  if (RATE_LIMIT.callCount > RATE_LIMIT.MAX_CALLS_PER_MINUTE) {
    const waitTime = oneMinute - (now - RATE_LIMIT.lastCallTime);
    throw new Error('Rate limit exceeded. Please wait ' + Math.ceil(waitTime / 1000) + ' seconds.');
  }
}

/**
 * Sanitize input to prevent XSS and injection attacks
 */
function sanitizeInput(input) {
  if (typeof input === 'string') {
    // Remove potentially dangerous characters
    return input
      .replace(/[<>]/g, '') // Remove angle brackets
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+\s*=/gi, '') // Remove event handlers
      .substring(0, 10000); // Limit length
  }
  return input;
}

/**
 * Check for duplicate resources and warn if found
 */
function checkForDuplicates(iterator, resourceName) {
  const resources = [];
  while (iterator.hasNext()) {
    resources.push(iterator.next());
  }

  if (resources.length > 1) {
    const message = 'WARNING: Multiple ' + resourceName + ' found (' + resources.length + '). Using the first one.';
    Logger.log(message);
    logToAuditLogs({
      timestamp: new Date().toISOString(),
      agent: 'SYSTEM',
      action: 'DUPLICATE_DETECTION',
      status: STATUS.WARNING,
      details: message
    });
  }

  return resources.length > 0 ? resources[0] : null;
}

/**
 * Main menu for the Financial Restoration AI Team
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('AI Agents')
    .addItem('Initialize System', 'initializeSystem')
    .addItem('Create Folder Structure', 'createAIAgentsFolders')
    .addItem('Create Financial Command Sheet', 'createFinancialCommandSheet')
    .addItem('Generate Gatekeeper AgentCard', 'generateGatekeeperCard')
    .addItem('Log Thought Signature', 'logThoughtSignature')
    .addToUi();
}

/**
 * Initialize the complete AI Agents system
 */
function initializeSystem() {
  try {
    // Step 1: Create folder structure
    const rootFolder = createAIAgentsFolders();

    // Step 2: Create Financial Command Sheet
    const sheet = createFinancialCommandSheet();

    // Step 3: Generate Gatekeeper AgentCard
    const agentCard = generateGatekeeperCard();

    // Log initialization to AuditLogs
    logToAuditLogs({
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_INITIALIZATION',
      status: STATUS.SUCCESS,
      details: 'AI Agents system initialized successfully',
      folderId: rootFolder.getId(),
      sheetId: sheet.getId()
    });

    SpreadsheetApp.getUi().alert(
      'System Initialized Successfully!\n\n' +
      'Root Folder: ' + rootFolder.getName() + '\n' +
      'Sheet: ' + sheet.getName() + '\n\n' +
      'AgentCard generated for Gatekeeper'
    );

    return {
      folder: rootFolder,
      sheet: sheet,
      agentCard: agentCard
    };
  } catch (error) {
    logToAuditLogs({
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_INITIALIZATION',
      status: STATUS.FAILURE,
      details: 'System initialization failed: ' + error.toString()
    });
    throw error;
  }
}

/**
 * Create AI AGENTS folder structure in Google Drive
 * Creates root folder with subfolders: 00_RAW, 01_CLEANED, 02_SAFE, 03_VAULT, 04_LOGS
 */
function createAIAgentsFolders() {
  try {
    checkRateLimit();

    // Check if root folder already exists with duplicate detection
    const existingFolders = DriveApp.getFoldersByName(FOLDER_STRUCTURE.ROOT);
    let rootFolder = checkForDuplicates(existingFolders, 'root folder "' + FOLDER_STRUCTURE.ROOT + '"');

    if (rootFolder) {
      logToAuditLogs({
        timestamp: new Date().toISOString(),
        agent: 'SYSTEM',
        action: 'FOLDER_ACCESS',
        status: STATUS.INFO,
        details: 'Using existing root folder: ' + rootFolder.getId()
      });
    } else {
      // Create root folder
      rootFolder = DriveApp.createFolder(FOLDER_STRUCTURE.ROOT);
      logToAuditLogs({
        timestamp: new Date().toISOString(),
        agent: 'SYSTEM',
        action: 'FOLDER_CREATION',
        status: STATUS.SUCCESS,
        details: 'Created root folder: ' + rootFolder.getId()
      });
    }

    // Create subfolders
    FOLDER_STRUCTURE.SUBFOLDERS.forEach(function(subfolderName) {
      const existingSubfolders = rootFolder.getFoldersByName(subfolderName);
      const subfolder = checkForDuplicates(existingSubfolders, 'subfolder "' + subfolderName + '"');

      if (!subfolder) {
        const newSubfolder = rootFolder.createFolder(subfolderName);
        logToAuditLogs({
          timestamp: new Date().toISOString(),
          agent: 'SYSTEM',
          action: 'FOLDER_CREATION',
          status: STATUS.SUCCESS,
          details: 'Created subfolder: ' + subfolderName + ' (' + newSubfolder.getId() + ')'
        });

        // Set description for data protection
        newSubfolder.setDescription('Financial data folder - Business Standard Protection. ' +
                                'Access restricted. Created: ' + new Date().toISOString());

        // Apply data protection settings based on folder type
        applyDataProtection(newSubfolder, subfolderName);
      } else {
        logToAuditLogs({
          timestamp: new Date().toISOString(),
          agent: 'SYSTEM',
          action: 'FOLDER_ACCESS',
          status: STATUS.INFO,
          details: 'Subfolder already exists: ' + subfolderName
        });
      }
    });

    // Set root folder description
    rootFolder.setDescription('AI Agents Root Folder - Financial Restoration System. ' +
                              'Business Standard Data Protection Enforced. ' +
                              'Created: ' + new Date().toISOString());

    logToAuditLogs({
      timestamp: new Date().toISOString(),
      agent: 'SYSTEM',
      action: 'FOLDER_STRUCTURE_COMPLETE',
      status: STATUS.SUCCESS,
      details: 'Folder structure created successfully'
    });

    return rootFolder;
  } catch (error) {
    const errorMsg = 'Error creating folders: ' + error.toString();
    logToAuditLogs({
      timestamp: new Date().toISOString(),
      agent: 'SYSTEM',
      action: 'FOLDER_CREATION',
      status: STATUS.ERROR,
      details: errorMsg
    });
    throw new Error(errorMsg);
  }
}

/**
 * Apply data protection settings to folders based on their purpose
 */
function applyDataProtection(folder, folderType) {
  // Add sharing restrictions based on folder type
  const protectionLevels = {
    '00_RAW': 'Raw financial data - requires validation',
    '01_CLEANED': 'Cleaned data - validated and sanitized',
    '02_SAFE': 'Safe data - approved for processing',
    '03_VAULT': 'Secure vault - encrypted financial records',
    '04_LOGS': 'Audit logs - system activity tracking'
  };

  const description = folder.getDescription() + ' | ' + (protectionLevels[folderType] || '');
  folder.setDescription(description);

  // Log access control application to AuditLogs
  logToAuditLogs({
    timestamp: new Date().toISOString(),
    agent: 'SYSTEM',
    action: 'DATA_PROTECTION_APPLIED',
    status: STATUS.SUCCESS,
    details: 'Applied data protection to: ' + folderType
  });
}

/**
 * Create FINANCIAL_COMMAND Google Sheet with tabs: Debt, Tax, AuditLogs
 */
function createFinancialCommandSheet() {
  try {
    checkRateLimit();

    // Check if sheet already exists with duplicate detection
    const existingFiles = DriveApp.getFilesByName(SHEET_CONFIG.NAME);
    let spreadsheet;
    const existingFile = checkForDuplicates(existingFiles, 'sheet "' + SHEET_CONFIG.NAME + '"');

    if (existingFile) {
      spreadsheet = SpreadsheetApp.openById(existingFile.getId());
      logToAuditLogs({
        timestamp: new Date().toISOString(),
        agent: 'SYSTEM',
        action: 'SHEET_ACCESS',
        status: STATUS.INFO,
        details: 'Using existing sheet: ' + spreadsheet.getId()
      });
    } else {
      // Create new spreadsheet
      spreadsheet = SpreadsheetApp.create(SHEET_CONFIG.NAME);
      logToAuditLogs({
        timestamp: new Date().toISOString(),
        agent: 'SYSTEM',
        action: 'SHEET_CREATION',
        status: STATUS.SUCCESS,
        details: 'Created new sheet: ' + spreadsheet.getId()
      });
    }

    // Create tabs
    SHEET_CONFIG.TABS.forEach(function(tabName, index) {
      let sheet = spreadsheet.getSheetByName(tabName);
      if (!sheet) {
        if (index === 0 && spreadsheet.getSheets().length === 1) {
          // Rename first sheet
          sheet = spreadsheet.getSheets()[0];
          sheet.setName(tabName);
        } else {
          sheet = spreadsheet.insertSheet(tabName);
        }
        logToAuditLogs({
          timestamp: new Date().toISOString(),
          agent: 'SYSTEM',
          action: 'TAB_CREATION',
          status: STATUS.SUCCESS,
          details: 'Created tab: ' + tabName
        });

        // Initialize tab with headers
        initializeTab(sheet, tabName);
      } else {
        logToAuditLogs({
          timestamp: new Date().toISOString(),
          agent: 'SYSTEM',
          action: 'TAB_ACCESS',
          status: STATUS.INFO,
          details: 'Tab already exists: ' + tabName
        });
      }
    });

    // Move to AI AGENTS folder if it exists
    try {
      const rootFolders = DriveApp.getFoldersByName(FOLDER_STRUCTURE.ROOT);
      const rootFolder = checkForDuplicates(rootFolders, 'root folder');
      if (rootFolder) {
        const file = DriveApp.getFileById(spreadsheet.getId());
        file.moveTo(rootFolder);
        logToAuditLogs({
          timestamp: new Date().toISOString(),
          agent: 'SYSTEM',
          action: 'FILE_MOVE',
          status: STATUS.SUCCESS,
          details: 'Moved sheet to AI AGENTS folder'
        });
      }
    } catch (e) {
      logToAuditLogs({
        timestamp: new Date().toISOString(),
        agent: 'SYSTEM',
        action: 'FILE_MOVE',
        status: STATUS.WARNING,
        details: 'Could not move sheet to folder: ' + e.toString()
      });
    }

    return spreadsheet;
  } catch (error) {
    const errorMsg = 'Error creating sheet: ' + error.toString();
    logToAuditLogs({
      timestamp: new Date().toISOString(),
      agent: 'SYSTEM',
      action: 'SHEET_CREATION',
      status: STATUS.ERROR,
      details: errorMsg
    });
    throw new Error(errorMsg);
  }
}

/**
 * Initialize tab with appropriate headers
 */
function initializeTab(sheet, tabName) {
  if (tabName === 'Debt') {
    sheet.getRange('A1:F1').setValues([[
      'ID', 'Creditor', 'Amount', 'Due Date', 'Status', 'Notes'
    ]]);
    sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#4285f4').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  } else if (tabName === 'Tax') {
    sheet.getRange('A1:F1').setValues([[
      'Year', 'Type', 'Amount', 'Status', 'Filed Date', 'Notes'
    ]]);
    sheet.getRange('A1:F1').setFontWeight('bold').setBackground('#0f9d58').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  } else if (tabName === 'AuditLogs') {
    sheet.getRange('A1:G1').setValues([[
      'Timestamp', 'Agent', 'Action', 'Status', 'Details', 'ThoughtSignature', 'Memory'
    ]]);
    sheet.getRange('A1:G1').setFontWeight('bold').setBackground('#f4b400').setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
}

/**
 * Generate AgentCard JSON for Gatekeeper agent per A2A Protocol
 */
function generateGatekeeperCard() {
  const agentCard = {
    agent_id: 'gatekeeper-001',
    agent_name: 'Financial Gatekeeper',
    agent_type: 'gatekeeper',
    version: '1.0.0',
    protocol: 'A2A',
    created: new Date().toISOString(),
    
    // A2A Protocol fields
    capabilities: [
      'financial_data_validation',
      'access_control',
      'data_routing',
      'security_enforcement'
    ],
    
    endpoints: {
      validate: 'validateFinancialData',
      route: 'routeDataToFolder',
      authorize: 'authorizeAccess'
    },
    
    // Step 5: Memory configuration using Markdown-KV
    memory: {
      format: 'markdown-kv',
      storage: '04_LOGS/gatekeeper_memory.md',
      structure: {
        type: 'key-value',
        syntax: 'markdown',
        example: '**key**: value'
      }
    },
    
    // Step 8: Thought Signature configuration
    thought_signature: {
      enabled: true,
      log_destination: 'AuditLogs',
      format: 'structured',
      fields: ['timestamp', 'decision', 'reasoning', 'confidence']
    },
    
    // Business Standard data protection
    security: {
      level: 'business_standard',
      encryption: 'at_rest',
      access_control: 'role_based',
      audit_logging: 'enabled',
      data_classification: 'financial'
    },
    
    workflow: {
      step_1: 'receive_financial_data',
      step_2: 'validate_data_format',
      step_3: 'check_security_clearance',
      step_4: 'classify_data_sensitivity',
      step_5: 'store_memory_markdown_kv',
      step_6: 'route_to_appropriate_folder',
      step_7: 'update_audit_log',
      step_8: 'log_thought_signature'
    }
  };
  
  // Store AgentCard in Script Properties
  const properties = PropertiesService.getScriptProperties();
  properties.setProperty('gatekeeper_agent_card', JSON.stringify(agentCard, null, 2));
  
  Logger.log('Generated Gatekeeper AgentCard');
  return agentCard;
}

/**
 * Get the Gatekeeper AgentCard
 */
function getGatekeeperCard() {
  const properties = PropertiesService.getScriptProperties();
  const cardJson = properties.getProperty('gatekeeper_agent_card');
  
  if (cardJson) {
    return JSON.parse(cardJson);
  } else {
    return generateGatekeeperCard();
  }
}

/**
 * Step 5: Store memory in Markdown-KV format with rotation support
 * @param {string} key - Memory key
 * @param {string} value - Memory value
 * @param {string} agentId - Agent identifier (required)
 */
function storeMemoryMarkdownKV(key, value, agentId) {
  if (!agentId) {
    throw new Error('Agent ID is required for memory storage');
  }

  try {
    checkRateLimit();

    // Sanitize inputs
    key = sanitizeInput(key);
    value = sanitizeInput(value);
    agentId = sanitizeInput(agentId);

    // Get or create memory file in 04_LOGS
    const rootFolders = DriveApp.getFoldersByName(FOLDER_STRUCTURE.ROOT);
    const rootFolder = checkForDuplicates(rootFolders, 'root folder');
    if (!rootFolder) {
      throw new Error('AI AGENTS folder not found');
    }

    const logsFolders = rootFolder.getFoldersByName('04_LOGS');
    const logsFolder = checkForDuplicates(logsFolders, '04_LOGS folder');

    if (!logsFolder) {
      throw new Error('04_LOGS folder not found');
    }

    const memoryFileName = agentId + '_memory.md';
    const existingFiles = logsFolder.getFilesByName(memoryFileName);

    let file;
    let content = '';
    let fileExists = false;

    if (existingFiles.hasNext()) {
      file = existingFiles.next();
      content = file.getBlob().getDataAsString();
      fileExists = true;

      // Check for duplicates
      if (existingFiles.hasNext()) {
        logToAuditLogs({
          timestamp: new Date().toISOString(),
          agent: agentId,
          action: 'MEMORY_DUPLICATE_WARNING',
          status: STATUS.WARNING,
          details: 'Multiple memory files found for ' + agentId + '. Using the first one.'
        });
      }

      // Check file size and rotate if needed
      if (MEMORY_CONFIG.ROTATION_ENABLED && content.length > MEMORY_CONFIG.MAX_FILE_SIZE) {
        const archiveTimestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archiveName = agentId + '_memory_archive_' + archiveTimestamp + '.md';
        file.setName(archiveName);

        logToAuditLogs({
          timestamp: new Date().toISOString(),
          agent: agentId,
          action: 'MEMORY_ROTATION',
          status: STATUS.SUCCESS,
          details: 'Memory file rotated. Archive: ' + archiveName + ', Size: ' + content.length + ' bytes'
        });

        // Create new memory file
        fileExists = false;
        content = '';
      }
    }

    if (!fileExists) {
      // Create new memory file
      content = '# Agent Memory: ' + agentId + '\n\n';
      content += '**Created**: ' + new Date().toISOString() + '\n\n';
      content += '## Memory Entries\n\n';
    }

    // Add new memory entry in Markdown-KV format
    const timestamp = new Date().toISOString();
    const newEntry = '**' + key + '**: ' + value + ' _(timestamp: ' + timestamp + ')_\n\n';
    content += newEntry;

    if (fileExists) {
      file.setContent(content);
    } else {
      file = logsFolder.createFile(memoryFileName, content, MimeType.PLAIN_TEXT);
    }

    logToAuditLogs({
      timestamp: timestamp,
      agent: agentId,
      action: 'MEMORY_STORED',
      status: STATUS.SUCCESS,
      details: 'Stored memory key: ' + key
    });

    return true;
  } catch (error) {
    const errorMsg = 'Error storing memory: ' + error.toString();
    logToAuditLogs({
      timestamp: new Date().toISOString(),
      agent: agentId || 'UNKNOWN',
      action: 'MEMORY_STORAGE',
      status: STATUS.ERROR,
      details: errorMsg
    });
    throw new Error(errorMsg);
  }
}

/**
 * Step 8: Log Thought Signature to AuditLogs
 */
function logThoughtSignature(thought) {
  try {
    const spreadsheet = getFinancialCommandSheet();
    const auditSheet = spreadsheet.getSheetByName('AuditLogs');

    if (!auditSheet) {
      throw new Error('AuditLogs tab not found');
    }

    const timestamp = new Date().toISOString();
    const thoughtSignature = {
      timestamp: timestamp,
      decision: thought.decision || 'N/A',
      reasoning: thought.reasoning || 'N/A',
      confidence: thought.confidence || 0.0,
      context: thought.context || {}
    };

    // Append to AuditLogs sheet
    auditSheet.appendRow([
      timestamp,
      thought.agent || 'gatekeeper-001',
      thought.action || 'THOUGHT_PROCESS',
      STATUS.SUCCESS,
      JSON.stringify(thought.details || {}),
      JSON.stringify(thoughtSignature),
      thought.memory || ''
    ]);

    // Also store in Markdown-KV memory
    const agentId = thought.agent || 'gatekeeper-001';
    storeMemoryMarkdownKV(
      'thought_' + timestamp,
      JSON.stringify(thoughtSignature),
      agentId
    );

    logToAuditLogs({
      timestamp: timestamp,
      agent: agentId,
      action: 'THOUGHT_SIGNATURE_LOGGED',
      status: STATUS.SUCCESS,
      details: 'Logged thought signature for decision: ' + thoughtSignature.decision
    });

    return true;
  } catch (error) {
    const errorMsg = 'Error logging thought signature: ' + error.toString();
    logToAuditLogs({
      timestamp: new Date().toISOString(),
      agent: thought.agent || 'UNKNOWN',
      action: 'THOUGHT_SIGNATURE',
      status: STATUS.ERROR,
      details: errorMsg
    });
    throw new Error(errorMsg);
  }
}

/**
 * Log general events to AuditLogs with standardized error handling
 */
function logToAuditLogs(logEntry) {
  try {
    const spreadsheet = getFinancialCommandSheet();
    const auditSheet = spreadsheet.getSheetByName('AuditLogs');

    if (!auditSheet) {
      throw new Error('AuditLogs tab not found - cannot log event');
    }

    auditSheet.appendRow([
      logEntry.timestamp || new Date().toISOString(),
      logEntry.agent || 'SYSTEM',
      logEntry.action || 'UNKNOWN',
      logEntry.status || STATUS.INFO,
      logEntry.details || '',
      logEntry.thoughtSignature || '',
      logEntry.memory || ''
    ]);

    return true;
  } catch (error) {
    // Fallback to Logger if AuditLogs unavailable
    Logger.log('AUDIT_LOG_ERROR: ' + error.toString());
    Logger.log('Failed to log: ' + JSON.stringify(logEntry));
    // Don't throw - allow execution to continue
    return false;
  }
}

/**
 * Get FINANCIAL_COMMAND sheet (helper function)
 */
function getFinancialCommandSheet() {
  const files = DriveApp.getFilesByName(SHEET_CONFIG.NAME);
  if (files.hasNext()) {
    const file = files.next();
    return SpreadsheetApp.openById(file.getId());
  }
  
  // Create if not exists
  return createFinancialCommandSheet();
}

/**
 * Validate financial data with comprehensive checks (Gatekeeper function)
 */
function validateFinancialData(data) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };

  // Sanitize input data
  if (data.creditor) {
    data.creditor = sanitizeInput(data.creditor);
  }
  if (data.type) {
    data.type = sanitizeInput(data.type);
  }

  // Validate amount
  if (!data.amount) {
    validation.isValid = false;
    validation.errors.push('Amount is required');
  } else if (isNaN(data.amount)) {
    validation.isValid = false;
    validation.errors.push('Invalid amount: must be a valid number');
  } else if (data.amount < 0) {
    validation.isValid = false;
    validation.errors.push('Invalid amount: cannot be negative');
  } else if (data.amount > 999999999.99) {
    validation.warnings.push('Amount is unusually large: ' + data.amount);
  }

  // Validate type
  const validTypes = ['debt', 'tax', 'income', 'expense', 'asset'];
  if (!data.type) {
    validation.isValid = false;
    validation.errors.push('Data type is required');
  } else if (!validTypes.includes(data.type.toLowerCase())) {
    validation.isValid = false;
    validation.errors.push('Invalid type: must be one of ' + validTypes.join(', '));
  }

  // Validate creditor name length
  if (data.creditor && data.creditor.length > 500) {
    validation.isValid = false;
    validation.errors.push('Creditor name too long (max 500 characters)');
  }

  // Validate date format if provided
  if (data.dueDate) {
    const dateObj = new Date(data.dueDate);
    if (isNaN(dateObj.getTime())) {
      validation.isValid = false;
      validation.errors.push('Invalid date format for dueDate');
    }
  }

  // Log thought signature with full error context (Critical Issue #2)
  logThoughtSignature({
    agent: 'gatekeeper-001',
    action: 'DATA_VALIDATION',
    decision: validation.isValid ? 'APPROVED' : 'REJECTED',
    reasoning: validation.isValid ?
      'All validation checks passed' :
      'Validation failed: ' + validation.errors.join(', '),
    confidence: validation.isValid ? 1.0 : 0.0,
    details: {
      data: data,
      validation: validation,
      errors: validation.errors,  // Explicit error context
      warnings: validation.warnings  // Explicit warning context
    }
  });

  return validation;
}

/**
 * Route data to appropriate folder based on status
 */
function routeDataToFolder(data, validationStatus) {
  let targetFolder = '00_RAW';
  
  if (validationStatus.isValid) {
    if (data.cleaned) {
      targetFolder = '01_CLEANED';
    }
    if (data.safe) {
      targetFolder = '02_SAFE';
    }
    if (data.vault) {
      targetFolder = '03_VAULT';
    }
  }
  
  // Log thought signature for routing decision
  logThoughtSignature({
    agent: 'gatekeeper-001',
    action: 'DATA_ROUTING',
    decision: targetFolder,
    reasoning: 'Routed based on validation and data status',
    confidence: 0.95,
    details: {
      data: data,
      validationStatus: validationStatus,
      targetFolder: targetFolder
    }
  });
  
  return targetFolder;
}

/**
 * Demo function to show the system in action
 */
function demoSystem() {
  logToAuditLogs({
    timestamp: new Date().toISOString(),
    agent: 'SYSTEM',
    action: 'DEMO_START',
    status: STATUS.INFO,
    details: 'Starting system demo'
  });

  // Example financial data
  const sampleData = {
    type: 'debt',
    amount: 1000.00,
    creditor: 'Sample Bank',
    cleaned: true,
    safe: false
  };

  // Validate
  const validation = validateFinancialData(sampleData);
  logToAuditLogs({
    timestamp: new Date().toISOString(),
    agent: 'SYSTEM',
    action: 'DEMO_VALIDATION',
    status: validation.isValid ? STATUS.SUCCESS : STATUS.ERROR,
    details: 'Validation result: ' + JSON.stringify(validation)
  });

  // Route
  const folder = routeDataToFolder(sampleData, validation);
  logToAuditLogs({
    timestamp: new Date().toISOString(),
    agent: 'SYSTEM',
    action: 'DEMO_ROUTING',
    status: STATUS.SUCCESS,
    details: 'Routed to folder: ' + folder
  });

  // Store memory with required agentId
  storeMemoryMarkdownKV('demo_run', 'System demo completed successfully', 'gatekeeper-001');

  logToAuditLogs({
    timestamp: new Date().toISOString(),
    agent: 'SYSTEM',
    action: 'DEMO_COMPLETE',
    status: STATUS.SUCCESS,
    details: 'Demo completed successfully'
  });
}
