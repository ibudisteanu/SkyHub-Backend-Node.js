var sanitizeHtml = require('sanitize-html');

module.exports = {

    sanitizeAdvanced(text) {
        return sanitizeHtml(text,
            {
                allowedTags: ['a','b','i','u','strong', 'h1','h2','h3','h4','h5','div','font','ul','li', 'br', 'span','p','div','em','iframe','img'],
                allowedAttributes: {
                    'a': [ 'href' ],
                    'img': ['class','src','width','height', 'style','width','height'],
                    'iframe': ['class','frameborder','allowfullscreen','src', 'style','alt','width','height'],
                    'font': ['class','style'],
                    'div': ['class','style'],
                    'p': ['class','style'],
                    'em': ['class','style'],
                    'span': ['class','style'],
                }
            })
    },

    sanitizeAdvancedSimple(text) {
        return sanitizeHtml(text,
            {
                allowedTags: ['a','b','i','u','strong','div','font','ul','li', 'br', 'span','p','div','em','iframe','img'],
                allowedAttributes: {
                    'a': [ 'href' ],
                    'img': ['class','src','width','height', 'style','width','height'],
                    'iframe': ['class','frameborder','allowfullscreen','src', 'style','alt','width','height'],
                    'font': ['class'],
                    'div': ['class'],
                    'p': ['class'],
                    'em': ['class'],
                    'span': ['class'],
                }
            })
    },

    sanitizeAdvancedShortDescription(text, limit) {

        if (typeof limit === 'undefined') limit = 512;

        text = this.sanitizeAdvancedSimple(text);
        if (text.length > 512) text = text.substr(0, limit);
        text = this.sanitizeAdvancedSimple(text);

        return text;

    },
};
