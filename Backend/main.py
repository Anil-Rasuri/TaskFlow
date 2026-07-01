from fastapi import FastAPI
import psycopg2

from pydantic import BaseModel
import bcrypt

from jose import jwt
from datetime import datetime,timedelta,timezone,date

from jose import JWTError,jwt
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import Depends

from typing import Optional

from fastapi.middleware.cors import CORSMiddleware






app=FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



con=psycopg2.connect(
    host="localhost",
    database="Task_Manager",
    user="postgres",
    password="postgres"
)
con.close()



class RegisterUser(BaseModel):
    username:str
    password:str
    confirm_password:str



@app.post("/Registration")
def User_Registration(user:RegisterUser):
    if len(user.username.strip()) <3:
        return{"Error":"Username is too short"}
    if len(user.password.strip()) <4:
        return{"Error":"Password is too short"}
    if user.password != user.confirm_password:
        return{"Error":"Passwords don't Match"}
    
    con = psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor = con.cursor()

    cursor.execute("SELECT id FROM users WHERE username=%s",(user.username,))
    existing_user=cursor.fetchone()
    if existing_user:
        con.close()
        return{"Error":"Username Unavailable"}
    
    hashed_password=bcrypt.hashpw(
        user.password.encode(),
        bcrypt.gensalt()
    ).decode()

    cursor.execute("INSERT INTO users(username,password) VALUES(%s,%s)",(user.username,hashed_password))
    con.commit()
    con.close()
    return{"Message":"Registration Successful"}





SECRET_KEY="iam_so_so_dumb"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=40

security=HTTPBearer()

def create_access_token(data:dict):
    to_encode=data.copy()
    expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp":expire})
    encoded_jwt=jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt

def verify_token(token:str):
    try:
        payload=jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

@app.get("/Login")
def User_Login(username:str, password:str):
    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT id,username,password FROM users WHERE username=%s",(username,))
    fetched_user=cursor.fetchone()
    if not fetched_user:
        return{"Error": "Invalid Username"}
    if not bcrypt.checkpw(
        password.encode(),
        fetched_user[2].encode()
    ):
        return{"Error": "Password Incorrect"}
    
    token=create_access_token({"user_id":fetched_user[0]})

    return{"Message":f"WELCOME {username}", "Access_Token":token}




class AddTask(BaseModel):
    title:str
    description:str
    priority:str
    due_date:date

