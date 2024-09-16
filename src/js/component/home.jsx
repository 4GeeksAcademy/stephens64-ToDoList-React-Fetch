import React, { useState, useEffect } from "react";
import '/workspaces/stephens64-ToDoList-React-Fetch/src/styles/index.css';

const Home = () => {
	const [inputValue, setInputValue] = useState("");
	const [taskList, setTaskList] = useState([]);

	// Fetch tasks from API when component mounts
	useEffect(() => {
		fetchTodos(setTaskList);
	}, []);

	// Fetch Todos from the API
	const fetchTodos = (setTaskList) => {
		fetch('https://playground.4geeks.com/todo/users/Brock_Stephens')
			.then((resp) => {
				if (!resp.ok) {
					throw new Error("Failed to fetch todo list. Status: " + resp.status);
				}
				return resp.json();
			})
			.then((userObject) => {
				if (Array.isArray(userObject.todos)) {
					setTaskList(userObject.todos);
				} else {
					setTaskList([]);
				}
			})
			.catch((error) => {
				console.error("There has been a problem with your fetch operation:", error);
			});
	};

	// Add new todo when user hits Enter
	const handleAddTodo = (event) => {
		if (event.key === "Enter" && inputValue.trim() !== "") {
			fetch('https://playground.4geeks.com/todo/todos/Brock_Stephens', {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					label: inputValue.trim(),
					is_done: false
				})
			})
				.then((resp) => {
					if (resp.ok) {
						fetchTodos(setTaskList);
					}
				})
				.catch((error) => console.error("Failed to add task", error));
			setInputValue("");
		}
	};

	// Delete a specific todo
	const deleteTodo = (index) => {
		let todoID = taskList[index].id;

		fetch(`https://playground.4geeks.com/todo/todos/${todoID}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			},
		})
			.then((resp) => {
				if (resp.ok) {
					fetchTodos(setTaskList);
				}
			})
			.catch((error) => console.error("Failed to delete todo", error));
	};

	// Clear all tasks
	const handleClearTasks = () => {
		fetch('https://playground.4geeks.com/todo/users/Brock_Stephens', {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json"
			}
		})
			.then((resp) => {
				if (resp.ok) {
					setTaskList([]);
				}
			})
			.catch((error) => console.error("Failed to clear all tasks", error));
	};

	// Create a new user in the API
	const handleCreateUser = () => {
		fetch('https://playground.4geeks.com/todo/users/Brock_Stephens', {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}
		})
		.then((resp) => {
			if (resp.ok) {
				alert("User has been created, and tasks can now be saved to the API");
			}
		})
		.catch((error) => console.error("Failed to create user in API", error));
	};

	return (
		<div className="todo-container">
			<h1>My Todo List</h1>
			<input
				className="task-input"
				type="text"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleAddTodo}
				placeholder="Add a task and press Enter"
			/>
			<ul className="task-list">
				{taskList.length === 0 ? (
					<li className="no-task">No tasks, add a task</li>
				) : (
					taskList.map((item, index) => (
						<li className="task-item" key={item.id}>
							{item.label}
							<span className="delete-task" onClick={() => deleteTodo(index)}>
								✖
							</span>
						</li>
					))
				)}
			</ul>
			<div className="d-flex justify-content-center">
				<button className="btn btn-danger" onClick={handleClearTasks}>
					Clear All Tasks
				</button>
				<button className="btn btn-success ms-2" onClick={handleCreateUser}>
					Create User
				</button>
			</div>
		</div>
	);
};

export default Home;
