// generate unique Id which is used while add new user.
const uuid = () => 'xxxxxxxx-xxxx-xxx'.replace(/[x]/g, () => Math.random() * 15).toString(15);

export default uuid;
