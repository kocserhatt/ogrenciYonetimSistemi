"use client";
import { supabase } from './lib/supabaseClient';
import { useEffect, useState } from 'react';
import Register from './pages/register'; // Kayıt bileşeni
import Login from './pages/login'; // Giriş bileşeni

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { user } = session;
        setUser({
          email: user.email,
          name: user.user_metadata?.full_name || user.email, // Kullanıcı adını almak için full_name kullanıyoruz
        });
      }
      setLoading(false);
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
    } else {
      console.error('Çıkış hatası:', error.message);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <p>Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h1>Öğrenci Yönetim Sistemine</h1>
      <h1 className="mb-4">Hoş Geldiniz!</h1>

      {user ? (
        <>
          <div>
            <p className="mb-3">
              Giriş Yapan Kullanıcı: <strong>{user.name}</strong>
            </p>
            <button className="btn btn-danger" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
          <div className="mt-4">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">Dersler</th>
                  <th scope="col">İlk Sınav</th>
                  <th scope="col">İkinci Sınav</th>
                  <th scope="col">Proje</th>
                  <th scope="col">Ortalama</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Matematik</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Türk Dili Ve Edibiyatı</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Fizik</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Biyoloji</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Kimya</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Din</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Felsefe</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Resim</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Müzik</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
                <tr>
                  <th scope="row">Beden Eğitim</th>
                  <td colSpan="1">80</td>
                  <td>50</td>
                  <td>45</td>
                  <td>58,333</td>
                </tr>
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div>
          {showRegister ? (
            <div>
              <Register />
              <p>
                Hesabınız var mı?{' '}
                <button className="btn btn-link" onClick={() => setShowRegister(false)}>
                  Giriş Yap
                </button>
              </p>
            </div>
          ) : (
            <div>
              <Login />
              <p>
                Hesabınız yok mu?{' '}
                <button className="btn btn-link" onClick={() => setShowRegister(true)}>
                  Kayıt Ol
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
