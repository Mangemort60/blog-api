const User = require('../models/userSchema');

const userController = {
  register: async (req, res) => {
    try {
      const newUser = req.body;
      const createdUser = await User.create(newUser);
      res
        .status(200)
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
      const userIdToDelete = req.params.id;
      const userId = req.params.author;
      const user = await User.findById(userIdToDelete);
      if (!user) {
        return res
          .status(404)
          .json({ message: "l'utilisateur n'a pas été trouvé" });
      }
      if (user._id.toString() !== userId || !user.isAdmin) {
        return res.status(403).json({
          message:
            "vous n'avez pas l'autorisation pour supprimer cet utilisateur",
        });
      }
      const deletedUser = await User.findByIdAndDelete(userIdToDelete);
      res.status(200).json({
        message: "l'utilisateur a bien été supprimé",
        data: deletedUser,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement',
        error,
      });
    }
  },
};

module.exports = userController;
