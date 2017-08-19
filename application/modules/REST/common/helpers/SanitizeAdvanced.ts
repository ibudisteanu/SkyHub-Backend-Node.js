var sanitizeHtml = require('sanitize-html');
//var tidy = require("tidy-html5").tidy_html5;
var tidy = require('htmltidy2').tidy;


module.exports = {

    cleanHTML_old(text){
        text = tidy(text, {"indent-spaces": 4});
        return text;
    },

    cleanHTML(text){
        tidy('<table><tr><td>badly formatted html</tr>', function(err, html) {
            text = html;
        });
        return text;
    },

    sanitizeAdvanced(text) {

        text = sanitizeHtml(text,
            {
                allowedTags: ['a','b','i','u','strong', 'h1','h2','h3','h4','h5','div','font','ul','li', 'br', 'span','div','em','iframe','img'],
                allowedAttributes: {
                    'a': [ 'href' ],
                    'img': ['class','src','width','height', 'style','width','height'],
                    'iframe': ['class','frameborder','allowfullscreen','src', 'style','alt','width','height'],
                    'font': ['class','style'],
                    'div': ['class','style'],
                    'em': ['class','style'],
                    'span': ['class','style'],
                }
            });

        return this.cleanHTML(text)
    },

    sanitizeAdvancedSimple(text) {
        text = sanitizeHtml(text,
            {
                allowedTags: ['a','b','i','u','strong','div','font','ul','li', 'br', 'span','div','em','iframe','img'],
                allowedAttributes: {
                    'a': [ 'href' ],
                    'img': ['class','src','width','height', 'style','width','height'],
                    'iframe': ['class','frameborder','allowfullscreen','src', 'style','alt','width','height'],
                    'font': ['class'],
                    'div': ['class'],
                    'em': ['class'],
                    'span': ['class'],
                }
            });

        return this.cleanHTML(text);
    },

    sanitizeAdvancedShortDescription(text, limit) {

        if (typeof limit === 'undefined') limit = 512;

        text = this.sanitizeAdvancedSimple(text);
        if (text.length > 512) text = text.substr(0, limit);
        text = this.sanitizeAdvancedSimple(text);

        return text;

    },
};
