Node Red Microsoft SQL Server Storage Plugin
============================================

This plugin allows you to store your flows and library entries in Microsoft SQL Server.  Thanks to adibenmati whose MongoDb storage plugin served as a template to create this one.

Getting Started
-----

For this one, you'll need a separate script to start your Node Red,
as per the guide for running a custom Node-Red inside your process:

http://nodered.org/docs/embedding.html

Firstly, require the module:

```bash
npm install --save node-red-mongo-contrib-mssql-storage-plugin
```

Then, in your settings, add:

```javascript
const storageModule = require('./node-red-mssql-storage-plugin');
const sqlConfig = {
  user: 'sa',
  password: 'myPassword',
  server: 'SQL01',
  database: 'NodeRed',
  encrypt: true
};

// Node-RED settings
const settings = {
  ...
  storageModule,
  storageModuleOptions: {
    sqlConfig,
    //optional
    //set the collection name that the module would be using
    tableNames:{
      flows: 'NodeRedFlows',
      sessions: 'NodeRedSessions',
      credentials: 'NodeRedCredentials',
      settings: 'NodeRedSettings',
      library: 'NodeRedLibrary'
    }
  },
  ...
};
```

Last, you will need to create the tables by running the CreateTables.sql file against your database.

TODO
-----
1. I do not have the library functions working completely yet - you can save library entires but I haven't figured out what I am missing to recall them.  PRs welcome!

Q&A
-----
Q. Why the heck did you break this out into separate tables when you are primarily just deleting and inserting a single row?
A. Good question :)  The reason I am doing it this way is because I am ultimately working on a structure here to allow flows to be broken up into pieces and secured by having multiple NodeRedFlows rows as a bit of a repository and use the admin API to overwrite the "working" version via a separate frontend.  More to come on that.