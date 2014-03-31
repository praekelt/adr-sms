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

        self.incr_kv = function(name) {
            return self.im.api_request('kv.incr', {key: name});
        };

        self.response_unmapped = function(pin){
            return 'MYNETA: Despite our best efforts, pincode ' + pin + ' is ' + 
                    'still not mapped to its right constituency in our database ' + 
                    'yet. We are working on that, in the mean time you can send ' + 
                    'constituency name instead of pincode.Visit www.myneta.info ' + 
                    'or call 1800-110-440 to get more details of candidates';
        };

        self.response_error = 'MYNETA: Please send a valid six digit pincode or ' + 
                    'constituency name.Visit www.myneta.info or call ' + 
                    '1800-110-440 to get more details of candidates';

        self.get_adr_content = function(pin){
            return self
                .http.get('http://www.myneta.info/sms.php',{
                    params: {
                        message: 'MYNETA ' + pin
                    }
                })
                .then(function(resp) {
                    // even errors return 200 and a string for the user
                    // which is double quoted by sandbox
                    var pin = resp.request.params.message.substring(7);
                    var metric = 'requests.clean';
                    if (resp.body == self.response_unmapped(pin)){
                        // unmapped
                        metric = 'requests.unmapped';
                    } else if (resp.body == self.response_error){
                        // unrecognised
                        metric = 'requests.error';
                    }
                    return self
                        .incr_kv(metric)
                        .then(function(result) {
                            return self.im.metrics.fire.last(metric,result.value);
                        }).then(function(){
                            return resp.body;
                        });
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
