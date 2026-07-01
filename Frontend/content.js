const options=document.querySelectorAll('.options p1');

options.forEach(option=>{
    option.addEventListener('click',()=>{
        options.forEach(btn=>{
            btn.classList.remove('active');
        });
        option.classList.add('active');
    })
})








const Dashboard=document.getElementById('dash');
const ADD_TASK=document.getElementById('AD');
const VIEW_TASK=document.getElementById('VT');
const update_btn=document.getElementById('MT')
const CP_btn=document.getElementById('CP')
const Profile_btn=document.getElementById('Pro')
const About_us=document.getElementById('AU')





const Dashboard_layput=document.getElementById('A');
const View_tasks=document.getElementById('view-task');
const Add_task=document.getElementById('Add-task');
const Manage=document.getElementById('manage')
const Delete_task=document.getElementById('delete-task')
const CP_task=document.getElementById('CP-task')
const profile=document.getElementById('pro')
const about_us=document.getElementById('About-us')



Dashboard.addEventListener('click',(event)=>{
    event.preventDefault();
    Dashboard_layput.style.display="block";
    View_tasks.style.display="none";
    Add_task.style.display="none";
    Manage.style.display="none";
    Delete_task.style.display="none";
    CP_task.style.display="none";
    profile.style.display="none";
    about_us.style.display="none";
   

})
ADD_TASK.addEventListener('click',(event)=>{
    event.preventDefault();
    Dashboard_layput.style.display="none";
    View_tasks.style.display="none";
    Add_task.style.display="block";
    Manage.style.display="none";
    Delete_task.style.display="none";
    CP_task.style.display="none";
    profile.style.display="none";
    about_us.style.display="none";
    

})
VIEW_TASK.addEventListener('click',(event)=>{
    event.preventDefault();
    Dashboard_layput.style.display="none";
    View_tasks.style.display="block";
    Add_task.style.display="none";
    Manage.style.display="none";
    Delete_task.style.display="none";
    CP_task.style.display="none";
    profile.style.display="none";
    about_us.style.display="none";
    

})
update_btn.addEventListener('click',(event)=>{
    event.preventDefault();
    Dashboard_layput.style.display="none";
    View_tasks.style.display="none";
    Add_task.style.display="none";
    CP_task.style.display="none";
    Manage.style.display="block";
    Delete_task.style.display="block";
    profile.style.display="none";
    about_us.style.display="none";
   
    
})
CP_btn.addEventListener('click',(event)=>{
    event.preventDefault();
    Dashboard_layput.style.display="none";
    View_tasks.style.display="none";
    Add_task.style.display="none";
    Manage.style.display="none";
    Delete_task.style.display="none";
    CP_task.style.display="block";
    profile.style.display="none";
    about_us.style.display="none";
  
})
Profile_btn.addEventListener('click',(event)=>{
    event.preventDefault();
    Dashboard_layput.style.display="none";
    View_tasks.style.display="none";
    Add_task.style.display="none";
    Manage.style.display="none";
    Delete_task.style.display="none";
    CP_task.style.display="none";
    profile.style.display="block";
    about_us.style.display="none";
  
})
About_us.addEventListener('click',(event)=>{
    event.preventDefault();
    Dashboard_layput.style.display="none";
    View_tasks.style.display="none";
    Add_task.style.display="none";
    Manage.style.display="none";
    Delete_task.style.display="none";
    CP_task.style.display="none";
    profile.style.display="none";
    about_us.style.display="block";
  
})












const dashboard_section=document.getElementById('dashboard-sections');
const profile_name=document.getElementById('profile-name');
const user_name_display=document.getElementById('user_name_display');

const username=localStorage.getItem("username");

    dashboard_section.textContent=username;
    profile_name.textContent=username;
    user_name_display.textContent=username;


const LOgout=document.getElementById('logout');
    LOgout.addEventListener('click',(event)=>{
        event.preventDefault()

        localStorage.removeItem('token');
        localStorage.removeItem('username')
        window.location.href="Login.html"

    })




const Total_tasks=document.getElementById('total-tasks');
const Completed=document.getElementById('com-tasks');
const Pending=document.getElementById('pen-tasks');


const token=localStorage.getItem("token");
console.log(token);

