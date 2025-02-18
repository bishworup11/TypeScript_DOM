const addButton=document.getElementById('add-button') as HTMLButtonElement;
const deleteButton=document.getElementById('delete-button') as HTMLButtonElement;
const header=document.querySelector('.header') as HTMLElement;

function getDayText(day: number): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
}

function getMonthText(month: number): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month];
}

function getGreeting(hour: number): string {
    if (hour < 12) {
        return "Good Morning. What's your plan today?";
    } else if (hour < 18) {
        return "Good Afternoon. What's your plan today?";
    } else {
        return "Good Evening. What's your plan today?";
    }
}

const day = getDayText(new Date().getDay());
const date=new Date().getDate();
const month = getMonthText(new Date().getMonth());
const year=new Date().getFullYear();
const welcomeText =  getGreeting(new Date().getHours()); ;

header.children[0].textContent=`${date} ${month} ${year}`;
header.children[1].textContent=welcomeText;


type Todo={
    id:number;  
    text:string;
    done:boolean;
}

let todoList:Todo[]=localStorage.getItem('todoList')?JSON.parse(localStorage.getItem('todoList')!):[];

 if(todoList.length>0){
     buildTable(todoList);
 }

addButton.addEventListener('click',()=>{
    const inputText=document.querySelector('input')?.value;
    document.querySelector('input')!.value='';
    const todo:Todo={
        id:Date.now(),
        text:inputText!,
        done:false
    }
    todoList.push(todo);
    console.log(todoList);

    buildTable(todoList);
    localStorage.setItem('todoList',JSON.stringify(todoList));

})

function buildTable(todoList:Todo[]){

    const table=document.querySelector('table')!;
      //clear table body
     table.children[1].innerHTML='';
     todoList.forEach(todo=>{
        const tr=document.createElement('tr');
        const td1=document.createElement('td');
         td1.textContent=todo.text;
        const td2=document.createElement('td');
        td2.innerHTML=`<button onclick="editFun(this)">Edit</button>
                      <button onclick="completeFun(this)">Complete</button>
                      <button onclick="deleteFun(this)">Delete</button>`;
        tr.appendChild(td1);
        tr.appendChild(td2);
        tr.setAttribute('key', todo.id.toString());
        if(todo.done){
            td1.style.textDecoration='line-through';
            td2.innerHTML=`<button onclick="editFun(this)">Edit</button>
                      <button onclick="completeFun(this)">Completed</button>
                      <button onclick="deleteFun(this)">Delete</button>`;
             tr.classList.add('completed');         
        }
        table.children[1].appendChild(tr);

     });
 
}

function deleteFun(bt:HTMLButtonElement){

    const li=bt.parentElement?.parentElement as HTMLTableRowElement
    const key=li.getAttribute('key');
     
    todoList=todoList.filter(todo=>todo.id.toString()!==key);
    localStorage.setItem('todoList',JSON.stringify(todoList));
    li.parentElement?.removeChild(li);
}

function completeFun(bt:HTMLButtonElement){
    const li=bt.parentElement?.parentElement as HTMLTableRowElement
    const key=li.getAttribute('key');
    const todo=todoList.find(todo=>todo.id.toString()===key);
    if(todo){
        todo.done=!todo.done;
    }
    buildTable(todoList);
    localStorage.setItem('todoList',JSON.stringify(todoList));

}

function editFun(bt:HTMLButtonElement){
    const li=bt.parentElement?.parentElement as HTMLTableRowElement
    if(bt.textContent==='Edit'){
        bt.textContent='Save';
        li.children[0].innerHTML=`<input type="text" value="${li.children[0].textContent}">`;
     }
     else {
        bt.textContent='Edit';
        const key=li.getAttribute('key');
        const todo=todoList.find(todo=>todo.id.toString()===key);
        if(todo){
            todo.text=(li.children[0].children[0] as HTMLInputElement).value;
        }
        buildTable(todoList);
        localStorage.setItem('todoList',JSON.stringify(todoList));
     };
     

}


function filterTodo(e:Event)
{
    const clickText=(e.target as HTMLSelectElement).innerText;
    const par=(e.target as HTMLSelectElement).parentElement as HTMLUListElement;

    if(clickText==='Show All'){
        buildTable(todoList);
        par.children[0].classList.add('active');
        par.children[1].classList.remove('active');
        par.children[2].classList.remove('active');

    }
    else if(clickText==='Completed'){
        const completedList=todoList.filter(todo=>todo.done);
        buildTable(completedList);
        par.children[0].classList.remove('active');
        par.children[1].classList.add('active');
        par.children[2].classList.remove('active');
     
    }
    else{
        const pendingList=todoList.filter(todo=>!todo.done);
        buildTable(pendingList);
        par.children[0].classList.remove('active');
        par.children[1].classList.remove('active');
        par.children[2].classList.add('active');
    }
}