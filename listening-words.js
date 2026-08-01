(() => {
  const additions = [
    ["bleach", "漂白剂；漂白，使褪色"],
    ["impulse", "一时冲动；冲动的念头"],
    ["frosted tips", "浅色挑染的发梢", true],
    ["scalp", "头皮"],
    ["hairline", "发际线"],
    ["irritate", "刺激，使不适；使烦躁"],
    ["wax", "蜡；用蜡脱毛"],
    ["stiff", "僵硬的；不柔软的；（衣料）挺括的"],
    ["tone", "语气；色调；风格基调"],
    ["salon", "美容院；美发沙龙"],
    ["haul", "一次大量购入的物品；拖、拉"],
    ["literally", "确实地；简直（用于强调）"],
    ["Pilates", "普拉提"],
    ["upcoming", "即将发生的；即将到来的"],
    ["layer up", "多穿几层衣服保暖", true],
    ["fluffy", "蓬松柔软的；毛茸茸的"],
    ["sweater", "毛衣"],
    ["cozy", "温暖舒适的；惬意的"],
    ["chill", "放松；寒意；清凉的"],
    ["diary", "日记；日程本"],
    ["gloomy", "阴沉的；令人压抑的"],
    ["element", "要素；因素；元素"],
    ["routine", "固定步骤；日常惯例"],
    ["introvert", "内向的人"],
    ["diminish", "减少；削弱；贬低"],
    ["whereas", "然而；但是（用于对比）"],
    ["all that aside", "撇开这些不谈", true],
    ["head out", "出门；离开", true],
    ["outfit", "一套服装；穿搭"],
    ["repetitive", "重复乏味的；反复的"],
    ["pay off", "取得回报；还清", true],
    ["pitter-pattering", "（雨滴或小脚步）发出轻快的滴答声", true],
    ["worthy", "值得的；配得上的"],
    ["crumble", "碎裂；崩塌；逐渐瓦解"],
    ["narration", "叙述；旁白"],
    ["sort of like", "有点像；大致类似", true],
    ["screw", "螺丝；拧紧；搞砸"],
    ["intentional", "有意的；刻意安排的"],
    ["embed", "嵌入；使深深植入"],
    ["affirmation", "肯定语；确认；支持"],
    ["dress up", "盛装打扮；装扮", true],
    ["black top", "黑色上衣", true],
    ["brand", "品牌；商标"],
    ["tailor", "裁缝；量身定制"],
    ["waist", "腰部；腰围"],
    ["fill up", "装满；加满", true],
    ["tank tops", "无袖背心", true],
    ["compact", "小巧紧凑的；粉盒"],
    ["hose", "软管；长筒袜"],
    ["adorable", "可爱的；讨人喜欢的"],
    ["tripod legs", "三脚架的支腿", true],
    ["camp", "营地；露营"],
    ["apprehension", "担忧；忧虑"],
    ["gorgeous", "极其漂亮的；华丽的"],
    ["windy", "多风的"],
    ["concern", "担忧；关切的问题"],
    ["fingers crossed", "祈愿好运；希望一切顺利", true],
  ];

  const list = document.querySelector('.word-list');
  if (!list) return;
  const existing = new Set([...list.querySelectorAll('.word-row')]
    .map(row => row.querySelector('.w').childNodes[0].textContent.trim().toLowerCase()));
  additions.forEach(([word, meaning, phrase]) => {
    if (existing.has(word.toLowerCase())) return;
    const row = document.createElement('div');
    row.className = 'word-row';
    if (phrase) row.dataset.phrase = 'true';
    const wordLine = document.createElement('div');
    wordLine.className = 'w';
    wordLine.textContent = word;
    const meaningLine = document.createElement('div');
    meaningLine.className = 'm';
    meaningLine.textContent = meaning;
    row.append(wordLine, meaningLine);
    list.appendChild(row);
  });
})();