async function loadDashboard(){
    try{
        const response= await fetch("https://taskflow-backend-esfy.onrender.com/Dashboard",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        

        });

        if(response.ok){
            const data=await response.json();
            const tot_task=data["Total Tasks"] || 0;
            const com=data["Completed Tasks"] || 0;
            const pend=data["Pending Tasks"] || 0;


            Total_tasks.textContent=tot_task;
            Completed.textContent=com;
            Pending.textContent=pend;

        }else{
            Total_tasks.textContent="0";
            Completed.textContent="0";
            Pending.textContent="0";
        }
    }
    catch (error) {
        console.log(error);

        Total_tasks.textContent = "0";
        Completed.textContent = "0";
        Pending.textContent = "0";
    }
}
loadDashboard();


const High=document.getElementById('High');
const Medium=document.getElementById('Medium');
const Low=document.getElementById('Low');



async function loadPriority(){
    try{
        const response= await fetch("https://taskflow-backend-esfy.onrender.com/Priority-Breakdown",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        

        });
        if(response.ok){
            const data=await response.json();
            const high=data.Data.Breakdown.High || 0;
            const medium=data.Data.Breakdown.Medium || 0;
            const low=data.Data.Breakdown.Low || 0;


            High.textContent=high;
            Medium.textContent=medium;
            Low.textContent=low;

        }
    }
    catch(error){
        console.log(error)
    }
}
loadPriority();



const Tasks=document.getElementById('Tasks');
const Description=document.getElementById('Description');
const Due=document.getElementById('Due');

const urgentBody=document.getElementById("urgent-body");

async function loadUrgentTasks(){
    try{
        const response= await fetch("https://taskflow-backend-esfy.onrender.com/Dashboard-Urgent-Tasks",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        

        });
        
            const data=await response.json();
            console.log(data);

            urgentBody.innerHTML="";

            if (data.Message){
                urgentBody.innerHTML=`
                    <tr>
                    <td colspan="3">${data.Message}</td>
                </tr>
                `;
            }
            else{
                const task=data["Urgent Over-Due Tasks"] || [];

                task.forEach(task=>{
                    urgentBody.innerHTML+=`
                    <tr>
                        <td>${task.Title}</td>
                        <td>${task.description}</td>
                        <td>${task.due_date}</td>
                    </tr>
                    `;
                });

            }
        
    }
    catch(error){
        console.log(error)
    }
}

loadUrgentTasks();




const id=document.getElementById('id');
const task=document.getElementById('task');
const des=document.getElementById('des');
const created_on=document.getElementById('created_on');
const created_at=document.getElementById('created_at');
const Due_date=document.getElementById('due_date')
const pri=document.getElementById('pri');
const status=document.getElementById('status');

const task_table=document.getElementById('view-task-table')


async function LoadAllTasks(){
    try{
        const response=await fetch("https://taskflow-backend-esfy.onrender.com/View-Tasks",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data=await response.json();
        console.log(data);

        task_table.innerHTML="";


        if(data.Message){
            task_table.innerHTML=`
            <tr>
                <td colspan="3">${data.Message}</td>
            </tr>
            `;
        }
        else{
            const tasks=data["My Tasks"] || [];

            tasks.forEach(tasks=>{
                task_table.innerHTML+=`
                <tr>
                    <td>${tasks.Id}</td>
                    <td>${tasks.Title}</td>
                    <td>${tasks.Description}</td>
                    <td>${tasks["Created-on"]}</td>
                    <td>${tasks["Created-at"]}</td>
                    <td>${tasks["Due-date"]}</td>
                    <td>${tasks.Priority}</td>
                    <td>${tasks.Status}</td>
                </tr>
                `;
            });
        }
    }
    catch(error){
        console.log(error)
    }
}
LoadAllTasks();  




const AT_btn=document.getElementById('AT-btn');


    AT_btn.addEventListener('click', async(event)=>{
        event.preventDefault();

        const title=document.getElementById('title').value;
        const desc=document.getElementById('descrip').value;
        const Due=document.getElementById('duedate').value;
        const Priority=document.getElementById('HML').value;

        if (!title || !desc || !Due || !Priority) {
            document.getElementById('fail-message').textContent="Fill All Properties";
            document.getElementById('AT-fail-box').style.display="block";
            return;
        }

        try{
            const response=await fetch("https://taskflow-backend-esfy.onrender.com/Add-Task",{
                method:"POST",
                headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            },
            body:JSON.stringify({
                "title":title,
                "description":desc,
                "due_date":Due,
                "priority":Priority
            })

            });

            const data=await response.json();

            if(response.ok){
                document.getElementById("AT-success-box").style.display="block";

                document.getElementById('title').value = "";
                document.getElementById('descrip').value = "";
                document.getElementById('duedate').value = "";
                document.getElementById('HML').value = "";

                console.log(data);
            }else{
                document.getElementById('AT-fail-box').style.display="block";
                console.log(data);
            }
           
        }catch(error){
            console.log(error);
            document.getElementById("AT-fail-box").style.display="block";
        }
    }); 
    
