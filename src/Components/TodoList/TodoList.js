import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addTask, deleteTask, addList, editTask, ListItemDelete, reorderList } from '../Redux/TodoSlice';
import { CgClose } from 'react-icons/cg';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { AiFillDelete } from 'react-icons/ai';
import { GrFormAdd } from 'react-icons/gr';
import styles from './TodoList.module.css';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import SearchAppBar from '../Navbar/Navbar';

function TodoList() {
  const [isClick, setIsClick] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [task, setTask] = useState('');
  const [list, setList] = useState('');
  const [edit, setEdit] = useState('');
  const [showEdit, setShowEdit] = useState(false);
  const dispatch = useDispatch();
  const { Todo } = useSelector((state) => state.todo);

  const navigate = useNavigate();

  const handleAdd = () => {
    dispatch(addTask({ myTask: task }));
    setTask('');
  };

  const handleAddCard = (taskId) => {
    dispatch(addList({ taskId, list }));
    setList('');
  };

  const handleEnterClick = (e, taskId) => {
    if (e.keyCode === 13) {
      handleAddCard(taskId);
    }
  };

  const handleEnter = (e) => {
    if (e.keyCode === 13) {
      dispatch(addTask({ myTask: task }));
      setTask('');
    }
  };

  const deleteData = (id) => {
    dispatch(deleteTask({ id: id }));
  };

  const deleteList = (id, titleId) => {
    dispatch(ListItemDelete({ id: id, titleId: titleId }));
  };

  const handleEdit = (title) => {
    setEdit(title);
    setShowEdit(!showEdit);
  };

  const handleEditable = (e, task, id, prev) => {
    if (e.keyCode === 13) {
      if (task !== '') {
        dispatch(editTask({ id: id, title: task }));
        setShowEdit(!showEdit);
      } else {
        dispatch(editTask({ id: id, title: prev }));
        setShowEdit(!showEdit);
      }
    }
  };

  const handleDynamicRouting = (key, cardName) => {
    navigate(`/description/${key}/${cardName}`);
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(
      reorderList({
        sourceIndex: source.index,
        destinationIndex: destination.index,
        sourceId: source.droppableId,
        destinationId: destination.droppableId,
      })
    );
  };

  const handleEditList = (titleId, listId, task, listContent) => {
    setList(task);
    if (task !== '') {
      dispatch(editTask({ titleId: titleId, listId: listId, task: task }));
      setShowEdit(!showEdit);
    } else {
      dispatch(editTask({ titleId: titleId, listId: listId, task: listContent }));
      setShowEdit(!showEdit);
    }
  }

  return (
    <div className={styles.back}>
      <SearchAppBar />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className={styles.wrapper}>
          {Todo.map((title) => (
            <div className={styles.mapContainer} key={title.id}>
              <div className={styles.title}>
                {!showEdit ? (
                  <span
                    className={styles.titleHead}
                    onClick={() => handleEdit(title.AddData)}
                  >
                    {title.AddData}
                  </span>
                ) : (
                  <input
                    autoFocus
                    className={styles.titleHead}
                    onKeyDown={(e) =>
                      handleEditable(e, edit, title.id, title.AddData)
                    }
                    type='text'
                    value={edit}
                    onChange={(e) => setEdit(e.target.value)}
                  />
                )}
                <span
                  className={styles.more}
                  onClick={() => deleteData(title.id)}
                >
                  <AiFillDelete />
                </span>
                <span className={styles.more}>
                  <BiDotsHorizontalRounded />
                </span>
              </div>

              <div>
                <Droppable droppableId={title.id} key={title.id}>
                  {(provided) => (
                    <ul
                      className={styles.draggable}
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                    >
                      {title.TodoList.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <li
                              className={styles.card}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              ref={provided.innerRef}
                            >
                              <div className={styles.cardss}>
                                <p
                                  onClick={() =>
                                    handleDynamicRouting(item.id, item.myList)
                                  }
                                >
                                  <span onClick={()=> handleEditList(title.id, item.id, list, item.myList)}>{item.myList}</span>
                                </p>
                                <AiFillDelete
                                  className={styles.deleteListItem}
                                  onClick={() =>
                                    deleteList(item.id, title.id)
                                  }
                                />
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </ul>
                  )}
                </Droppable>
              </div>

              {!showAddCard ? (
                <button
                  className={styles.cardButton}
                  onClick={() => setShowAddCard(!showAddCard)}
                >
                  <GrFormAdd className={styles.addIcon} />
                  Add a card
                </button>
              ) : (
                <div className={styles.cardContainer}>
                  <input
                    className={styles.inputCard}
                    placeholder='Enter a title for this card...'
                    value={list}
                    onChange={(e) => setList(e.target.value)}
                    onKeyDown={(e) => handleEnterClick(e, title.id)}
                    autoFocus
                  />
                  <div className={styles.buttonContainer}>
                    <button
                      className={styles.button}
                      onClick={() => handleAddCard(title.id)}
                    >
                      Add card
                    </button>
                    <CgClose
                      className={styles.close}
                      onClick={() => {
                        setShowAddCard(!showAddCard);
                        setList('');
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
          <div>
            <Droppable droppableId='todolist'>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {!isClick ? (
                    <button
                      className={styles.listButton}
                      onClick={() => {
                        setIsClick(!isClick);
                      }}
                    >
                      + Add another list
                    </button>
                  ) : (
                    <div className={styles.inputContainer}>
                      <input
                        className={styles.input}
                        type='text'
                        placeholder='Enter list title...'
                        value={task}
                        onChange={(e) => setTask(e.target.value)}
                        onKeyDown={handleEnter}
                        autoFocus
                      />
                      <div className={styles.buttonContainer}>
                        <button
                          className={styles.button}
                          onClick={handleAdd}
                        >
                          Add list
                        </button>
                        <CgClose
                          className={styles.close}
                          onClick={() => {
                            setIsClick(!isClick);
                            setTask('');
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default TodoList;
