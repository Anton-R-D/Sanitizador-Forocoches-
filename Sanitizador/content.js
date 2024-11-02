chrome.storage.sync.get({ ignoredUsers: [] }, (data) => {
  const ignoredUserIds = data.ignoredUsers;
  const hiddenThreads = [];

  const userSpans = document.querySelectorAll("span[onclick^=\"window.open('member.php?u=\"]");

  userSpans.forEach(span => {
    const onclickValue = span.getAttribute('onclick');
    const userId = onclickValue.match(/u=(\d+)/)[1];
    const authorName = span.textContent.trim();

    if (ignoredUserIds.includes(userId)) {
      const trElement = span.closest('tr');
      const threadLinkElement = trElement.querySelector('a[id^="thread_title_"]');
      const threadTitle = threadLinkElement.textContent.trim();
      const threadLink = threadLinkElement.href;

      if (trElement) {
        trElement.style.display = 'none';
        hiddenThreads.push({ title: threadTitle, author: authorName, link: threadLink });
      }
    }
  });

  chrome.storage.sync.set({ hiddenThreads }, () => {
    console.log('Hilos ocultos guardados:', hiddenThreads);

    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.bottom = '10px';
    popup.style.right = '10px';
    popup.style.width = '250px';
    popup.style.maxHeight = '300px';
    popup.style.overflowY = 'auto';
    popup.style.backgroundColor = '#f8d7da';
    popup.style.color = '#721c24';
    popup.style.padding = '10px';
    popup.style.borderRadius = '5px';
    popup.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    popup.style.zIndex = '1000';
    popup.style.borderRadius = '10px';

    const popupHeader = document.createElement('div');
    popupHeader.style.display = 'flex';
    popupHeader.style.justifyContent = 'space-between';
    popupHeader.style.alignItems = 'center';
    
    const popupTitle = document.createElement('strong');
    popupTitle.textContent = `Hilos Ocultos (${hiddenThreads.length})`;
    
    const minimizeButton = document.createElement('button');
    minimizeButton.style.background = 'none';
    minimizeButton.style.border = 'none';
    minimizeButton.style.cursor = 'pointer';
    minimizeButton.style.fontSize = '16px';
    minimizeButton.style.lineHeight = '1';

    const threadList = document.createElement('ul');
    threadList.style.listStyleType = 'none';
    threadList.style.padding = '0';
    threadList.style.margin = '10px 0';

    hiddenThreads.forEach(thread => {
      const listItem = document.createElement('li');
      listItem.style.marginBottom = '5px';
      listItem.innerHTML = `<strong>${thread.author}:</strong> <a href="${thread.link}" target="_blank">${thread.title}</a>`;
      threadList.appendChild(listItem);
    });

    popupHeader.appendChild(popupTitle);
    popupHeader.appendChild(minimizeButton);
    popup.appendChild(popupHeader);
    popup.appendChild(threadList);
    document.body.appendChild(popup);

    chrome.storage.sync.get({ isMinimized: true }, (state) => {
      threadList.style.display = state.isMinimized ? 'none' : 'block';
      popupTitle.textContent = `Hilos Ocultos (${hiddenThreads.length})`;
      minimizeButton.textContent = state.isMinimized ? '\u2719' : '\u2500';

      minimizeButton.addEventListener('click', () => {
        chrome.storage.sync.get('isMinimized', (data) => {
          const newState = !data.isMinimized;
          chrome.storage.sync.set({ isMinimized: newState }, () => {
            threadList.style.display = newState ? 'none' : 'block';
            minimizeButton.textContent = newState ? '\u2719' : '\u2500';
          });
        });
      });
    });
  });
});
