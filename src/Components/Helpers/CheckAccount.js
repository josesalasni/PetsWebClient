export const CheckAccount = (props) => {

    if (localStorage.getItem('auth_token') === null) {
        props.history.push('/'); 
    } 
}

