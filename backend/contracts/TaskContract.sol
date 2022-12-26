// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

contract TaskContract {
    // creating events
    event AddTask(address recipient, uint taskid);
    event DeleteTask(uint taskid, bool isDeleted);

    // struct
    struct Task {
        uint id;
        string taskText;
        bool isDeleted;
    }

    // array
    Task[] private tasks;
     
    // map
    mapping(uint => address) taskToOwner;

    // add function
    function addTask(string memory taskText, bool isDeleted) external {
        uint taskId = tasks.length;
        tasks.push(Task(taskId, taskText, isDeleted));
        taskToOwner[taskId] = msg.sender;
        // calling the function
        emit AddTask(msg.sender, taskId);
    }

    // get all tasks
    function getMyTasks() external view returns (Task[] memory) {
        // creating a dynamic array
        Task[] memory temporary = new Task[](tasks.length);
        uint counter = 0;

        for (uint i = 0; i < tasks.length; i++) {
            if (taskToOwner[i] == msg.sender && tasks[i].isDeleted == false) {
                temporary[counter] = tasks[i]; 
                counter++;
            }
        }

        Task[] memory result = new Task[](counter);
        for (uint i = 0; i < counter; i++) {
                result[i] = temporary[i];
        }
        return result;
    }

//with this we will make isDeleted true so that when we get sll task only not deleted ones appear
    function deleteTask(uint taskId,bool isDeleted) external{
        if (taskToOwner[taskId]==msg.sender) {
            tasks[taskId].isDeleted=isDeleted ; //true
emit DeleteTask(taskId,isDeleted);
        }
    }
}
