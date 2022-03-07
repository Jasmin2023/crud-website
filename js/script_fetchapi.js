
const createNewUserTable = document.getElementById('add-user-form');
const tableOutput = document.querySelector('.tableOutput');
const profileTable = document.querySelector('#profile_table');
const userProfileSection = document.querySelector('#user-profile-section');
const userProfileSection2 = document.querySelector('#user-profile-section-2');
const tableSection = document.querySelector('#table-section');

userProfileSection.style.display = "none";
userProfileSection2.style.display = "none";
const btn = document.querySelector('.btn');
const baseurl = 'https://reqres.in/api/';
var userList = [];
const app = {
    pg:[1,2]
}

window.addEventListener('DOMContentLoaded', loadData());

function loadData(){
    const para = 'users?page=';
    const url = baseurl + para;
    for(const id of app.pg){
        fetch(`${url}${id}`)
            .then(res => res.json())
            .then(res => {
                res.data.forEach(element => {
                    userList.push(element);
                });
                $('#table_id').DataTable({
                    paging: true,
                    searching: true,
                    data: userList,
                    "bDestroy": true,
                    "columns":[  
                        {data: "id"},  
                        {data: "first_name"},  
                        {data: "last_name"}, 
                        {
                            data: "id",
                            render: function(data){
                                return " <button class='btn btn-secondary' data-id="+ data +" onclick='userColor("+ data +");userProfile("+ data +");'>Update</button><button class='btn btn-danger' data-id=" + data + " onclick='deleteUser("+ data +")'>Delete</button>";
                            }
                        },   
                   ]
                }); 
            });
    }
    
}

function makeNode(parent,nodeType,content){
    const el = document.createElement(nodeType);
    parent.append(el);
    el.innerHTML = content;
    return parent.appendChild(el);
}

function addUser(user){
    const outputTr = makeNode(tableOutput, 'tr', '');
    const html1 = `${user.id}`;
    const html2 = `${user.first_name}`;
    const html3 = `${user.last_name}`;

    makeNode(outputTr, 'td', html1);
    makeNode(outputTr, 'td', html2);
    makeNode(outputTr, 'td', html3);
    const outputTd4 = makeNode(outputTr, 'td', '');
    
    const button1 = makeNode(outputTd4, 'button', '');
    const button2 = makeNode(outputTd4, 'button', '');
    button1.classList.add('btn');
    button1.classList.add('btn-secondary');
    button2.classList.add('btn');
    button2.classList.add('btn-danger');

    button1.innerHTML = 'Update';
    button1.addEventListener('click', function(){
        userProfile(user);
        userColor(user);
    })
    button2.innerHTML = 'Delete';
    button2.addEventListener('click', function(){
        deleteUser(user);
    });
}


function addNewUser(){
    const para = 'users/';
    const url = baseurl + para;
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            email: document.querySelector('#user_email'),
            first_name: document.querySelector('#user_first_name').value,
            last_name: document.querySelector('#user_last_name').value
        }),
        headers:{
            'Content-Type' : "application/json" 
        }
    })
    .then(response => response.json())
    .then(data => {
        $.magnificPopup.close();
      
        addUser(data);

    })
}

createNewUserTable.addEventListener('submit', function(e){
    e.preventDefault();
    addNewUser();
})

function userProfile(user){
    userProfileSection.style.display = "block";
    userProfileSection2.style.display = "block";
    tableSection.style.display = "none";
    document.querySelector('#add_user').style.display = "none";
    
    const para = 'users/'+ user;
    const url = baseurl + para;
   
    fetch(url)
        .then(response => response.json())
        .then(response => {
            
            profileTable.innerHTML = `
            <h3 class="title">My Profile</h3>
            <div class="panel">
                <table class="table" width="100%">
                    <tr>
                        <th>Id</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Avatar</th>
                        <th>Last Updated</th>
                        <th>Job</th>
                    </tr>
                    <tr>
                        <td>${response.data.id}</td>
                        <td><input class="form-control" type="text" id="updated-fname" value="${response.data.first_name}"> </td>
                        <td>${response.data.last_name}</td>
                        <td>${response.data.email}</td>
                        <td><img width="40" src="${response.data.avatar}"></td>
                        <td id="updated-at">${response.data.updatedAt}</td>
                        <td><input class="form-control" type="text" id="updated-Job" value="${response.data.job}"></td>
                    </tr>
                </table>
                <div class="back-btn-container col-xs-12 text-center">
                    <button class="btn btn-secondary" onclick="updateProfile(${response.data.id})">UPDATE</button>
                   
                </div>
            </div>`
            var jobValue = document.getElementById('updated-Job');
            if (jobValue.value == 'undefined'){    
                jobValue.value = "Update Job Title";
            }
        })
}

function back(){
   document.querySelector('#table-section').style.display = "block";
   document.querySelector('#user-profile-section').style.display = "none";
   document.querySelector('#user-profile-section-2').style.display = "none";
   document.querySelector('#add_user').style.display = "block";
}

function updateProfile(id){
    const para = 'users/'+id;
    const url = baseurl + para;
    fetch(url, {
        method: 'PATCH',
        headers: {
         'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            first_name: document.getElementById('updated-fname').value,
            job: document.getElementById('updated-Job').value
        })
    })
        .then(res => res.json())
        .then(data => {
            document.getElementById('updated-at').innerHTML = data.updatedAt;
            document.getElementById('updated-fname').value = data.first_name;
            document.getElementById('updated-Job').value = data.job;
             
    })
}

function deleteUser(user){
    const para = 'users/'+ user;
    const url = baseurl + para;
    fetch(url, {
        method: "DELETE",
        body: JSON.stringify({
            "id": user,
        })
    }).then(res => {
            if(res.ok){
                
                alert(`User number ${user} can not be deleted`)
            } else {
                alert(`Error with Status Code: ${res.status}`)
            }
        })
}

function userColor(id){
    const para = 'unknown/'+id;
    const url = baseurl + para;
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(res => res.json())
        .then(data => {
            createColor(data.data);
        })
}

function createColor(data){
    document.querySelector('#color-table').innerHTML = `
    <h3 class="title" id="color-title" style="color:${data.color}">My Color</h3>
    <table class="table" width="100%">
        <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Year</th>
            <th>Color</th>
            <th>Pantone value</th>
        </tr>
        <tr>
            <td>${data.id}</td>
            <td>${data.name}</td>
            <td>${data.year}</td>
            <td><input class="form-control" type="text" id="colorValue" oninput="changeColorFunction()" value="${data.color}"> </td>
            <td>${data.pantone_value}</td>
        </tr>
    </table>
    <div class="back-btn-container col-xs-12 text-center">
        <button class="btn btn-secondary" onclick="back();">BACK</button>
    </div>
    
    `
}

function changeColorFunction() {
    const colorValue = document.getElementById('colorValue').value;
    document.getElementById('color-title').style.color =  colorValue;

} 
document.querySelector('#add-user-form').addEventListener('change', function(){
    const user_first_name = document.querySelector('#user_first_name').value;
    const user_last_name = document.querySelector('#user_last_name').value;
    const create_btn = document.querySelector('#create_btn');
    const validation = document.querySelector('#validation');

    if(user_first_name != "" && user_last_name != ""){
        create_btn.classList.remove('disabled')
    } 
})
 