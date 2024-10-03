"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function AdminStudentDetail() {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editGrade, setEditGrade] = useState(null);
  const router = useRouter();
  const params = useParams();
  const { userss } = params;

  useEffect(() => {
    if (!userss) {
      console.error('Geçersiz öğrenci ID');
      setLoading(false);
      return;
    }

    const fetchStudentAndGrades = async () => {
      try {
        const { data: studentData, error: studentError } = await supabase
          .from('users')
          .select('id, full_name, email')
          .eq('id', userss)
          .single();

        if (studentError) {
          console.error('Öğrenci alınamadı:', studentError.message);
        } else {
          setStudent(studentData);

          const { data: gradesData, error: gradesError } = await supabase
            .from('grades')
            .select('*')
            .eq('user_id', userss);

          if (gradesError) {
            console.error('Notlar alınamadı:', gradesError.message);
          } else {
            setGrades(gradesData);
          }
        }
      } catch (error) {
        console.error('Hata:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentAndGrades();
  }, [userss]);

  const handleEditClick = (grade) => {
    setEditGrade(grade);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditGrade((prevGrade) => ({
      ...prevGrade,
      [name]: value,
    }));
  };

  const handleUpdateGrade = async (e) => {
    e.preventDefault();

    // Notların 100'den büyük olup olmadığını kontrol et
    if (
      (editGrade.exam1 !== null && editGrade.exam1 > 100) ||
      (editGrade.exam2 !== null && editGrade.exam2 > 100) ||
      (editGrade.project !== null && editGrade.project > 100)
    ) {
      alert('100 den büyük not giremezsiniz');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('grades')
        .update({
          exam1: editGrade.exam1 !== null ? parseInt(editGrade.exam1) : null,
          exam2: editGrade.exam2 !== null ? parseInt(editGrade.exam2) : null,
          project: editGrade.project !== null ? parseInt(editGrade.project) : null,
        })
        .eq('id', editGrade.id);

      if (error) {
        console.error('Not güncellenemedi:', error.message);
      } else {
        console.log('Not güncellendi:', data);
        setGrades((prevGrades) =>
          prevGrades.map((grade) =>
            grade.id === editGrade.id ? editGrade : grade
          )
        );
        setEditGrade(null);
      }
    } catch (error) {
      console.error('Veri güncelleme hatası:', error.message);
    }
  };

  const calculateAverage = (grade) => {
    const scores = [grade.exam1, grade.exam2, grade.project].filter(score => score !== null);
    if (scores.length === 0) return 'H';
    const sum = scores.reduce((acc, score) => acc + score, 0);
    return (sum / scores.length).toFixed(2);
  };

  if (loading) {
    return <div className="text-center mt-5">Yükleniyor...</div>;
  }

  if (!student) {
    return <div className="text-center mt-5">Öğrenci bulunamadı</div>;
  }

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Öğrenci Detayları</h1>
      <p><strong>Adı:</strong> {student.full_name}</p>
      <p><strong>Email:</strong> {student.email}</p>
      <h2 className="text-center mb-4">Notlar</h2>
      <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Dersler</th>
            <th scope="col">İlk Sınav</th>
            <th scope="col">İkinci Sınav</th>
            <th scope="col">Proje</th>
            <th scope="col">Ortalama</th>
            <th scope="col">Düzenle</th>
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
              <td>
                <button className="btn btn-primary" onClick={() => handleEditClick(grade)}>
                  Düzenle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editGrade && (
        <div className="mt-4 mb-5">
          <h2 className="text-center mb-4">Not Düzenle</h2>
          <form onSubmit={handleUpdateGrade}>
            <div className="mb-3">
              <h3 className="form-label">Ders Adı: {editGrade.course_name}</h3>
            </div>
            <div className="mb-3">
              <label htmlFor="exam1" className="form-label">İlk Sınav</label>
              <input
                type="number"
                className="form-control"
                id="exam1"
                name="exam1"
                value={editGrade.exam1 !== null ? editGrade.exam1 : ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exam2" className="form-label">İkinci Sınav</label>
              <input
                type="number"
                className="form-control"
                id="exam2"
                name="exam2"
                value={editGrade.exam2 !== null ? editGrade.exam2 : ''}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="project" className="form-label">Proje</label>
              <input
                type="number"
                className="form-control"
                id="project"
                name="project"
                value={editGrade.project !== null ? editGrade.project : ''}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">Not Güncelle</button>
          </form>
        </div>
      )}
      <p><strong>G</strong>=Girilmedi</p>
      <p><strong>H</strong>=Hesaplanmadı</p>
    </div>
  );
}