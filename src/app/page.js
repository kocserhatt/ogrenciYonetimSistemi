"use client";
import Image from "next/image";
import { supabase } from './lib/supabaseClient';
import { useEffect, useState } from 'react';
import Register from './pages/register'; // Kayıt bileşeni
import Login from './pages/login'; // Giriş bileşeni

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Yükleniyor durumu

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null); // Oturum varsa kullanıcıyı al
      setLoading(false); // Yükleme tamamlandı
    };

    getUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      setUser(null); // Kullanıcıyı null yap
    } else {
      console.error('Çıkış hatası:', error.message); // Hata varsa konsola yaz
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}><p>Yükleniyor...</p></div>; // Yükleniyor mesajı
  }

  return (
    <div className="container text-center mt-5">
      <h1 className="mb-4">Hoş Geldiniz!</h1>
      
      {user ? (
        <div>
          <p className="mb-3">Giriş Yapan Kullanıcı: <strong>{user.email}</strong></p>
          <button className="btn btn-danger" onClick={handleLogout}>Çıkış Yap</button> {/* Çıkış yap butonu */}
        </div>
      ) : (
        <div>
          <p>Öğrenci Yönetim Sistemi</p>
          <Register /> {/* Kayıt bileşenini burada ekle */}
          <Login /> {/* Giriş bileşenini burada ekle */}
        </div>
      )}
    </div>
  );
}
