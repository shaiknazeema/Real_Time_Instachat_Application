import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../api/auth';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await registerUser(form);
      setMsg('Registration successful!');
      navigate('/login');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex justify-content-center align-items-center bg-light">
      <form 
        onSubmit={handleSubmit} 
        className="p-4 rounded shadow bg-white w-100"
        style={{ maxWidth: '400px' }}
      >
        <h2 className="mb-4 text-center text-success">Register</h2>
        <div className="mb-3">
          <input
            name="name"
            type="text"
            className="form-control"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="email"
            type="email"
            className="form-control"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <input
            name="password"
            type="password"
            className="form-control"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Register</button>
        {msg && (
          <div className={`mt-3 text-center ${msg === 'Registration successful!' ? 'text-success' : 'text-danger'}`}>
            {msg}
          </div>
        )}
      </form>
    </div>
  );
}
