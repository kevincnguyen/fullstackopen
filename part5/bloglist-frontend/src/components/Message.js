const Message = ({message, success}) => {
    const successStyle = {
        color: 'green', 
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    };

    const errorStyle = {
        color: 'red', 
        background: 'lightgrey',
        fontSize: '20px',
        borderStyle: 'solid',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px'
    };
    
    if (message === null) {
        return null; 
    }

    if (success) {
        return (
            <div style={successStyle}>
                {message}
            </div>
        );
    } 

    return (
        <div style={errorStyle}>
            {message}
        </div>
    );
}

export default Message; 