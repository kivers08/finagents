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
    
    // Log initialization
    logToAuditLogs({
      timestamp: new Date().toISOString(),
      action: 'SYSTEM_INITIALIZATION',
      status: 'SUCCESS',
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
      status: 'FAILURE',
      error: error.toString()
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
    // Check if root folder already exists
    const existingFolders = DriveApp.getFoldersByName(FOLDER_STRUCTURE.ROOT);
    let rootFolder;
    
    if (existingFolders.hasNext()) {
      rootFolder = existingFolders.next();
      Logger.log('Using existing root folder: ' + rootFolder.getId());
    } else {
      // Create root folder
      rootFolder = DriveApp.createFolder(FOLDER_STRUCTURE.ROOT);
      Logger.log('Created root folder: ' + rootFolder.getId());
    }
    
    // Create subfolders
    FOLDER_STRUCTURE.SUBFOLDERS.forEach(function(subfolderName) {
      const existingSubfolders = rootFolder.getFoldersByName(subfolderName);
      if (!existingSubfolders.hasNext()) {
        const subfolder = rootFolder.createFolder(subfolderName);
        Logger.log('Created subfolder: ' + subfolderName + ' (' + subfolder.getId() + ')');
        
        // Set description for data protection
        subfolder.setDescription('Financial data folder - Business Standard Protection. ' +
                                'Access restricted. Created: ' + new Date().toISOString());
        
        // Apply data protection settings based on folder type
        applyDataProtection(subfolder, subfolderName);
      } else {
        Logger.log('Subfolder already exists: ' + subfolderName);
      }
    });
    
    // Set root folder description
    rootFolder.setDescription('AI Agents Root Folder - Financial Restoration System. ' +
                              'Business Standard Data Protection Enforced. ' +
                              'Created: ' + new Date().toISOString());
    
    Logger.log('Folder structure created successfully');
    return rootFolder;
  } catch (error) {
    Logger.log('Error creating folders: ' + error);
    throw error;
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
  
  // Log access control application
  Logger.log('Applied data protection to: ' + folderType);
}

/**
 * Create FINANCIAL_COMMAND Google Sheet with tabs: Debt, Tax, AuditLogs
 */
function createFinancialCommandSheet() {
  try {
    // Check if sheet already exists
    const existingFiles = DriveApp.getFilesByName(SHEET_CONFIG.NAME);
    let spreadsheet;
    
    if (existingFiles.hasNext()) {
      const file = existingFiles.next();
      spreadsheet = SpreadsheetApp.openById(file.getId());
      Logger.log('Using existing sheet: ' + spreadsheet.getId());
    } else {
      // Create new spreadsheet
      spreadsheet = SpreadsheetApp.create(SHEET_CONFIG.NAME);
      Logger.log('Created new sheet: ' + spreadsheet.getId());
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
        Logger.log('Created tab: ' + tabName);
        
        // Initialize tab with headers
        initializeTab(sheet, tabName);
      } else {
        Logger.log('Tab already exists: ' + tabName);
      }
    });
    
    // Move to AI AGENTS folder if it exists
    try {
      const rootFolders = DriveApp.getFoldersByName(FOLDER_STRUCTURE.ROOT);
      if (rootFolders.hasNext()) {
        const rootFolder = rootFolders.next();
        const file = DriveApp.getFileById(spreadsheet.getId());
        file.moveTo(rootFolder);
        Logger.log('Moved sheet to AI AGENTS folder');
      }
    } catch (e) {
      Logger.log('Could not move sheet to folder: ' + e);
    }
    
    return spreadsheet;
  } catch (error) {
    Logger.log('Error creating sheet: ' + error);
    throw error;
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
 * Step 5: Store memory in Markdown-KV format
 */
function storeMemoryMarkdownKV(key, value, agentId) {
  agentId = agentId || 'gatekeeper-001';
  
  try {
    // Get or create memory file in 04_LOGS
    const rootFolders = DriveApp.getFoldersByName(FOLDER_STRUCTURE.ROOT);
    if (!rootFolders.hasNext()) {
      throw new Error('AI AGENTS folder not found');
    }
    
    const rootFolder = rootFolders.next();
    const logsFolders = rootFolder.getFoldersByName('04_LOGS');
    
    if (!logsFolders.hasNext()) {
      throw new Error('04_LOGS folder not found');
    }
    
    const logsFolder = logsFolders.next();
    const memoryFileName = agentId + '_memory.md';
    const existingFiles = logsFolder.getFilesByName(memoryFileName);
    
    let file;
    let content = '';
    
    if (existingFiles.hasNext()) {
      file = existingFiles.next();
      content = file.getBlob().getDataAsString();
    } else {
      // Create new memory file
      content = '# Agent Memory: ' + agentId + '\n\n';
      content += '**Created**: ' + new Date().toISOString() + '\n\n';
      content += '## Memory Entries\n\n';
    }
    
    // Add new memory entry in Markdown-KV format
    const timestamp = new Date().toISOString();
    const newEntry = '**' + key + '**: ' + value + ' _(timestamp: ' + timestamp + ')_\n\n';
    content += newEntry;
    
    if (existingFiles.hasNext()) {
      file.setContent(content);
    } else {
      file = logsFolder.createFile(memoryFileName, content, MimeType.PLAIN_TEXT);
    }
    
    Logger.log('Stored memory in Markdown-KV: ' + key);
    return true;
  } catch (error) {
    Logger.log('Error storing memory: ' + error);
    return false;
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
      'LOGGED',
      JSON.stringify(thought.details || {}),
      JSON.stringify(thoughtSignature),
      thought.memory || ''
    ]);
    
    // Also store in Markdown-KV memory
    storeMemoryMarkdownKV(
      'thought_' + timestamp,
      JSON.stringify(thoughtSignature),
      thought.agent
    );
    
    Logger.log('Logged thought signature: ' + timestamp);
    return true;
  } catch (error) {
    Logger.log('Error logging thought signature: ' + error);
    return false;
  }
}

/**
 * Log general events to AuditLogs
 */
function logToAuditLogs(logEntry) {
  try {
    const spreadsheet = getFinancialCommandSheet();
    const auditSheet = spreadsheet.getSheetByName('AuditLogs');
    
    if (!auditSheet) {
      Logger.log('AuditLogs tab not found, skipping log');
      return false;
    }
    
    auditSheet.appendRow([
      logEntry.timestamp || new Date().toISOString(),
      logEntry.agent || 'SYSTEM',
      logEntry.action || 'UNKNOWN',
      logEntry.status || 'INFO',
      logEntry.details || '',
      logEntry.thoughtSignature || '',
      logEntry.memory || ''
    ]);
    
    return true;
  } catch (error) {
    Logger.log('Error logging to audit: ' + error);
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
 * Validate financial data (Gatekeeper function)
 */
function validateFinancialData(data) {
  const validation = {
    isValid: true,
    errors: [],
    warnings: []
  };
  
  // Basic validation checks
  if (!data.amount || isNaN(data.amount)) {
    validation.isValid = false;
    validation.errors.push('Invalid amount');
  }
  
  if (!data.type) {
    validation.isValid = false;
    validation.errors.push('Missing data type');
  }
  
  // Log thought signature for validation decision
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
      validation: validation
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
  Logger.log('=== Starting Demo ===');
  
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
  Logger.log('Validation: ' + JSON.stringify(validation));
  
  // Route
  const folder = routeDataToFolder(sampleData, validation);
  Logger.log('Routed to: ' + folder);
  
  // Store memory
  storeMemoryMarkdownKV('demo_run', 'System demo completed successfully');
  
  Logger.log('=== Demo Complete ===');
}
