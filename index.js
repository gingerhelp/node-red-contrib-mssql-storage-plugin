/* eslint-disable no-restricted-syntax */
const constants = require('./constants');
const MssqlHandler = require('./MssqlHandler');

let settings;
let mssqlHandler;

const storageModule = {
  init(_settings) {
    settings = _settings;
    if (
      settings.storageModuleOptions == null ||
      settings.storageModuleOptions.sqlConfig == null
    ) {
      throw new Error(
        "SQL Server storage module's required parameters are not defined"
      );
    }

    this.tableNames = Object.assign(constants.DefaultTableNames);
    if (settings.storageModuleOptions.tableNames != null) {
      for (const settingsColName of Object.keys(
        settings.storageModuleOptions.tableNames
      )) {
        this.tableNames[settingsColName] =
          settings.storageModuleOptions.tableNames[settingsColName];
      }
    }

    this.collectionNames = Object.assign(constants.DefaultTableNames);
    if (settings.storageModuleOptions.collectionNames != null) {
      for (const settingsColName of Object.keys(
        settings.storageModuleOptions.collectionNames
      )) {
        this.collectionNames[settingsColName] =
          settings.storageModuleOptions.collectionNames[settingsColName];
      }
    }

    mssqlHandler = new MssqlHandler(settings.storageModuleOptions.sqlConfig);
    return mssqlHandler.connect();
  },

  getFlows() {
    return mssqlHandler.findAll(this.tableNames.flows);
  },

  saveFlows(flows) {
    return mssqlHandler.saveAll(this.tableNames.flows, flows);
  },

  getCredentials() {
    return mssqlHandler.findAll(this.tableNames.credentials);
  },

  saveCredentials(credentials) {
    return mssqlHandler.saveAll(this.tableNames.credentials, credentials);
  },

  getSettings() {
    return mssqlHandler.findAll(this.tableNames.settings);
  },
  saveSettings(s) {
    return mssqlHandler.saveAll(this.tableNames.settings, s);
  },
  getSessions() {
    return mssqlHandler.findAll(this.tableNames.sessions);
  },
  saveSessions(sessions) {
    return mssqlHandler.saveAll(this.tableNames.sessions, sessions);
  },

  getLibraryEntry(type, path) {
    return mssqlHandler.findLibraryEntry(this.tableNames.library, type, path);
  },

  saveLibraryEntry(type, path, meta, body) {
    return mssqlHandler.saveLibraryEntry(
      this.tableNames.library,
      type,
      path,
      meta,
      body
    );
  }
};

module.exports = storageModule;
