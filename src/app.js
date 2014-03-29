go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var EndState = vumigo.states.EndState;

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');

        self.init = function() {
            // Fetch the contact from the contact store that matches the current
            // user's address. When we get the contact, we put the contact on the
            // app so we can reference it easily when creating each state.
            return self.im
                .contacts.for_user()
                .then(function(user_contact) {
                    self.contact = user_contact;
                });
        };

        self.states.add('states:start', function(name) {
            
            return new EndState(name, {
                text: 'Message received',
                next: 'states:start',
                events: {
                    'state:enter': function() {
                        // Extract the key info
                        self.contact.extra.pin = self.im.msg.content; // zipcode of user
                        self.contact.extra.circle = self.im.msg.transport_metadata.netcore.circle;
                        // number they dialed to initiate 
                        self.contact.extra.source_addr = self.im.msg.to_addr; 
                        // sms or ivr
                        self.contact.extra.source_sys = self.im.msg.transport_metadata.netcore.source; 
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
