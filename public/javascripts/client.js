var url = document.getElementsByClassName('url')[0]
var img = document.getElementsByClassName('img')[0]

url.addEventListener('blur', function(){
  img.scr = url.value
})
