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
	
	// 저장된 이미지 초기화
	for (let imgInfo of generatedImages) {
		// 생성 당시와 현재의 배경 이미지 영역 비율 계산
		let scaleX = imgBounds.width / imgInfo.originalImgBounds.width;
		let scaleY = imgBounds.height / imgInfo.originalImgBounds.height;
		let averageScale = (scaleX + scaleY) / 2; // 평균 스케일 사용
		
		// 배경 이미지 기준 상대 위치 계산
		let relativeX = (imgInfo.x - imgInfo.originalImgBounds.x) / imgInfo.originalImgBounds.width;
		let relativeY = (imgInfo.y - imgInfo.originalImgBounds.y) / imgInfo.originalImgBounds.height;
		
		// 현재 배경 이미지 영역에서의 새로운 절대 위치 계산
		let newX = imgBounds.x + (relativeX * imgBounds.width);
		let newY = imgBounds.y + (relativeY * imgBounds.height);
		
		// 크기도 화면 비율에 맞게 조정
		let newSize = imgInfo.size * averageScale;
		
		imageMode(CENTER);
		image(imgInfo.img, newX, newY, newSize, newSize);
		imageMode(CORNER);
	}
	
	// 알파벳 체크리스트 표시
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
	text(baseText, 30, textY); // 화면 왼쪽에서 30px 떨어진 위치
	
	// textWidth를 올바른 폰트로 계산하기 위해 폰트를 다시 설정
	textFont('evalfey-variable');
	textSize(30);
	let baseTextWidth = textWidth(baseText);
	
	// 현재 단어를 "Your Summer Is" 옆에 표시
	if (showEnglishMessage) {
		// 영어가 아닌 문자 입력 시 안내 메시지
		fill(255, 0, 0); // 빨간색
		noStroke(); // 테두리 제거
		textFont('Pretendard-Regular'); // 일반 텍스트는 Pretendard 사용
		textSize(25);
		
		let wordsX = 30 + baseTextWidth;
		text("English only", wordsX, textY);
	} else if (typedWords.length > 0) {
		// 가장 최근 단어 표시
		fill(0, 0, 255); // HTML 기본 파란색
		noStroke(); // 테두리 제거
		textFont('Pretendard-Regular'); // 일반 텍스트는 Pretendard 사용
		textSize(25);
		
		let currentWord = typedWords[typedWords.length - 1]; // 가장 최근 단어만
		let wordsX = 30 + baseTextWidth;
		
		// 단어가 화면을 넘어가는지 확인
		if (wordsX + textWidth(currentWord) <= availableWidth + 30) {
			text(currentWord, wordsX, textY);
		}
	}
	
	// 각 알파벳을 2단으로 표시 (두 번째 줄부터, 왼쪽 정렬, 위에 2vh 여백 추가)
	textAlign(LEFT);
	textFont('Pretendard-Regular'); // 알파벳 리스트는 Pretendard 사용
	textSize(22);
	
	let vhMargin = windowHeight * 0.02; // 2vh 계산
	let currentY = textY + 35 + vhMargin; // 두 번째 줄 시작 위치에 2vh 추가
	let lineHeight = 28; // 줄 간격
	
	// 2단 레이아웃 계산 (고정 여백 사용)
	let totalContentWidth = availableWidth - 60; // 좌우 여백 제외
	let columnWidth = (totalContentWidth - fixedColumnGap) / 2; // 고정 여백을 제외한 열 너비
	
	let alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	let itemsPerColumn = Math.ceil(alphabets.length / 2); // 한 열당 13개
	
	// 알파벳 리스트를 감싸는 둥근 회색 네모 그리기
	let rectX = 20; // 왼쪽 여백 10px 줄임
	let rectY = currentY - 20; // 텍스트 시작점보다 20px 위
	let rectWidth = availableWidth - 20; // 전체 너비에서 좌우 여백 제외
	let rectHeight = (itemsPerColumn * lineHeight) + 40; // 모든 텍스트 높이 + 위아래 여백
	
	fill(230); // 배경 회색(220)보다 밝은 회색
	noStroke();
	rect(rectX, rectY, rectWidth, rectHeight, 15.12); // 4mm = 15.12px (96dpi 기준)
	
	// 2단 레이아웃을 네모 안에서 중앙 정렬하기 위한 계산
	let contentWidth = (minColumnWidth * 2) + fixedColumnGap; // 실제 콘텐츠 너비
	let startX = rectX + (rectWidth - contentWidth) / 2; // 네모 안에서 중앙 정렬된 시작 위치
	
	// 세로 중앙 정렬을 위한 계산
	let contentHeight = itemsPerColumn * lineHeight; // 실제 콘텐츠 높이
	let startY = rectY + (rectHeight - contentHeight) / 2 + 15; // 네모 안에서 세로 중앙 정렬 + 약간의 조정
	
	// 2단 가운데에 동글동글한 점선 그리기
	let lineX = startX + minColumnWidth + (fixedColumnGap / 2); // 두 열 사이의 중앙
	let lineStartY = startY - 20 - 10 + 15; // 기존 위치에서 아래로 15px 이동
	let lineEndY = startY + contentHeight - 15 - 20 + 15; // 끝점도 아래로 15px 이동
	
	// 동글동글한 점들로 점선 만들기
	fill(180); // 점선 색상 (회색)
	noStroke();
	let dotSpacing = 10; // 점 간격
	let dotSize = 3; // 점 크기
	
	for (let y = lineStartY; y <= lineEndY; y += dotSpacing) {
		circle(lineX, y, dotSize);
	}
	
	for (let i = 0; i < alphabets.length; i++) {
		let letter = alphabets[i];
		let word = alphabetWords[letter];
		
		// 2단 레이아웃 계산
		let column = Math.floor(i / itemsPerColumn); // 0 또는 1
		let row = i % itemsPerColumn; // 각 열에서의 행 위치
		
		let currentX = startX + (column * (minColumnWidth + fixedColumnGap));
		let displayY = startY + (row * lineHeight);
		
		// 해당 알파벳이 입력되었는지 확인
		if (typedKeys.includes(letter)) {
			// 입력된 경우: A ir conditioner 형태로 표시 (첫 글자 제거)
			fill(100); // 진한 회색
			let wordWithoutFirstLetter = word.substring(1); // 첫 글자 제거
			text(letter + wordWithoutFirstLetter, currentX, displayY);
		} else {
			// 입력되지 않은 경우: A만 표시
			fill(0); // 검은색
			text(letter, currentX, displayY);
		}
	}
}

