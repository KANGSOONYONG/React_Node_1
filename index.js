const express = require('express')
const app = express()
const path = require('path');
const port = 8080;

const config = require('./config/key');
const cookieParser = require('cookie-parser');
const { User } = require("./models/User");
const { Items } = require("./models/Items");
const { SiteNames } = require("./models/SiteNames");
const { Youtubers } = require("./models/Youtubers");
const { auth } = require("./middleware/auth");


app.use(express.urlencoded({extended: true}));

app.use(express.json());

app.use(cookieParser());


const mongoose = require('mongoose')

mongoose.connect(config.mongoURI,)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err))

// npm run build 된 것이 localhost 8080 메인에 뜨게 설정
app.use(express.static(path.join(__dirname, 'react-project/build')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/react-project/build/index.html'));
});

// app.get('*', function (req, res) {
//   res.sendFile(path.join(__dirname, '/react-project/build/index.html'));
// });
// 회원가입 post 메소드
app.post('/api/users/register', (req, res) => {

  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)

  // MongoDB에서 온 메소드
  user.save((err, userInfo) => {
    if(err) return res.json({ success : false, err})
    return res.status(200).json({
      success : true
    })
  })
})

app.get('/api/users/auth', auth , (req, res) => {
  // 여기까지 미들웨어를 통과해 왔다는 이야기는 Authentication 이 true라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false: true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})

app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, 
    {token : ""}
    , (err, user) => {
      if(err) return res.json ({success : false, err});
      return res.status(200).send({
        success: true
      })
    })
})

app.get('/api/users', async (req, res) => {
  try{
    const user = await User.find();
    res.json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

app.get('/api/youtubers', async (req, res) => {
  try{
    const youtubers = await Youtubers.find();
    res.json(youtubers);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

app.get('/api/items/youtuber/:youtuber', async (req, res) => {
  try{
    const items = await Items.find( {youtuber: req.params.youtuber});
    res.json(items);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})
// app.get('/api/items', async (req, res) => {
//   try{
//     const items = await Items.find();
//     res.json(items);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// })

app.get('/api/sitenames', async (req, res) => {
  try{
    const siteNames = await SiteNames.find();
    res.json(siteNames);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

app.post('/api/youtubers/create', (req, res) => {

  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const youtubers = new Youtubers(req.body)

  // MongoDB에서 온 메소드
  youtubers.save((err, youInfo) => {
    if(err) return res.json({ success : false, err})
    return res.status(200).json({
      success : true
    })
  })
})
app.post('/api/items/create', (req, res) => {

  // 회원 가입 할 때 필요한 정보들을 client에서 가져오면
  // 그것들을 데이터 베이스에 넣어준다.
  const items = new Items(req.body)

  // MongoDB에서 온 메소드
  items.save((err, itemInfo) => {
    if(err) return res.json({ success : false, err})
    return res.status(200).json({
      success : true
    })
  })
})
app.put('/api/items/:item_id', (req, res) => {
  const items = new Items(req.body)
  items.update({_id: req.params.item_id}, { $set: req.body })
  try{
    res.json({message: complete});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

app.delete('/api/items/:item_id', (req, res) => {
  const items = new Items(req.body)
  items.remove({_id: req.params.item_id})
  try{
    res.json({message: "complete"});
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
app.use(express.json());
var cors = require('cors');
app.use(cors({
  origin: '*'
}));