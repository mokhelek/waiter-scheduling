import express from "express";
import { engine } from "express-handlebars";
import bodyParser from "body-parser";
import bcrypt from "bcrypt"

import db from "./model/db.js";

import flash from "express-flash";
import session from "express-session";

let app = express();
app.use(
    session({
        secret: "<add a secret string here>",
        resave: false,
        saveUninitialized: true,
    })
);

// TODO : --> I CAN HAVE DIFFERENT ROUTES FOR AUTHENTICATION AND FOR ACTIONS

app.use(flash());
app.use(express.static("public"));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());



// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
  if (req.session.user) {
      return next();
  }
  res.redirect('/login/user');
}

app.get('/', isAuthenticated, (req, res) => {
  res.redirect(`/waiter/${req.session.user.username}`)
});

app.post('/submit/user', async (req, res) => {
  const selectedValues = req.body.values; 
  let authenticatedUser = req.session.user.username ;
  
  const insertQueries = selectedValues.map(item => {
    return db.none('INSERT INTO days(username, weekday) VALUES($1, $2)', [authenticatedUser,item ]);
  })
  Promise.all(insertQueries)


  const insertQueriesCounter = selectedValues.map(item => {
    return db.none('UPDATE all_days SET counter = all_days.counter + 1 WHERE weekday = $1', [item ]);
  })
  Promise.all(insertQueriesCounter)

});


app.get('/waiter/:username', isAuthenticated, async (req, res) => {
  // TODO : -->  so display all the days for which the authenticated user indicated for availability

  
  let days = await db.any('SELECT * FROM days WHERE username = $1',[req.session.user.username] )
  let all_days = await db.any('SELECT * FROM all_days' )
  res.render('home', { days , all_days});
});

app.get('/admin/:username', isAuthenticated, async (req, res) => {


  let waiters = await db.any('SELECT * FROM waiters')

  let selectedDays = await db.any('SELECT * from days')

  let all_days = await db.any('SELECT * FROM all_days' ) // Arr of days

  
  for (let i of selectedDays ){
    for(let j of all_days){
      if(i.weekday == j.weekday){
          let bookedUsers = await db.any('SELECT username FROM days WHERE weekday = $1', [i.weekday])
          console.log(bookedUsers)
          j.users = bookedUsers;
      }
    }
  }


    console.log(all_days)



  // ? [{'weekday':'mon', 'waiters': [] }]
  res.render('admin-dashboard', { all_days, waiters});

});

app.get('/login/user', (req, res) => {
  res.render('login');
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
      const waiter = await db.oneOrNone('SELECT * FROM waiters WHERE username = $1', username);
      const admin = await db.oneOrNone('SELECT * FROM admin WHERE username = $1', username);

      if(waiter){
        const passwordMatch = await bcrypt.compare(password, waiter.password);

        if (passwordMatch) {
            req.session.user = waiter;
            res.redirect(`/waiter/${username}`);
        }else{
          res.redirect('/login/user');
        }
        
      }else if(admin){
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (passwordMatch) {
          req.session.user = admin;
          res.redirect(`/admin/${username}`);
        }else{
          res.redirect('/login/user');
        }
      }else{

        res.redirect('/login/user');
      }

  } catch (error) {
      res.redirect('/login/user');
      console.log("error?")
  }
});

app.get('/register/user', (req, res) => {
  res.render('register');
});

app.post('/register/user', async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.none('INSERT INTO waiters(username, password) VALUES($1, $2)', [username, hashedPassword]);
    res.redirect('/login/user');
} catch (error) {
  console.log(error)
    res.redirect('/register/user');
}
 
});

app.get('/logout/user', (req, res) => {
  req.session.destroy(() => {
      res.redirect('/login/user');
  });
});


app.get('/reset/user', async (req, res) => {
  await db.none('DELETE FROM days');
  await db.none('UPDATE all_days SET counter = 0');

  res.redirect('/logout/user')
});




let PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
    console.log("App starting on port", PORT);
});


