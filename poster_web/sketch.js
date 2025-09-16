// Abstract typewriter

let txt = 'hello';
let size = 40;
let c;
let drawText = false;
let centerX, centerY;
let rangeX, rangeY;
let bgImage;
let imgBounds = {};
let generatedImages = [];
let typedKeys = [];
let typedWords = [];
let showEnglishMessage = false;

// 알파벳 객체
let alphabetImages = {};

// 알파벳별 단어 매핑
let alphabetWords = {
	'A': 'Air conditioner',
	'B': 'Beach', 
	'C': 'Cicada',
	'D': 'Diving',
	'E': 'Eel',
	'F': 'Flip-flops',
	'G': 'Gelato',
	'H': 'Hat',
	'I': 'Ice cream',
	'J': 'Juice',
	'K': 'Kayak',
	'L': 'Lifeguard',
	'M': 'Mosquito',
	'N': 'Net',
	'O': 'Ocean',
	'P': 'Popsicle',
	'Q': 'Quokka',
	'R': 'Rash guard',
	'S': 'Sunglasses',
	'T': 'Towel',
	'U': 'Umbrella',
	'V': 'Volleyball',
	'W': 'Watermelon',
	'X': 'Xylitol gum',
	'Y': 'Yakult',
	'Z': 'Zucchini'
};

function preload() {
	// 배경 이미지
	bgImage = loadImage('source/background.png');
	
	// A~Z, a~z
	for (let i = 0; i < 26; i++) {
		let letter = String.fromCharCode(65 + i);
		alphabetImages[letter] = loadImage(`source/alphabet/${letter}.png`);
		alphabetImages[letter.toLowerCase()] = alphabetImages[letter];
	}
}

function setup() {
	createCanvas(windowWidth, windowHeight);
	c = color(0);
	
	// Pretendard
	textFont('Pretendard-Regular');
	
	typedKeys = [];
	typedWords = [];
	generatedImages = [];
	showEnglishMessage = false;
	
	centerX = width / 2;
	centerY = height / 2;
	
	// 랜덤 생성 범위
	rangeX = width * 0.3;
	rangeY = height * 0.3;
	
	drawBackground();
}

function draw() {
	drawBackground();
	
	for (let imgInfo of generatedImages) {
		let scaleX = imgBounds.width / imgInfo.originalImgBounds.width;
		let scaleY = imgBounds.height / imgInfo.originalImgBounds.height;
		let averageScale = (scaleX + scaleY) / 2;
		
		let relativeX = (imgInfo.x - imgInfo.originalImgBounds.x) / imgInfo.originalImgBounds.width;
		let relativeY = (imgInfo.y - imgInfo.originalImgBounds.y) / imgInfo.originalImgBounds.height;
		
		let newX = imgBounds.x + (relativeX * imgBounds.width);
		let newY = imgBounds.y + (relativeY * imgBounds.height);
		
		let newSize = imgInfo.size * averageScale;
		
		imageMode(CENTER);
		image(imgInfo.img, newX, newY, newSize, newSize);
		imageMode(CORNER);
	}
	
	drawAlphabetChecklist();
}

function keyTyped() {
	if (keyCode == ENTER || keyCode == SHIFT ||
			keyCode == CONTROL || keyCode == ALT ||
		 	keyCode == OPTION || key == "Meta") {

	} else {
		let ascii = key.charCodeAt(0);
		print(ascii);
		
		if ((ascii >= 97 && ascii <= 122) || (ascii >= 65 && ascii <= 90)) {
			let upperKey = key.toUpperCase();
			typedKeys.push(upperKey);
			if (alphabetWords[upperKey]) {
				typedWords.push(alphabetWords[upperKey]);
			}
			
			showEnglishMessage = false;
			
			// 이미지 생성 로직
			if (alphabetImages[key]) {
				let baseSize = Math.min(imgBounds.width, imgBounds.height) * 0.5;
				size = random(baseSize * 0.8, baseSize * 1.2);
				
				let halfSize = size / 2;
				
				let marginX = 20 + halfSize;
				let marginY = 90 + halfSize;
				let marginBottom = 50 + halfSize;
				
				let randomX = random(imgBounds.x + marginX, imgBounds.x + imgBounds.width - marginX);
				let randomY = random(imgBounds.y + marginY, imgBounds.y + imgBounds.height - marginBottom);
				
				generatedImages.push({
					img: alphabetImages[key],
					x: randomX,
					y: randomY,
					size: size,
					originalImgBounds: {
						x: imgBounds.x,
						y: imgBounds.y,
						width: imgBounds.width,
						height: imgBounds.height
					},
					key: key
				});
			}
		} else {
			showEnglishMessage = true;
		}
	}

	print(key);
}

