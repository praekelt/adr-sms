go.app = function() {
    var vumigo = require('vumigo_v02');
    var App = vumigo.App;
    var EndState = vumigo.states.EndState;

    var GoApp = App.extend(function(self) {
        App.call(self, 'states:start');

        self.states.add('states:start', function(name) {
            return new EndState(name, {
                text: 'Message received',
                next: 'states:start'
            });
        });
    });

    return {
        GoApp: GoApp
    };
}();