// 윈도우 크기 변경시 캔버스 크기도 조정
function windowResized() {
	resizeCanvas(windowWidth * 0.98, windowHeight * 0.98);
	
	// 중심점과 범위 재계산
	centerX = width / 2;
	centerY = height / 2;
	rangeX = width * 0.3;
	rangeY = height * 0.3;
	
	// 배경 이미지 다시 그리기
	drawBackground();
}

// 배경 이미지를 원래 비율로 그리는 함수
function drawBackground() {
	// 먼저 밝은 회색 배경으로 채우기
	background(230);
	
	if (bgImage) {
		// 이미지 비율 계산
		let imgRatio = bgImage.width / bgImage.height;
		let screenRatio = width / height;
		
		let drawWidth, drawHeight;
		
		// 화면에 맞게 크기 조정 (비율 유지) - 90% 크기로 축소
		if (imgRatio > screenRatio) {
			// 이미지가 더 가로로 길 때 - 너비를 화면에 맞춤
			drawWidth = width * 0.9;
			drawHeight = (width * 0.9) / imgRatio;
		} else {
			// 이미지가 더 세로로 길거나 비율이 같을 때 - 높이를 화면에 맞춤
			drawHeight = height * 0.9;
			drawWidth = (height * 0.9) * imgRatio;
		}
		
		// 중앙에 배치
		let imgX = (width - drawWidth) / 2;
		let imgY = (height - drawHeight) / 2;
		
		// 이미지 영역 정보 저장 (이미지 생성 범위용)
		imgBounds = {
			x: imgX,
			y: imgY,
			width: drawWidth,
			height: drawHeight
		};
		
		image(bgImage, imgX, imgY, drawWidth, drawHeight);
	}
}