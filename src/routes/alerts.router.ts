
import express from "express";

const router = express.Router();
/*
### [ ] Reads
- `GET /alerts` — active alerts for the logged-in user's devices
*/
router.get("/", (req, res) => {
  // Active alerts retrieval logic here
});

export default router;
