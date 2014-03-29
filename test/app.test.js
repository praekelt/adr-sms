var vumigo = require('vumigo_v02');
var fixtures = require('./fixtures');
var AppTester = vumigo.AppTester;


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
                })
                .setup(function(api) {
                    api.contacts.add( {
                        msisdn: '+271234',
                        extra : {
                            is_registered: 'true',
                            registration_source: 'upload'
                        }
                    });
                });
        });

        describe("when the user starts a session", function() {
            it("should acknowlede", function() {
                return tester
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
                    .run();
            });
        });

    });
});
