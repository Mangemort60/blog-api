const User = require('../models/userSchema');

const userController = {
  register: async (req, res) => {
    try {
      const newUser = req.body;
      const createdUser = await User.create(newUser);
      res
        .status(201)
        .json({ message: 'user a bien été crée', data: createdUser });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const userToDelete = req.params.id;
      const deletedUser = await User.findOneAndDelete(userToDelete);
      if (!deletedUser) {
        return res.status(404).json({ message: "le post n'a pas été trouvé" });
      }
      res
        .status(201)
        .json({ message: 'user a bien été supprimée', data: deletedUser });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
};

module.exports = userController;
