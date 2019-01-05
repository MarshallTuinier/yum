const express = require("express");
const router = express.Router();
const storeFunctions = require("./controllers/storeFunctions");
const userFunctions = require("./controllers/userFunctions");
const authFunctions = require("./controllers/authFunctions");
const reviewFunctions = require("./controllers/reviewFunctions");

router.get("/stores/:id", storeFunctions.findStore);
router.get("/stores", storeFunctions.findAllStores);
router.get("/store/:storeSlug", storeFunctions.getStoreBySlug);
router.get("/tags/:tag", storeFunctions.getStoresByTag);
router.get("/getUserData", authFunctions.checkToken, userFunctions.getUserData);
router.post(
  "/createStore",
  authFunctions.checkToken,
  storeFunctions.createStore
);
router.post(
  "/editStore/:id",
  authFunctions.checkToken,
  storeFunctions.confirmOwner,
  storeFunctions.editStore
);
router.post(
  "/uploadPhoto/:id",
  storeFunctions.upload,
  storeFunctions.resize,
  storeFunctions.addPhotoPathToDB
);
// Validate Registration data, register the user, then log the user in.
router.post(
  "/register",
  userFunctions.validateRegister,
  userFunctions.register
);

router.post("/updateUser", authFunctions.checkToken, userFunctions.updateUser);

router.post("/login", authFunctions.login);

router.post(
  "/reviews/:id",
  authFunctions.checkToken,
  reviewFunctions.addReview
);

router.get("/getTopStores", storeFunctions.getTopStores);

router.get("/api/v1/search", storeFunctions.searchStores);

router.get("/api/v1/stores/near", storeFunctions.mapStores);

router.post(
  "/api/v1/stores/:id/heart",
  authFunctions.checkToken,
  userFunctions.heartStore
);

module.exports = router;
