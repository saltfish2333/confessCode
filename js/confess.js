// 状态变量（对应小程序data）
const state = {
    showCodeGarden: false,
    isShaking: false,
    hearts: [],
    goodBtnScale: 1,
    badBtnScale: 1,
    goodBtnVisible: true,
    badBtnVisible: true,
    showFireworks: false,
    fireworks: [],
    badClickCount: 0,
    currentImageIndex: 0,
    currentConfessTextIndex: 0,
    showEmojiRain: false,
    emojiItems: [],
    // 图片数组（需替换为实际图片路径）
    images: [
        'images/confess1.jpg', 'images/confess2.jpg', 'images/confess3.jpg',
        'images/confess4.jpg', 'images/confess5.jpg', 'images/confess6.jpg',
        'images/confess7.jpg', 'images/confess8.jpg', 'images/confess0.jpg'
    ],
    // 表白文本数组
    confessTexts: [
        "可以做我女朋友吗？", "再考虑一下？🥹", "不许选这个！😡", "点错了？",
        "你真忍心拒绝我吗", "你再这样我找别的男人了😤", "再给你一次机会", "最后一次机会哦~😎"
    ]
};

function preloadImages() {
    state.images.forEach(src => {
        const img = new Image();
        img.src = src; // 浏览器会自动缓存该图片
    });
}


// DOM元素
const elements = {
    bgImage: document.getElementById('bgImage'),
    confessText: document.getElementById('confessText'),
    goodBtn: document.getElementById('goodBtn'),
    badBtn: document.getElementById('badBtn'),
    heartContainer: document.getElementById('heartContainer'),
    fireworksContainer: document.getElementById('fireworksContainer'),
    emojiRainContainer: document.getElementById('emojiRainContainer')
};

function setState(newState) {
    Object.assign(state, newState); // 合并新状态
    updateButtons(); // 同步更新按钮UI
}

function updateButtons() {
    // 控制显示/隐藏（优先级最高）
    elements.goodBtn.style.display = state.goodBtnVisible ? 'inline-block' : 'none';
    elements.badBtn.style.display = state.badBtnVisible ? 'inline-block' : 'none';

    // 控制缩放（仅在显示时生效）
    if (state.goodBtnVisible) {
        elements.goodBtn.style.transform = `scale(${state.goodBtnScale})`;
    }
    if (state.badBtnVisible) {
        elements.badBtn.style.transform = `scale(${state.badBtnScale})`;
    }
}

// 初始化
function init() {
    preloadImages(); // 关键：提前加载所有图片
    preloadCodeGardenResources(); // 新增：预加载目标页资源
    // 设置初始图片和文本
    updateBackground();
    updateConfessText();
    updateButtons(); // 初始化按钮状态
    // 绑定事件
    elements.goodBtn.addEventListener('click', onGoodTap);
    elements.badBtn.addEventListener('click', onBadTap);
}
// 新增：预加载code_garden.html资源
function preloadCodeGardenResources() {
    const resources = [
        'css/default.css',
        'css/mobile.css',
        'js/jquery.js',
        'js/garden.js',
        'js/functions.js',
        'fonts/digital.ttf'
    ];

    resources.forEach(url => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = url;
        link.as = url.endsWith('.css') ? 'style' : url.endsWith('.js') ? 'script' : 'font';
        document.head.appendChild(link);
    });
}
// 更新背景图片
function updateBackground() {
    const targetSrc = state.images[state.currentImageIndex];
    const img = new Image();

    img.onload = function() {
        // 图片加载完成后，再设置到DOM（避免空白）
        elements.bgImage.src = targetSrc;
        // 触发淡入过渡（利用CSS的opacity）
        elements.bgImage.style.opacity = 1;
    };

    img.onerror = function() {
        console.error(`图片加载失败：${targetSrc}`);
    };

    // 先隐藏旧图（触发淡出）
    elements.bgImage.style.opacity = 0;
    // 开始加载新图
    img.src = targetSrc;
}

// 更新表白文本
function updateConfessText() {
    elements.confessText.textContent = state.confessTexts[state.currentConfessTextIndex];
}

