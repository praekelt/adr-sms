var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;
var assert = require('assert');


describe("app", function() {
    describe("GoApp", function() {
        var app;
        var tester;

        beforeEach(function() {
            app = new go.app.GoApp();

            tester = new AppTester(app);

            tester
                .setup.config.app({
                    name: 'test_app',
                    delivery_class: 'sms',
                })
                .setup(function(api) {
                    fixtures().forEach(api.http.fixtures.add);
                });
                
        });

        describe("when they have not been pre-registered",function() {
            it("should acknowledge and register them", function() {
                return tester
                    .setup.user.addr('+27123')
                    .start()
                    .input({
                        content:'11111',
                        to_addr: '10010',
                        transport_metadata: {
                            'netcore': {
                                'circle': "of life",
                                'source': "sms",
                            }
                        }
                    })
                    .check.interaction({
                        state: 'states:start',
                        reply: 'Message received'
                    })
                    .check(function(api) {
                        var contact = api.contacts.store[0];
                        assert.equal(contact.extra.circle, 'of life');
                        assert.equal(contact.extra.registration_source, 'sms');
                        assert.equal(contact.extra.source_addr, '10010');
                        assert.equal(contact.extra.pin, '11111');
                    })
                    .run();
            });
        });

        describe("when they have been pre-registered",function() {
            it("should acknowledge and only update them", function() {
                return tester
                    .setup(function(api) {
                        api.contacts.add( {
                            msisdn: '+27333',
                            extra : {
                                registration_source: 'upload'
                            }
                        });
                    })
                    .setup.user.addr('+27333')
                    .start()
                    .input({
                        content:'11111',
                        to_addr: '10010',
                        transport_metadata: {
                            'netcore': {
                                'circle': "of life",
                                'source': "sms",
                            }
                        }
                    })
                    .check.interaction({
                        state: 'states:start',
                        reply: 'Message received'
                    })
                    .check(function(api) {
                        var contact = api.contacts.store[0];
                        assert.equal(contact.extra.circle, 'of life');
                        assert.equal(contact.extra.registration_source, 'upload');
                        assert.equal(contact.extra.source_addr, undefined);
                        assert.equal(contact.extra.pin, '11111');
                    })
                    .run();
            });
        });

    });
});
