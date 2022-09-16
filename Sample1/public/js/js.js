const nav = document.querySelector('.navbar')
fetch('/nav.html')
.then(res=>res.text())
.then(data=>{
    nav.innerHTML=data;
})