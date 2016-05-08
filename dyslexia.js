$(document).ready(function(){
	initMessUpLoop(100);
})

function getTextNodesIn(element) {
	return $(element).find(":not(iframe,script)").addBack().contents().filter(function() {
		return this.nodeType == 3;
	});
};
function isLetter(char) {
	return /^[\d]$/.test(char);
}

var textNodes = getTextNodesIn($("*"));
function getWordsInTextNode(textNode){
	var words = [];
	var regex = /\w+/g;
	var match;
	while ((match = regex.exec(textNode.nodeValue)) != null){
		var word = match[0];
		var position = match.index;
		words.push({
			word: word,
			length: word.length,
			position: position
		});
	}
	return words;
}

function messUpWords (textNodes) {
	for (var i = 0; i < textNodes.length; i++) {
		var node = textNodes[i];
		var wordsInTextNodes = getWordsInTextNode(node);
		for (var j = 0; j < wordsInTextNodes.length; j++) {
			var wordInfo = wordsInTextNodes[j];
			// Only change a tenth of the words each round.
			if (Math.random() > 2/10) {
				continue;
			}
			var position = wordInfo.position;
			var length = wordInfo.length;
			var word = wordInfo.word;
			var messedUpWord = messUpWord(word);
			var before = node.nodeValue.slice(0, position);
			var after  = node.nodeValue.slice(position + length);
			node.nodeValue = before + messedUpWord + after;
		};
	};
}

function messUpWord (word) {
	if (word.length < 3) {
		return word;
	}
	return word[0] + messUpMessyPart(word.slice(1, -1)) + word[word.length - 1];
}

function messUpMessyPart (messyPart) {
	if (messyPart.length < 2) {
		return messyPart;
	}
	var a, b;
	while (!(a < b)) {
		a = getRandomInt(0, messyPart.length - 1);
		b = getRandomInt(0, messyPart.length - 1);
	}
	return swapLetters(messyPart, a, b);
}

String.prototype.replaceAt=function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

function swapLetters(string, a, b){
	var temp = string[a];
	string = string.replaceAt(a, string[b]);
	string = string.replaceAt(b, temp);
	return string;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}
//setInterval(messUpWords, 50);

function initMessUpLoop(delay){
	var textNodes = getTextNodesIn($("body"));
	setInterval(function(){messUpWords(textNodes)}, delay);
}