let timeout: ReturnType<typeof setTimeout> | null;
let currentValue: string;

const fetchPatientURL = 'http://127.0.0.1:8000/api/clinic-histories';
const fetchPatientsURL = 'http://127.0.0.1:8000/api/clinic-histories/getInfo';
const savePatientURL = 'http://127.0.0.1:8000/api/clinic-histories/save';
const deletePatientURL = 'http://127.0.0.1:8000/api/clinic-histories';

const fetchHistoriesURL = 'http://127.0.0.1:8000/api/clinic-histories/detail/getInfo';
const deleteHistoriesURL = 'http://127.0.0.1:8000/api/clinic-histories/detail';

export const fetchPatient = (value: string, callback: Function) => {
    if (timeout) {
        clearTimeout(timeout);
        timeout = null;
    }
    currentValue = value;

    timeout = setTimeout(() => {
        fetch(`${fetchPatientURL}/${value}`)
            .then((response) => response.json())
            .then((response) => {
                if (currentValue === value) {
                    callback(response);
                }
            });
    }, 500);
};

export const fetchPatients = (callback: Function) => {
    fetch(fetchPatientsURL)
        .then((response) => response.json())
        .then((response) => {
            callback(response);
        });
}

export const sendPatient = (data: any, callback: Function) => {
    fetch(`${savePatientURL}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then((response) => {

            if (response.ok) {
                callback(true)
            }
            return response.json();
        })
}

export const fetchHistories = (id: string, callback: Function) => {
    fetch(`${fetchHistoriesURL}/${id}`)
        .then((response) => response.json())
        .then((response) => {
            callback(response);
        });
}

export const deleteDetail = (id: string) => {
    fetch(`${deleteHistoriesURL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
}

export const deletePatient = (id: string) => {
    fetch(`${deletePatientURL}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
    })
}