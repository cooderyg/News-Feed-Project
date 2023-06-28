const express = require('express');
const router = express.Router();
const likesRouter = require("./likes.route");
const menusRouter = require("./menus.route");
const placeCategoriesRouter = require("./placeCategories.route");
const placesRouter = require("./places.route");
const reviewsRouter = require("./reviews.route");
const usersRouter = require("./users.route");
const reviewImagesRouter = require("./reviewImages.route");
const filesRouter = require("./files.route");

const defaultRoutes = [
  {
    path: '/likes',
    route: likesRouter,
  },
  {
    path: '/menus',
    route: menusRouter,
  },
  {
    path: '/placeCategories',
    route: placeCategoriesRouter,
  },
  {
    path: '/places',
    route: placesRouter,
  },
  {
    path: '/reviews',
    route: reviewsRouter,
  },
  {
    path: '/users',
    route: usersRouter,
  },
  {
    path: '/reviewImages',
    route: reviewImagesRouter,
  },
  {
    path: '/files',
    route: filesRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
