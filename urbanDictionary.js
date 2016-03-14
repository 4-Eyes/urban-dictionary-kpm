var request = require.safe('request');
var idiot = require.once('./idiot.json');
var i = 0;

//request.get('http://api.urbandictionary.com/v0/define?term=', (err, response, body)

exports.match = function(text, commandPrefix) {
    return text.startsWith(commandPrefix + "urban");
};

exports.help = function() {
    return [[this.commandPrefix + "urban {word}", "Searches Urban Dictionary for word"]];
};

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
    request.get('http://api.urbandictionary.com/v0/define?term=' + word, (err, response, body) => {
        body = JSON.parse(body);
        if (body.list == null || body.list.length === 0) {
            return idiotMessage(api, event);
        }
        api.sendMessage(word + ": " + body.list[0].definition, event.thread_id);
        api.sendMessage("Example: " + body.list[0].example, event.thread_id);
    });
};