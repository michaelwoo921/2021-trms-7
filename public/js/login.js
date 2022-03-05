window.onload = () => {
    document.getElementById('submit').onclick = login;
                                   //.addEventListenter('click', login);
}

async function login() {
    let user = document.getElementById('name').value;
    console.log(user);
    let pass = document.getElementById('password').value;
    console.log(pass);
    const response = await fetch('/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name: user , password: pass})
    });
    const data = await response.json();
    console.log(data);
    return data;
       
}