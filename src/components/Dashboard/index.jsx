import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";
import {
  MainContainer,
  DashboardContainer,
  Greetings,
  UserProfileContainer,
  UserProfileBtn,
  AddTaskForm,
  TaskInputContainerLabel,
  TaskInputContainerText,
  AddBtn,
  TaskListContainer,
  ListContainer,
  TitleAndRemoveContainer,
  ListTitleHeading,
  RemoveBtn,
  ListTitle,
  ListPara,
  StatusContainer,
  StatusCheckbox,
  Status,
  CreatedDate,
  NoTasks,
} from "./styledComponents.js";

function Dashboard() {
  const [titleInput, setTitleInput] = useState("");
  const [descInput, setDescInput] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [userName, setUserName] = useState("");
  const [callEffect, setCallEffect] = useState(true);
  const navigate = useNavigate();
  const jwtToken = Cookies.get("jwt_token");
  useEffect(() => {
    if (jwtToken === undefined) {
      navigate("/login", { replace: true });
    }
  }, []);
  useEffect(() => {
    const callApi = async () => {
      try {
        const apiUrl = "https://todo-fullstack-kd1i.onrender.com";
        const options = {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          method: "GET",
        };
        const response = await fetch(apiUrl, options);
        const data = await response.json();
        setTaskData(data[1]);
        setUserName(data[0].username);
      } catch (err) {
        console.log("Server Error");
      }
    };
    callApi();
  }, [callEffect]);
  const onTextIn = (event) => {
    setTitleInput(event.target.value);
  };
  const onDesIn = (event) => {
    setDescInput(event.target.value);
  };
  const formSubmit = async (event) => {
    event.preventDefault();
    if (titleInput.length >= 1) {
      const addApiUrl = "https://todo-fullstack-kd1i.onrender.com/addtask/";
      const todoTask = {
        title: titleInput,
        description: descInput,
      };
      const addOptions = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todoTask),
      };
      await fetch(addApiUrl, addOptions);
      setCallEffect(!callEffect);
      setTitleInput("");
      setDescInput("");
    }
  };
  const removeTask = async (id) => {
    const delTaskUrl = `https://todo-fullstack-kd1i.onrender.com/deletetask/${id}`;
    const options = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    await fetch(delTaskUrl, options);
    setCallEffect(!callEffect);
  };
  const boxClicked = async (id, status) => {
    const updateStatus = `https://todo-fullstack-kd1i.onrender.com/updatetask/${id}`;
    const statusUpdates = { status: `${status}` };
    const options = {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(statusUpdates),
    };
    const response = await fetch(updateStatus, options);
    setCallEffect(!callEffect);
  };
  const logoutUser = async () => {
    Cookies.remove("jwt_token");
    navigate("/login", { replace: true });
  };
  return (
    <MainContainer>
      <DashboardContainer>
        <Greetings>{`Hello, ${userName}`}</Greetings>
        <UserProfileContainer>
          <Greetings as="h1">Your Tasks</Greetings>
          <UserProfileBtn title="Logout" onClick={logoutUser}>
            {userName[0]}
          </UserProfileBtn>
        </UserProfileContainer>
        <AddTaskForm as="form" onSubmit={formSubmit}>
          <AddTaskForm>
            <TaskInputContainerLabel htmlFor="title">
              Title
            </TaskInputContainerLabel>
            <TaskInputContainerText
              type="text"
              id="title"
              value={titleInput}
              onChange={onTextIn}
            />
          </AddTaskForm>
          <AddTaskForm>
            <TaskInputContainerLabel htmlFor="description">
              Description
            </TaskInputContainerLabel>
            <TaskInputContainerText
              type="text"
              id="description"
              value={descInput}
              onChange={onDesIn}
            />
          </AddTaskForm>
          <AddBtn type="submit">Add</AddBtn>
        </AddTaskForm>
        {taskData.length > 0 ? (
          <TaskListContainer>
            {taskData.map((each, index) => {
              return (
                <ListContainer key={each.id}>
                  <TitleAndRemoveContainer>
                    <ListTitleHeading>Title:</ListTitleHeading>
                    <RemoveBtn onClick={() => removeTask(each.id)}>
                      <i className="bi bi-trash3-fill"></i>
                    </RemoveBtn>
                  </TitleAndRemoveContainer>
                  <ListTitle>{each.title}</ListTitle>
                  <p>Description:</p>
                  <ListPara className="list-para">{each.description}</ListPara>
                  <TitleAndRemoveContainer>
                    <StatusContainer>
                      <StatusCheckbox
                        type="checkbox"
                        id={each.index}
                        checked={each.status === "Completed" ? true : false}
                        onChange={(event) => {
                          boxClicked(each.id, event.target.checked);
                        }}
                      />
                      <Status htmlFor={each.index}>{each.status}</Status>
                    </StatusContainer>
                    <CreatedDate>{each.createdDate}</CreatedDate>
                  </TitleAndRemoveContainer>
                </ListContainer>
              );
            })}
          </TaskListContainer>
        ) : (
          <NoTasks>No tasks found</NoTasks>
        )}
      </DashboardContainer>
    </MainContainer>
  );
}
export default Dashboard;
