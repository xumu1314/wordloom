
(() => {
  document.querySelector('.nav a[href="../tv/"]')?.remove();
  const list = document.querySelector('.word-list');
  if (!list) return;

  const extraIpa = {
    bleach: '/bliːtʃ/', impulse: '/ˈɪmpʌls/', scalp: '/skælp/', hairline: '/ˈheəlaɪn/',
    irritate: '/ˈɪrɪteɪt/', wax: '/wæks/', stiff: '/stɪf/', tone: '/təʊn/', salon: '/ˈsælɒn/',
    haul: '/hɔːl/', literally: '/ˈlɪtərəli/', Pilates: '/pɪˈlɑːtiːz/', upcoming: '/ˈʌpkʌmɪŋ/',
    fluffy: '/ˈflʌfi/', sweater: '/ˈswetə/', cozy: '/ˈkəʊzi/', chill: '/tʃɪl/', diary: '/ˈdaɪəri/',
    gloomy: '/ˈɡluːmi/', element: '/ˈelɪmənt/', routine: '/ruːˈtiːn/', introvert: '/ˈɪntrəvɜːt/',
    diminish: '/dɪˈmɪnɪʃ/', whereas: '/ˌweərˈæz/', outfit: '/ˈaʊtfɪt/', repetitive: '/rɪˈpetətɪv/',
    worthy: '/ˈwɜːði/', crumble: '/ˈkrʌmbəl/', narration: '/nəˈreɪʃən/', screw: '/skruː/',
    intentional: '/ɪnˈtenʃənəl/', embed: '/ɪmˈbed/', affirmation: '/ˌæfəˈmeɪʃən/', brand: '/brænd/',
    tailor: '/ˈteɪlə/', waist: '/weɪst/', compact: '/kəmˈpækt/', hose: '/həʊz/',
    adorable: '/əˈdɔːrəbəl/', camp: '/kæmp/', apprehension: '/ˌæprɪˈhenʃən/',
    gorgeous: '/ˈɡɔːdʒəs/', windy: '/ˈwɪndi/', concern: '/kənˈsɜːn/',
  };

  const addBritishSpeaker = (wordLine, word) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'sound';
    button.setAttribute('aria-label', `英音朗读 ${word}`);
    button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10v4h4l5 4V6L8 10H4z"></path><path d="M16 9.5a4 4 0 0 1 0 5"></path></svg>';
    button.addEventListener('click', () => {
      if (!window.speechSynthesis) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(word);
      utterance.lang = 'en-GB';
      utterance.rate = .85;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    });
    wordLine.appendChild(button);
  };

  list.querySelectorAll('.word-row .w').forEach(wordLine => {
    const word = wordLine.childNodes[0].textContent.trim();
    const isPhrase = word.includes(' ') || wordLine.closest('.word-row').dataset.phrase === 'true';
    if (isPhrase) {
      wordLine.querySelector('.ipa')?.remove();
      wordLine.querySelector('.sound')?.remove();
    } else if (!wordLine.querySelector('.ipa') && extraIpa[word]) {
      const ipa = document.createElement('span');
      ipa.className = 'ipa';
      ipa.textContent = extraIpa[word];
      wordLine.insertBefore(ipa, wordLine.querySelector('.sound'));
    }
    if (!isPhrase && !wordLine.querySelector('.sound')) addBritishSpeaker(wordLine, word);
  });

  const library = location.pathname.split('/').filter(Boolean).at(-1);
  const counts = {};
  const updatedAt = {};
  const useLocalProgress = location.hostname.endsWith('.github.io');
  const localProgressKey = `wordloom-progress:${library}`;
  if (useLocalProgress) {
    try {
      const saved = JSON.parse(localStorage.getItem(localProgressKey) || '{}');
      Object.assign(counts, saved.counts || {});
      Object.assign(updatedAt, saved.updatedAt || {});
    } catch (_) {}
  }
  const saveLocalProgress = () => {
    if (!useLocalProgress) return;
    localStorage.setItem(localProgressKey, JSON.stringify({ counts, updatedAt }));
  };
  const wordOf = row => row.querySelector('.w').childNodes[0].textContent.trim();
  const sortByCount = newestRow => {
    [...list.querySelectorAll('.word-row')]
      .sort((first, second) => {
        const countDifference = (counts[wordOf(first)] || 0) - (counts[wordOf(second)] || 0);
        if (countDifference) return countDifference;
        if (first === newestRow) return 1;
        if (second === newestRow) return -1;
        return (updatedAt[wordOf(first)] || 0) - (updatedAt[wordOf(second)] || 0);
      })
      .forEach(row => list.appendChild(row));
  };

  const updateRow = row => {
    const word = wordOf(row);
    row.querySelector('.known-count').textContent = counts[word] || 0;
  };

  const saveAction = async (row, action) => {
    const word = wordOf(row);
    const button = row.querySelector('.known-button');
    button.disabled = true;
    const finishAction = () => {
      updateRow(row);
      sortByCount(row);
      if (action === 'done') {
        button.textContent = 'UNDO';
        button.classList.add('undo');
        clearTimeout(button.undoTimer);
        button.undoTimer = setTimeout(() => {
          button.textContent = 'DONE';
          button.classList.remove('undo');
        }, 6000);
      } else {
        button.textContent = 'DONE';
        button.classList.remove('undo');
      }
    };
    try {
      if (useLocalProgress) {
        counts[word] = action === 'done' ? (counts[word] || 0) + 1 : Math.max(0, (counts[word] || 0) - 1);
        updatedAt[word] = Date.now();
        saveLocalProgress();
        finishAction();
        return;
      }
      const response = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ library, word, action }),
      });
      const data = await response.json();
      if (!response.ok || !data.record) throw new Error('save failed');
      counts[word] = data.record.done_count;
      updatedAt[word] = data.record.updated_at;
      finishAction();
    } catch (_) {
      button.textContent = '重试';
    } finally {
      button.disabled = false;
    }
  };

  [...list.querySelectorAll('.word-row')].forEach(row => {
    const word = wordOf(row);
    const meaning = row.querySelector('.m');
    let blurTimer;
    meaning.setAttribute('role', 'button');
    meaning.setAttribute('tabindex', '0');
    meaning.setAttribute('aria-label', `${word} 的释义，点击显示十秒`);
    const revealMeaning = () => {
      clearTimeout(blurTimer);
      meaning.classList.add('revealed');
      blurTimer = setTimeout(() => meaning.classList.remove('revealed'), 10000);
    };
    meaning.addEventListener('click', revealMeaning);
    meaning.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') revealMeaning();
    });

    const count = document.createElement('span');
    count.className = 'known-count';
    count.textContent = '0';
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'known-button';
    button.textContent = 'DONE';
    button.addEventListener('click', () => saveAction(row, button.classList.contains('undo') ? 'undo' : 'done'));
    row.append(count, button);
  });

  if (useLocalProgress) {
    list.querySelectorAll('.word-row').forEach(updateRow);
    sortByCount();
  } else {
    fetch(`/api/progress?library=${encodeURIComponent(library)}`)
      .then(response => response.ok ? response.json() : Promise.reject())
      .then(data => {
        data.records.forEach(record => {
          counts[record.word] = record.done_count;
          updatedAt[record.word] = record.updated_at;
        });
        list.querySelectorAll('.word-row').forEach(updateRow);
        sortByCount();
      })
      .catch(() => {});
  }
})();
