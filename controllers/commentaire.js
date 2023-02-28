const { Commentaire } = require('../models');

exports.createCommentaire = async (req, res) => {
  try {
    const { content, ProfileId, PlanteId } = req.body;

    // Create the new commentaire
    const commentaire = await Commentaire.create({
      content,
      ProfileId,
      PlanteId,
    });

    res.status(201).json(commentaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getCommentaireById = async (req, res) => {
  try {
    const { id } = req.params;

    const commentaire = await Commentaire.findByPk(id);

    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire not found' });
    }

    res.json(commentaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateCommentaire = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    // Find the existing commentaire
    const commentaire = await Commentaire.findByPk(id);

    if (!commentaire) {
      return res.status(404).json({ message: 'Commentaire not found' });
    }

    // Update the commentaire
    commentaire.content = content;
    await commentaire.save();

    res.json(commentaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteCommentaire = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCommentaire = await Commentaire.destroy({ where: { id } });

    if (!deletedCommentaire) {
      return res.status(404).json({ message: 'Commentaire not found' });
    }

    res.json({ message: 'Commentaire deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};