// 「好」按钮点击（核心：跳转至原index.html）
function onGoodTap() {
    // 1. 播放动画效果
    showFireworks();
    showEmojiRain();

    state.currentImageIndex = 8;
    updateBackground(); // 触发图片更新（淡入淡出效果）
    elements.confessText.textContent = "嘿嘿，爱你哦！❤️";
    // 2. 更新按钮状态（隐藏不好按钮，放大好按钮）
    // state.goodBtnVisible = false;
    // state.badBtnVisible = false;
    setState({
        goodBtnVisible: false,  // 隐藏好按钮
        badBtnVisible: false,   // 关键：隐藏不好按钮（核心修复）
        // goodBtnScale: 20,        // 好按钮放大（视觉上“填满屏幕”）
        showCodeGarden: true     // 标记切换到代码花园（可选）
    });
    // elements.badBtn.style.transform = `scale(${state.badBtnScale})`;
    // elements.goodBtn.style.transform = `scale(${state.goodBtnScale})`;

    // 3. 延迟1秒后跳转至原代码花园页面（用户提供的第一个index.html）
    setTimeout(() => {
        window.location.href = 'code_garden.html'; // 跳转到原Web表白页
    }, 1000);
}

// 「不好」按钮点击
function onBadTap() {
    // 1. 更新点击计数和文本索引
    state.badClickCount++;
    state.currentConfessTextIndex = (state.currentConfessTextIndex + 1) % state.confessTexts.length;
    state.currentImageIndex = (state.currentImageIndex + 1) % (state.images.length - 1);

    // 2. 触发爱心动画
    triggerHeartAnimation();

    // 3. 更新按钮状态（缩放、隐藏逻辑）
    if (state.badClickCount < 8) {
        state.badBtnScale = 1 - (state.badClickCount * 0.1);
        state.goodBtnScale = 1 + (state.badClickCount * 0.15);
    } else {
        // state.badBtnVisible = false;
        setState({
            badBtnVisible: false,  // 关键：隐藏不好按钮（核心修复）
            goodBtnScale: 20        // 好按钮放大
        });
        // state.goodBtnScale = 20;
        state.currentImageIndex = 8;
        elements.confessText.textContent = "xxxx";
    }
    elements.badBtn.style.transform = `scale(${state.badBtnScale})`;
    elements.goodBtn.style.transform = `scale(${state.goodBtnScale})`;

    // 4. 更新UI
    updateBackground();
    updateConfessText();
}

// 触发爱心动画（从好按钮位置飞出）
function triggerHeartAnimation() {
    const goodBtnRect = elements.goodBtn.getBoundingClientRect();
    const centerX = goodBtnRect.left + goodBtnRect.width / 2;
    const centerY = goodBtnRect.top + goodBtnRect.height / 2;

    // 生成12个爱心
    for (let i = 0; i < 12; i++) {
        const heart = document.createElement('span');
        heart.className = 'heart-animation';
        heart.textContent = '❤️';
        heart.style.left = `${centerX + (Math.random() * 80 - 40)}px`;
        heart.style.top = `${centerY + (Math.random() * 40 - 20)}px`;
        heart.style.animationDelay = `${i * 0.08}s`;

        elements.heartContainer.appendChild(heart);

        // 动画结束后移除元素
        setTimeout(() => heart.remove(), 1200);
    }
}

// 显示烟花特效
function showFireworks() {
    const container = elements.fireworksContainer;
    container.innerHTML = '';

    // 生成80个烟花粒子
    for (let i = 0; i < 80; i++) {
        const firework = document.createElement('div');
        firework.className = 'firework';
        firework.style.left = `${Math.random() * window.innerWidth}px`;
        firework.style.top = `${Math.random() * window.innerHeight}px`;
        firework.style.width = `${Math.random() * 20 + 5}px`;
        firework.style.height = firework.style.width;

        container.appendChild(firework);
    }

    // 2秒后隐藏
    setTimeout(() => container.innerHTML = '', 500);
}

// 显示表情雨（爱心泡泡）
function showEmojiRain() {
    const container = elements.emojiRainContainer;
    container.innerHTML = '';

    // 生成50个爱心泡泡
    for (let i = 0; i < 50; i++) {
        const emoji = document.createElement('div');
        emoji.className = 'emoji-item';
        emoji.textContent = '❤️';
        emoji.style.left = `${Math.random() * window.innerWidth}px`;
        emoji.style.top = `${Math.random() * window.innerHeight}px`;
        emoji.style.animationDelay = `${Math.random() * 1}s`;
        emoji.style.fontSize = `${Math.random() * 20 + 15}px`;

        container.appendChild(emoji);
    }

    // 2秒后隐藏
    setTimeout(() => container.innerHTML = '', 500);
}

// 启动应用
init();