(function (document, window) {

	function getRandomInt (min, max) {
		return Math.floor (Math.random () * (max - min + 1) + min);
	}

	function Dyslexia (options) {
		var options = options || {};
		this.domNodeSelector = options.selector || options.domNodeSelector || '.dyslexia';
		this.delay = options.delay || 2000;
		this.textNodes = [];
	}

	Dyslexia.prototype.initialize = function initialize () {
		this.textNodes = this.getTextNodes ();
		window.setInterval (this.scrambleTexts.bind (this), this.delay);
	};

	Dyslexia.prototype.getTextNodes = function getTextNodes () {
		var nodes = document.querySelectorAll (this.domNodeSelector);
		var queue = Array.prototype.concat.apply ([], nodes);
		var texts = [];

		while ( queue.length > 0 ) {
			var node = queue.pop ();

			if ( node.nodeName === '#text' ) {
				texts.push (node);
				continue;
			}

			for ( var i = 0; i < node.childNodes.length; i++ ) {
				queue.push (node.childNodes[i]);
			}
		}

		return texts;
	};

	Dyslexia.prototype.scrambleTexts = function scrambleTexts () {
		var newNodes = this.textNodes
			.map (function (node) { return node.textContent; })
			.map (this.scrambleWords.bind (this))
			.map (function (words) { return document.createTextNode (words); });

		for ( var i = 0; i < newNodes.length; i++ ) {
			var currentNode = this.textNodes[i];
			var newNode = newNodes[i];
			currentNode.parentNode.replaceChild (newNode, currentNode);
		}

		this.textNodes = newNodes;
	}

	Dyslexia.prototype.scrambleWords = function scrambleWords (sentence) {
		var words = sentence.split (/\b/);
		return words.map (this.scrambleWord.bind (this)).join ('');
	};

	Dyslexia.prototype.scrambleWord = function scrambleWord (word) {
		if ( ! word || word.length < 4 ) { return word; }
		if ( ! word.match (/(\w|\d)+/) ) { return word; }

		var chars = word.split ('');
		var a = getRandomInt(1, chars.length - 3);
		var b = getRandomInt(1, chars.length - 3);

		var c = chars[a];
		chars[a] = chars[b];
		chars[b] = c;

		return chars.join ('');
	};

	window.Dyslexia = window.Dyslexia || Dyslexia;

} (document, window));
