const ignoredUsers = Array.from(document.querySelectorAll('#ignorelist li'))
  .map(li => li.id.match(/\d+/)[0]); // Extrae solo los números en el ID

chrome.storage.sync.set({ ignoredUsers }, () => {
  console.log('Lista de usuarios ignorados guardada:', ignoredUsers);
});

chrome.storage.sync.set({ ignoredUsers }, () => {
  console.log('Lista de usuarios ignorados guardada:', ignoredUsers);
});
