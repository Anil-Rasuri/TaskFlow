const login_close_eye=document.getElementById('pass-login-id');
const login_open_eye=document.getElementById('pass-login-2-id');

const login_pass_type=document.getElementById('pass-login_input');

login_close_eye.addEventListener('click',(event)=>{
    event.preventDefault();

    login_open_eye.style.display="block";
    login_close_eye.style.display="none";

    if(login_pass_type.type==="password"){
        login_pass_type.type="text";
    }
    else{
        login_pass_type.type="password";
    }
})

login_open_eye.addEventListener('click',(event)=>{
    event.preventDefault();

    login_close_eye.style.display="block";
    login_open_eye.style.display="none";

    if(login_pass_type.type==="text"){
        login_pass_type.type="password"
    }
    else{
        login_pass_type.type="text";
    }
})




const login_btn=document.getElementById('login-btn')

login_btn.addEventListener('click',(event)=>{
    event.preventDefault();

    const username=document.getElementById('username-login').value;
    const pass=document.getElementById('pass-login_input').value;


    if(!username || !pass ){
        document.getElementById('login-msg').innerText="Fill  All Properties";
        document.getElementById('login-fail').style.display="block";
        return;
    }
    
    fetch(`http://127.0.0.1:8000/Login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(pass)} `,{
        method:"get"
       
    })
    .then(response =>response.json())
    .then(data =>{
        if(data.Message){
            document.getElementById('login-success').style.display="block";
            document.getElementById('login-fail').style.display="none";
            localStorage.setItem("username",username);
            localStorage.setItem("token",data.Access_Token);
            
        }
        else{
            document.getElementById('login-msg').innerText=data.Error;
            document.getElementById('login-fail').style.display="block";
            document.getElementById('login-success').style.display="none";
        }
    })
    

})

    const next=document.getElementById('next-btn')
    const close_box=document.getElementById('close-box')

        next.addEventListener('click',(event)=>{
            event.preventDefault();
            window.location.href="content.html";

        })
        close_box.addEventListener('click',(event)=>{
            event.preventDefault();
            document.getElementById('login-fail').style.display="none";
        })
        
