const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.write("Hello User! Let's play the game.");
  res.end();
});

module.exports = router;
