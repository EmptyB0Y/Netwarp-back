const { Sequelize,sequelize, Notification ,Profile } = require('../models');

exports.getNotificationsByProfile = async (req, res) => {
    try{
      const { id } = req.params;
      const notifications = await Notification.findAll({where: {ProfileId: id}});
  
      res.json(notifications);
    }catch (error) {
      console.error(error);
      res.status(500).json({message: 'Server error', error: error});
    }
  }

exports.deleteNotification = async (req, res) => {
    try{
        const { id } = req.params;
        const notification = await Notification.findByPk(id);
        const profile = await Profile.findByPk(notification.ProfileId);

        if(profile.UserId != res.locals.userId && !res.locals.isAdmin) {
            return res.status(403).json({message: "Vous n'avez pas accès à cette notification"})
        }

        const deletedNotification = await Notification.destroy({where: {id}});

        if (!deletedNotification) {
            return res.status(404).json({ message: 'Notification non trouvée' });
          }
      
        res.json({ message: 'Notification supprimée' });
      }catch (error) {
        console.error(error);
        res.status(500).json({message: 'Server error', error: error});
      }
}