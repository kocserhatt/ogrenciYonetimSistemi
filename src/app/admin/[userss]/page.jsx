"use client";
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/app/lib/supabaseClient';

export default function AdminStudentDetail() {
  const [student, setStudent] = useState(null);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editGrade, setEditGrade] = useState(null);
  const [newGrade, setNewGrade] = useState({
    course_name: '',
    exam1: '',
    exam2: '',
    project: '',
  });
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
    if (editGrade) {
      setEditGrade((prevGrade) => ({
        ...prevGrade,
        [name]: value,
      }));
    } else {
      setNewGrade((prevGrade) => ({
        ...prevGrade,
        [name]: value,
      }));
    }
  };

  const handleUpdateGrade = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('grades')
        .update({
          course_name: editGrade.course_name,
          exam1: parseInt(editGrade.exam1),
          exam2: parseInt(editGrade.exam2),
          project: parseInt(editGrade.project),
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

  const handleAddGrade = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('grades')
        .insert([
          {
            user_id: userss,
            course_name: newGrade.course_name,
            exam1: parseInt(newGrade.exam1),
            exam2: parseInt(newGrade.exam2),
            project: parseInt(newGrade.project),
          },
        ]);

      if (error) {
        console.error('Not eklenemedi:', error.message);
      } else {
        console.log('Not eklendi:', data);
        if (data && data.length > 0) {
          setGrades((prevGrades) => [...prevGrades, data[0]]);
        }
        setNewGrade({
          course_name: '',
          exam1: '',
          exam2: '',
          project: '',
        });
      }
    } catch (error) {
      console.error('Veri ekleme hatası:', error.message);
    }
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
              <td>{grade.exam1}</td>
              <td>{grade.exam2}</td>
              <td>{grade.project}</td>
              <td>{((grade.exam1 + grade.exam2 + grade.project) / 3).toFixed(2)}</td>
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
        <div className="mt-4">
          <h2 className="text-center mb-4">Not Düzenle</h2>
          <form onSubmit={handleUpdateGrade}>
            <div className="mb-3">
              <label htmlFor="course_name" className="form-label">Ders Adı</label>
              <input
                type="text"
                className="form-control"
                id="course_name"
                name="course_name"
                value={editGrade.course_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exam1" className="form-label">İlk Sınav</label>
              <input
                type="number"
                className="form-control"
                id="exam1"
                name="exam1"
                value={editGrade.exam1}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="exam2" className="form-label">İkinci Sınav</label>
              <input
                type="number"
                className="form-control"
                id="exam2"
                name="exam2"
                value={editGrade.exam2}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="project" className="form-label">Proje</label>
              <input
                type="number"
                className="form-control"
                id="project"
                name="project"
                value={editGrade.project}
                onChange={handleInputChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">Not Güncelle</button>
          </form>
        </div>
      )}

      <div className="mt-4">
        <h2 className="text-center mb-4">Yeni Not Ekle</h2>
        <form onSubmit={handleAddGrade}>
          <div className="mb-3">
            <label htmlFor="course_name" className="form-label">Ders Adı</label>
            <input
              type="text"
              className="form-control"
              id="course_name"
              name="course_name"
              value={newGrade.course_name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exam1" className="form-label">İlk Sınav</label>
            <input
              type="number"
              className="form-control"
              id="exam1"
              name="exam1"
              value={newGrade.exam1}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exam2" className="form-label">İkinci Sınav</label>
            <input
              type="number"
              className="form-control"
              id="exam2"
              name="exam2"
              value={newGrade.exam2}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="project" className="form-label">Proje</label>
            <input
              type="number"
              className="form-control"
              id="project"
              name="project"
              value={newGrade.project}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Not Ekle</button>
        </form>
      </div>
    </div>
  );
}