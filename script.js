
let AllTasks = JSON.parse(localStorage.getItem("AllTasks"))|| [];
let InputValue = "";
let isCheck;
let input;
let text;
let flagEdit;

window.onload = async function() {

  input = document.getElementById("into");
  input.addEventListener("change", inputChange);
  input.addEventListener("keydown", keyDownSave);

  let button = document.getElementsByTagName('button')[0]
  button.addEventListener("click", onClickButton)

  divMain = document.getElementsByClassName('main')[0];

  divMini = document.createElement("div");
  divMini.className = "divMini";
  divMain.appendChild(divMini);
  
  if(AllTasks !== []){
    removeAll = document.createElement("button");
    removeAll.innerHTML = "Delete all Tasks";
    divMain.appendChild(removeAll);
    removeAll.addEventListener("click", onClickDeleteAll);
  }else{

  }
  
  let resp = await fetch("http://localhost:8000/allTasks", {metod: "GET"});
  let result = await resp.json();
  AllTasks = result.data;
  console.log("загрузка с сервера", result.data);
  

 render()
  
};

inputChange = async (e) => {
  InputValue = e.target.value;
}

keyDownSave = (e) => {
  if(e.keyCode === 13) {
    InputValue = e.target.value;
    onClickButton();
  }
}

//добавление нового задания связала с сервером:
onClickButton = async () => {
  if (Boolean(InputValue)) {
    AllTasks.push({
      text: InputValue,
      isCheck: false,
    });
    
    const resp = await fetch("http://localhost:8000/createTask", {
      method: "POST",
      headers: {
        "Content-type":"application/json;charset=utf-8",
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        text: InputValue,
        isCheck: false,
      })
      
    });
   
    let result = await resp.json();
    console.log("загрузка на сервер", result);
    AllTasks = result.data;
    console.log(AllTasks);
    
    console.log(result.data)

    localStorage.setItem("AllTasks", JSON.stringify(AllTasks));  
    InputValue = "";
    input.value = "";
     
    render();
  }
  
}

render = () => {

  while (divMini.firstChild){
    divMini.firstChild.remove();
  }

  AllTasks.map((item, index) => {
        
    let divForOut = document.createElement("div");
    divForOut.className = "divforOut";
    divMini.appendChild(divForOut);
    divForOut.id = `task_${index}`;


    if(flagEdit !== index){// убираем чекбокс, если редактируем инпут
      checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      divForOut.appendChild(checkBox);
      checkBox.checked = item.isCheck? true : false;
      checkBox.addEventListener("click", function () {onClickCheckBox(index)} )
    }
   
    
    if (flagEdit !== index){// создаем <p>, если не редактируем
      text = document.createElement("p");
      text.innerHTML = item.text;
      text.className = item.isCheck? "textDone" : "text";
      divForOut.appendChild(text);
    } else{//создаем <input> куда вложим новое значение 
      //вешаем на инпут функцию что делать, когда отредактировали
      taskEdit = document.createElement("input");
      taskEdit.value = item.text;
      divForOut.appendChild(taskEdit);
      taskEdit.addEventListener("change", function () {doneTaskEdit(item, index)});

      imgDone = document.createElement("img"); //картинка для окончания редактирования
      imgDone.src = "img/done.svg";
      imgDone.className = "imageEdit";
      divForOut.appendChild(imgDone);
      imgDone.addEventListener("click", function () {doneTaskEdit(item, index)});
    }
    //картинка для редактирования
    if(flagEdit !== index){
      let imageEdit = document.createElement("img");
      imageEdit.src = "img/edit.svg";
      imageEdit.className = "imageEdit";
      imageEdit.hidden = item.isCheck? true : false;
      divForOut.appendChild(imageEdit);
      imageEdit.addEventListener("click", function () { onClickImageEdit(index)});
    }
    
    //картинка для удаления
    let imageDelete = document.createElement("img");
    imageDelete.src = "img/delete.svg";
    imageDelete.className = "imageEdit";
    divForOut.appendChild(imageDelete);
    imageDelete.addEventListener("click", function () { onClickImageDelete(index)});

  })

}

onClickImageEdit = (index) => {

  flagEdit = index;
  localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
  render();
}

//изменение Задания связала с сервером
doneTaskEdit = async (item, index) => {

  if(taskEdit.value){

    InputValue = taskEdit.value;
    AllTasks[index].text = InputValue;

    let resp = await fetch(`http://localhost:8000/updateTask?=${AllTasks[index]._id}`, {
    method: "PATCH", 
    headers: {
      "Content-type":"application/json;charset=utf-8",
      'Access-Control-Allow-Origin': "*"
    },
    body: JSON.stringify({
      _id: AllTasks[index]._id,
      text: taskEdit.value,
    })
  });
  let result = await resp.json();
  AllTasks = result.data;


    InputValue = "";
    flagEdit = !flagEdit;
    localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
    render();
   
  }else{
    AllTasks[index].text = item.text;
    InputValue = "";
    flagEdit = !flagEdit;
    localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
    render();
  }
  
}

//изменение Чексбокса связала с сервером
onClickCheckBox = async (index) => {

  AllTasks[index].isCheck = !AllTasks[index].isCheck; 
  localStorage.setItem("AllTasks", JSON.stringify(AllTasks));

  let resp = await fetch(`http://localhost:8000/updateTask?=${AllTasks[index]._id}`, {
    method: "PATCH", 
    headers: {
      "Content-type":"application/json;charset=utf-8",
      'Access-Control-Allow-Origin': "*"
    },
    body: JSON.stringify({
      _id: AllTasks[index]._id,
      isCheck: AllTasks[index].isCheck,
    })


  });
  let result = await resp.json();
  AllTasks = result.data;
  console.log("загрузка с сервера", result.data);
  
  render();
}

//удаление 1 задания связала с сервером и Базой Данных:
onClickImageDelete = async (index) => {
 
  console.log(AllTasks[index]._id)
  const resp = await fetch(`http://localhost:8000/deleteTask?_id=${AllTasks[index]._id}`, {
      method: "DELETE",
  });


  let result = await resp.json();
  console.log("после удаления на сервере",result.data);
  
  AllTasks.splice(index,1);

  localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
  let t = document.getElementById(`task_${index}`)

  t.remove();
  render();
  
  console.log("чпок")
}

//удаление ВСЕХ заданий связала с сервером:
onClickDeleteAll = () =>{

  console.log(AllTasks);
 
  AllTasks.map( async (item, index) => {

    const resp = await fetch(`http://localhost:8000/deleteTask?_id=${item._id}`, {
      method: "DELETE",
      });
      let result = await resp.json();
      console.log(result.data)
  });

  AllTasks = [];
  localStorage.removeItem("AllTasks");
  render();
};