const x_success=document.getElementById('xs-box')
x_success.addEventListener('click',(event)=>{
    event.preventDefault();
    document.getElementById("AT-success-box").style.display="none";
})

const x_fail=document.getElementById('xf-box')
x_fail.addEventListener('click',(event)=>{
    event.preventDefault();
    document.getElementById("AT-fail-box").style.display="none";
})










const id_u=document.getElementById('id-u');
const task_u=document.getElementById('task-u');
const des_u=document.getElementById('des-u');
const created_on_u=document.getElementById('created_on-u');
const created_at_u=document.getElementById('created_at-u');
const Due_date_u=document.getElementById('due_date-u')
const pri_u=document.getElementById('pri-u');
const status_u=document.getElementById('status-u');

const task_table_u=document.getElementById('view-task-to-update')


async function LoadAllTasks_TO_update(){
    try{
        const response=await fetch("https://taskflow-backend-esfy.onrender.com/View-Tasks",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data=await response.json();
        console.log(data);

        task_table_u.innerHTML="";


        if(data.Message){
            task_table_u.innerHTML=`
            <tr>
                <td colspan="3">${data.Message}</td>
            </tr>
            `;
        }
        else{
            const tasks=data["My Tasks"] || [];

            tasks.forEach(tasks=>{
                task_table_u.innerHTML+=`
                <tr>
                    <td>${tasks.Id}</td>
                    <td>${tasks.Title}</td>
                    <td>${tasks.Description}</td>
                    <td>${tasks["Created-on"]}</td>
                    <td>${tasks["Created-at"]}</td>
                    <td>${tasks["Due-date"]}</td>
                    <td>${tasks.Priority}</td>
                    <td>${tasks.Status}</td>
                </tr>
                `;
            });
        }
    }
    catch(error){
        console.log(error)
    }
}
LoadAllTasks_TO_update();  


const update_b=document.getElementById('button-to-update');

    update_b.addEventListener('click', async(event)=>{
        event.preventDefault();

       const new_id=document.getElementById('id-to-update').value;
       const new_title=document.getElementById('title-to-update').value;
       const new_description=document.getElementById('description-to-update').value;
       const new_duedate=document.getElementById('duedate-to-update').value;
       const new_priority=document.getElementById('priority-to-update').value;
       const new_status=document.getElementById('status-to-update').value;


       

        const body = { };
        if(new_title.trim() !==""){
            body.title=new_title
        }
        if (new_description.trim() !== "") {
            body.description = new_description;
        }

        if (new_duedate !== "") {
            body.due_date = new_duedate;
        }

        if (new_priority !== "") {
            body.priority = new_priority;
        }

        if (new_status !== "") {
            body.status = new_status;
        }
       


            try {
       
                const response = await fetch(
                    `https://taskflow-backend-esfy.onrender.com/Update-Task?id=${encodeURIComponent(new_id)}`,
                    {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                            },
                    body: JSON.stringify(body)
                    }
                );

                        const data = await response.json();
                        console.log(data);

                        if (response.ok) {
                           document.getElementById('UT-success-box').style.display="block";

                            
                        } else {
                           document.getElementById('UT-fail-box').style.display="block";
                        }

                    } catch (error) {
                        console.error(error);
                        alert("Server connection failed");
                    }
                });

const close_success=document.getElementById('UT-success-box');

close_success.addEventListener('click',(event)=>{
    event.preventDefault();
    document.getElementById('UT-success-box').style.display="none";

})
const close_fail=document.getElementById('UT-fail-box');

close_fail.addEventListener('click',(event)=>{
    event.preventDefault();
    document.getElementById('UT-fail-box').style.display="none";

})











const delete_task_button=document.getElementById('delete_task_button')

