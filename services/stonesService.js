const stonesModel = require("./../models/Stones");

const getAllStones = () => stonesModel.find();

const getStone = (id) => stonesModel.findById(id);

const getLastStones = () =>
  stonesModel.find().sort({ createdAt: -1 }).limit(3);

const createStone = async (data) => stonesModel.create(data);

const updateStone = (id, data) =>
  stonesModel.findByIdAndUpdate(id, data, { runValidators: true });

const deleteStone = (id) => stonesModel.findByIdAndDelete(id);

const likeStone = async (userId, stoneId) => {
  const stone = await getStone(stoneId).populate("likedList");

  if (stone.likedList.some(user => user._id == userId)) {
    throw new Error("User has already liked this!");
  }

  if (stone.owner == userId) {
    throw new Error("Owner can not like this!");
  }

  stone.likedList.push(userId);

  await stone.save();
}

const searchStones = async (name) => {
  let stones = stonesModel.find();

  if (name !== undefined && name !== "") {
    stones = stones.find({ name: new RegExp(name, "i") });
  }

  return stones.lean();
}

module.exports = {
  getAllStones,
  getStone,
  getLastStones,
  createStone,
  updateStone,
  deleteStone,
  likeStone,
  searchStones
};
