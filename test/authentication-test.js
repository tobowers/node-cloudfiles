/*
 * authentication-test.js: Tests for rackspace cloudfiles authentication
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..', 'lib'));
 
var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    helpers = require('./helpers'),
    cloudfiles = require('cloudfiles');
    
var client = helpers.createClient();
    
vows.describe('node-cloudfiles/authentication').addBatch({
  "The node-cloudfiles client": {
    "with a valid username and api key": {
      topic: function () {
        client.setAuth(this.callback);
      },
      "should respond with 204 and appropriate headers": function (err, res) {
        assert.equal(res.statusCode, 204); 
        assert.isObject(res.headers);
        assert.include(res.headers, 'x-server-management-url');
        assert.include(res.headers, 'x-storage-url');
        assert.include(res.headers, 'x-cdn-management-url');
        assert.include(res.headers, 'x-auth-token');
      },
      "should update the config with appropriate urls": function (err, res) {
        assert.equal(res.headers['x-server-management-url'], client.config.serverUrl);
        assert.equal(res.headers['x-storage-url'], client.config.storageUrl);
        assert.equal(res.headers['x-cdn-management-url'], client.config.cdnUrl);
        assert.equal(res.headers['x-auth-token'], client.config.authToken);
      }
    },
    "with an invalid username and api key": {
      topic: function () {
        var invalidClient = cloudfiles.createClient({ 
          auth: {
            username: 'invalid-username', 
            apiKey: 'invalid-apikey'
          }
        });
        
        invalidClient.setAuth(this.callback);
      },
      "should respond with 401": function (err, res) {
        assert.equal(res.statusCode, 401);
      }
    }
  }
}).export(module);