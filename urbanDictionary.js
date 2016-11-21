var request = require('request');
var idiot = require.once('./idiot.json');
var i = 0;
var indexes = {};

var idiotMessage = function(api, event) {
    api.sendMessage("Unable to find a definition of that word. But this describes you: \nIdiot: " + idiot.list[i++ % idiot.list.length].definition, event.thread_id);
}

exports.run = function(api, event) {
    var array = event.body.split(" ");
    array.splice(0, 1);
    var word = array.join(" ");
    if (word.trim().length === 0) {
        return idiotMessage(api, event);
    }
    if (!indexes[word]) {
        indexes[word] = 0;
    }
    request.get('http://api.urbandictionary.com/v0/define?term=' + word, (err, response, body) => {
        body = JSON.parse(body);
        if (body.list == null || body.list.length === 0) {
            return idiotMessage(api, event);
        }
        api.sendMessage(word + ": " + body.list[indexes[word]++%body.list.length].definition, event.thread_id);
        api.sendMessage("Example: " + body.list[indexes[word]++ % body.list.length].example, event.thread_id);
    });
};