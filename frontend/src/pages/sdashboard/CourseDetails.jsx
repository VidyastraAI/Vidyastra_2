import React, { useEffect, useState } from 'react';
import { studentAPI } from '../../api/studentAPI';

export default function CourseDetails() {
  const [course, setCourse] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const courseId = window.location.pathname.split('/').pop();

  useEffect(() => {
    fetchCourse();
  }, []);

  const fetchCourse = async () => {
    try {
      setLoading(true);

      const res = await studentAPI.getCourseById(courseId);

      const data = res.data?.data;

      setCourse(data?.course || null);
      setLectures(data?.lectures || []);

    } catch (err) {
      console.error('Error fetching course:', err);

      setError(
        err.response?.data?.message ||
        'Failed to load course.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-slate-500">
          Loading course...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-red-500">
          {error}
        </p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="py-16 text-center">
        <p className="text-sm font-semibold text-slate-500">
          Course not found.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      <button
        onClick={() => {
          window.location.href = '/student/courses';
        }}
        className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
      >
        ← Back to My Courses
      </button>

      {/* Course Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">

        <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide">
          {course.category}
        </p>

        <h1 className="mt-2 text-2xl font-bold text-slate-800">
          {course.title}
        </h1>

        <p className="mt-3 text-sm text-slate-500 leading-6">
          {course.description}
        </p>

        <div className="mt-5">

          <p className="text-xs text-slate-400">
            Instructor
          </p>

          <p className="text-sm font-semibold text-slate-700">
            {course.instructor?.name || 'Not available'}
          </p>

        </div>

      </div>

      {/* Course Content */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm">

        <div className="flex justify-between items-center mb-5">

          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Course Content
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              {lectures.length} lecture{lectures.length !== 1 ? 's' : ''}
            </p>
          </div>

        </div>

        {lectures.length === 0 ? (

          <div className="py-12 text-center">
            <p className="text-sm text-slate-500">
              No lectures are available for this course yet.
            </p>
          </div>

        ) : (

          <div className="space-y-3">

            {lectures.map((lecture, index) => (

              <div
                key={lecture._id}
                className="border border-slate-100 rounded-2xl p-4 hover:border-indigo-100 hover:bg-slate-50 transition"
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-4">

                    <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>

                    <div>

                      <h3 className="text-sm font-bold text-slate-800">
                        {lecture.title}
                      </h3>

                      {lecture.description && (
                        <p className="text-xs text-slate-500 mt-1">
                          {lecture.description}
                        </p>
                      )}

                    </div>

                  </div>

                  <button
                    onClick={() => {
                      window.location.href =
                        `/student/lecture-library/${lecture._id}`;
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700"
                  >
                    Open
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}