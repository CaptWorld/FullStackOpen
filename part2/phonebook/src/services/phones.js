import axios from 'axios';

const url = 'http://localhost:3001';

const getAll = () => axios
    .get(`${url}/persons`)
    .then(response => response.data);


const addPerson = (newPerson) => axios
    .post(`${url}/persons`, newPerson)
    .then(response => response.data);

const deletePerson = (id) => axios
    .delete(`${url}/persons/${id}`)
    .then(response => response.data);

export default { getAll, addPerson, deletePerson };