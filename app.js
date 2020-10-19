
const express = require('express');
const uuid = require('uuid');
const { get } = require('http');
const path = require('path');
// const moment = require('moment');

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

const logger = (req, res, next) => {
  console.log(`${req.protocol}://${req.get('host')}${req.originalUrl}: ${moment().format()}`);
  next();
}

app.use(logger);

const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@gmail.com',
    status: 'active'
  }
];

app.get('/api/users', (req, res) => res.json(users));

//get user
app.get('/api/users/:id', (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id));

  if(found){
    res.json(users.filter(user => user.id === parseInt(req.params.id)));
  }
  else{
    res.status(400).json({msg: `No user with the id of ${req.param.id}`})
  }
});

//create user
app.post('/api/users', (req, res) => {
  const newUser = {
    id: uuid.v4(),
    name: req.body.name,
    email: req.body.email,
    status: 'active'
  }
  if(!newUser.name || !newUser.email){
    return res.status(400).json({msg: 'Please include a name and email'});
  }
  users.push(newUser);
  res.json(users);
});

//update user
app.put('/api/users/:id', (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id));

  if(found){
    const updatedUser = req.body;
    users.forEach(user => {
      if(user.id === parseInt(req.params.id)){
        user.name = updatedUser.name ? updatedUser.name : user.name;
        user.email = updatedUser.email ? updatedUser.email : user.email;

        res.json({ msg: 'User updated', user });
      }
    });
  }
  else{
    res.status(400).json({msg: `No user with the id of ${req.param.id}`})
  }
});

//delete user
app.delete('/api/users/:id', (req, res) => {
  const found = users.some(user => user.id === parseInt(req.params.id));

  if(found){
    res.json({
      msg: 'User deleted', users: users.filter(user => user.id !== parseInt(req.params.id))
    });
  }
  else{
    res.status(400).json({msg: `No user with the id of ${req.param.id}`})
  }
});


app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3030;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

