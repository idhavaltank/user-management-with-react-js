const uuid = () => 'xxxxxxxx-xxxx-4xxx-xxxxxxxxxxxx'.replace(/[x]/g, () => Math.random() * 16).toString(16);

export default uuid;
