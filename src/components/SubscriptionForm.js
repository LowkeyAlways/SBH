import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import validation from './SignupValidation';
import { useNavigate } from 'react-router-dom';

function SubscriptionForm() {
    const [values, setValues] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        phone: ''
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [emailExists, setEmailExists] = useState(false);

    axios.defaults.withCredentials = true;
    useEffect(() => {
        axios.get(`${process.env.REACT_APP_HOST}/`)
            .then(res => {
                console.log(res.data);
                if (res.data.valid) {
                    navigate('/');
                }
            })
            .catch(err => {
                console.log(err);
                navigate('/login');
            });
    }, []);

    const handleInput = (e) => {
        setValues(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const formErrors = validation(values.email, values.password, values.firstname, values.lastname);

        // Check if there are any validation errors
        if (Object.values(formErrors).some(error => error !== '')) {
            // If there are errors, update the state and prevent form submission
            setErrors(formErrors);
            console.log('Il y a des erreurs de validation');
            return;
        }

        axios.post(`https://sbh-production.up.railway.app/api/check-email`, { email: values.email })
            .then(res => {
                const { exists } = res.data;
                if (exists) {
                    // Si l'email existe déjà, afficher un message d'erreur
                    setEmailExists(true);
                } else {
                    // Si l'email n'existe pas, soumettre le formulaire
                    axios.post(`${process.env.REACT_APP_HOST}/api/register`, values)
                        .then(res => {
                            console.log(res);
                            navigate('/login');
                        })
                        .catch(err => console.log(err));
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className='d-flex vh-100 justify-content-center align-items-center'>
            <div className='login-form p-3 bg-white border rounded'>
                <legend className='text-center'>Inscription</legend>
                <form onSubmit={handleSubmit}>
                    <div className='mb-3'>
                        <label htmlFor="email">Prénom</label>
                        <input type="name" placeholder='Prénom' className='form-control' name='firstname'
                            onChange={handleInput}></input>
                        {errors.firstname && <span className='text-danger'>{errors.firstname}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email">Nom</label>
                        <input type="name" placeholder='Nom' className='form-control' name='lastname'
                            onChange={handleInput}></input>
                        {errors.lastname && <span className='text-danger'>{errors.lastname}</span>}
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="email">Email</label>
                        <input type="email" placeholder='nom@exemple.com' className='form-control' name='email'
                            onChange={handleInput}></input>
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                        {emailExists && <span className="text-danger">Cet email est déjà utilisé.</span>}

                    </div>
                    <div className='mb-3'>
                        <label htmlFor="password">Mot de Passe</label>
                        <input type="password" placeholder='************' className='form-control' name='password'
                            onChange={handleInput}></input>
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                        <p>(8 caractères min., 1 chiffre obligatoire)</p>
                    </div>
                    <div className='mb-3'>
                        <label htmlFor="number">Portable (Facultatif)</label>
                        <input type="number" placeholder='Téléphone' className='form-control' name='phone'
                            onChange={handleInput}></input>
                    </div>
                    <button type='submit' className='btn btn-primary'>S'inscrire</button>
                </form>
            </div>
        </div>
    )
}

export default SubscriptionForm;
