import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Ad için yeni state
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp(
      {
        email,
        password,
        options: {
          data: {
            full_name: name, // Kullanıcı adını user_metadata içinde ekliyoruz
          },
        },
      }
    );
    if (error) {
      setError(error.message);
    } else {
      setMessage('Kayıt başarılı! Lütfen giriş yapın.');
      setEmail('');
      setPassword('');
      setName(''); // Formu temizlerken adı da sıfırlıyoruz
    }
  };

  return (
    <div className="card mb-4 p-4">
      <h2 className="text-center">Kayıt Ol</h2>
      {error && <p className="text-danger">{error}</p>}
      {message && <p className="text-success">{message}</p>}
      <form onSubmit={handleRegister}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-success w-100">Kayıt Ol</button>
      </form>
    </div>
  );
}
