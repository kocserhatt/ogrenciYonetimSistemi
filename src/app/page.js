"use client";
import { supabase } from './lib/supabaseClient';
import { useEffect, useState } from 'react';
import Register from './pages/register'; // Kayıt bileşeni
import Login from './pages/login'; // Giriş bileşeni

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (session) {
          const { user } = session;
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (userError) {
            console.error('Kullanıcı rolü alınamadı:', userError.message);
          } else {
            setUser({
              email: user.email,
              name: user.user_metadata?.full_name || user.email, // Kullanıcı adını almak için full_name kullanıyoruz
              role: userData.role, // Kullanıcı rolünü ekleyin
            });

            // Eğer kullanıcı öğrenci ise notları al
            if (userData.role === 'student') {
              const { data: gradesData, error: gradesError } = await supabase
                .from('grades')
                .select('*')
                .eq('user_id', user.id);

              if (gradesError) {
                console.error('Notlar alınamadı:', gradesError.message);
              } else {
                setGrades(gradesData);
              }
            }
          }
        }
      } catch (error) {
        console.error('Hata:', error.message);
      } finally {
        setLoading(false); // Yüklenme durumunu kapat
      }
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null);
      window.location.href = '/'; // Çıkış yaptıktan sonra ana sayfaya yönlendir
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
  const calculateAverage = (grade) => {
    const scores = [grade.exam1, grade.exam2, grade.project].filter(score => score !== null);
    if (scores.length === 0) return 'Hesaplanamadı';
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return (sum / scores.length).toFixed(2);
  };

  return (
    <div className="container text-center mt-5">
      <h1>Öğrenci Yönetim Sistemine</h1>
      <h1 className="mb-4">Hoş Geldiniz!</h1>

      {user ? (
        <>
          {user.role === 'student' ? (
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
                  {grades.map((grade) => (
                    <tr key={grade.id}>
                      <th scope="row">{grade.course_name}</th>
                      <td>{grade.exam1 !== null ? grade.exam1 : 'G'}</td>
                      <td>{grade.exam2 !== null ? grade.exam2 : 'G'}</td>
                      <td>{grade.project !== null ? grade.project : 'G'}</td>
                      <td>{calculateAverage(grade)}</td>
                    </tr>
                  ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div>
              <p>Admin sayfasına yönlendiriliyorsunuz...  <a href="/admin">admin sayfası</a></p>
              <p className="mb-3">
                  Giriş Yapan Kullanıcı: <strong>{user.name} / {user.role}</strong>
                </p>
              <button className="btn btn-danger" onClick={handleLogout}>
                  Çıkış Yap
                </button>
            </div>
          )}
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