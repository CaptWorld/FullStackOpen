const Notification = ({ message, error }) => {
    if (message == null) {
        return null;
    }
    return (
        <div
            style={{
                color: error ? 'red' : 'green',
                background: 'lightgrey',
                fontSize: '20px',
                'borderStyle': 'solid',
                'borderRadius': 5,
                'padding': 10,
                'marginBottom': 10
            }}
        >
            {message}
        </div>
    )
}

export default Notification