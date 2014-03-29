var go = {};
go;

go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var EndState = vumigo.states.EndState;
    var HttpApi = vumigo.http.api.HttpApi;

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');

        self.init = function() {
            self.http = new HttpApi(self.im);
            // Fetch the contact from the contact store that matches the current
            // user's address. When we get the contact, we put the contact on the
            // app so we can reference it easily when creating each state.
            return self.im
                .contacts.for_user()
                .then(function(user_contact) {
                    self.contact = user_contact;
                });
        };

        self.get_adr_content = function(pin){
            return self
                .http.get('http://www.myneta.info/sms.php',{
                    params: {
                        message: 'MYNETA%20' + pin
                    }
                })
                .then(function(resp) {
                    // even errors return 200 and a string for the user
                    // which is double quoted by sandbox
                    trimmed = resp.body.substring(1, resp.body.length-1);
                    return trimmed;
                });
        };

        self.states.add('states:start', function(name) {
            return new EndState(name, {
                text: self.get_adr_content(self.im.msg.content),
                next: 'states:start',
                events: {
                    'state:enter': function() {
                        // Extract and save the key info
                        self.contact.extra.pin = self.im.msg.content; // zipcode of user
                        self.contact.extra.circle = self.im.msg.transport_metadata.netcore.circle;
                        if (self.contact.extra.registration_source === undefined){
                            // New contact via sms or ivr
                            self.contact.extra.registration_source = self.im.msg.transport_metadata.netcore.source;
                            // number they dialed to initiate 
                            self.contact.extra.source_addr = self.im.msg.to_addr; 
                        }
                        msisdn = self.im.msg.from_addr;
                        return self.im.contacts.save(self.contact);
                    }
                }
            });
        });
    });

    return {
        GoApp: GoApp
    };
}();

go.init = function() {
    var vumigo = require('vumigo_v02');
    var InteractionMachine = vumigo.InteractionMachine;
    var GoApp = go.app.GoApp;


    return {
        im: new InteractionMachine(api, new GoApp())
    };
}();
