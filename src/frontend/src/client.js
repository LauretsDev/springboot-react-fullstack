import fetch from "unfetch";

const checkStatus = response => {
    if (response.ok) {
        return response;
    }
    // convert non-2xx HTTP response into errors:
    const error = new Error(response.statusText);
    error.response = response;
    return Promise.reject(error);
}

export const getAllStudents = () => {
    return fetch('api/v1/students')
        .then(checkStatus);
}

export const addNewStudent = student => {
    return fetch('api/v1/students', {
        headers: {
            'Content-Type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify(student)
    }).then(checkStatus);
}

export const removeStudent = id => {
    return fetch(`api/v1/students/${id}`, {
        method: 'DELETE'
    }).then(checkStatus);
}