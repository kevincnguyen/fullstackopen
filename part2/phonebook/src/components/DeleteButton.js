const DeleteButton = ({name, id, handleDelete}) => {
    return (
        <button onClick={() => handleDelete(id, name)}>delete</button>
    );
}

export default DeleteButton;