@app.post("/Add-Task")
def Add_task(task:AddTask, credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()
    
    cursor.execute("INSERT INTO tasks(user_id,title,description,priority,due_date) VALUES (%s,%s,%s,%s,%s)", (user_id, task.title, task.description, task.priority, task.due_date))
    con.commit()
    con.close()
    return{"Message":"Task Added Successfully"}




@app.get("/View-Tasks")
def View_Tasks(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]
    
    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT id,title,description,priority,due_date,status,created_date,created_time FROM tasks WHERE user_id=%s ORDER BY id DESC",(user_id,))
    All_tasks=cursor.fetchall()
    con.close()


    if not All_tasks:
        return{"Message":"No Tasks Found"}
    Tasks=[]
    for task in All_tasks:
        actual_time=task[7]
        formated_time=actual_time.strftime("%I:%M %p") if actual_time is not None else "N/A"
        Tasks.append(
        {
            "Id":task[0],
            "Title":task[1],
            "Description":task[2],
            "Priority":task[3],
            "Due-date":task[4],
            "Status":task[5],
            "Created-on":task[6],
            "Created-at":formated_time
        })
    return{"My Tasks":Tasks}

@app.get("/View-Task")
def View_Task(id:int, credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]
    
    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT id,title,description,priority,due_date,status,created_date,created_time FROM tasks WHERE user_id=%s AND id=%s",(user_id,id))
    Single_task=cursor.fetchone()
    actual_time=Single_task[7]
    formated_time=actual_time.strftime("%I:%M %p") if actual_time is not None else "N/A"

    if not Single_task:
        con.close()
        return{"Message":"No Task Found"}
    return{"Id":Single_task[0],
           "Title":Single_task[1],
           "Description":Single_task[2],
           "Priority":Single_task[3],
           "Due_date":Single_task[4],
           "Status":Single_task[5],
           "Created on":Single_task[6],
            "Created at":formated_time}



class UpdateTask(BaseModel):
    title:Optional[str]=None
    description:Optional[str]=None
    due_date:Optional[date]=None
    





@app.delete("/Delete-Task")
def Delete_Task(id:int, credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT id FROM tasks WHERE id=%s AND user_id=%s",(id,user_id))
    delete_task=cursor.fetchone()
    if not delete_task:
        return{"Error":"Nothing Found to Delete"}

    cursor.execute("DELETE FROM tasks WHERE id=%s AND user_id=%s",(id,user_id))
    con.commit()
    con.close()
    return{"Message":" Task Deleted Successfully"}

class UpdateTask(BaseModel):
    title:Optional[str]=None
    description:Optional[str]=None
    priority:Optional[str]=None
    due_date:Optional[date]=None
    status:Optional[str]=None


@app.put("/Update-Task")
def Update_Task(id:int, update:UpdateTask, credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT title, description, priority, due_date, status FROM tasks WHERE id=%s AND user_id=%s ", (id,user_id))
    edit_task=cursor.fetchone()

    if not edit_task:
        con.close()
        return{"Error":"Nothing Found to update"}
    
    new_title=update.title if update.title is not None else edit_task[0]
    new_description=update.description if update.description is not None else edit_task[1]
    new_priority=update.priority if update.priority is not None else edit_task[2]
    new_due_date=update.due_date if update.due_date is not None else edit_task[3]
    new_status=update.status if update.status is not None else edit_task[4]

    cursor.execute("UPDATE tasks SET title=%s, description=%s, priority=%s, due_date=%s, status=%s WHERE id=%s AND user_id=%s", (new_title,new_description, new_priority,new_due_date,new_status, id,user_id))
    con.commit()
   
    cursor.execute("SELECT id,title,description,priority,due_date,status,created_date,created_time FROM tasks WHERE id=%s AND user_id=%s ", (id,user_id))
    updated_task=cursor.fetchone()
    actual_time=updated_task[7]
    formated_time=actual_time.strftime("%I:%M %p") if actual_time is not None else "N/A"


    if not updated_task:
        return{"Error":"Nothing Found to update"}
    
    return{"Message":"Update Successful",
           "Id":updated_task[0],
           "Title":updated_task[1],
           "Description":updated_task[2],
           "Priority":updated_task[3],
           "Due Date":updated_task[4],
           "Status":updated_task[5],
            "Created on":updated_task[6],
            "Created Time":formated_time}




@app.get("/Dashboard")
def User_Dashboard(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)
    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]
    
    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT COUNT(title), COUNT(CASE WHEN status='completed' THEN 1 END), COUNT(CASE WHEN status='Pending' THEN 1 END) FROM tasks WHERE user_id=%s",(user_id,))
    Fetched_details=cursor.fetchone()

    
    return{"Total Tasks":Fetched_details[0],
           "Completed Tasks":Fetched_details[1],
           "Pending Tasks":Fetched_details[2],
           }



@app.get("/Dashboard-Urgent-Tasks")
def User_Dashboard(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)
    if not payload:
        con.close()
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]
    
    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT title,description,due_date,status FROM tasks WHERE user_id=%s AND status !='completed' AND due_date <=CURRENT_DATE ORDER BY due_date ASC ",(user_id,))
    urgent_tasks=cursor.fetchall() 
    con.close()

    if not urgent_tasks:
        return{"Message":"NO Urgent tasks or overdue"}
    
    overdue_tasks=[]
    for task in urgent_tasks:
        overdue_tasks.append({
            "Title":task[0],
            "description":task[1],
            "due_date":task[2],
            "status":task[3],
        })
    return{"Urgent Over-Due Tasks":overdue_tasks}
    

@app.get("/Priority-Breakdown")
def Priority_Breakdown(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]
    
    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT priority, COUNT(id) FROM tasks WHERE user_id=%s GROUP BY priority",(user_id,))
    priority_wise=cursor.fetchall()
    con.close()

    final_breakdown={
        "High":0,
        "Medium":0,
        "Low":0
    }

    for pri in priority_wise:
        pri_name=pri[0]
        pri_count=pri[1]
    
    

        if pri_name=="High":
            final_breakdown["High"]=pri_count
        elif pri_name=="Medium":
            final_breakdown["Medium"]=pri_count
        elif pri_name=="Low":
            final_breakdown["Low"]=pri_count

    return{
        "Status":"Success",
        "Data":{
            "Total Categorized":final_breakdown["High"] + final_breakdown["Medium"]+final_breakdown["Low"],
            "Breakdown":final_breakdown
        }
    }


@app.get("/Profile")
def User_Profile(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)
    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT  username,created_at FROM users WHERE id=%s", (user_id,))
    username=cursor.fetchone()
    if not username:
        return{"Error":"Username not Found"}
    

    return{"Message":f"WELCOME {username[0]}",
           "Account Created On":username[1]}



class ChangePassword(BaseModel):
    current_password:str
    new_password:str

@app.put("/Change-Password")
def Change_Password(password_section:ChangePassword, credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)
    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT password FROM users WHERE id=%s", (user_id,))
    password_record=cursor.fetchone()
    if not password_record:
        return{"Error":"Not Found"}
    
    current_hashed_password=password_record[0]

    if not bcrypt.checkpw(password_section.current_password.encode(), current_hashed_password.encode()):
        con.close()
        return{"Error":"The password you entered is incorrect"}

    new_hashed_password=bcrypt.hashpw(password_section.new_password.encode(),bcrypt.gensalt()).decode()

    cursor.execute("UPDATE users SET password=%s WHERE id=%s", (new_hashed_password,user_id))
    con.commit()
    con.close()

    return{"Message":"Password change Successful"}


class ChangeStatus(BaseModel):
    status:str

@app.put("/Change-Status")
def Change_Status(id:int, status_button:ChangeStatus, credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]

    status_codes=status_button.status.strip()
    if status_codes not in ["Pending", "completed"]:
        return {"Error":"Invalid status value"}

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT title, description, priority, due_date, status FROM tasks WHERE id=%s AND user_id=%s ", (id,user_id))
    edit_task=cursor.fetchone()

    if not edit_task:
        con.close()
        return{"Error":"Nothing Found to update"}
    

    cursor.execute("UPDATE tasks SET status=%s WHERE id=%s AND user_id=%s",(status_codes,id,user_id))
    con.commit()
    con.close()

    return{"Message":"Status Update Completed"}





@app.delete("/Delete-User-Account")
def Delete_Account(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT id FROM users WHERE id=%s",(user_id,))
    find_user=cursor.fetchone()

    if not find_user:
        return{"Error":"User Not Found"}
    
    cursor.execute("DELETE FROM users WHERE id=%s",(user_id,))
    con.commit()

    cursor.execute("DELETE FROM tasks WHERE id=%s",(user_id,))
    con.commit()
    con.close()

    return{"Message":"Account and All Tasks Deleted Successfully"}




@app.get("/Pending Tasks")
def Pending_Tasks(credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT id,title,description,due_date,status FROM tasks WHERE status='Pending' AND user_id=%s ",(user_id,))
    pending_tasks=cursor.fetchall()

    if not pending_tasks:
        return{"Message":"No Pendings Tasks"}
    
    Total_pending=[]
    for task in pending_tasks:
        Total_pending.append({
            "Id":task[0],
            "Title":task[1],
            "Description":task[2],
            "Due Date":task[3],
            "Status":task[4]
        })
    return{"Total Pending Tasks":Total_pending}
           


@app.get("/Filter-via-Status")
def Filter_Via_Status(status_code:str, credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    cursor.execute("SELECT id,title,description,priority,due_date,status,created_date,created_time FROM tasks WHERE status=%s AND user_id=%s",(status_code,user_id))
    Filtered_status=cursor.fetchall()

    Filtered_one=[]
    for task in Filtered_status:
        actual_time=task[7]
        formated_time=actual_time.strftime("%I:%M %p") if actual_time is not None else "N/A"
        Filtered_one.append({
            "Id":task[0],
            "Title":task[1],
            "Description":task[2],
            "Priority":task[3],
            "Due Date":task[4],
            "Status":task[5],
            "Created On":task[6],
            "Created at":formated_time
        })
    return{"Tasks":Filtered_one}




@app.get("/Search-Tasks")
def Search_Tasks(keyword:str,credentials:HTTPAuthorizationCredentials=Depends(security)):
    token=credentials.credentials
    payload=verify_token(token)

    if not payload:
        return{"Error":"Invalid Token"}
    
    user_id=payload["user_id"]

    con=psycopg2.connect(
        host="localhost",
        database="Task_Manager",
        user="postgres",
        password="postgres"
    )
    cursor=con.cursor()

    search_term=f"%{keyword}%"
    cursor.execute("SELECT id,title,description,priority,due_date,status,created_date,created_time FROM tasks WHERE user_id=%s AND (title ILIKE %s OR description ILIKE %s)",(user_id,search_term,search_term))
    searched_one=cursor.fetchall()

    if not searched_one:
        return{"Error":"You Search Not Found"}
    
    searched_tasks=[]
    for task in searched_one:
        actual_time=task[7]
        formated_time=actual_time.strftime("%I:%M %p") if actual_time is not None else "N/A"
        searched_tasks.append({
            "Id":task[0],
            "Title":task[1],
            "Description":task[2],
            "Priority":task[3],
            "Due Date":task[4],
            "Status":task[5],
            "Created on":task[6],
            "Created at":formated_time
        })
    return{"Search Results":searched_tasks}