function keyPressed() {
	if (keyCode === BACKSPACE) {
		if (generatedImages.length > 0) {
			generatedImages.pop();
			typedKeys.pop();
			typedWords.pop();
			showEnglishMessage = false;
		}
	}
}

function drawAlphabetChecklist() {
	let leftX = imgBounds.x - 30;
	let textY = imgBounds.y + 50;
	let availableWidth = leftX - 30;
	
	let fixedColumnGap = 40;
	let minColumnWidth = 150;
	let minRequiredWidth = (minColumnWidth * 2) + fixedColumnGap + 60;
	
	if (availableWidth < minRequiredWidth) {
		return;
	}
	
	fill(0);
	noStroke();
	textAlign(LEFT);
	textFont('evalfey-variable');
	textSize(30);
	
	let baseText = "Your Summer Is: ";
	text(baseText, 30, textY);
	
	textFont('evalfey-variable');
	textSize(30);
	let baseTextWidth = textWidth(baseText);
	
	if (showEnglishMessage) {
		fill(255, 0, 0);
		noStroke();
		textFont('Pretendard-Regular');
		textSize(25);
		
		let wordsX = 30 + baseTextWidth;
		text("English only", wordsX, textY);
	} else if (typedWords.length > 0) {
		fill(0, 0, 255);
		noStroke();
		textFont('Pretendard-Regular');
		textSize(25);
		
		let currentWord = typedWords[typedWords.length - 1];
		let wordsX = 30 + baseTextWidth;
		
		if (wordsX + textWidth(currentWord) <= availableWidth + 30) {
			text(currentWord, wordsX, textY);
		}
	}
	
	textAlign(LEFT);
	textFont('Pretendard-Regular');
	textSize(22);
	
	let vhMargin = windowHeight * 0.02;
	let currentY = textY + 35 + vhMargin;
	let lineHeight = 28;

	let totalContentWidth = availableWidth - 60;
	let columnWidth = (totalContentWidth - fixedColumnGap) / 2;
	
	let alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	let itemsPerColumn = Math.ceil(alphabets.length / 2);

	let rectX = 20;
	let rectY = currentY - 20;
	let rectWidth = availableWidth - 20;
	let rectHeight = (itemsPerColumn * lineHeight) + 40;
	
	fill(230);
	noStroke();
	rect(rectX, rectY, rectWidth, rectHeight, 15.12);
	
	let contentWidth = (minColumnWidth * 2) + fixedColumnGap;
	let startX = rectX + (rectWidth - contentWidth) / 2;

	let contentHeight = itemsPerColumn * lineHeight;
	let startY = rectY + (rectHeight - contentHeight) / 2 + 15;

	let lineX = startX + minColumnWidth + (fixedColumnGap / 2);
	let lineStartY = startY - 20 - 10 + 15;
	let lineEndY = startY + contentHeight - 15 - 20 + 15;
	
	// 점선
	fill(180);
	noStroke();
	let dotSpacing = 10;
	let dotSize = 3;
	
	for (let y = lineStartY; y <= lineEndY; y += dotSpacing) {
		circle(lineX, y, dotSize);
	}
	
	for (let i = 0; i < alphabets.length; i++) {
		let letter = alphabets[i];
		let word = alphabetWords[letter];
		
		// 2단 레이아웃
		let column = Math.floor(i / itemsPerColumn);
		let row = i % itemsPerColumn;
		
		let currentX = startX + (column * (minColumnWidth + fixedColumnGap));
		let displayY = startY + (row * lineHeight);
		
		if (typedKeys.includes(letter)) {
			fill(100);
			let wordWithoutFirstLetter = word.substring(1);
			text(letter + wordWithoutFirstLetter, currentX, displayY);
		} else {
			fill(0);
			text(letter, currentX, displayY);
		}
	}
}

function windowResized() {
	resizeCanvas(windowWidth * 0.98, windowHeight * 0.98);

	centerX = width / 2;
	centerY = height / 2;
	rangeX = width * 0.3;
	rangeY = height * 0.3;

	drawBackground();
}

function drawBackground() {
	background(230);
	
	if (bgImage) {
		// 이미지 비율 계산
		let imgRatio = bgImage.width / bgImage.height;
		let screenRatio = width / height;
		
		let drawWidth, drawHeight;
		
		// 화면에 맞게 크기 조정
		if (imgRatio > screenRatio) {
			drawWidth = width * 0.9;
			drawHeight = (width * 0.9) / imgRatio;
		} else {
			drawHeight = height * 0.9;
			drawWidth = (height * 0.9) * imgRatio;
		}
		
		let imgX = (width - drawWidth) / 2;
		let imgY = (height - drawHeight) / 2;
		
		imgBounds = {
			x: imgX,
			y: imgY,
			width: drawWidth,
			height: drawHeight
		};
		
		image(bgImage, imgX, imgY, drawWidth, drawHeight);
	}
}
