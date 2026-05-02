const express = require("express");
const router = express.Router();

router.get("/notifications", (req, res) => {
    res.json([]);
});

module.exports = router;