delete_task_button.addEventListener('click', async(event)=>{
    event.preventDefault();

    const delete_id=document.getElementById('delete-task-id').value;

    if(isNaN(delete_id)){
        document.getElementById('-Delete-fail-message').textContent="Enter Task-id";
        document.getElementById('Delete-fail-box').style.display="block";
        return;
    }

    try{
        const response=await fetch(`https://taskflow-backend-esfy.onrender.com/Delete-Task?id=${encodeURIComponent(delete_id)}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data=await response.json();
        console.log(data);

        
        if (response.ok) {
            document.getElementById('Delete-success-box').style.display="block";

                            
        } else {
            document.getElementById('Delete-fail-box').style.display="block";
        }

        } catch (error) {
            console.error(error);
            alert("Server connection failed");
        }
});


const close_Delete_success=document.getElementById('Delete-s-box');

close_Delete_success.addEventListener('click',(event)=>{
    event.preventDefault();
    document.getElementById('Delete-success-box').style.display="none";

})

const close_Delete_fail=document.getElementById('Delete-f-box');

close_fail.addEventListener('click',(event)=>{
    event.preventDefault();
    document.getElementById('Delete-fail-box').style.display="none";

})






const Get_Tasks=document.getElementById('Get-Tasks')
const CP_table=document.getElementById('cp-task-table')

Get_Tasks.addEventListener('click',async(event)=>{
    event.preventDefault();

    const status_value=document.getElementById('status-select').value;

    try{
        const response=await fetch(`https://taskflow-backend-esfy.onrender.com/Filter-via-Status?status_code=${encodeURIComponent(status_value)}`,{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data=await response.json();
        console.log(data);

        CP_table.innerHTML="";


        if(data.Message){
            CP_table.innerHTML=`
            <tr>
                <td colspan="3">${data.Message}</td>
            </tr>
            `;
        }
        else{
            const tasks=data["Tasks"] || [];

            tasks.forEach(tasks=>{
                CP_table.innerHTML+=`
                <tr>
                    <td>${tasks.Id}</td>
                    <td>${tasks.Title}</td>
                    <td>${tasks.Description}</td>
                    <td>${tasks["Created on"]}</td>
                    <td>${tasks["Created at"]}</td>
                    <td>${tasks["Due date"]}</td>
                    <td>${tasks.Priority}</td>
                    <td>${tasks.Status}</td>
                </tr>
                `;
            });
        }
    }
    catch(error){
        console.log(error)
    }
})








const Change_p_btn=document.getElementById('change-p');
Change_p_btn.addEventListener('click',async (event)=>{
    event.preventDefault();

    document.getElementById('change-pass').style.display="block";
    document.getElementById('delete-account').style.display="none";
})

const x_btn=document.getElementById('close-pass-change');
x_btn.addEventListener('click',async(event)=>{
    event.preventDefault();
    document.getElementById('change-pass').style.display="none";
})





const delete_account=document.getElementById('delete-account-btn');
delete_account.addEventListener('click',async(event)=>{
    event.preventDefault();
    document.getElementById('delete-account').style.display="block";
    document.getElementById('change-pass').style.display="none";
})

const xlose=document.getElementById('close-delete-account');
xlose.addEventListener('click',async(event)=>{
    event.preventDefault();
    document.getElementById('delete-account').style.display="none";
})

const no=document.getElementById('no');
no.addEventListener('click',async(event)=>{
    event.preventDefault();
    document.getElementById('delete-account').style.display="none";
})

const oks=document.getElementById('oks-b')
oks.addEventListener('click',(event)=>{
    event.preventDefault();

    document.getElementById('update-success-box').style.display="none";

})

const okf=document.getElementById('okf-b')
okf.addEventListener('click',(event)=>{
    event.preventDefault();

    document.getElementById('update-fail-box').style.display="none";
    
})



const ok_delete_box=document.getElementById('delete-s-b')
ok_delete_box.addEventListener('click',(event)=>{
    event.preventDefault();

    document.getElementById('delete-account-success-box').style.display="none";
    
})

const ok_delete_fail=document.getElementById('delete-f-b')
ok_delete_fail.addEventListener('click',(event)=>{
    event.preventDefault();

    document.getElementById('delete-account-fail-box').style.display="none";

})






const Update_password=document.getElementById('UPDATE-password')
Update_password.addEventListener('click',async(event)=>{
    event.preventDefault();

    const present_pass=document.getElementById('present_pass').value;
    const new_pass=document.getElementById('new_pass').value;


    try{
        const response=await fetch(`https://taskflow-backend-esfy.onrender.com/Change-Password`,{
        method:"PUT",
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
            },
        body:JSON.stringify({
            current_password:present_pass,
            new_password:new_pass
        })
    });



        const data=await response.json();
        console.log(data);

        if(response.ok && !data.Error){
            document.getElementById('update-success-box').style.display="block";
            document.getElementById('update-fail-box').style.display="none";
            
        }else{
            document.getElementById('update-fail-box').style.display="block";
            document.getElementById('update-success-box').style.display="none";
        }

    }catch(error){
        console.error(error);
        alert("Server connection failed");
    }

});







