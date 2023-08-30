const { MongooseError } = require('mongoose');
const {
  User,
  registerValidationSchema,
  loginValidationSchema,
} = require('../models/userSchema');
const bcrypt = require('bcrypt');
const private_Key = require('../middleware/private_key');
const jwt = require('jsonwebtoken');

const userController = {
  register: async (req, res) => {
    try {
      const { error } = registerValidationSchema.validate(req.body, {
        allowUnknown: true,
      });
      if (error) {
        return res.status(400).send(error.message);
      }
      const password = req.body.password;
      const hash = await bcrypt.hash(password, 10);
      const newUser = { ...req.body, password: hash };
      const createdUser = await User.create(newUser);

      res.status(200).json({
        message: `user ${createdUser.email} a bien été crée`,
      });
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({ message: error.errors });
      }
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
      const userDeleting = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ message: "l'utilisateur n'a pas été trouvé" });
      }
      if (user._id.toString() === userId || userDeleting.isAdmin) {
        const deletedUser = await User.findByIdAndDelete(userIdToDelete);
        return res.status(200).json({
          message: "l'utilisateur a bien été supprimé",
          data: deletedUser,
        });
      }
      return res.status(403).json({
        message:
          "vous n'avez pas l'autorisation pour supprimer cet utilisateur",
      });
    } catch (error) {
      if (error instanceof M)
        res.status(500).json({
          message: 'Une erreur est survenue, veuillez essayer ultérieurement',
          error,
        });
    }
  },
  login: async (req, res) => {
    try {
      const userInfo = req.body;
      const { error } = loginValidationSchema.validate(userInfo, {
        allowUnknown: true,
      });
      if (error) {
        return res.status(400).send(error.message);
      }

      const user = await User.findOne({ email: userInfo.email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "l'utilisateur n'a pas été trouvé" });
      }
      const checkPassword = await bcrypt.compare(
        userInfo.password,
        user.password
      );
      if (!checkPassword) {
        return res.status(401).json({ message: 'Mot de passe incorrect' });
      }
      const token = jwt.sign({ userId: user.id }, private_Key, {
        expiresIn: '24h',
      });
      return res.status(200).json({ token });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        message: 'Une erreur est survenue, veuillez essayer ultérieurement.',
        error,
      });
    }
  },
};

module.exports = userController;
