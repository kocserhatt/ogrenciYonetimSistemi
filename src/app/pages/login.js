import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Hata mesajını sıfırla

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Giriş hatası:', error);
      setError(error.message);
    } else {
      setUser(data.user); // Kullanıcı bilgilerini state'e kaydet
      setTimeout(() => {
        window.location.reload(); // Sayfayı 2 saniye sonra yenile
      }, 1000);
    }
  };

  return (
    <div className="card mb-4 p-4">
      <h2 className="text-center">Giriş Yap</h2>
      {error && <p className="text-danger">{error}</p>}
      {user ? (
        <p className="text-success">
          Giriş başarılı, hoş geldin <strong>{user.user_metadata?.full_name || user.email}</strong>!
        </p>
      ) : (
        <form onSubmit={handleLogin}>
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
          <button type="submit" className="btn btn-primary w-100">Giriş Yap</button>
        </form>
      )}
    </div>
  );
}
