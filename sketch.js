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
	
	// 이미지 초기화
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
		// 특수키는 무시
		
	} else {
		let ascii = key.charCodeAt(0);
		print(ascii);
		
		// 영어 알파벳
		if ((ascii >= 97 && ascii <= 122) || (ascii >= 65 && ascii <= 90)) {
			let upperKey = key.toUpperCase();
			typedKeys.push(upperKey);
			if (alphabetWords[upperKey]) {
				typedWords.push(alphabetWords[upperKey]);
			}
			
			showEnglishMessage = false;
			
			// 이미지 생성 로직을 직접 여기서 실행
			if (alphabetImages[key]) {
				// 이미지 크기를 화면 크기에 비례하여 설정 (배경 이미지 크기 기준)
				let baseSize = Math.min(imgBounds.width, imgBounds.height) * 0.5; // 배경 이미지의 50% 크기를 기본으로
				size = random(baseSize * 0.8, baseSize * 1.2); // 기본 크기의 80~120% 사이로 랜덤
				
				// 이미지의 절반 크기 (중심점에서 가장자리까지의 거리)
				let halfSize = size / 2;
				
				// 범위 설정 - 위쪽과 아래쪽 여백을 각각 30px씩 더 늘려서 범위 축소
				let marginX = 20 + halfSize; // 좌우 여백 (기존과 동일)
				let marginY = 90 + halfSize; // 위쪽 여백을 기존 80에서 90으로 변경 (+10px 추가)
				let marginBottom = 50 + halfSize; // 아래쪽 여백을 새로 설정 (+30px)
				
				// 랜덤 위치는 이미지의 중심점 좌표 (위쪽과 아래쪽 범위 모두 축소)
				let randomX = random(imgBounds.x + marginX, imgBounds.x + imgBounds.width - marginX);
				let randomY = random(imgBounds.y + marginY, imgBounds.y + imgBounds.height - marginBottom); // 아래쪽도 별도 여백 적용
				
				// 이미지 정보를 배열에 저장 (생성 당시의 배경 이미지 영역 정보도 함께 저장)
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
			// 영어가 아닌 문자가 입력되면 안내 메시지 표시
			showEnglishMessage = true;
		}
	}

	print(key);
}

// 백스페이스 처리를 위한 별도 함수
function keyPressed() {
	if (keyCode === BACKSPACE) {
		// 백스페이스를 누르면 가장 최근에 생성된 이미지 삭제
		if (generatedImages.length > 0) {
			generatedImages.pop();
			typedKeys.pop(); // 타이핑된 키도 함께 삭제
			typedWords.pop(); // 타이핑된 단어도 함께 삭제
			// 영어 안내 메시지도 숨기기
			showEnglishMessage = false;
		}
	}
}

// 알파벳 체크리스트를 오른쪽에 표시하는 함수
function drawAlphabetChecklist() {
	// 배경 이미지 왼쪽 옆에 텍스트 표시 (왼쪽 정렬)
	let leftX = imgBounds.x - 30; // 배경 이미지 왼쪽 - 30px 여백
	let textY = imgBounds.y + 50; // 배경 이미지 상단에서 조금 아래
	let availableWidth = leftX - 30; // 왼쪽 여백까지의 사용 가능한 너비
	
	// 필요한 최소 너비 계산 (2단 + 고정 여백 고려)
	let fixedColumnGap = 40; // 2단 사이의 고정 여백
	let minColumnWidth = 150; // 각 열의 최소 너비
	let minRequiredWidth = (minColumnWidth * 2) + fixedColumnGap + 60; // 총 필요한 최소 너비
	
	// 사용 가능한 공간이 충분한지 확인
	if (availableWidth < minRequiredWidth) {
		return; // 공간이 부족하면 체크리스트를 그리지 않음
	}
	
	// YOUR SUMMER IS: 부분과 현재 단어 표시
	fill(0); // 검은색
	noStroke(); // 테두리 제거
	textAlign(LEFT);
	textFont('evalfey-variable'); // Evalfey Variable 폰트 적용
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
	
	// 알파벳 컨테이너
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
	
	//점선
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
		
		let column = Math.floor(i / itemsPerColumn);
		let row = i % itemsPerColumn;
		
		let currentX = startX + (column * (minColumnWidth + fixedColumnGap));
		let displayY = startY + (row * lineHeight);
		
		// 알파벳 입력 확인
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

// 이미지 함수
function drawBackground() {
	background(230);
	
	if (bgImage) {
		// 이미지 비율
		let imgRatio = bgImage.width / bgImage.height;
		let screenRatio = width / height;
		
		let drawWidth, drawHeight;
		
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