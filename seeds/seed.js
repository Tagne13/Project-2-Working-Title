const sequelize = require("../config/connection");
const { User, Review, Comment } = require("../models");
const userData = require("./userData.json");
const reviewData = require("./reviewData.json");
const commentData = require("./commentData.json");

const getRandomUserId = (users) => {
  const randomIndex = Math.floor(Math.random() * users.length);
  return users[randomIndex].id;
};

const getRandomReviewId = (reviews) => {
  const randomIndex = Math.floor(Math.random() * reviews.length);
  return reviews[randomIndex].id;
};

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  const reviews = await Review.bulkCreate(reviewData, {
    individualHooks: true,
    returning: true,
  });

  for (const review of reviews) {
    const randomUserId = getRandomUserId(users);

    await review.update({
      user_id: randomUserId,
    });
  }

  for (const comment of commentData) {
    const randomUserId = getRandomUserId(users);
    const randomReviewId = getRandomReviewId(reviews);

    await Comment.create({
      ...comment,
      user_id: randomUserId,
      review_id: randomReviewId,
    });
  }

  process.exit(0);
};

seedDatabase();
