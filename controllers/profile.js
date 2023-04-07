const handleProfileGet = (req,res, userDB) => {
    const { id } = req.params;
    userDB.select('*').from('users').where({id})
      .then(user => {
        if (user.length) {
          res.json(user[0])
        }else {
          res.status(400).json('not found')
        }
      })
      .catch(err => res.status(400).json('error getting user'))
  }

  module.exports = {
    handleProfileGet: handleProfileGet
  }