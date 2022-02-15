console.log('!! For more information, please visit https://github.com/shir0tetsuo/ara.shadowsword.ca')

async function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i <ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

async function Cookie_To_UserArea(){
  controller = document.getElementById('UserArea')
  user_name = await getCookie('user_name')
  if (user_name) {
    controller.href = '/profile'
    controller.innerHTML = 'Hi, '+user_name
  } else {
    controller.innerHTML = 'Login'
  }
}

function del(id){
  box = document.getElementById(id).style.display = 'none';
}

function delCookies() {
  document.cookie = `user_email=; maxAge=0; SameSite=none; path=/; Secure`
  document.cookie = `hashed_pwd=; maxAge=0; SameSite=none; path=/; Secure`
  document.cookie = `user_name=; maxAge=0; SameSite=none; path=/; Secure`
}

function landing(){
  Cookie_To_UserArea()
}
