"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/app/lib/supabaseClient'; 

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); 

  useEffect(() => {
    const getUserAndFetchStudents = async () => {
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
            if (userData.role === 'student') {
              router.push('/');
              return;
            }

            setUser({
              email: user.email,
              name: user.user_metadata?.full_name || user.email,
              role: userData.role,
            });

            const { data: studentsData, error: studentsError } = await supabase
              .from('users')
              .select('id, full_name, email')
              .eq('role', 'student'); 

            if (studentsError) {
              console.error('Öğrenciler alınamadı:', studentsError.message);
            } else {
              console.log('Fetched students:', studentsData);
              setStudents(studentsData);
            }
          }
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error('Hata:', error.message);
        router.push('/'); 
      } finally {
        setLoading(false);
      }
    };

    getUserAndFetchStudents();
  }, [router]);

  const handleViewDetails = (userId) => {
    router.push(`/admin/${userId}`);
  };

  if (loading) {
    return <div className="text-center mt-5">Yükleniyor...</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Admin Page</h1>
      <h2 className="text-center mb-4">Öğrenci Listesi</h2>
      <ul className="list-group">
        {students.length > 0 ? (
          students.map((student) => (
            <li key={student.id} className="list-group-item d-flex justify-content-between align-items-center">
              {student.full_name} - {student.email}
              <button className="btn btn-primary" onClick={() => handleViewDetails(student.id)}>
                Detayları Görüntüle
              </button>
            </li>
          ))
        ) : (
          <li className="list-group-item">Öğrenci bulunamadı</li>
        )}
      </ul>
    </div>
  );
}