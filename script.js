
let AllTasks = JSON.parse(localStorage.getItem("AllTasks"))|| [];
let InputValue = "";
let isCheck;
let input;
let task;



window.onload = function() {

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
  }

 render()
  
};

inputChange = (e) => {
  InputValue = e.target.value;
}

keyDownSave = (e) => {
  if(e.keyCode === 13) {
    InputValue = e.target.value;
    onClickButton();
  }
}

onClickButton = () => {
  if (Boolean(InputValue)) {
    AllTasks.push({
      task: InputValue,
      isCheck: false,
      isEdit: false,
    });
    // console.log(AllTasks)
    InputValue = "";
    input.value = "";
    localStorage.setItem("AllTasks", JSON.stringify(AllTasks));    
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


    if(!item.isEdit){// убираем чекбокс, если редактируем инпут
      checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      divForOut.appendChild(checkBox);
      checkBox.checked = item.isCheck? true : false;
      checkBox.addEventListener("click", function () {onClickCheckBox(index)} )
    }
   
    
    if (!item.isEdit){// создаем <p>, если не редактируем
      task = document.createElement("p");
      task.innerHTML = item.task;
      task.className = item.isCheck? "textDone" : "text";
      divForOut.appendChild(task);
    } else{//создаем <input> куда вложим новое значение 
      //вешаем на инпут функцию что делать, когда отредактировали
      taskEdit = document.createElement("input");
      taskEdit.value = item.task;
      divForOut.appendChild(taskEdit);
      taskEdit.addEventListener("change", function () {doneTaskEdit(item, index)});

      imgDone = document.createElement("img"); //картинка для окончания редактирования
      imgDone.src = "img/done.svg";
      imgDone.className = "imageEdit";
      divForOut.appendChild(imgDone);
      imgDone.addEventListener("click", function () {doneTaskEdit(item, index)});
    }
    //картинка для редактирования
    if(!item.isEdit){
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

  AllTasks[index].isEdit = !AllTasks[index].isEdit;
  localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
  render();

}


doneTaskEdit = (item, index) => {

  if(taskEdit.value){
   
    InputValue = taskEdit.value;
    AllTasks[index].task = InputValue;
    InputValue = "";
    AllTasks[index].isEdit = !AllTasks[index].isEdit;
    localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
    render();
  }else{
    AllTasks[index].task = item.task;
    InputValue = "";
    AllTasks[index].isEdit = !AllTasks[index].isEdit;
    localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
    render();
  }
  
}

onClickCheckBox = (index) => {
  AllTasks[index].isCheck = !AllTasks[index].isCheck; 
  localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
  render();
}

onClickImageDelete = (index) => {
  
  AllTasks.splice(index,1);
  localStorage.setItem("AllTasks", JSON.stringify(AllTasks));
  let t = document.getElementById(`task_${index}`)
  t.remove();
  render();
}

onClickDeleteAll = () =>{

  AllTasks = [];
  console.log( AllTasks);
  localStorage.removeItem("AllTasks");
  render();
}