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
            describe("entering a valid PIN", function() {
                it("should acknowledge and register them", function() {
                    return tester
                        .setup.user.addr('+27123')
                        .start()
                        .input({
                            content:'141002',
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
                            reply: ["MYNETA:candidates details.You can visit our website ", 
                                    "www.myneta.info for full details of candidates or call ",
                                    "toll free 1800-110-440 to get them on phone"]
                                    .join('')
                        })
                        .check(function(api) {
                            var contact = api.contacts.store[0];
                            assert.equal(contact.extra.circle, 'of life');
                            assert.equal(contact.extra.registration_source, 'sms');
                            assert.equal(contact.extra.source_addr, '10010');
                            assert.equal(contact.extra.pin, '141002');
                        })
                        .run();
                });
            });
            describe("entering an invalid PIN", function() {
                it("should acknowledge error and register them", function() {
                    return tester
                        .setup.user.addr('+27123')
                        .start()
                        .input({
                            content:'14100',
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
                            reply: ["MYNETA: Please send a valid six digit pincode or ", 
                                    "constituency name.Visit www.myneta.info or call ",
                                    "1800-110-440 to get more details of candidates"]
                                    .join('')
                        })
                        .check(function(api) {
                            var contact = api.contacts.store[0];
                            assert.equal(contact.extra.circle, 'of life');
                            assert.equal(contact.extra.registration_source, 'sms');
                            assert.equal(contact.extra.source_addr, '10010');
                            assert.equal(contact.extra.pin, '14100');
                        })
                        .run();
                });
            });
            describe("entering an unmapped PIN", function() {
                it("should acknowledge issue and register them", function() {
                    return tester
                        .setup.user.addr('+27123')
                        .setup.char_limit(300)
                        .start()
                        .input({
                            content:'149099',
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
                            reply: ["MYNETA: Despite our best efforts, pincode 149099 is ",
                                    "still not mapped to its right constituency in our database ",
                                    "yet. We are working on that, in the mean time you can send ",
                                    "constituency name instead of pincode.Visit www.myneta.info ",
                                    "or call 1800-110-440 to get more details of candidates"]
                                    .join('')
                        })
                        .check(function(api) {
                            var contact = api.contacts.store[0];
                            assert.equal(contact.extra.circle, 'of life');
                            assert.equal(contact.extra.registration_source, 'sms');
                            assert.equal(contact.extra.source_addr, '10010');
                            assert.equal(contact.extra.pin, '149099');
                        })
                        .run();
                });
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
                        content:'141002',
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
                        reply: ["MYNETA:candidates details.You can visit our website ", 
                                "www.myneta.info for full details of candidates or call ",
                                "toll free 1800-110-440 to get them on phone"]
                                .join('')
                    })
                    .check(function(api) {
                        var contact = api.contacts.store[0];
                        assert.equal(contact.extra.circle, 'of life');
                        assert.equal(contact.extra.registration_source, 'upload');
                        assert.equal(contact.extra.source_addr, undefined);
                        assert.equal(contact.extra.pin, '141002');
                    })
                    .run();
            });
        });

    });
});