const delete_my_account=document.getElementById('delete-yes-btn')
delete_my_account.addEventListener('click',async(event)=>{
    event.preventDefault();
    try{
        const response=await fetch(`https://taskflow-backend-esfy.onrender.com/Delete-User-Account`,{
            method:"DELETE",
            headers:{
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
            
        });
        const data=await response.json();
        console.log(data)

        if(response.ok && !data.Error){
            document.getElementById('delete-account-success-box').style.display="block";
            document.getElementById('delete-account-fail-box').style.display="none";
            document.getElementById('delete-account').style.display="none";
            setTimeout(() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    window.location.href = "Login.html"; 
                }, 3000);
        }else{
            document.getElementById('delete-account-fail-box').style.display=" block"
            document.getElementById('delete-account-success-box').style.display="none";
            document.getElementById('delete-account').style.display="none";
        }
    }catch (error) {
        console.error("Connection error:", error);
        document.getElementById('delete-account-fail-box').style.display = "block";
    }

});






const search=document.getElementById('SEARCH');
search.addEventListener('click',async(event)=>{
    event.preventDefault();

    const keyword=document.getElementById('keyword').value;

    if (keyword === "") {
        LoadAllTasks();  
        return;
    }

    const response=await fetch(`https://taskflow-backend-esfy.onrender.com/Search-Tasks?keyword=${encodeURIComponent(keyword)}`,{
        method:"GET",
        headers:{
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const data=await response.json();
    console.log(data)

    task_table.innerHTML="";


    if(data.Message){
        task_table.innerHTML=`
        <tr>
            <td colspan="3">${data.Message}</td>
        </tr>
        `;
    }
    else{
        const Searched_tasks=data["Search Results"] || [];

         Searched_tasks.forEach(task=>{
                task_table.innerHTML+=`
                <tr>
                    <td>${task.Id}</td>
                    <td>${task.Title}</td>
                    <td>${task.Description}</td>
                    <td>${task["Created on"]}</td>
                    <td>${task["Created at"]}</td>
                    <td>${task["Due Date"]}</td>
                    <td>${task.Priority}</td>
                    <td>${task.Status}</td>
                </tr>
                `;
            });
    }
})

const keywordInput = document.getElementById("keyword");

keywordInput.addEventListener("input", () => {

    if (keywordInput.value.trim() === "") {
        LoadAllTasks();
    }

});








const update_status=document.getElementById('Change-status');

    update_status.addEventListener('click', async(event)=>{
        event.preventDefault();

    
       const the_status=document.getElementById('select-status').value;
       const taskid=document.getElementById('id_to_change_status').value;


       

        const body = { };

        if (the_status !== "") {
            body.status = the_status;
        }
       


            try {
       
                const response = await fetch(
                    `https://taskflow-backend-esfy.onrender.com/Change-Status?id=${encodeURIComponent(taskid)}`,
                    {
                    method: "PUT",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                            },
                    body: JSON.stringify(body)
                    }
                );

                        const data = await response.json();
                        console.log(data);

                        if (response.ok && !data.Error) {
                           document.getElementById('change-status-box1').style.display="block";

                            
                        } else {
                            document.getElementById('innertext').innerText="Status Not Changed!"
                            document.getElementById('change-status-box1').style.display="block";
                        }

                    } catch (error) {
                        console.error(error);
                        alert("Server connection failed");
                    }
                });


const oook=document.getElementById('oook')
oook.addEventListener('click',(event)=>{
    event.preventDefault();
    document.getElementById('change-status-box1').style.display="none";
})











window.onload = function () {
    Dashboard_layput.style.display = "block";
    View_tasks.style.display = "none";
    Add_task.style.display = "none";
    Manage.style.display = "none";
    Delete_task.style.display = "none";
    CP_task.style.display = "none";
    profile.style.display = "none";
    about_us.style.display = "none"; 
};


