module.exports = function() {
    return [{
        "request": {
            "method": "GET",
            "url": "http://www.myneta.info/sms.php",
            "params": {
                "message": "MYNETA 141002"
            }
        },
        "response": {
            "code": 200,
            "data": 'MYNETA:candidates details.You can visit our website ' + 
                    'www.myneta.info for full details of candidates or call ' +
                    'toll free 1800-110-440 to get them on phone'
        }
    },
    {
        "request": {
            "method": "GET",
            "url": "http://www.myneta.info/sms.php",
            "params": {
                "message": "MYNETA 14100"
            }
        },
        "response": {
            "code": 200,
            "data": 'MYNETA: Please send a valid six digit pincode or ' + 
                    'constituency name.Visit www.myneta.info or call ' + 
                    '1800-110-440 to get more details of candidates'
        }
    },
    {
        "request": {
            "method": "GET",
            "url": "http://www.myneta.info/sms.php",
            "params": {
                "message": "MYNETA 149099"
            }
        },
        "response": {
            "code": 200,
            "data": 'MYNETA: Despite our best efforts, pincode 149099 is ' + 
                    'still not mapped to its right constituency in our database ' + 
                    'yet. We are working on that, in the mean time you can send ' + 
                    'constituency name instead of pincode.Visit www.myneta.info ' + 
                    'or call 1800-110-440 to get more details of candidates' 
                    
        }
    }];
};
