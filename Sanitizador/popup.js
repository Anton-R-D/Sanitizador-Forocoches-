function initializePopup() {
  chrome.storage.sync.get({ hiddenThreads: [], isMinimized: true }, (data) => {
    const hiddenThreads = data.hiddenThreads;
    const hiddenThreadsList = document.getElementById('hidden-threads-list');
    const totalHiddenCount = document.getElementById('total-hidden-count');
    const minimizeButton = document.getElementById('minimize-button');
    const isMinimized = data.isMinimized;

    hiddenThreadsList.innerHTML = '';

    if (hiddenThreads.length === 0) {
      hiddenThreadsList.innerHTML = '<li>No se ocultaron hilos.</li>';
    } else {
      hiddenThreads.forEach(thread => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `<strong>${thread.author}:</strong> <a href="${thread.link}" target="_blank">${thread.title}</a>`;
        hiddenThreadsList.appendChild(listItem);
      });
    }

    totalHiddenCount.textContent = `Hilos Ocultos (${hiddenThreads.length})`;

    if (isMinimized) {
      hiddenThreadsList.style.display = 'none';
      totalHiddenCount.style.display = 'block';
      minimizeButton.textContent = '\u2719';
    } else {
      hiddenThreadsList.style.display = 'block';
      totalHiddenCount.style.display = 'none';
      minimizeButton.textContent = '\u2500';
    }
  });
}

function toggleMinimize() {
  chrome.storage.sync.get('isMinimized', (data) => {
    const newState = !data.isMinimized;

    chrome.storage.sync.set({ isMinimized: newState }, () => {
      initializePopup();
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initializePopup();

  document.getElementById('minimize-button').addEventListener('click', toggleMinimize);
});
