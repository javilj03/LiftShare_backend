const mongoose = require('mongoose');
const express = require('express');
const { User, Routine, DayRoutine, Post } = require('./types');
const bcrypt = require('bcrypt')
const multer = require('multer');
const path = require('path');

const getRouter = () => {
  const router = express.Router();
  const connectionString = 'mongodb://admin:pass@172.27.240.1:27017/liftShare?authSource=admin';

  mongoose.connect(connectionString)
    .then(() => {
      console.log('Connected to the database');
    }).catch(err => {
      console.error(err);
    });

  router.post('/createUser', async (req, res) => {
    const {
      name,
      lastName,
      email,
      weight,
      height,
      username,
      password,

    } = req.body;
    const passHash = await bcrypt.hash(password, 10)
    var newUser = new User({
      name: name,
      lastName: lastName,
      email: email,
      weight: weight,
      height: height,
      username: username,
      password: passHash,
      birth_date: new Date(),
      visibility: true
    });

    newUser.save()
      .then(doc => {
        res.send(doc);
      })
      .catch(err => {
        res.send(err);
      });
  });
  router.get('/getUsers', async (req, res) => {
    User.find()
      .then(users => {
        res.send(users)
      })
      .catch(err => {
        res.status(500).send(err.message)
      })
  })

  router.post('/verify', async (req, res) => {
    const { username, password } = req.body;

    await User.findOne({ username: { $eq: username } })
      .then(async user => {
        const isCorrect = await bcrypt.compare(password, user.password)
        if (isCorrect) {
          res.send(user)
        } else {
          res.send('Credenciales erroneas')
        }
      })
      .catch(err => {
        res.status(500).send(err)
      })
  })

  router.put('/updUser/:id', async (req, res) => {
    const { id } = req.params;
    const updatedField = req.body;

    try {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: updatedField },
        { new: true }
      );

      if (!user) {
        return res.status(404).send('No existe el usuario');
      }

      res.send(user);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })

  router.put('/createRoutine/:id', async (req, res) => {
    const { id } = req.params
    const { name, desc, days_of_week } = req.body

    var newRoutine = new Routine({
      name: name,
      desc: desc,
      days_of_week: days_of_week,
      visibility: true
    });

    newRoutine.save()
      .then(doc => {
        res.send(doc);
      })
      .catch(err => {
        res.send(err);
      });
  })
  router.post('/createDayRoutine', async (req, res) => {
    const { day_of_week, exercises } = req.body

    var newDayRoutine = new DayRoutine({
      day_of_week: day_of_week,
      exercises: exercises,
      visibility: true
    });

    newDayRoutine.save()
      .then(doc => {
        res.send(doc._id);
      })
      .catch(err => {
        res.send(err);
      });
  })
  router.get('/getRoutines', (_, res) => {
    Routine.find()
      .then(routines => {
        res.send(routines)
      })
      .catch(err => {
        res.status(500).send(err)
      })
  })
  router.get('/getUserRoutines/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findOne({ _id: { $eq: userId } })

      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }

      const routineIds = user.routines;

      const routines = await Routine.find({
        _id: { $in: routineIds.map(id => new mongoose.Types.ObjectId(id)) }
      });

      res.send(routines);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  router.put('/sendFriendRequest/:id', async (req, res) => {
    const { id } = req.params;
    const { username } = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { username: username },
        { $addToSet: { friend_request: id } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send('Usuario no encontrado');
      }

      res.send(updatedUser);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  router.put('/getFriendRequest/:id', async (req, res) => {
    const { id } = req.params

    try {
      const user = await User.findOne({ _id: { $eq: id } })

      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }

      const userIds = user.friend_request;

      const users = await User.find({
        _id: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) }
      });

      res.send(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })

  router.put('/acceptRequest/:id', async (req, res) => {
    const { id } = req.params
    const { friendId } = req.body

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { friend_request: friendId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send('Usuario no encontrado');
      }
      const friend4User = await User.findOneAndUpdate(
        { _id: id },
        { $addToSet: { friends: friendId } },
        { new: true }
      );
      res.send(friend4User);
    } catch (error) {
      res.status(500).send(error.message);
    }

  })
  router.put('/removeFriend/:id', async (req, res) => {
    const { id } = req.params;
    const { friendId } = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { friends: friendId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send('Usuario no encontrado');
      }

      res.send(updatedUser);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  router.put('/removeRequest/:id', async (req, res) => {
    const { id } = req.params;
    const { friendId } = req.body;

    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { friend_request: friendId } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).send('Usuario no encontrado');
      }

      res.send(updatedUser);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  router.put('/getFriends/:id', async (req, res) => {
    try {
      const { id } = req.params
      User.findOne({ _id: id })
      if (!user) {
        return res.status(404).send('Usuario no encontrado');
      }

      const userIds = user.friends;

      const users = await User.find({
        _id: { $in: userIds.map(id => new mongoose.Types.ObjectId(id)) }
      });

      res.send(users);
    } catch (error) {
      res.status(500).send(error.message);
    }
  })
  router.put('/editRoutine/:id', async (req, res) => {
    const { id } = req.params
    const updatedField = req.body
    try {

      const updatedRoutine = await Routine.findOneAndUpdate(
        { _id: id },
        { $set: updatedField },
        { new: true })


      if (!updatedRoutine) {
        return res.status(404).send('No existe el usuario');
      }

      res.send(updatedRoutine);
    } catch (err) {
      res.status(500).send(err)
    }
  })
  router.put('/getRoutine/:id', async (req, res) => {
    const { id } = req.params
    try {
      const routine = await Routine.findOne({ _id: id })
      if (!routine) {
        res.status(404).send("Rutina no encontrada")
      }
      res.send(routine)
    } catch (err) {
      res.status(500).send(err)
    }
  })
  router.put('/deleteRoutine/:id', async (req, res) => {
    const { id } = req.params
    try {
      Routine.deleteOne({ _id: id })
    } catch (err) {
      res.status(500).send(err)
    }
  })
  router.put('/editDayRoutine/:id', async (req, res) => {
    const { id } = req.params
    const updatedField = req.body
    try {
      const dayRoutine = await DayRoutine.findOneAndUpdate(
        { _id: id },
        { $set: updatedField },
        { new: true })

      if (!dayRoutine) {
        res.status(404).send("Rutina no encontrada")
      }
      res.send(dayRoutine)
    } catch (err) {
      res.status(500).send(err)
    }
  })
  router.put('/getDayRoutine/:id', async (req, res) => {
    const { id } = req.params
    try {
      const day = await DayRoutine.findOne({ _id: id })
      if (!day) {
        res.status(404).send('No se encuentra la rutina del dia')
      }
      res.send(day)
    } catch (err) {
      res.status(500).send(err)
    }
  })
  router.put('/deleteDayRoutine/:id', async (req, res) => {
    const { id } = req.params
    try {
      await DayRoutine.deleteOne({ _id: id })
    } catch (err) {
      res.status(500).send(err)
    }
  })
  //Obtener posts para el perfil del usuario


  // var storage = multer.diskStorage({
  //   destination: function (req, file, cb) {
  //     // cb(null, path.join(__dirname, '../', '../', '/uploads/'))
  //     cb(null, './uploads')
  //   },
  //   filename: function (req, file, cb) {
  //     try {
  //       console.log(req)
  //       cb(null, Date.now() + "-" + file.originalname)

  //     } catch (err) {
  //       console.error('Error al guardar el archivo: ', err)
  //       cb(err)
  //     }

  //   }
  // })

  var upload = multer({ dest: './uploads/' })

  router.put('/createPost/:id', upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const image = req.file;
    try {
      // Verificar si se ha enviado una imagen
      if (!image) {
        res.status(400).send('No se ha enviado ninguna imagen.');
        return;
      } else {
        console.log('entro')
        console.log(image)
      }

      // Crear el nuevo post
      const newPost = new Post({
        title,
        description,
        src: `uploads/${image.filename}`,
      });

      // Guardar el post en la base de datos
      const savedPost = await newPost.save();

      // Actualizar la lista de posts del usuario
      await User.findByIdAndUpdate(
        id,
        { $push: { posts: savedPost._id } },
        { new: true }
      );

      res.send(savedPost);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  router.put('/searchUsername/:id', async (req, res) => {
    const {username} = req.params
    try{
      User.find({username: {$regex: `${username}`, $options: 'i'}})
        .then(users => {
          res.send(users)
        })
        .catch(err => {
          console.error(err)
          res.status(404).send(err)
        })
    }catch(err){
      console.error(err)
    }
  })

  return router; // Return the router instance
};

const router = getRouter();
module.exports = router;