var assert = require('chai').assert;
var expect = require('chai').expect;
require('chai').should();


var iChatClient = require('../client/c');
var client;

describe('iChatClient', function(){
  before(function() {
    // runs before all tests in this block
	  client = new iChatClient({
			url : 'http://127.0.0.1:4567/faye',
	  	timeout : 120,
			retry		: 5
		});
		
		client.send('foo',{
			text:'msg'
		},function(){
			 // alert('Message received by server!');
		},function(error){
			alert('There was a problem: ' + error.message);
		});
		
		
  })
  after(function(){
    // runs after all tests in this block
  })
  beforeEach(function(){
    // runs before each test in this block
  })
  afterEach(function(){
    // runs after each test in this block
  })

  describe('#save()', function(){
    it('should return sang_test2 when user save', function(){
			
			client.join('foo', function(message) {
				// handle message
				assert.equal('msg', message.text);
			
			});
		
		
    })
  })
})