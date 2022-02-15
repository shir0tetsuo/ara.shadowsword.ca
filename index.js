// shadowsword#0179 to my amazing wife for her sales
const express = require('express'); // Main Server Handler
//const chalk = require('chalk'); // Console Vibrance
const SHA256 = require('crypto-js/sha256') // Cryptography
const bcrypt = require('bcrypt') // https://www.npmjs.com/package/bcrypt
const saltRounds = 10; // Cryptography

const bparse = require('body-parser') //https://codeforgeek.com/handle-get-post-request-express-4/
const cookies = require('cookie-parser') //https://stackoverflow.com/questions/16209145/how-to-set-cookie-in-node-js-using-express-framework

require("dotenv").config(); // .env
// All .env Variables Should Init Here
const PORT = process.env.SERVER_PORT;
const SERVER_URL = process.env.SERVER_URL;
const SERVER_CDN = process.env.CDN; // Referencing static public paths

const Sequelize = require('sequelize')
const APPLICATION = express();

const ff = require('fs'); // for dynamic
const fs = require("fs").promises; // for static
let StartDate = new Date();

// SQLITE CONTROLLERS
const sqlite = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',
  logging: false,
  storage: './store.db',
})
const U = sqlite.define('userdata', {
  user_id: {
    type: Sequelize.STRING,
    unique: true,
  },
  user_name: {
    type: Sequelize.STRING,
    defaultValue: 'N/A',
    allowNull: false,
  },
  user_email: {
    type: Sequelize.STRING,
    defaultValue: 'unknown@unknown.ca',
    allowNull: false,
  },
  user_phone: {
    type: Sequelize.STRING,
    defaultValue: '5555555555',
    allowNull: false,
  },
  user_address: {
    type: Sequelize.STRING,
    defaultValue: '123 Somewhere Square, Golfington, Australia',
    allowNull: false,
  },
  user_spent: {
    type: Sequelize.STRING,
    defaultValue: '0.00',
    allowNull: false,
  },
  user_permission: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
    allowNull: false,
  },
  user_loyalty: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
    allowNull: false,
  },
  hashed_pwd: {
    type: Sequelize.STRING,
    defaultValue: '0',
    allowNull: false,
  },
})
////////////////////////////////////////////////////////////////////////////////
// END OF MAIN LOADING BLOCK ///////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// front-end: /dynamic_content(/js)
// CDN (where all images are saved:) CDN/ara_store_items/

StoreContent = {}
ff.readdir('./storemodel/', (err, files) => {
  if (err) console.err(err);
  console.log(`Loaded ${files.length} store items.`)
  files.forEach(f => {
    let fileread = require(`./storemodel/${f}`);
    StoreContent[fileread.material_data.material_id] = fileread.material_data;
    console.log(StoreContent[fileread.material_data.material_id])
  })
})

async function readFile(filePath) {
  try {
    const data = await fs.readFile(filePath);
    //console.log(data.toString());
    return data.toString()
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
}

// Dynamic Content Loader
async function DC_Load(cookies, onloader) {
  var user = false;
  if (cookies.user_email && cookies.hashed_pwd) {
    user = await U.findOne({
      where: {
        user_email: cookies.user_email
      }
    })
    if (user.hashed_pwd != cookies.hashed_pwd) {
      user = false;
    }
  }
  let header = await readFile('./dynamic_content/header.html')
  let pub_ver = await readFile('./dynamic_content/version.txt')
  let test_block = await readFile('./dynamic_content/test_block.html')
  let navbar = await readFile('./dynamic_content/navbar.html')
  var header_body = '<body onload="landing()">';
  if (onloader) header_body = `<body onload="${onloader}">`;
  // let top_head = await readFile('./')
  // let loader =

  class DC_Load{
    constructor(headerFile, versionFile, user){
      this.header = headerFile;
      this.header_body = header_body;
      this.footer = '</body></html>'

      this.pub_ver = versionFile;
      this.start_date = StartDate;

      this.user = user;

      this.test = '<body>'+ this.pub_ver + 'HELLO, WORLD!</body></html>'

      this.c_test_block = '<body>'+ test_block +'</body></html>';
      this.c_navbar = navbar;
    }
  }
  return await new DC_Load(header, pub_ver, user)
}



////////////////////////////////////////////////////////////////////////////////
// LISTEN BLOCK START //////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
APPLICATION.listen(
  PORT,
  () => console.log(`Connection Open @ localhost:${PORT} and ${process.env.SERVER_URL}`)
)

APPLICATION.use(express.json());
APPLICATION.use(bparse.urlencoded({ extended: true }));
APPLICATION.use(bparse.json());
APPLICATION.use(cookies())
APPLICATION.use('/dynamic_content', express.static('dynamic_content'));
APPLICATION.use('/favicon', express.static('favicon'));
APPLICATION.use('/robots.txt', express.static('robots.txt'))

APPLICATION.use(function(err, req, res, next) {
  console.error(err.stack);
})

APPLICATION.get('/', async (req, res) => {
  let DC_Parts = await DC_Load(req.cookies, `landing()`);
  console.log(DC_Parts)
  res.status(200).send(DC_Parts.header + DC_Parts.header_body + DC_Parts.c_navbar + DC_Parts.footer)
})
