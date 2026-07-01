

const user_signup=document.getElementById('user-signup')

user_signup.addEventListener('click',(event)=>{
    event.preventDefault();

    const user_name=document.getElementById('user-name').value;
    const user_password=document.getElementById('user-password').value;
    const user_confirmpassword=document.getElementById('user-confirm_password').value;

    if (!user_name || !user_password || !user_confirmpassword){
        document.getElementById('fail-message').innerText="Fill All Properties";
        document.getElementById('register-fail-box').style.display="block";
        return;
    }

    fetch("https://taskflow-backend-esfy.onrender.com/Registration",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body:JSON.stringify({
        "username":user_name,
        "password":user_password,
        "confirm_password":user_confirmpassword
    })
    })
    .then(response =>response.json())
    .then(data =>{
        if(data.Message){
            document.getElementById('register-success-box').style.display="block";
        }else if (data.Error){
            document.getElementById('fail-message').innerText=data.Error;
            document.getElementById('register-fail-box').style.display="block";
        }

    })
})

const ok_btn_success=document.getElementById('ok-btn-success');
    ok_btn_success.addEventListener('click',(event)=>{
        event.preventDefault();
        document.getElementById('register-success-box').style.display="none";
    })
const ok_btn_fail=document.getElementById('ok-btn-fail');
    ok_btn_fail.addEventListener('click',(event)=>{
        event.preventDefault();
        document.getElementById('register-fail-box').style.display="none";
    })







const eye_close=document.getElementById('eye-close')
const eye_open=document.getElementById('eye-open')
const password_type=document.getElementById('user-password')


eye_close.addEventListener('click',(event)=>{
    event.preventDefault();

    eye_open.style.display="block";
    eye_close.style.display="None";
    if (password_type.type ==="password"){
        password_type.type="text";
    }
    else{
        password_type.type="password";
    }
});

eye_open.addEventListener('click',(event)=>{
    event.preventDefault();

    eye_close.style.display="block";
    eye_open.style.display="None";
   
    if (password_type.type ==="text"){
        password_type.type="password";
    }
    else{
        password_type.type="text";
    }
})



