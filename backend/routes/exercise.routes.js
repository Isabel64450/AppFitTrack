const express            = require('express');
const router             = express.Router();
const ExerciseController = require('../controllers/exercise.controller');
const authMiddleware     = require('../middleware/auth.middleware');


router.use(authMiddleware);

router.get('/:id', ExerciseController.getOne);    // GET /api/exercises/42
router.get('/',    ExerciseController.getAll);    // GET /api/exercises?category=Cardio
router.post('/',   ExerciseController.create);   // POST /api/exercises
router.put('/:id', ExerciseController.update);   // PUT /api/exercises/42
router.delete('/:id', ExerciseController.delete); // DELETE /api/exercises/42

module.exports = router;