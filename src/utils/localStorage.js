let storageName = '';
const createStorage = (storage) => {
  if (!localStorage.getItem(storage)) {
    localStorage.setItem(storage, '[]');
  }
  storageName = storage || 'userList';
};

const getData = () => {
  const data = localStorage.getItem(storageName);
  return data ? JSON.parse(data) : [];
};

const storeData = (user) => {
  const storageObj = JSON.parse(localStorage.getItem(storageName));
  if (storageObj.length === null) {
    localStorage.setItem(storageName, JSON.stringify(user));
  } else {
    const position = storageObj.findIndex((e) => e?.userId === user?.userId);
    if (position > -1) {
      storageObj.splice(position, 1, user);
    } else {
      storageObj.push(user);
    }
  }
  localStorage.setItem(storageName, JSON.stringify(storageObj));
};

const deleteById = (userId) => {
  const storageObj = JSON.parse(localStorage.getItem(storageName));
  const index = storageObj.findIndex((e) => e.userId === userId);
  storageObj.splice(index, 1);
  localStorage.setItem(storageName, JSON.stringify(storageObj));
};

export { createStorage, getData, storeData, deleteById };
